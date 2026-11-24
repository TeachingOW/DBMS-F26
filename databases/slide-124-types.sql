-- Slide 124: type-choice values
-- PostgreSQL 16+
DROP TABLE IF EXISTS TypeExamples CASCADE;
CREATE TABLE TypeExamples (
  price DECIMAL(8,2),
  zip_code VARCHAR(5),
  created_at TIMESTAMP,
  temperature_c DOUBLE PRECISION
);
INSERT INTO TypeExamples
  (price, zip_code, created_at, temperature_c)
VALUES
  (19.99, '00501', TIMESTAMP '2026-08-27 10:30:00', 21.8734);
