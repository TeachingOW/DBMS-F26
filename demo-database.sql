-- DBMS SQL lecture slide datasets
-- Dialect: PostgreSQL 16+
--
-- Every inserted value below appears in the lecture slides. The deck reuses
-- relation names with different schemas and rows, so each distinct example is
-- kept in its own PostgreSQL schema instead of blending incompatible datasets.
-- Select the schema for the slide before running its query, for example:
--   SET search_path TO slide_037_joins;

BEGIN;

DROP SCHEMA IF EXISTS slide_018_nulls CASCADE;
DROP SCHEMA IF EXISTS slide_034_foreign_keys CASCADE;
DROP SCHEMA IF EXISTS slide_037_joins CASCADE;
DROP SCHEMA IF EXISTS slide_042_ambiguity CASCADE;
DROP SCHEMA IF EXISTS slide_045_semantics CASCADE;
DROP SCHEMA IF EXISTS slide_059_set_operations CASCADE;
DROP SCHEMA IF EXISTS slide_064_intersect CASCADE;
DROP SCHEMA IF EXISTS slide_075_correlated CASCADE;
DROP SCHEMA IF EXISTS slide_084_aggregation CASCADE;
DROP SCHEMA IF EXISTS slide_096_authors CASCADE;
DROP SCHEMA IF EXISTS slide_101_quantifiers CASCADE;
DROP SCHEMA IF EXISTS slide_105_null_logic CASCADE;
DROP SCHEMA IF EXISTS slide_112_outer_join CASCADE;
DROP SCHEMA IF EXISTS slide_124_types CASCADE;

-- Slide 18: NULL and NOT NULL
CREATE SCHEMA slide_018_nulls;
CREATE TABLE slide_018_nulls.Students (
  sid VARCHAR(20) PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  gpa DECIMAL(2,1)
);
INSERT INTO slide_018_nulls.Students (sid, name, gpa) VALUES
  ('123', 'Bob', 3.9),
  ('143', 'Jim', NULL);

-- Slides 34-36: foreign-key example
CREATE SCHEMA slide_034_foreign_keys;
CREATE TABLE slide_034_foreign_keys.Students (
  sid VARCHAR(20) PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  gpa DECIMAL(2,1)
);
CREATE TABLE slide_034_foreign_keys.Enrolled (
  student_id VARCHAR(20),
  cid VARCHAR(20),
  grade VARCHAR(10),
  PRIMARY KEY (student_id, cid),
  FOREIGN KEY (student_id)
    REFERENCES slide_034_foreign_keys.Students(sid)
);
INSERT INTO slide_034_foreign_keys.Students (sid, name, gpa) VALUES
  ('101', 'Bob', 3.2),
  ('123', 'Mary', 3.8);
INSERT INTO slide_034_foreign_keys.Enrolled (student_id, cid, grade) VALUES
  ('123', '564', 'A'),
  ('123', '537', 'A+');

-- Slides 9-13, 24-31, and 37-50: product/company examples
CREATE SCHEMA slide_037_joins;
CREATE TABLE slide_037_joins.Company (
  CName VARCHAR(60) PRIMARY KEY,
  StockPrice DECIMAL(10,2) NOT NULL,
  Country VARCHAR(40) NOT NULL
);
CREATE TABLE slide_037_joins.Product (
  PName VARCHAR(60) PRIMARY KEY,
  Price DECIMAL(10,2) NOT NULL,
  Category VARCHAR(40) NOT NULL,
  Manufacturer VARCHAR(60) NOT NULL
    REFERENCES slide_037_joins.Company(CName)
);
INSERT INTO slide_037_joins.Company (CName, StockPrice, Country) VALUES
  ('GizmoWorks', 25, 'USA'),
  ('Canon', 65, 'Japan'),
  ('Hitachi', 15, 'Japan');
INSERT INTO slide_037_joins.Product
  (PName, Price, Category, Manufacturer)
VALUES
  ('Gizmo', 19.99, 'Gadgets', 'GizmoWorks'),
  ('Powergizmo', 29.99, 'Gadgets', 'GizmoWorks'),
  ('SingleTouch', 149.99, 'Photography', 'Canon'),
  ('MultiTouch', 203.99, 'Household', 'Hitachi');

-- Slides 42-43 define these relations but provide no rows.
CREATE SCHEMA slide_042_ambiguity;
CREATE TABLE slide_042_ambiguity.Company (
  name VARCHAR(60),
  address VARCHAR(120)
);
CREATE TABLE slide_042_ambiguity.Person (
  name VARCHAR(60),
  address VARCHAR(120),
  worksfor VARCHAR(60)
);

-- Slide 45: the exact R and S values shown in the semantics walkthrough
CREATE SCHEMA slide_045_semantics;
CREATE TABLE slide_045_semantics.R (A INTEGER);
CREATE TABLE slide_045_semantics.S (B INTEGER, C INTEGER);
INSERT INTO slide_045_semantics.R (A) VALUES (1), (3);
INSERT INTO slide_045_semantics.S (B, C) VALUES
  (2, 3),
  (3, 4),
  (3, 5);

-- Slides 59-62 and 115-119 name R, S, and T but show no base rows.
CREATE SCHEMA slide_059_set_operations;
CREATE TABLE slide_059_set_operations.R (A INTEGER, B INTEGER);
CREATE TABLE slide_059_set_operations.S (A INTEGER, B INTEGER);
CREATE TABLE slide_059_set_operations.T (A INTEGER, B INTEGER);

