-- Slides 83-94: Purchase aggregation
-- PostgreSQL 16+
DROP TABLE IF EXISTS Purchase CASCADE;
CREATE TABLE Purchase (
  product VARCHAR(60),
  date DATE,
  price DECIMAL(10,2),
  quantity INTEGER
);
INSERT INTO Purchase (product, date, price, quantity) VALUES
  ('bagel', DATE '2005-10-21', 1.00, 20),
  ('banana', DATE '2005-10-03', 0.50, 10),
  ('banana', DATE '2005-10-10', 1.00, 10),
  ('bagel', DATE '2005-10-25', 1.50, 20);
