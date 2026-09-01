(() => {
  const setup = String.raw`-- DBMS SQL lecture slide datasets
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

COMMIT;`;

  const databaseSubsets = [
    { start: 18, end: 18, file: 'databases/slide-018-nulls.sql', label: 'Slide 18 NULL dataset' },
    { start: 34, end: 36, file: 'databases/slide-034-foreign-keys.sql', label: 'Slides 34–36 foreign-key dataset' },
    { start: 42, end: 43, file: 'databases/slide-042-ambiguity.sql', label: 'Slides 42–43 ambiguity schemas' },
    { start: 45, end: 46, file: 'databases/slide-045-semantics.sql', label: 'Slides 45–46 semantics dataset' },
    { start: 9, end: 13, file: 'databases/slide-037-joins.sql', label: 'Product table dataset' },
    { start: 24, end: 31, file: 'databases/slide-037-joins.sql', label: 'Product query dataset' },
    { start: 37, end: 41, file: 'databases/slide-037-joins.sql', label: 'Product and Company join dataset' },
    { start: 49, end: 50, file: 'databases/slide-037-joins.sql', label: 'Product and Company join dataset' },
    { start: 59, end: 62, file: 'databases/slide-059-set-operations.sql', label: 'Set-operation schemas' },
    { start: 63, end: 66, file: 'databases/slide-064-intersect.sql', label: 'INTERSECT example dataset' },
    { start: 68, end: 82, file: 'databases/slide-075-correlated.sql', label: 'Nested-query schemas' },
    { start: 83, end: 94, file: 'databases/slide-084-aggregation.sql', label: 'Purchase aggregation dataset' },
    { start: 96, end: 98, file: 'databases/slide-096-authors.sql', label: 'Author and Wrote schemas' },
    { start: 101, end: 102, file: 'databases/slide-101-quantifiers.sql', label: 'Quantifier schemas' },
    { start: 105, end: 107, file: 'databases/slide-105-null-logic.sql', label: 'NULL-logic dataset' },
    { start: 109, end: 113, file: 'databases/slide-112-outer-join.sql', label: 'Inner- and outer-join dataset' },
    { start: 115, end: 119, file: 'databases/slide-059-set-operations.sql', label: 'Set-operation schemas' },
    { start: 124, end: 124, file: 'databases/slide-124-types.sql', label: 'Type-choice dataset' }
  ];

  function databaseSubsetForSlide(number) {
    return databaseSubsets.find(subset => number >= subset.start && number <= subset.end) || null;
  }

  function setupFileForSlide(number) {
    return databaseSubsetForSlide(number)?.file || 'demo-database.sql';
  }

  const syntaxCatalog = {
    'create-and-insert': { title: 'Create a table and insert rows', description: 'Define a table first, then add one or more rows whose values match its columns and data types.', pattern: `CREATE TABLE table_name (\n  column_name data_type [constraint],\n  ...\n);\n\nINSERT INTO table_name (column_name, ...)\nVALUES (value, ...), (...);`, breakdown: ['CREATE TABLE names the new relation.', 'Each column has a data type and optional constraint.', 'INSERT lists target columns; each VALUES row must align with that list.'], example: `CREATE TABLE Course (\n  course_id INTEGER PRIMARY KEY,\n  title VARCHAR(100) NOT NULL\n);\nINSERT INTO Course (course_id, title)\nVALUES (101, 'Database Systems');` },
    'create-table': { title: 'CREATE TABLE', description: 'Create a relation by declaring its columns, data types, keys, and integrity rules.', pattern: `CREATE TABLE table_name (\n  column_name data_type [constraint],\n  ...\n  [FOREIGN KEY (column_name) REFERENCES parent_table(parent_key)]\n);`, breakdown: ['Choose a stable primary key.', 'Use data types that match the meaning of each value.', 'Use constraints to prevent invalid data at write time.'], example: `CREATE TABLE EnrollmentNote (\n  note_id INTEGER PRIMARY KEY,\n  student_id VARCHAR(10) REFERENCES Student(student_id),\n  note_text TEXT NOT NULL\n);` },
    'create-view': { title: 'CREATE VIEW', description: 'Save a query under a reusable virtual-table name.', pattern: `CREATE VIEW view_name AS\nSELECT column_list\nFROM table_name\n[JOIN ...]\n[WHERE condition]\n[GROUP BY column_list];\n\nSELECT * FROM view_name;`, breakdown: ['The view stores a query definition, not a separate copy of its result.', 'Applications can query the view like a table.', 'Base-table changes appear when the view is queried again.'], example: `CREATE VIEW affordable_products AS\nSELECT name, price\nFROM Product\nWHERE price < 100;\n\nSELECT * FROM affordable_products;` },
    'create-index': { title: 'CREATE INDEX', description: 'Build an access path that can speed up matching and sorting on selected columns.', pattern: `CREATE INDEX index_name\nON table_name (leading_column, next_column);\n\nSELECT column_list\nFROM table_name\nWHERE leading_column = value\n  AND next_column >= value;`, breakdown: ['Put commonly filtered columns first.', 'An index can speed reads but adds storage and write cost.', 'Use EXPLAIN to check whether the optimizer uses it.'], example: `CREATE INDEX product_category_price_idx\nON Product (category, price);\n\nSELECT name, price\nFROM Product\nWHERE category = 'Gadgets' AND price >= 20;` },
    grant: { title: 'GRANT', description: 'Give a database role permission to perform an action on an object.', pattern: `GRANT privilege_name\nON object_name\nTO role_name;`, breakdown: ['The privilege may be SELECT, INSERT, UPDATE, DELETE, or another supported action.', 'The object is usually a table, view, sequence, or schema.', 'Grant only the permissions the role needs.'], example: `GRANT SELECT\nON Product\nTO reporting_role;` },
    savepoint: { title: 'SAVEPOINT', description: 'Mark a point inside a transaction so later work can be undone without discarding earlier work.', pattern: `BEGIN;\nstatement_1;\nSAVEPOINT savepoint_name;\noptional_statement;\nROLLBACK TO SAVEPOINT savepoint_name;\nCOMMIT;`, breakdown: ['BEGIN starts the transaction.', 'SAVEPOINT creates a partial rollback target.', 'COMMIT makes all work not rolled back permanent.'], example: `BEGIN;\nUPDATE Product SET price = price * 0.90 WHERE category = 'Gadgets';\nSAVEPOINT price_change;\nUPDATE Product SET price = 0;\nROLLBACK TO SAVEPOINT price_change;\nCOMMIT;` },
    isolation: { title: 'Transaction isolation', description: 'Choose how strongly one transaction is separated from concurrent transactions.', pattern: `BEGIN;\nSET TRANSACTION ISOLATION LEVEL level_name;\n-- Read and write the protected rows.\nCOMMIT;`, breakdown: ['Set the isolation level immediately after BEGIN.', 'Stronger isolation prevents more anomalies but may wait or retry.', 'PostgreSQL supports READ COMMITTED, REPEATABLE READ, and SERIALIZABLE.'], example: `BEGIN;\nSET TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSELECT price FROM Product WHERE name = 'Gizmo';\nCOMMIT;` },
    transaction: { title: 'Transactions', description: 'Treat several statements as one all-or-nothing unit of work.', pattern: `BEGIN;\nstatement_1;\nstatement_2;\n-- Use ROLLBACK on failure.\nCOMMIT;`, breakdown: ['BEGIN opens the unit of work.', 'All statements see the transaction’s own earlier changes.', 'COMMIT saves; ROLLBACK cancels.'], example: `BEGIN;\nUPDATE Product SET price = price + 5 WHERE name = 'Gizmo';\nUPDATE Product SET price = price - 5 WHERE name = 'Powergizmo';\nCOMMIT;` },
    explain: { title: 'EXPLAIN', description: 'Ask PostgreSQL to show the execution plan it chooses for a query.', pattern: `EXPLAIN [ANALYZE]\nSELECT column_list\nFROM table_name\nWHERE condition\n[GROUP BY column_list];`, breakdown: ['EXPLAIN shows estimated plan steps.', 'EXPLAIN ANALYZE also runs the query and reports actual timing.', 'Compare estimated and actual rows to diagnose weak estimates.'], example: `EXPLAIN ANALYZE\nSELECT category, AVG(price)\nFROM Product\nGROUP BY category;` },
    'recursive-cte': { title: 'Recursive common table expression', description: 'Repeatedly apply a query to traverse hierarchical or graph-shaped data.', pattern: `WITH RECURSIVE cte_name AS (\n  anchor_query\n  UNION ALL\n  recursive_query_that_references_cte\n)\nSELECT column_list\nFROM cte_name;`, breakdown: ['The anchor query produces starting rows.', 'The recursive query refers to the CTE and produces the next level.', 'Recursion stops when an iteration produces no new rows.'], example: `WITH RECURSIVE org AS (\n  SELECT employee_id, manager_id, employee_name, 0 AS depth\n  FROM Employee WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.employee_id, e.manager_id, e.employee_name, o.depth + 1\n  FROM Employee e JOIN org o ON e.manager_id = o.employee_id\n)\nSELECT * FROM org ORDER BY depth, employee_id;` },
    cte: { title: 'Common table expression (WITH)', description: 'Name an intermediate query so a larger statement can be read in clear stages.', pattern: `WITH cte_name AS (\n  SELECT column_list\n  FROM table_name\n  [WHERE condition]\n)\nSELECT column_list\nFROM cte_name\n[JOIN another_cte ...];`, breakdown: ['The CTE exists only for the statement that follows WITH.', 'Use it to separate filtering, aggregation, or ranking steps.', 'Several CTEs can be separated by commas.'], example: `WITH gadget_products AS (\n  SELECT name, price\n  FROM Product\n  WHERE category = 'Gadgets'\n)\nSELECT * FROM gadget_products WHERE price >= 20;` },
    window: { title: 'Window functions', description: 'Calculate rankings, running values, or group statistics while keeping each detail row.', pattern: `SELECT\n  detail_columns,\n  window_function(expression) OVER (\n    [PARTITION BY group_column]\n    [ORDER BY sort_column]\n    [ROWS BETWEEN frame_start AND frame_end]\n  ) AS result_name\nFROM table_name;`, breakdown: ['PARTITION BY defines independent groups.', 'ORDER BY defines the order within each group.', 'Unlike GROUP BY, a window function does not collapse detail rows.'], example: `SELECT name, category, price,\n       RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank\nFROM Product;` },
    'set-operators': { title: 'Set operators', description: 'Combine compatible query results using union, intersection, or difference semantics.', pattern: `SELECT compatible_column_list FROM first_query_source\n{ UNION | UNION ALL | INTERSECT | EXCEPT }\nSELECT compatible_column_list FROM second_query_source;`, breakdown: ['Both queries must return the same number of compatible columns.', 'UNION removes duplicates; UNION ALL keeps them.', 'INTERSECT keeps common rows; EXCEPT keeps rows only in the first result.'], example: `SELECT A, B FROM R\nINTERSECT\nSELECT A, B FROM T;` },
    'not-exists': { title: 'NOT EXISTS', description: 'Keep an outer row only when the correlated inner query finds no matching row.', pattern: `SELECT outer_columns\nFROM outer_table AS outer_row\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM inner_table AS inner_row\n  WHERE inner_row.key = outer_row.key\n    AND counterexample_condition\n);`, breakdown: ['The subquery is evaluated in relation to each outer row.', 'SELECT 1 signals that only existence matters.', 'NOT EXISTS is reliable even when inner columns contain NULL.'], example: `SELECT p.name\nFROM Product p\nWHERE NOT EXISTS (\n  SELECT 1 FROM Purchase pu WHERE pu.product = p.name\n);` },
    exists: { title: 'EXISTS', description: 'Keep an outer row when the correlated inner query finds at least one match.', pattern: `SELECT outer_columns\nFROM outer_table AS outer_row\nWHERE EXISTS (\n  SELECT 1\n  FROM inner_table AS inner_row\n  WHERE inner_row.key = outer_row.key\n    AND matching_condition\n);`, breakdown: ['The database can stop after the first matching inner row.', 'Correlate the subquery to the current outer row.', 'Use NOT EXISTS to test for the absence of matches.'], example: `SELECT p.name\nFROM Product p\nWHERE EXISTS (\n  SELECT 1 FROM Purchase pu WHERE pu.product = p.name\n);` },
    all: { title: 'ALL subquery comparison', description: 'Require a comparison to be true for every value returned by a subquery.', pattern: `SELECT column_list\nFROM outer_table\nWHERE expression comparison_operator ALL (\n  SELECT comparable_expression\n  FROM inner_table\n  WHERE inner_condition\n);`, breakdown: ['The subquery returns one comparable column.', 'The comparison must hold against every returned value.', 'Check empty-set and NULL behavior when interpreting the result.'], example: `SELECT name, price\nFROM Product\nWHERE price >= ALL (SELECT price FROM Product WHERE category = 'Gadgets');` },
    in: { title: 'IN subquery', description: 'Keep rows whose expression equals one of the values returned by a subquery.', pattern: `SELECT column_list\nFROM outer_table\nWHERE expression IN (\n  SELECT compatible_expression\n  FROM inner_table\n  WHERE inner_condition\n);`, breakdown: ['The subquery must return one compatible column.', 'IN is a compact membership test.', 'Use NOT EXISTS carefully when replacing NOT IN with nullable data.'], example: `SELECT name, price\nFROM Product\nWHERE name IN (SELECT product FROM Purchase);` },
    having: { title: 'HAVING', description: 'Filter groups after aggregate values have been computed.', pattern: `SELECT group_column, aggregate_function(expression) AS result_name\nFROM table_name\n[WHERE row_condition]\nGROUP BY group_column\nHAVING aggregate_condition;`, breakdown: ['WHERE filters rows before grouping.', 'GROUP BY forms one group for each distinct key.', 'HAVING filters the completed groups.'], example: `SELECT category, AVG(price) AS avg_price\nFROM Product\nGROUP BY category\nHAVING AVG(price) >= 50;` },
    'group-by': { title: 'GROUP BY', description: 'Collapse rows into groups and compute one aggregate result per group.', pattern: `SELECT group_column, aggregate_function(expression) AS result_name\nFROM table_name\n[WHERE row_condition]\nGROUP BY group_column;`, breakdown: ['Every selected nonaggregate expression must belong to the grouping key.', 'Aggregate functions summarize rows within each group.', 'Add HAVING when groups must be filtered.'], example: `SELECT category, COUNT(*) AS product_count, AVG(price) AS avg_price\nFROM Product\nGROUP BY category;` },
    aggregate: { title: 'Aggregate functions', description: 'Summarize several rows with COUNT, SUM, AVG, MIN, or MAX.', pattern: `SELECT aggregate_function([DISTINCT] expression) AS result_name\nFROM table_name\n[WHERE condition];`, breakdown: ['COUNT(*) counts rows.', 'Most aggregates ignore NULL input values.', 'DISTINCT inside an aggregate removes repeated input values first.'], example: `SELECT COUNT(*) AS products, AVG(price) AS average_price\nFROM Product;` },
    'left-join': { title: 'LEFT JOIN', description: 'Keep every row from the left table and attach matching right-table data when available.', pattern: `SELECT column_list\nFROM left_table AS l\nLEFT JOIN right_table AS r\n  ON l.key = r.key\n[WHERE condition];`, breakdown: ['Unmatched left rows remain in the result.', 'Columns from a missing right row become NULL.', 'A right-table filter in WHERE can accidentally turn the result into an inner join.'], example: `SELECT p.name, pu.buyer\nFROM Product p\nLEFT JOIN Purchase pu ON pu.product = p.name;` },
    join: { title: 'INNER JOIN', description: 'Combine rows from two tables when the ON condition is true.', pattern: `SELECT [DISTINCT] column_list\nFROM first_table AS a\nJOIN second_table AS b\n  ON a.key = b.key\n[WHERE condition];`, breakdown: ['ON defines how rows match.', 'A one-to-many match produces multiple result rows.', 'Qualify ambiguous columns with table aliases.'], example: `SELECT pu.buyer, p.name, p.category\nFROM Purchase pu\nJOIN Product p ON p.name = pu.product;` },
    'order-by': { title: 'ORDER BY', description: 'Sort the final query result using one or more expressions.', pattern: `SELECT column_list\nFROM table_name\n[WHERE condition]\nORDER BY first_sort_expression [ASC|DESC],\n         tie_breaker_expression [ASC|DESC];`, breakdown: ['ASC is the default; DESC reverses the order.', 'Add a tie-breaker for deterministic output.', 'Ordering is guaranteed only when ORDER BY is present.'], example: `SELECT name, category, price\nFROM Product\nORDER BY price DESC, name ASC;` },
    like: { title: 'LIKE pattern matching', description: 'Match text using SQL wildcard patterns.', pattern: `SELECT column_list\nFROM table_name\nWHERE text_column LIKE pattern;\n-- % matches any number of characters; _ matches one character.`, breakdown: ['% matches zero or more characters.', '_ matches exactly one character.', 'PostgreSQL ILIKE performs case-insensitive matching.'], example: `SELECT name, category\nFROM Product\nWHERE name LIKE '%gizmo%';` },
    'is-null': { title: 'NULL tests', description: 'Test whether a value is unknown using IS NULL or IS NOT NULL.', pattern: `SELECT column_list\nFROM table_name\nWHERE column_name IS NULL;\n-- Use IS NOT NULL for known values.`, breakdown: ['NULL is not equal to anything, including another NULL.', 'Use IS NULL, never = NULL.', 'Most comparisons with NULL evaluate to UNKNOWN.'], example: `SELECT registration_id, notes\nFROM event_registration\nWHERE notes IS NULL;` },
    distinct: { title: 'SELECT DISTINCT', description: 'Remove duplicate rows from the projected result.', pattern: `SELECT DISTINCT column_list\nFROM table_name\n[WHERE condition];`, breakdown: ['Distinctness applies to the complete selected row.', 'DISTINCT can require sorting or hashing.', 'Use it when duplicate removal is part of the question, not to hide an incorrect join.'], example: `SELECT DISTINCT category\nFROM Product\nORDER BY category;` },
    insert: { title: 'INSERT', description: 'Add one or more new rows to a table.', pattern: `INSERT INTO table_name (column_name, ...)\nVALUES (value, ...);`, breakdown: ['List target columns explicitly.', 'Values must appear in the same order and use compatible types.', 'Omitted columns use defaults or NULL when allowed.'], example: `INSERT INTO Product (name, price, category, manufacturer)\nVALUES ('DataPad', 79.99, 'Gadgets', 'GizmoWorks');` },
    update: { title: 'UPDATE', description: 'Change column values in existing rows that satisfy a condition.', pattern: `UPDATE table_name\nSET column_name = expression\nWHERE condition;`, breakdown: ['SET defines the new value.', 'WHERE limits which rows change.', 'Preview the same WHERE condition with SELECT before a broad update.'], example: `UPDATE Product\nSET price = price * 1.05\nWHERE category = 'Gadgets';` },
    select: { title: 'SELECT–FROM–WHERE', description: 'Choose result columns, identify source tables, and optionally filter rows.', pattern: `SELECT column_list\nFROM table_name\n[WHERE condition];`, breakdown: ['FROM identifies the input relation.', 'WHERE keeps rows whose condition is TRUE.', 'SELECT computes the output columns after filtering.'], example: `SELECT name, price\nFROM Product\nWHERE price < 100;` }
  };

  function syntaxKeyFor(sql) {
    const upper = String(sql || '').toUpperCase();
    if (upper.includes('CREATE TABLE') && upper.includes('INSERT INTO')) return 'create-and-insert';
    if (upper.includes('CREATE TABLE')) return 'create-table';
    if (upper.includes('CREATE VIEW')) return 'create-view';
    if (upper.includes('CREATE INDEX')) return 'create-index';
    if (upper.includes('GRANT ')) return 'grant';
    if (upper.includes('SAVEPOINT')) return 'savepoint';
    if (upper.includes('SET TRANSACTION ISOLATION LEVEL')) return 'isolation';
    if (upper.includes('BEGIN;') || upper.includes('COMMIT;')) return 'transaction';
    if (upper.includes('EXPLAIN')) return 'explain';
    if (upper.includes('WITH RECURSIVE')) return 'recursive-cte';
    if (/\bWITH\s+[A-Z_]/.test(upper)) return 'cte';
    if (upper.includes(' OVER (')) return 'window';
    if (/\b(INTERSECT|UNION(?:\s+ALL)?|EXCEPT)\b/.test(upper)) return 'set-operators';
    if (upper.includes('NOT EXISTS')) return 'not-exists';
    if (upper.includes('EXISTS')) return 'exists';
    if (/\b[<>=]+\s*ALL\s*\(/.test(upper)) return 'all';
    if (/\bIN\s*\(/.test(upper)) return 'in';
    if (upper.includes('HAVING')) return 'having';
    if (upper.includes('GROUP BY')) return 'group-by';
    if (/\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/.test(upper)) return 'aggregate';
    if (upper.includes('LEFT JOIN')) return 'left-join';
    if (upper.includes('JOIN')) return 'join';
    if (upper.includes('ORDER BY')) return 'order-by';
    if (upper.includes('LIKE')) return 'like';
    if (upper.includes('IS NULL') || upper.includes('IS NOT NULL')) return 'is-null';
    if (upper.includes('SELECT DISTINCT')) return 'distinct';
    if (upper.includes('INSERT INTO')) return 'insert';
    if (upper.includes('UPDATE ')) return 'update';
    return 'select';
  }

  function syntaxInfoFor(sql) {
    const slug = syntaxKeyFor(sql);
    return { slug, ...syntaxCatalog[slug] };
  }

  function syntaxFor(sql) {
    return syntaxInfoFor(sql).pattern;
  }

  window.DBMS_SQL_REPRO = {
    dialect: 'PostgreSQL 16+',
    setup,
    setupFile: 'demo-database.sql',
    databaseSubsets,
    databaseSubsetForSlide,
    setupFileForSlide,
    syntaxCatalog,
    syntaxKeyFor,
    syntaxInfoFor,
    syntaxFor
  };
})();
