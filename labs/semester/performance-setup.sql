-- Run once after setup.sql. Deterministic data; no existing objects are removed.
BEGIN;
SET search_path TO course32;
CREATE TABLE perf_customers (id integer PRIMARY KEY, region text NOT NULL);
INSERT INTO perf_customers
SELECT n, CASE WHEN n%2=0 THEN 'east' ELSE 'west' END
FROM generate_series(1,1000) AS g(n);
CREATE TABLE perf_purchases (
 id integer PRIMARY KEY, customer_id integer NOT NULL REFERENCES perf_customers(id),
 purchased_at date NOT NULL, status text NOT NULL, amount numeric(10,2) NOT NULL
);
INSERT INTO perf_purchases
SELECT n,1+((n-1)%1000), DATE '2025-01-01'+((n-1)%730),
 CASE WHEN n%10=0 THEN 'pending' ELSE 'paid' END,
 (100+(n%9900))::numeric/100
FROM generate_series(1,100000) AS g(n);
COMMIT;
ANALYZE course32.perf_customers;
ANALYZE course32.perf_purchases;
-- Initial baseline; students add indexes during the experiment.
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM course32.perf_purchases WHERE customer_id=42;
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM course32.perf_purchases WHERE status='paid';

