-- Slides 9-13, 24-31, and 37-50: Product and Company
-- PostgreSQL 16+
DROP TABLE IF EXISTS Product CASCADE;
DROP TABLE IF EXISTS Company CASCADE;
CREATE TABLE Company (
  CName VARCHAR(60) PRIMARY KEY,
  StockPrice DECIMAL(10,2) NOT NULL,
  Country VARCHAR(40) NOT NULL
);
CREATE TABLE Product (
  PName VARCHAR(60) PRIMARY KEY,
  Price DECIMAL(10,2) NOT NULL,
  Category VARCHAR(40) NOT NULL,
  Manufacturer VARCHAR(60) NOT NULL REFERENCES Company(CName)
);
INSERT INTO Company (CName, StockPrice, Country) VALUES
  ('GizmoWorks', 25, 'USA'),
  ('Canon', 65, 'Japan'),
  ('Hitachi', 15, 'Japan');
INSERT INTO Product (PName, Price, Category, Manufacturer) VALUES
  ('Gizmo', 19.99, 'Gadgets', 'GizmoWorks'),
  ('Powergizmo', 29.99, 'Gadgets', 'GizmoWorks'),
  ('SingleTouch', 149.99, 'Photography', 'Canon'),
  ('MultiTouch', 203.99, 'Household', 'Hitachi');
