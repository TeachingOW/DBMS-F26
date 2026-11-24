-- Slides 42-43: tuple-variable ambiguity
-- The slides define schemas but display no rows.
-- PostgreSQL 16+
DROP TABLE IF EXISTS Person CASCADE;
DROP TABLE IF EXISTS Company CASCADE;
CREATE TABLE Company (
  name VARCHAR(60),
  address VARCHAR(120)
);
CREATE TABLE Person (
  name VARCHAR(60),
  address VARCHAR(120),
  worksfor VARCHAR(60)
);
