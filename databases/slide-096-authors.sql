-- Slides 96-98: Author and Wrote
-- The slides define schemas but display no rows.
-- PostgreSQL 16+
DROP TABLE IF EXISTS Wrote CASCADE;
DROP TABLE IF EXISTS Author CASCADE;
CREATE TABLE Author (
  login VARCHAR(60) PRIMARY KEY,
  name VARCHAR(100)
);
CREATE TABLE Wrote (
  login VARCHAR(60) REFERENCES Author(login),
  url VARCHAR(240)
);
