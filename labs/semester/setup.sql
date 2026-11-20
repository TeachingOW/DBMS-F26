-- PostgreSQL 16+. Run once in a new, empty teaching database.
-- No DROP statements: an existing course32 schema causes a deliberate failure.
BEGIN;
CREATE SCHEMA course32;
SET search_path TO course32;
CREATE TABLE students (
  id integer PRIMARY KEY, name text NOT NULL, email text UNIQUE
);
CREATE TABLE events (
  id integer PRIMARY KEY, title text NOT NULL,
  fee numeric(10,2) NOT NULL CHECK (fee >= 0),
  capacity integer NOT NULL CHECK (capacity > 0)
);
CREATE TABLE bookings (
  student_id integer REFERENCES students(id),
  event_id integer REFERENCES events(id),
  booked_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid boolean NOT NULL DEFAULT false,
  PRIMARY KEY(student_id,event_id)
);
CREATE TABLE required_event (event_id integer PRIMARY KEY REFERENCES events(id));
CREATE TABLE booking_probe (student_id integer);
CREATE TABLE topics (id integer PRIMARY KEY, name text NOT NULL,
  parent_id integer REFERENCES topics(id));
CREATE TABLE accounts (id integer PRIMARY KEY,
  balance numeric(12,2) NOT NULL CHECK(balance >= 0));
CREATE TABLE stock (id integer PRIMARY KEY, quantity integer NOT NULL CHECK(quantity >= 0));
INSERT INTO students VALUES
 (1,'Ada','ada@example.test'),(2,'Ben',NULL),(3,'Cy','cy@example.test'),
 (4,'Dee',NULL),(5,'Eli','eli@example.test');
INSERT INTO events VALUES (101,'SQL',20,10),(102,'Design',30,10),
 (103,'Data',30,10),(104,'Graph',10,1);
INSERT INTO bookings VALUES
 (1,101,'2026-01-01 09:00',true),(1,102,'2026-01-01 09:00',true),
 (2,101,'2026-01-02 10:00',true),(3,102,'2026-01-03 11:00',false),
 (3,103,'2026-01-03 11:00',true),(4,101,'2026-01-05 12:00',false);
INSERT INTO required_event VALUES (101),(102);
INSERT INTO booking_probe VALUES (1),(NULL);
INSERT INTO topics VALUES (1,'Database',NULL),(2,'SQL',1),(3,'Systems',1),
 (4,'Joins',2),(5,'Transactions',3);
INSERT INTO accounts VALUES (1,100),(2,100);
INSERT INTO stock VALUES (1,1);
COMMIT;
SELECT 'students' AS entity,COUNT(*) AS rows FROM course32.students
UNION ALL SELECT 'events',COUNT(*) FROM course32.events
UNION ALL SELECT 'bookings',COUNT(*) FROM course32.bookings;
SELECT SUM(balance) AS total_balance FROM course32.accounts;

