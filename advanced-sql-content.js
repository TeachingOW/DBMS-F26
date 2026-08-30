window.DBMS_ADVANCED_SLIDES = window.DBMS_ADVANCED_SLIDES || {};
window.DBMS_ADVANCED_SLIDES.sql = [
  {
    id: "advanced-start", section: "SQL Part III", title: "Advanced SQL turns query blocks into reusable reasoning tools",
    lead: "The next topics help you express multi-stage analysis, compare rows without collapsing them, protect concurrent work, and diagnose performance.",
    points: ["CTEs name intermediate results.", "Window functions analyze related rows while preserving detail.", "Transactions protect multi-statement changes.", "Indexes and EXPLAIN connect query intent to performance."],
    takeaway: "Keep using the same discipline: predict schema, rows, multiplicity, NULL behavior, and now—state changes and access paths."
  },
  {
    id: "cte-purpose", section: "Common table expressions", title: "A CTE gives one query block a meaningful name",
    lead: "WITH defines a temporary result that exists only for the statement. It can replace a deeply nested subquery and expose the stages of a solution.",
    points: ["List the CTE before the main query.", "Give its output columns clear names.", "Test the CTE body independently before adding the next stage."],
    code: [{ label: "Name the filtered rows", language: "sql", text: "WITH recent_registration AS (\n  SELECT student_id, event_id, ticket_price\n  FROM event_registration\n  WHERE registered_at >= DATE '2026-08-01'\n)\nSELECT *\nFROM recent_registration;" }],
    takeaway: "A CTE improves structure; it does not automatically make a query faster."
  },
  {
    id: "cte-pipeline", section: "Common table expressions", title: "Chain CTEs when each stage has one job",
    lead: "This query first summarizes revenue per event, then joins the summary to Event. Each CTE has a small, testable output schema.",
    points: ["Stage 1 changes the grain to one row per event.", "Stage 2 attaches the event title.", "The final WHERE filters summarized values."],
    code: [{ label: "Build a two-stage query", language: "sql", text: "WITH event_total AS (\n  SELECT event_id, SUM(ticket_price) AS revenue\n  FROM event_registration\n  GROUP BY event_id\n),\nlabeled_total AS (\n  SELECT e.event_id, e.title, t.revenue\n  FROM Event AS e\n  JOIN event_total AS t ON t.event_id = e.event_id\n)\nSELECT title, revenue\nFROM labeled_total\nWHERE revenue >= 500;" }],
    takeaway: "Write down the grain and columns produced by every stage."
  },
  {
    id: "recursive-cte", section: "Recursive CTEs", title: "Recursion combines a starting set with repeated expansion",
    lead: "A recursive CTE has an anchor query and a recursive query joined by UNION ALL. The recursive member uses rows produced in the prior iteration.",
    points: ["The anchor creates level 0.", "The recursive member produces the next level.", "A stopping condition must prevent unlimited expansion."],
    code: [{ label: "Walk an employee hierarchy", language: "sql", text: "WITH RECURSIVE org AS (\n  SELECT employee_id, manager_id, employee_name, 0 AS depth\n  FROM Employee\n  WHERE manager_id IS NULL\n\n  UNION ALL\n\n  SELECT e.employee_id, e.manager_id, e.employee_name, o.depth + 1\n  FROM Employee AS e\n  JOIN org AS o ON e.manager_id = o.employee_id\n)\nSELECT employee_id, employee_name, depth\nFROM org\nORDER BY depth, employee_id;" }],
    takeaway: "Some systems omit the RECURSIVE keyword, so verify the target dialect."
  },
  {
    id: "recursive-safety", section: "Recursive CTEs", title: "Trace recursion level by level and plan for cycles",
    lead: "Bad hierarchy data can contain a cycle such as 7 → 12 → 7. Without protection, the recursive member can revisit the same nodes.",
    points: ["Predict the anchor rows.", "List the new rows from each iteration.", "Stop when an iteration produces no new rows.", "Use a path or visited-node test when cycles are possible."],
    code: [{ label: "Bound a teaching example", language: "sql", text: "WITH RECURSIVE level(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1\n  FROM level\n  WHERE n < 5\n)\nSELECT n FROM level;\n-- Result: 1, 2, 3, 4, 5" }],
    takeaway: "A recursive query is only as safe as its termination and cycle rules."
  },
  {
    id: "window-intro", section: "Window functions", title: "A window function analyzes neighbors without collapsing rows",
    lead: "GROUP BY returns one row per group. A window function keeps each input row and adds a value computed over related rows.",
    points: ["The function appears with OVER(...).", "PARTITION BY defines independent groups.", "ORDER BY inside OVER defines sequence within each group."],
    code: [{ label: "Keep registrations and add the event average", language: "sql", text: "SELECT\n  registration_id,\n  event_id,\n  ticket_price,\n  AVG(ticket_price) OVER (PARTITION BY event_id) AS event_avg\nFROM event_registration;" }],
    takeaway: "Use GROUP BY to change the grain; use windows to preserve the grain."
  },
  {
    id: "window-partition", section: "Window functions", title: "PARTITION BY restarts the calculation for each group",
    lead: "Every registration remains visible, but total revenue is calculated separately for each event_id partition.",
    points: ["Rows with the same event_id share a partition.", "The partition total repeats on every row in that event.", "No GROUP BY is needed because detail rows remain."],
    code: [{ label: "Add a partition total", language: "sql", text: "SELECT\n  registration_id,\n  event_id,\n  ticket_price,\n  SUM(ticket_price) OVER (PARTITION BY event_id) AS event_revenue\nFROM event_registration\nORDER BY event_id, registration_id;" }],
    takeaway: "A repeated window result is intentional context, not an accidental duplicate."
  },
  {
    id: "window-ranking", section: "Window functions", title: "Choose a ranking function based on how ties should behave",
    lead: "ROW_NUMBER always assigns unique positions. RANK gives tied rows the same rank and leaves gaps. DENSE_RANK gives ties the same rank without gaps.",
    points: ["Include a deterministic tie-breaker when one row must be first.", "Partition when ranking should restart by group.", "Do not use rank as a permanent identifier."],
    code: [{ label: "Rank registrations within each event", language: "sql", text: "SELECT\n  event_id,\n  student_id,\n  registered_at,\n  ROW_NUMBER() OVER (\n    PARTITION BY event_id\n    ORDER BY registered_at, registration_id\n  ) AS signup_order\nFROM event_registration;" }],
    takeaway: "Ordering defines ranking meaning; incomplete ordering makes tied results unstable."
  },
  {
    id: "window-frame", section: "Window functions", title: "A running total needs an explicit window frame",
    lead: "The frame controls which ordered rows contribute to the current result. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW means from the first row through this row.",
    points: ["PARTITION BY restarts the total per event.", "ORDER BY registered_at defines progression.", "ROWS states that physical rows, including ties, are accumulated."],
    code: [{ label: "Calculate cumulative event revenue", language: "sql", text: "SELECT\n  event_id,\n  registered_at,\n  ticket_price,\n  SUM(ticket_price) OVER (\n    PARTITION BY event_id\n    ORDER BY registered_at, registration_id\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS running_revenue\nFROM event_registration;" }],
    takeaway: "When order matters, write the frame instead of relying on a dialect default."
  },
  {
    id: "window-lag", section: "Window functions", title: "LAG compares the current row with a prior row",
    lead: "LAG returns a value from an earlier row in the window order. The first row has no predecessor, so its previous value is NULL.",
    points: ["Define the comparison order explicitly.", "Subtract the prior value only when the units are meaningful.", "Handle the first-row NULL deliberately."],
    code: [{ label: "Measure the change from the previous ticket", language: "sql", text: "SELECT\n  event_id,\n  registered_at,\n  ticket_price,\n  LAG(ticket_price) OVER (\n    PARTITION BY event_id\n    ORDER BY registered_at, registration_id\n  ) AS previous_price,\n  ticket_price - LAG(ticket_price) OVER (\n    PARTITION BY event_id\n    ORDER BY registered_at, registration_id\n  ) AS price_change\nFROM event_registration;" }],
    takeaway: "Window navigation replaces many error-prone self-joins."
  },
  {
    id: "views", section: "Views", title: "A view gives a query a reusable interface",
    lead: "CREATE VIEW stores a query definition, not a copied result in ordinary implementations. Consumers query the view as if it were a table.",
    points: ["Expose stable names and a useful grain.", "Hide unnecessary columns.", "Document whether the view can contain duplicate or NULL rows."],
    code: [{ label: "Create a reusable event summary", language: "sql", text: "CREATE VIEW event_summary AS\nSELECT\n  e.event_id,\n  e.title,\n  COUNT(r.registration_id) AS registrations,\n  COALESCE(SUM(r.ticket_price), 0) AS revenue\nFROM Event AS e\nLEFT JOIN event_registration AS r\n  ON r.event_id = e.event_id\nGROUP BY e.event_id, e.title;\n\nSELECT * FROM event_summary;" }],
    takeaway: "A view is a contract over a query; changes to its columns can break consumers."
  },
  {
    id: "view-boundaries", section: "Views", title: "Views simplify access but do not replace authorization",
    lead: "A view can expose only approved rows or columns, but protection also depends on database privileges and whether users can still query the base tables.",
    points: ["Grant access to the view and restrict base-table access when appropriate.", "Avoid exposing sensitive columns through joins or derived expressions.", "Treat an updatable view as dialect-specific behavior."],
    code: [{ label: "Expose a limited student directory", language: "sql", text: "CREATE VIEW public_student_directory AS\nSELECT student_id, display_name, major\nFROM Student\nWHERE directory_opt_in = TRUE;\n\n-- PUBLIC is a built-in PostgreSQL role.\nGRANT SELECT ON public_student_directory TO PUBLIC;" }],
    takeaway: "A view contributes to least privilege only when grants enforce the boundary."
  },
  {
    id: "transactions", section: "Transactions", title: "A transaction makes several statements one logical unit",
    lead: "A registration may require an event seat update and a payment row. Either both changes should commit or neither should remain.",
    points: ["Atomicity prevents partial completion.", "Consistency preserves constraints.", "Isolation controls interference between transactions.", "Durability preserves committed work."],
    code: [{ label: "Protect a two-statement change", language: "sql", text: "BEGIN;\n\nINSERT INTO event_registration\n  (registration_id, student_id, event_id, ticket_price)\nVALUES\n  (9001, '00501', 42, 19.99);\n\nUPDATE Event\nSET seats_remaining = seats_remaining - 1\nWHERE event_id = 42\n  AND seats_remaining > 0;\n\nCOMMIT;" }],
    takeaway: "A transaction boundary should match one business action."
  },
  {
    id: "rollback-savepoint", section: "Transactions", title: "ROLLBACK and SAVEPOINT provide controlled recovery",
    lead: "ROLLBACK cancels the transaction. A savepoint marks an intermediate position so part of the work can be undone without abandoning everything.",
    points: ["Check affected-row counts before committing.", "Rollback after any failed invariant.", "Use savepoints sparingly; simple transactions are easier to reason about."],
    code: [{ label: "Undo only the optional step", language: "sql", text: "BEGIN;\n\nINSERT INTO event_registration\n  (registration_id, student_id, event_id, ticket_price)\nVALUES\n  (9002, '00502', 43, 29.99);\n\nSAVEPOINT optional_note;\nUPDATE event_registration\nSET notes = 'VIP meal requested'\nWHERE registration_id = 9002;\n\nROLLBACK TO SAVEPOINT optional_note;\nCOMMIT;" }],
    takeaway: "COMMIT is a decision point—validate the intended state before crossing it."
  },
  {
    id: "concurrency-anomalies", section: "Isolation", title: "Concurrent transactions can observe surprising intermediate states",
    lead: "Isolation rules determine which changes one transaction may observe while another transaction is still active.",
    points: ["Dirty read: observe data that may roll back.", "Non-repeatable read: reread one row and get a different value.", "Phantom: repeat a predicate query and get a different set of rows.", "Lost update: one write overwrites another transaction’s work."],
    takeaway: "Name the anomaly before choosing a locking or isolation strategy."
  },
  {
    id: "isolation-levels", section: "Isolation", title: "Stronger isolation reduces anomalies but may reduce concurrency",
    lead: "READ COMMITTED, REPEATABLE READ, and SERIALIZABLE describe increasingly strong guarantees, but exact behavior varies across database engines.",
    points: ["READ COMMITTED blocks dirty reads in common implementations.", "REPEATABLE READ protects previously read rows more strongly.", "SERIALIZABLE aims for an outcome equivalent to some serial order.", "Applications must be prepared to retry aborted transactions."],
    code: [{ label: "Declare intent, then keep the transaction short", language: "sql", text: "BEGIN;\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n\nSELECT event_id, seats_remaining\nFROM Event\nWHERE event_id = 42\nFOR UPDATE;\n\n-- Perform the related registration and capacity update here.\nCOMMIT;" }],
    takeaway: "Isolation is a correctness choice first and a performance tradeoff second."
  },
  {
    id: "indexes", section: "Indexes", title: "An index trades extra storage and write work for faster access",
    lead: "A B-tree index can help equality, range, ordering, and prefix lookups on its indexed key. The optimizer decides whether using it is cheaper than scanning.",
    points: ["Index columns used in selective filters and joins.", "Avoid indexing every column.", "Remember that INSERT, UPDATE, and DELETE must maintain each index."],
    code: [{ label: "Support a common event lookup", language: "sql", text: "CREATE INDEX idx_registration_event_time\nON event_registration(event_id, registered_at);\n\nSELECT registration_id, student_id, registered_at\nFROM event_registration\nWHERE event_id = 42\n  AND registered_at >= TIMESTAMP '2026-08-01 00:00:00'\nORDER BY registered_at;" }],
    takeaway: "Create an index for a real query pattern, then measure the plan."
  },
  {
    id: "composite-index", section: "Indexes", title: "Composite-index order should match the query’s leading conditions",
    lead: "For an index on (event_id, registered_at), event_id is the leading column. Queries that constrain event_id can efficiently use the following time range.",
    points: ["Equality columns commonly come before range columns.", "An index may also satisfy ORDER BY when direction and prefix align.", "A query on registered_at alone may not use this index effectively."],
    code: [{ label: "Compare two access patterns", language: "sql", text: "-- Aligned with (event_id, registered_at)\nSELECT * FROM event_registration\nWHERE event_id = 42\n  AND registered_at >= TIMESTAMP '2026-08-01 00:00:00';\n\n-- Missing the leading event_id condition\nSELECT * FROM event_registration\nWHERE registered_at >= TIMESTAMP '2026-08-01 00:00:00';" }],
    takeaway: "Column order is part of the index design, not a cosmetic choice."
  },
  {
    id: "explain", section: "Query plans", title: "EXPLAIN connects SQL meaning to the chosen access plan",
    lead: "A plan shows operations such as scans, index lookups, joins, sorts, and aggregates. Estimated row counts often explain why the optimizer chose them.",
    points: ["Read from data access toward the final result.", "Compare estimated rows with actual rows when the DBMS supports execution analysis.", "Look for avoidable full scans, large intermediate results, and repeated work."],
    code: [{ label: "Inspect without changing the query’s meaning", language: "sql", text: "EXPLAIN\nSELECT event_id, COUNT(*)\nFROM event_registration\nWHERE registered_at >= DATE '2026-08-01'\nGROUP BY event_id;\n\n-- PostgreSQL example for measured execution:\nEXPLAIN ANALYZE\nSELECT event_id, COUNT(*)\nFROM event_registration\nWHERE registered_at >= DATE '2026-08-01'\nGROUP BY event_id;" }],
    takeaway: "Optimize evidence from the plan—not the visual complexity of the SQL text."
  },
  {
    id: "capstone-query", section: "Capstone", title: "Combine a CTE and window function without losing the grain",
    lead: "The CTE summarizes one row per event. The outer window ranks those event summaries by revenue.",
    points: ["The CTE output grain is one row per event.", "RANK compares those event rows.", "The final result remains one row per event."],
    code: [{ label: "Rank events by revenue", language: "sql", text: "WITH event_total AS (\n  SELECT\n    event_id,\n    COUNT(*) AS registrations,\n    SUM(ticket_price) AS revenue\n  FROM event_registration\n  GROUP BY event_id\n)\nSELECT\n  event_id,\n  registrations,\n  revenue,\n  RANK() OVER (ORDER BY revenue DESC) AS revenue_rank\nFROM event_total\nORDER BY revenue_rank, event_id;" }],
    takeaway: "State the grain after every query block to prevent accidental duplication."
  },
  {
    id: "advanced-practice", section: "Advanced SQL practice", title: "Build the advanced query in four testable steps",
    lead: "Report each event’s registrations, revenue, running revenue by registration time, and overall revenue rank.",
    points: ["Create and inspect the event-level CTE.", "Write the detail-level running total separately.", "Join the two results using event_id.", "Predict duplicates and NULLs before adding the final ORDER BY."],
    code: [{ label: "Starter: finish one stage at a time", language: "sql", text: "WITH event_total AS (\n  SELECT event_id, COUNT(*) AS registrations,\n         SUM(ticket_price) AS revenue\n  FROM event_registration\n  GROUP BY event_id\n),\nranked_event AS (\n  SELECT event_id, registrations, revenue,\n         RANK() OVER (ORDER BY revenue DESC) AS revenue_rank\n  FROM event_total\n)\nSELECT *\nFROM ranked_event\nORDER BY revenue_rank, event_id;\n\n-- Next: add a separate registration-level running total." }],
    takeaway: "Submit each intermediate result and explain its schema and grain."
  },
  {
    id: "advanced-summary", section: "Advanced SQL summary", title: "Advanced SQL is structured reasoning, not longer syntax",
    lead: "CTEs clarify stages, windows add context without collapsing rows, views expose stable interfaces, transactions protect state, and indexes support measured access paths.",
    points: ["Name each query block’s grain.", "Separate correctness from execution strategy.", "Treat concurrency and NULL as part of semantics.", "Use plans and measurements before tuning."],
    takeaway: "The expert habit remains the same: predict, run, compare, and explain."
  }
];
