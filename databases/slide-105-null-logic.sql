-- Slides 105-107: NULL logic
-- PostgreSQL 16+
DROP TABLE IF EXISTS Person CASCADE;
CREATE TABLE Person (
  name VARCHAR(60),
  address VARCHAR(120),
  worksfor VARCHAR(60),
  age INTEGER,
  height DECIMAL(3,1),
  weight INTEGER
);
INSERT INTO Person (age, height, weight)
VALUES (20, NULL, 200);