-- Slides 64-65: the exact joined rows used to explain the INTERSECT pitfall
CREATE SCHEMA slide_064_intersect;
CREATE TABLE slide_064_intersect.Company (
  name VARCHAR(60) PRIMARY KEY,
  hq_city VARCHAR(60)
);
CREATE TABLE slide_064_intersect.Product (
  pname VARCHAR(60),
  maker VARCHAR(60) REFERENCES slide_064_intersect.Company(name),
  factory_loc VARCHAR(40)
);
INSERT INTO slide_064_intersect.Company (name, hq_city) VALUES
  ('X Co.', 'Seattle'),
  ('Y Inc.', 'Seattle');
INSERT INTO slide_064_intersect.Product (pname, maker, factory_loc) VALUES
  ('X', 'X Co.', 'U.S.'),
  ('X', 'Y Inc.', 'China');

-- Slides 68-76 specify these schemas but do not display base-table rows.
CREATE SCHEMA slide_075_correlated;
CREATE TABLE slide_075_correlated.Company (
  name VARCHAR(60),
  hq_city VARCHAR(60),
  city VARCHAR(60)
);
CREATE TABLE slide_075_correlated.Product (
  name VARCHAR(60),
  price DECIMAL(10,2),
  category VARCHAR(40),
  maker VARCHAR(60),
  factory_loc VARCHAR(40),
  year INTEGER
);
CREATE TABLE slide_075_correlated.Purchase (
  id INTEGER,
  product VARCHAR(60),
  buyer VARCHAR(60)
);
CREATE TABLE slide_075_correlated.Movie (
  title VARCHAR(100),
  year INTEGER,
  director VARCHAR(100),
  length INTEGER
);

-- Slides 84 and 87-92: the exact Purchase rows in the aggregation example
CREATE SCHEMA slide_084_aggregation;
CREATE TABLE slide_084_aggregation.Purchase (
  product VARCHAR(60),
  date DATE,
  price DECIMAL(10,2),
  quantity INTEGER
);
INSERT INTO slide_084_aggregation.Purchase
  (product, date, price, quantity)
VALUES
  ('bagel', DATE '2005-10-21', 1.00, 20),
  ('banana', DATE '2005-10-03', 0.50, 10),
  ('banana', DATE '2005-10-10', 1.00, 10),
  ('bagel', DATE '2005-10-25', 1.50, 20);

-- Slides 96-98 define these relations but provide no rows.
CREATE SCHEMA slide_096_authors;
CREATE TABLE slide_096_authors.Author (
  login VARCHAR(60) PRIMARY KEY,
  name VARCHAR(100)
);
CREATE TABLE slide_096_authors.Wrote (
  login VARCHAR(60) REFERENCES slide_096_authors.Author(login),
  url VARCHAR(240)
);

-- Slides 101-102 define these relations but provide no rows.
CREATE SCHEMA slide_101_quantifiers;
CREATE TABLE slide_101_quantifiers.Company (
  name VARCHAR(60),
  city VARCHAR(60)
);
CREATE TABLE slide_101_quantifiers.Product (
  name VARCHAR(60),
  price DECIMAL(10,2),
  company VARCHAR(60)
);

-- Slides 105-107 show one partial tuple: age=20, height=NULL, weight=200.
CREATE SCHEMA slide_105_null_logic;
CREATE TABLE slide_105_null_logic.Person (
  name VARCHAR(60),
  address VARCHAR(120),
  worksfor VARCHAR(60),
  age INTEGER,
  height DECIMAL(3,1),
  weight INTEGER
);
INSERT INTO slide_105_null_logic.Person (age, height, weight)
VALUES (20, NULL, 200);

-- Slides 112-113: the exact inner- and left-join example rows
CREATE SCHEMA slide_112_outer_join;
CREATE TABLE slide_112_outer_join.Product (
  name VARCHAR(60) PRIMARY KEY,
  category VARCHAR(40)
);
CREATE TABLE slide_112_outer_join.Purchase (
  prodName VARCHAR(60) REFERENCES slide_112_outer_join.Product(name),
  store VARCHAR(60)
);
INSERT INTO slide_112_outer_join.Product (name, category) VALUES
  ('Gizmo', 'gadget'),
  ('Camera', 'Photo'),
  ('OneClick', 'Photo');
INSERT INTO slide_112_outer_join.Purchase (prodName, store) VALUES
  ('Gizmo', 'Wiz'),
  ('Camera', 'Ritz'),
  ('Camera', 'Wiz');

-- Slide 124: the four displayed type-choice values
CREATE SCHEMA slide_124_types;
CREATE TABLE slide_124_types.TypeExamples (
  price DECIMAL(8,2),
  zip_code VARCHAR(5),
  created_at TIMESTAMP,
  temperature_c DOUBLE PRECISION
);
INSERT INTO slide_124_types.TypeExamples
  (price, zip_code, created_at, temperature_c)
VALUES
  (19.99, '00501', TIMESTAMP '2026-08-27 10:30:00', 21.8734);

-- Use the main product/company dataset by default.
SET search_path TO slide_037_joins;

COMMIT;
