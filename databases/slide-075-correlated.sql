-- Slides 68-76: nested and correlated-query schemas
-- The slides specify these schemas but display no base rows.
-- PostgreSQL 16+
DROP TABLE IF EXISTS Purchase CASCADE;
DROP TABLE IF EXISTS Product CASCADE;
DROP TABLE IF EXISTS Company CASCADE;
DROP TABLE IF EXISTS Movie CASCADE;
CREATE TABLE Company (
  name VARCHAR(60),
  hq_city VARCHAR(60),
  city VARCHAR(60)
);
CREATE TABLE Product (
  name VARCHAR(60),
  price DECIMAL(10,2),
  category VARCHAR(40),
  maker VARCHAR(60),
  factory_loc VARCHAR(40),
  year INTEGER
);
CREATE TABLE Purchase (
  id INTEGER,
  product VARCHAR(60),
  buyer VARCHAR(60)
);
CREATE TABLE Movie (
  title VARCHAR(100),
  year INTEGER,
  director VARCHAR(100),
  length INTEGER
);
