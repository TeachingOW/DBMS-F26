window.DBMS_LABS = {
  "db-design": [
    {
      id: "db-anomalies", afterSlide: 13, duration: "6 minutes", title: "Practice: expose the three anomalies",
      prompt: "Use Enrollment(StudentID, StudentName, Major, CourseID, CourseTitle, InstructorID, InstructorName, Grade). Assume one row per student-course enrollment.",
      steps: ["Describe an update that must change several rows.", "Describe a course fact that cannot be inserted until a student enrolls.", "Describe a deletion that accidentally removes the only copy of a course or instructor fact.", "For each anomaly, name the repeated dependency that causes it."],
      code: [{ label: "Copyable response frame", language: "text", text: "Update anomaly:\nRepeated fact / FD:\n\nInsertion anomaly:\nBlocked fact / FD:\n\nDeletion anomaly:\nLost fact / FD:" }],
      resource: "../labs/normalization/normal-forms.html"
    },
    {
      id: "db-closure", afterSlide: 48, duration: "7 minutes", title: "Practice: compute a closure with evidence",
      prompt: "Given StudentID → StudentName, Major; CourseID → CourseTitle, InstructorID; InstructorID → InstructorName; and StudentID, CourseID → Grade, compute {StudentID, CourseID}+.",
      steps: ["Start the closure with the two given attributes.", "Apply one functional dependency at a time.", "Record exactly which dependency added each attribute.", "Stop when no dependency adds anything new, then decide whether the starting set is a superkey."],
      code: [{ label: "Closure trace template", language: "text", text: "X = {StudentID, CourseID}\nX+ initially = {StudentID, CourseID}\nApply __________ → add __________\nApply __________ → add __________\nApply __________ → add __________\nFixed point: X+ = {________________}\nConclusion: X is / is not a superkey because __________." }]
    },
    {
      id: "db-normal-form", afterSlide: 72, duration: "8 minutes", title: "Practice: use the normal-form decision ladder",
      prompt: "For the enrollment relation and dependencies above, identify one 2NF violation, one 3NF or BCNF violation, and the determinant responsible for each.",
      steps: ["Find the candidate key and mark prime attributes.", "Look for a dependency on only part of the composite key.", "Look for a non-key determinant that determines a non-prime attribute.", "Propose relations that remove both violations."],
      code: [{ label: "Schema answer template", language: "text", text: "Candidate key: __________\n2NF violation: __________ → __________\n3NF/BCNF violation: __________ → __________\nDecomposition:\n1. __________(__________)\n2. __________(__________)\n3. __________(__________)" }]
    },
    {
      id: "db-lossless", afterSlide: 95, duration: "6 minutes", title: "Practice: verify the decomposition",
      prompt: "Audit your enrollment decomposition instead of assuming it is correct.",
      steps: ["Identify the shared attributes for each decomposition step.", "Show that the shared attributes determine all attributes of at least one component.", "List where each original dependency can be enforced.", "Name any dependency that would require a join to check."],
      code: [{ label: "Verification checklist", language: "text", text: "Lossless join evidence:\nR1 ∩ R2 = {__________}\nShared attributes determine: __________\n\nDependency preservation:\nFD 1 enforced in: __________\nFD 2 enforced in: __________\nFD requiring a join, if any: __________" }],
      resource: "../labs/normalization/normal-forms.html"
    }
  ],
  "er-modeling": [
    {
      id: "er-requirements", afterSlide: 9, duration: "6 minutes", title: "Practice: turn a sentence into model elements",
      prompt: "A department sponsors many events. Each event is held in one room. Students may register for many events, and a registration records the registration time.",
      steps: ["Underline nouns that suggest entity sets.", "Circle verbs that suggest relationships.", "Mark measurements or descriptions that suggest attributes.", "Highlight words that reveal minimum or maximum participation."],
      code: [{ label: "Requirement scan template", language: "text", text: "Candidate entities:\nCandidate relationships:\nCandidate attributes:\nParticipation/cardinality words:\nQuestions for the stakeholder:" }],
      resource: "../labs/foundations/er-modeling-lab.html"
    },
    {
      id: "er-cardinality", afterSlide: 33, duration: "5 minutes", title: "Practice: state cardinality in both directions",
      prompt: "For Department — sponsors — Event, assume every event has exactly one sponsoring department and a department may sponsor zero or many events.",
      steps: ["Write the rule from Department to Event.", "Write the rule from Event to Department.", "State minimum and maximum participation for both sides.", "Explain which words in the requirement justify each number."],
      code: [{ label: "Cardinality response frame", language: "text", text: "Department → Event: minimum ___, maximum ___\nEvent → Department: minimum ___, maximum ___\nPlain-English reading:\nEvidence from the requirement:" }]
    },
    {
      id: "er-associative", afterSlide: 45, duration: "6 minutes", title: "Practice: relationship or associative entity?",
      prompt: "Students register for events. A registration has registered_at, attended, payment_status, and may be cancelled independently.",
      steps: ["Decide whether Registration needs its own identity or lifecycle.", "Choose a key and explain whether a composite key is sufficient.", "Place the registration-specific attributes.", "State what duplicate registration rule must be enforced."],
      code: [{ label: "Decision template", language: "text", text: "Decision: relationship / associative entity\nReason:\nKey:\nAttributes:\nUniqueness rule:" }]
    },
    {
      id: "er-mapping", afterSlide: 85, duration: "8 minutes", title: "Practice: map the model to relations",
      prompt: "Map Department, Event, Student, and Registration into relations. Include keys and the sponsor relationship.",
      steps: ["Create one relation per entity set.", "Place the Department foreign key on the Event table for the 1:N relationship.", "Create Registration for the M:N student-event relationship.", "Put relationship attributes in Registration and label all constraints."],
      code: [{ label: "Copyable SQL starting point", language: "sql", text: "CREATE TABLE department (\n  department_id INTEGER PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);\n\nCREATE TABLE event (\n  event_id INTEGER PRIMARY KEY,\n  title VARCHAR(200) NOT NULL,\n  department_id INTEGER NOT NULL,\n  FOREIGN KEY (department_id) REFERENCES department(department_id)\n);\n\n-- Complete student and registration tables." }],
      resource: "../labs/foundations/er-modeling-lab.html"
    }
  ],
  "sql": [
    {
      id: "sql-bags", afterSlide: 14, duration: "4 minutes", title: "Lab: follow duplicates through the Product example",
      prompt: "Use the Product rows from slides 10–14. Predict the Manufacturer column after each numbered query, then run only that query.",
      steps: ["Build the Product example shown in the lecture.", "Run SELECT and keep both GizmoWorks rows.", "Add DISTINCT and predict which duplicate disappears."],
      code: [
        { label: "Step 1 — Recreate the Product example", language: "sql", text: "DROP TABLE IF EXISTS Product CASCADE;\n\nCREATE TABLE Product (\n  name VARCHAR(30),\n  price DECIMAL(8,2),\n  manufacturer VARCHAR(30)\n);\n\nINSERT INTO Product VALUES\n  ('Gizmo',       19.99, 'GizmoWorks'),\n  ('Powergizmo',  29.99, 'GizmoWorks'),\n  ('SingleTouch', 149.99, 'Canon'),\n  ('MultiTouch',  203.99, 'Hitachi');" },
        { label: "Step 2 — SELECT preserves duplicates", language: "sql", text: "SELECT Manufacturer\nFROM Product;" },
        { label: "Step 3 — DISTINCT removes duplicates", language: "sql", text: "SELECT DISTINCT Manufacturer\nFROM Product;" }
      ],
      demos: [
        "Product created.\n4 rows inserted.",
        "Manufacturer\n------------\nGizmoWorks\nGizmoWorks\nCanon\nHitachi\n\n4 rows",
        "Manufacturer\n------------\nGizmoWorks\nCanon\nHitachi\n\n3 rows"
      ],
      resource: "../labs/single-table/single-table-queries.html"
    },
    {
      id: "sql-foreign-key", afterSlide: 34, duration: "7 minutes", title: "Lab: enforce the Students–Enrolled rule",
      prompt: "Use the exact Students and Enrolled example from slide 34: only a student already in Students may enroll.",
      steps: ["Create Students with sid as its primary key.", "Create Enrolled with the composite key (student_id, cid).", "Insert Bob, Mary, and Mary’s two valid enrollments.", "Try student 999 and explain why the database rejects it."],
      code: [
        { label: "Step 1 — Create the parent table", language: "sql", text: "DROP TABLE IF EXISTS Enrolled;\nDROP TABLE IF EXISTS Students;\n\nCREATE TABLE Students (\n  sid VARCHAR(10) PRIMARY KEY,\n  name VARCHAR(60) NOT NULL,\n  gpa DECIMAL(2,1)\n);" },
        { label: "Step 2 — Create the child table", language: "sql", text: "CREATE TABLE Enrolled (\n  student_id VARCHAR(10),\n  cid VARCHAR(10),\n  grade VARCHAR(2),\n  PRIMARY KEY (student_id, cid),\n  FOREIGN KEY (student_id) REFERENCES Students(sid)\n);" },
        { label: "Step 3 — Insert the rows shown on slide 34", language: "sql", text: "INSERT INTO Students VALUES\n  ('101', 'Bob',  3.2),\n  ('123', 'Mary', 3.8);\n\nINSERT INTO Enrolled VALUES\n  ('123', '564', 'A'),\n  ('123', '537', 'A+');" },
        { label: "Step 4 — Test the foreign key", language: "sql", text: "INSERT INTO Enrolled VALUES ('999', '564', 'A');\n-- Rejected: student 999 does not appear in Students." }
      ],
      demos: [
        "Students table created.\nPrimary key: sid",
        "Enrolled table created.\nPrimary key: (student_id, cid)\nForeign key: student_id → Students.sid",
        "2 Students rows inserted.\n2 Enrolled rows inserted.",
        "FOREIGN KEY violation\n\nThe row is rejected because student_id '999' has no matching Students.sid.\nEnrolled remains unchanged."
      ],
      resource: "../labs/joins-foreign-keys/foreign-keys.html"
    },
    {
      id: "sql-join", afterSlide: 48, duration: "7 minutes", title: "Lab: trace the R–S join exactly as the slides do",
      prompt: "Use the R(A) and S(B,C) example from slides 45–48. Follow the logical meaning: combinations, filter, then projection.",
      steps: ["Create R and S with the values shown in the lecture.", "Generate the cross product R × S.", "Keep only combinations where R.A = S.B.", "Project R.A and explain why the answer contains two 3s."],
      code: [
        { label: "Step 1 — Recreate R and S", language: "sql", text: "DROP TABLE IF EXISTS R;\nDROP TABLE IF EXISTS S;\n\nCREATE TABLE R (A INTEGER);\nCREATE TABLE S (B INTEGER, C INTEGER);\n\nINSERT INTO R VALUES (1), (3);\nINSERT INTO S VALUES (2,3), (3,4), (3,5);" },
        { label: "Step 2 — Form every combination", language: "sql", text: "SELECT R.A, S.B, S.C\nFROM R CROSS JOIN S;" },
        { label: "Step 3 — Apply the join condition", language: "sql", text: "SELECT R.A, S.B, S.C\nFROM R CROSS JOIN S\nWHERE R.A = S.B;" },
        { label: "Step 4 — Project the requested column", language: "sql", text: "SELECT R.A\nFROM R, S\nWHERE R.A = S.B;\n-- Result: 3, 3 (SQL preserves both matching rows)." }
      ],
      demos: [
        "R created: 2 rows\nS created: 3 rows",
        "A | B | C\n--+---+--\n1 | 2 | 3\n1 | 3 | 4\n1 | 3 | 5\n3 | 2 | 3\n3 | 3 | 4\n3 | 3 | 5\n\n6 combinations",
        "A | B | C\n--+---+--\n3 | 3 | 4\n3 | 3 | 5\n\n2 matching combinations",
        "A\n-\n3\n3\n\n2 rows: projection preserves both matches."
      ],
      resource: "../labs/joins-foreign-keys/joins-part1.html"
    },
    {
      id: "sql-groupby", afterSlide: 95, duration: "8 minutes", title: "Lab: trace the Purchase query in four passes",
      prompt: "Use the Purchase example from slides 91–95. Build the result one clause at a time instead of switching to an unrelated table.",
      steps: ["Filter Purchase rows dated after October 1, 2005.", "Group the remaining rows by product.", "Keep groups whose total quantity is greater than 30.", "Return product and SUM(price × quantity), as in the lecture."],
      code: [
        { label: "Step 1 — FROM and WHERE select rows", language: "sql", text: "SELECT product, date, price, quantity\nFROM Purchase\nWHERE date > DATE '2005-10-01';" },
        { label: "Step 2 — GROUP BY forms product groups", language: "sql", text: "SELECT product, SUM(price * quantity) AS TotalSales\nFROM Purchase\nWHERE date > DATE '2005-10-01'\nGROUP BY product;" },
        { label: "Step 3 — HAVING filters groups", language: "sql", text: "SELECT product, SUM(price * quantity) AS TotalSales\nFROM Purchase\nWHERE date > DATE '2005-10-01'\nGROUP BY product\nHAVING SUM(quantity) > 30;" },
        { label: "Step 4 — Check the SELECT list", language: "sql", text: "-- Valid: product is grouped; TotalSales is aggregated.\nSELECT product, SUM(price * quantity) AS TotalSales\nFROM Purchase\nWHERE date > DATE '2005-10-01'\nGROUP BY product\nHAVING SUM(quantity) > 30;" }
      ],
      demos: [
        "product | date  | price | quantity\n--------+-------+-------+---------\nBagel   | 10/21 | 1.00  | 20\nBagel   | 10/25 | 1.50  | 20\nBanana  | 10/03 | 0.50  | 10\nBanana  | 10/10 | 1.00  | 10",
        "product | TotalSales\n--------+-----------\nBagel   | 50.00\nBanana  | 15.00",
        "product | TotalSales\n--------+-----------\nBagel   | 50.00\n\nBanana is removed because SUM(quantity) = 20.",
        "Valid grouped result\n\nproduct is in GROUP BY.\nSUM(price × quantity) is aggregated.\nOutput: Bagel | 50.00"
      ],
      resource: "../labs/aggregation/aggregation-grouping.html"
    },
    {
      id: "sql-null", afterSlide: 108, duration: "7 minutes", title: "Lab: follow the Person NULL example",
      prompt: "Use the Person predicates from slides 104–108. For the row with age 20, height NULL, and weight 200, label each condition TRUE, FALSE, or UNKNOWN before running it.",
      steps: ["Create the lecture’s Person row with an unknown height.", "Evaluate the AND predicate and explain why UNKNOWN is not returned.", "Test the apparently complete age condition.", "Add IS NULL so every age is handled explicitly."],
      code: [
        { label: "Step 1 — Create the Person example", language: "sql", text: "DROP TABLE IF EXISTS Person;\n\nCREATE TABLE Person (\n  age INTEGER,\n  height DECIMAL(3,1),\n  weight INTEGER\n);\n\nINSERT INTO Person VALUES\n  (20, NULL, 200),\n  (30, 5.8, 170),\n  (NULL, 6.1, 195);" },
        { label: "Step 2 — WHERE keeps only TRUE", language: "sql", text: "SELECT *\nFROM Person\nWHERE age < 25\n  AND (height > 6 AND weight > 190);\n-- The age-20 row yields UNKNOWN because height is NULL." },
        { label: "Step 3 — UNKNOWN can still exclude a row", language: "sql", text: "SELECT *\nFROM Person\nWHERE age < 25 OR age >= 25;\n-- The row with NULL age is not returned." },
        { label: "Step 4 — Test NULL explicitly", language: "sql", text: "SELECT *\nFROM Person\nWHERE age < 25\n   OR age >= 25\n   OR age IS NULL;" }
      ],
      demos: [
        "Person created.\n3 rows inserted, including one NULL height and one NULL age.",
        "No rows\n\nFor (20, NULL, 200):\nTRUE AND (UNKNOWN AND TRUE) = UNKNOWN.\nWHERE keeps only TRUE.",
        "age  | height | weight\n-----+--------+-------\n20   | NULL   | 200\n30   | 5.8    | 170\n\nThe NULL-age row evaluates to UNKNOWN and is omitted.",
        "age  | height | weight\n-----+--------+-------\n20   | NULL   | 200\n30   | 5.8    | 170\nNULL | 6.1    | 195\n\n3 rows: IS NULL handles the missing-age case."
      ]
    },
    {
      id: "sql-types", afterSlide: 124, duration: "8 minutes", title: "Lab: implement the four type choices from slide 124",
      prompt: "Translate the slide’s four examples into SQL. For each column, connect the type to the operation it must protect.",
      steps: ["Store price as exact DECIMAL(8,2).", "Store ZIP code as VARCHAR(5) so 00501 keeps its leading zeros.", "Store created_at as TIMESTAMP for ordering and elapsed time.", "Store temperature_c as DOUBLE PRECISION because the measurement is approximate."],
      code: [
        { label: "Step 1 — Declare the four slide examples", language: "sql", text: "DROP TABLE IF EXISTS TypeExamples;\n\nCREATE TABLE TypeExamples (\n  price DECIMAL(8,2),\n  zip_code VARCHAR(5),\n  created_at TIMESTAMP,\n  temperature_c DOUBLE PRECISION\n);" },
        { label: "Step 2 — Insert the values from slide 124", language: "sql", text: "INSERT INTO TypeExamples VALUES (\n  19.99,\n  '00501',\n  TIMESTAMP '2026-08-27 10:30:00',\n  21.8734\n);" },
        { label: "Step 3 — Verify representation", language: "sql", text: "SELECT price, zip_code, created_at, temperature_c\nFROM TypeExamples;\n-- Confirm that price is exact and zip_code still begins with 0." },
        { label: "Step 4 — Run a boundary test", language: "sql", text: "INSERT INTO TypeExamples(price, zip_code)\nVALUES (19.999, '00501');\n-- Check whether your DBMS rounds or rejects the third decimal place." }
      ],
      demos: [
        "TypeExamples created.\nprice: exact 2-decimal scale\nzip_code: 5-character identifier\ncreated_at: timestamp\ntemperature_c: approximate measurement",
        "1 row inserted.\nThe quotes preserve zip_code as text.",
        "price | zip_code | created_at          | temperature_c\n------+----------+---------------------+--------------\n19.99 | 00501    | 2026-08-27 10:30:00 | 21.8734",
        "DBMS-dependent boundary result\n\nA strict engine may reject 19.999 for DECIMAL(8,2).\nAnother engine may round it to 20.00.\nRecord the observed behavior and keep the test as evidence."
      ],
      resource: "../labs/foundations/data-types-use-cases.html"
    }
  ]
};
