-- Slides 64-65: INTERSECT pitfall
-- PostgreSQL 16+
DROP TABLE IF EXISTS Product CASCADE;
DROP TABLE IF EXISTS Company CASCADE;
CREATE TABLE Company (
  name VARCHAR(60) PRIMARY KEY,
  hq_city VARCHAR(60)
);
CREATE TABLE Product (
  pname VARCHAR(60),
  maker VARCHAR(60) REFERENCES Company(name),
  factory_loc VARCHAR(40)
);
INSERT INTO Company (name, hq_city) VALUES
  ('X Co.', 'Seattle'),
  ('Y Inc.', 'Seattle');
INSERT INTO Product (pname, maker, factory_loc) VALUES
  ('X', 'X Co.', 'U.S.'),
  ('X', 'Y Inc.', 'China');
