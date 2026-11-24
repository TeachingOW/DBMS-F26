-- Slide 18: NULL and NOT NULL
-- PostgreSQL 16+
DROP TABLE IF EXISTS Students CASCADE;
CREATE TABLE Students (
  sid VARCHAR(20) PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  gpa DECIMAL(2,1)
);
INSERT INTO Students (sid, name, gpa) VALUES
  ('123', 'Bob', 3.9),
  ('143', 'Jim', NULL);
