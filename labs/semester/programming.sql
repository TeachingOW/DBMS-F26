-- PostgreSQL PL/pgSQL reference implementation for meetings 17-18.
-- Install once after setup.sql; uses only the teaching schema.
BEGIN;
CREATE FUNCTION course32.transfer(p_from integer,p_to integer,p_amount numeric)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_balance numeric; v_count integer;
BEGIN
 IF p_from IS NULL OR p_to IS NULL OR p_amount IS NULL
    OR p_from=p_to OR p_amount<=0 OR p_amount<>round(p_amount,2) THEN
   RAISE EXCEPTION 'Use different accounts and a positive amount with at most two decimals';
 END IF;
 -- Acquire locks in the same order for either transfer direction.
 PERFORM id FROM course32.accounts WHERE id IN (p_from,p_to) ORDER BY id FOR UPDATE;
 GET DIAGNOSTICS v_count = ROW_COUNT;
 IF v_count<>2 THEN RAISE EXCEPTION 'Account not found'; END IF;
 SELECT balance INTO v_balance FROM course32.accounts WHERE id=p_from;
 IF v_balance<p_amount THEN RAISE EXCEPTION 'Insufficient funds'; END IF;
 UPDATE course32.accounts SET balance=balance-p_amount WHERE id=p_from;
 UPDATE course32.accounts SET balance=balance+p_amount WHERE id=p_to;
END;
$$;
CREATE TABLE course32.account_audit (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 account_id integer NOT NULL REFERENCES course32.accounts(id),
 old_balance numeric(12,2) NOT NULL, new_balance numeric(12,2) NOT NULL,
 changed_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE FUNCTION course32.audit_balance() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 INSERT INTO course32.account_audit(account_id,old_balance,new_balance)
 VALUES(NEW.id,OLD.balance,NEW.balance);
 RETURN NEW;
END;
$$;
CREATE TRIGGER account_balance_audit AFTER UPDATE OF balance ON course32.accounts
FOR EACH ROW WHEN (OLD.balance IS DISTINCT FROM NEW.balance)
EXECUTE FUNCTION course32.audit_balance();
COMMIT;

