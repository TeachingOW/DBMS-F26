-- Slides 109-113: inner and left outer joins
-- PostgreSQL 16+
DROP TABLE IF EXISTS Purchase CASCADE;
DROP TABLE IF EXISTS Product CASCADE;
CREATE TABLE Product (
  name VARCHAR(60) PRIMARY KEY,
  category VARCHAR(40)
);
CREATE TABLE Purchase (
  prodName VARCHAR(60) REFERENCES Product(name),
  store VARCHAR(60)
);
INSERT INTO Product (name, category) VALUES
  ('Gizmo', 'gadget'),
  ('Camera', 'Photo'),
  ('OneClick', 'Photo');
INSERT INTO Purchase (prodName, store) VALUES
  ('Gizmo', 'Wiz'),
  ('Camera', 'Ritz'),
  ('Camera', 'Wiz');
