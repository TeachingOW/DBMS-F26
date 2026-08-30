window.DBMS_QUERY_LABS = window.DBMS_QUERY_LABS || {};

const quickQueryLab = (afterSlide, id, title, prompt, code, demo) => ({
  id: `quick-${id}`,
  afterSlide,
  duration: "3 minutes",
  title: `Quick lab: ${title}`,
  prompt,
  steps: ["Predict the output columns and row count.", "Copy and run the query with the lecture data.", "Show the result and explain any difference from your prediction."],
  code: [{ label: `Query from slide ${afterSlide}`, language: "sql", text: code }],
  demos: [demo],
  quick: true
});

window.DBMS_QUERY_LABS.sql = [
  quickQueryLab(24, "selection", "filter Product rows", "Keep only products in the Gadgets category.",
    "SELECT *\nFROM Product\nWHERE Category = 'Gadgets';",
    "name       | price | category | manufacturer\n-----------+-------+----------+-------------\nGizmo      | 19.99 | Gadgets  | GizmoWorks\nPowergizmo | 29.99 | Gadgets  | GizmoWorks\n\nAdditional Gadget rows may also appear in the shared demo database."),

  quickQueryLab(25, "projection", "choose the output columns", "Filter to Gadgets, then return only name, price, and manufacturer.",
    "SELECT name, price, manufacturer\nFROM Product\nWHERE category = 'Gadgets';",
    "The result contains only name, price, and manufacturer for each Gadget row."),

  quickQueryLab(29, "like", "match a name pattern", "Find product names containing the text gizmo.",
    "SELECT name\nFROM Product\nWHERE LOWER(name) LIKE '%gizmo%';",
    "name\n----------\nGizmo\nPowergizmo\n\nLOWER makes this example case-insensitive across common DBMS products."),

  quickQueryLab(30, "distinct", "remove repeated categories", "Compare the category list with and without duplicate removal.",
    "SELECT category FROM Product;\n\nSELECT DISTINCT category FROM Product;",
    "Without DISTINCT: Gadgets, Gadgets, Photography, Household\n\nWith DISTINCT: Gadgets, Photography, Household"),

  quickQueryLab(31, "order-by", "sort with a tie-breaker", "Sort qualifying products by price and then by name.",
    "SELECT name, price, manufacturer\nFROM Product\nWHERE category = 'Gadgets' AND price > 20\nORDER BY price, name;",
    "Rows are ordered by price; name provides a deterministic tie-breaker."),

  quickQueryLab(35, "foreign-key", "declare a valid reference", "Create Enrolled so every student_id must match Students.sid.",
    "DROP TABLE IF EXISTS Enrolled;\n\nCREATE TABLE Enrolled (\n  student_id VARCHAR(10),\n  cid VARCHAR(10),\n  grade VARCHAR(2),\n  PRIMARY KEY (student_id, cid),\n  FOREIGN KEY (student_id) REFERENCES Students(sid)\n);",
    "Enrolled created.\nPrimary key: (student_id, cid)\nForeign key: student_id → Students.sid"),

  quickQueryLab(41, "join-japan", "join Product to Company", "Return products under $200 made by companies in Japan.",
    "SELECT p.name, p.price\nFROM Product AS p\nJOIN Company AS c ON p.manufacturer = c.name\nWHERE c.country = 'Japan'\n  AND p.price <= 200;",
    "SingleTouch and other qualifying Japanese products appear; MultiTouch is excluded because its price exceeds 200."),

  quickQueryLab(43, "aliases", "resolve ambiguous names", "Use aliases so name and address clearly come from Person.",
    "SELECT DISTINCT p.name, p.address\nFROM Person AS p\nJOIN Company AS c ON p.worksfor = c.name;",
    "The output uses Person.name and Person.address.\nAliases remove ambiguity without changing the join result."),

  quickQueryLab(46, "join-semantics", "trace combinations, filter, projection", "Use the R and S example to explain why 3 appears twice.",
    "SELECT R.A\nFROM R, S\nWHERE R.A = S.B;",
    "A\n-\n3\n3\n\nR.A = 3 matches two S rows. Projection preserves both matches."),

  quickQueryLab(50, "join-duplicates", "diagnose repeated countries", "Return unique countries that manufacture a Gadget.",
    "SELECT DISTINCT c.country\nFROM Product AS p\nJOIN Company AS c ON p.manufacturer = c.name\nWHERE p.category = 'Gadgets';",
    "Country\n-------\nUSA\n\nWithout DISTINCT, USA appears once for each matching Gadget product."),

  quickQueryLab(59, "intersect", "keep values in both results", "Find A values returned by both join queries.",
    "SELECT R.A FROM R, S WHERE R.A = S.A\nINTERSECT\nSELECT R.A FROM R, T WHERE R.A = T.A;",
    "The result contains distinct A values present in both query outputs.\nBoth sides must return compatible columns."),

  quickQueryLab(60, "union", "combine results as a set", "Combine both A-value results and remove duplicates.",
    "SELECT R.A FROM R, S WHERE R.A = S.A\nUNION\nSELECT R.A FROM R, T WHERE R.A = T.A;",
    "Every distinct A value from either query appears once.\nUNION applies set semantics."),

  quickQueryLab(61, "union-all", "preserve every result occurrence", "Combine both A-value results without duplicate removal.",
    "SELECT R.A FROM R, S WHERE R.A = S.A\nUNION ALL\nSELECT R.A FROM R, T WHERE R.A = T.A;",
    "Rows from both query outputs are appended.\nRepeated A values remain repeated."),

  quickQueryLab(62, "except", "subtract one result", "Keep A values returned by the first query but not the second.",
    "SELECT R.A FROM R, S WHERE R.A = S.A\nEXCEPT\nSELECT R.A FROM R, T WHERE R.A = T.A;",
    "Only distinct A values in the first result and absent from the second remain."),

  quickQueryLab(66, "nested-in", "apply two membership tests", "Find headquarters of companies with factories in both the US and China.",
    "SELECT DISTINCT c.hq_city\nFROM Company AS c\nWHERE c.name IN (\n  SELECT maker FROM Product WHERE factory_loc = 'US'\n)\nAND c.name IN (\n  SELECT maker FROM Product WHERE factory_loc = 'China'\n);",
    "Only a company name present in both maker lists qualifies.\nProjecting hq_city happens after company identity is verified."),

  quickQueryLab(68, "subquery-relation", "use one query as an input", "Find cities of companies making products bought by Joe Blow.",
    "SELECT c.city\nFROM Company AS c\nWHERE c.name IN (\n  SELECT pr.maker\n  FROM Purchase AS p\n  JOIN Product AS pr ON p.product = pr.name\n  WHERE p.buyer = 'Joe Blow'\n);",
    "The inner query returns maker names.\nThe outer query converts qualifying makers into company cities."),

  quickQueryLab(70, "rewrite-distinct", "make a join rewrite set-equivalent", "Use DISTINCT so the flattened join returns the same set of cities as the IN query.",
    "SELECT DISTINCT c.city\nFROM Company AS c\nJOIN Product AS pr ON c.name = pr.maker\nJOIN Purchase AS p ON pr.name = p.product\nWHERE p.buyer = 'Joe Blow';",
    "Each qualifying city appears once.\nDISTINCT removes repetitions caused by multiple matching purchases."),

  quickQueryLab(71, "all", "compare with every subquery value", "Find products more expensive than every Gizmo-Works product.",
    "SELECT name\nFROM Product\nWHERE price > ALL (\n  SELECT price\n  FROM Product\n  WHERE maker = 'Gizmo-Works'\n);",
    "A product qualifies only if its price exceeds every value returned by the subquery.\nANY and ALL support varies by DBMS."),

  quickQueryLab(72, "exists", "test whether a matching row exists", "Find Gizmo-Works products whose name is also used by a competitor.",
    "SELECT p1.name\nFROM Product AS p1\nWHERE p1.maker = 'Gizmo-Works'\n  AND EXISTS (\n    SELECT 1\n    FROM Product AS p2\n    WHERE p2.maker <> 'Gizmo-Works'\n      AND p2.name = p1.name\n  );",
    "The outer product is returned when the correlated subquery finds at least one competitor row with the same name."),

  quickQueryLab(73, "not-exists", "express a set difference", "Return R pairs that have no matching pair in S.",
    "SELECT R.A, R.B\nFROM R\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM S\n  WHERE S.A = R.A AND S.B = R.B\n);",
    "Each R row is kept only when no equal (A,B) row exists in S.\nThis is a NULL-safer anti-match pattern."),

  quickQueryLab(75, "correlated", "track outer and inner scope", "Find movie titles associated with more than one year.",
    "SELECT DISTINCT m.title\nFROM Movie AS m\nWHERE EXISTS (\n  SELECT 1\n  FROM Movie AS other\n  WHERE other.title = m.title\n    AND other.year <> m.year\n);",
    "A title qualifies when another Movie row has the same title and a different year.\nThe outer alias m changes each correlation test."),

  quickQueryLab(76, "correlated-all", "compare within each manufacturer", "Find products priced above all older products from the same maker.",
    "SELECT DISTINCT x.name, x.maker\nFROM Product AS x\nWHERE x.price > ALL (\n  SELECT y.price\n  FROM Product AS y\n  WHERE y.maker = x.maker\n    AND y.year < 1972\n);",
    "The comparison set is different for each outer product because x.maker is correlated into the subquery."),

  quickQueryLab(81, "aggregate", "summarize qualifying rows", "Count products after 1995 and average Toyota prices.",
    "SELECT COUNT(*) AS recent_products\nFROM Product\nWHERE year > 1995;\n\nSELECT AVG(price) AS toyota_average\nFROM Product\nWHERE maker = 'Toyota';",
    "Each statement returns one summary row.\nAVG ignores NULL price values; COUNT(*) counts rows."),

  quickQueryLab(82, "count-distinct", "count unique categories", "Compare row count, non-NULL category count, and unique category count.",
    "SELECT\n  COUNT(*) AS rows,\n  COUNT(category) AS known_categories,\n  COUNT(DISTINCT category) AS unique_categories\nFROM Product\nWHERE year > 1995;",
    "rows counts every qualifying row.\nknown_categories skips NULL.\nunique_categories also removes duplicate category values."),

  quickQueryLab(84, "sum-expression", "calculate Bagel revenue", "Sum price times quantity for Bagel purchases.",
    "SELECT SUM(price * quantity) AS BagelSales\nFROM Purchase\nWHERE product = 'Bagel';",
    "BagelSales\n----------\n50.00\n\n1.00×20 + 1.50×20 = 50.00"),

  quickQueryLab(89, "group-by", "return one total per product", "Calculate sales after October 1, 2005 for each product.",
    "SELECT product, SUM(price * quantity) AS TotalSales\nFROM Purchase\nWHERE date > DATE '2005-10-01'\nGROUP BY product;",
    "product | TotalSales\n--------+-----------\nBagel   | 50.00\nBanana  | 15.00\n\nOne output row per product group."),

  quickQueryLab(92, "having", "filter complete groups", "Keep products whose total purchased quantity exceeds 30.",
    "SELECT product, SUM(price * quantity) AS TotalSales\nFROM Purchase\nWHERE date > DATE '2005-10-01'\nGROUP BY product\nHAVING SUM(quantity) > 30;",
    "product | TotalSales\n--------+-----------\nBagel   | 50.00\n\nBanana is removed because its quantity totals 20."),

  quickQueryLab(97, "author-group", "count related rows per author", "Find authors with more than ten Wrote rows.",
    "SELECT a.name\nFROM Author AS a\nJOIN Wrote AS w ON a.login = w.login\nGROUP BY a.name\nHAVING COUNT(w.url) > 10;",
    "One row per qualifying author group.\nNo DISTINCT is needed because GROUP BY already produces one row per name."),

  quickQueryLab(98, "grouped-subquery", "filter entities with a grouped subquery", "Return authors whose login appears in a qualifying grouped result.",
    "SELECT name\nFROM Author\nWHERE login IN (\n  SELECT login\n  FROM Wrote\n  GROUP BY login\n  HAVING COUNT(*) > 10\n);",
    "The inner query returns qualifying logins.\nThe outer query returns the corresponding author names."),

  quickQueryLab(101, "existential", "express 'some' with a join", "Find companies making at least one product priced below 100.",
    "SELECT DISTINCT c.name\nFROM Company AS c\nJOIN Product AS p ON c.name = p.company\nWHERE p.price < 100;",
    "Each qualifying company appears once.\nDISTINCT controls repetition when a company has several inexpensive products."),

  quickQueryLab(102, "universal", "express 'all' as no counterexample", "Find companies with no product priced 100 or more.",
    "SELECT c.name\nFROM Company AS c\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM Product AS p\n  WHERE p.company = c.name\n    AND p.price >= 100\n);",
    "A company qualifies only when the counterexample query returns no row.\nThis expresses 'all products are below 100.'"),

  quickQueryLab(105, "null-and", "trace UNKNOWN through AND", "Predict the Person result when height is NULL.",
    "SELECT *\nFROM Person\nWHERE age < 25\n  AND (height > 6 AND weight > 190);",
    "For (20, NULL, 200): TRUE AND (UNKNOWN AND TRUE) = UNKNOWN.\nWHERE rejects the row because it retains only TRUE."),

  quickQueryLab(107, "is-null", "handle the missing-age case", "Write an age condition that also includes NULL ages.",
    "SELECT *\nFROM Person\nWHERE age < 25\n   OR age >= 25\n   OR age IS NULL;",
    "Known ages satisfy one comparison; missing ages satisfy IS NULL.\nAll Person rows are covered."),

  quickQueryLab(110, "inner-loss", "identify rows lost by an inner join", "Join products to purchases and predict which products disappear.",
    "SELECT p.name, pu.store\nFROM Product AS p\nJOIN Purchase AS pu ON p.name = pu.product;",
    "Only products with at least one Purchase row appear.\nAn unsold product such as OneClick is omitted."),

  quickQueryLab(113, "left-join", "preserve unsold products", "Return every product and any matching purchase store.",
    "SELECT p.name, pu.store\nFROM Product AS p\nLEFT JOIN Purchase AS pu ON p.name = pu.product;",
    "name     | store\n---------+------\nGizmo    | Wiz\nCamera   | Ritz\nCamera   | Wiz\nOneClick | NULL\n\nThe unmatched left row is preserved."),

  quickQueryLab(119, "empty-product", "test the empty-relation edge case", "Explain what happens when S is empty in the three-table query.",
    "SELECT DISTINCT R.A\nFROM R, S, T\nWHERE R.A = S.A OR R.A = T.A;",
    "If S is empty, R × S × T is empty.\nThe WHERE condition is never evaluated, so the result is empty—even if R matches T.")
];
