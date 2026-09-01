-- Slides 34-36: foreign keys
-- PostgreSQL 16+
DROP TABLE IF EXISTS Enrolled CASCADE;
DROP TABLE IF EXISTS Students CASCADE;
CREATE TABLE Students (
  sid VARCHAR(20) PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  gpa DECIMAL(2,1)
);
CREATE TABLE Enrolled (
  student_id VARCHAR(20),
  cid VARCHAR(20),
  grade VARCHAR(10),
  PRIMARY KEY (student_id, cid),
  FOREIGN KEY (student_id) REFERENCES Students(sid)
);
INSERT INTO Students (sid, name, gpa) VALUES
  ('101', 'Bob', 3.2),
  ('123', 'Mary', 3.8);
INSERT INTO Enrolled (student_id, cid, grade) VALUES
  ('123', '564', 'A'),
  ('123', '537', 'A+');
