-- Slides 101-102: quantifier schemas
-- The slides define schemas but display no rows.
-- PostgreSQL 16+
DROP TABLE IF EXISTS Product CASCADE;
DROP TABLE IF EXISTS Company CASCADE;
CREATE TABLE Company (
  name VARCHAR(60),
  city VARCHAR(60)
);
CREATE TABLE Product (
  name VARCHAR(60),
  price DECIMAL(10,2),
  company VARCHAR(60)
);
