-- Worked reference answers. Load setup.sql first. PostgreSQL 16+.
SET search_path TO course32;
-- Every event, including the empty event.
SELECT e.id,e.title,COUNT(b.student_id) AS bookings,
 COUNT(b.student_id) FILTER (WHERE b.paid) AS paid_bookings,
 COALESCE(SUM(e.fee) FILTER (WHERE b.paid),0) AS paid_revenue
FROM events e LEFT JOIN bookings b ON b.event_id=e.id
GROUP BY e.id,e.title ORDER BY e.id;
-- No bookings.
SELECT s.id,s.name FROM students s
WHERE NOT EXISTS(SELECT 1 FROM bookings b WHERE b.student_id=s.id) ORDER BY s.id;
-- Every required event; true for all students when required_event is empty.
SELECT s.id,s.name FROM students s WHERE NOT EXISTS (
 SELECT 1 FROM required_event r WHERE NOT EXISTS (
  SELECT 1 FROM bookings b WHERE b.student_id=s.id AND b.event_id=r.event_id
 )) ORDER BY s.id;
-- Ranking after aggregation, ties preserved.
WITH revenue AS (
 SELECT e.id,e.title,COALESCE(SUM(e.fee) FILTER(WHERE b.paid),0) AS amount
 FROM events e LEFT JOIN bookings b ON b.event_id=e.id GROUP BY e.id,e.title
)
SELECT *,RANK() OVER(ORDER BY amount DESC) AS revenue_rank,
 DENSE_RANK() OVER(ORDER BY amount DESC) AS dense_revenue_rank,
 ROW_NUMBER() OVER(ORDER BY amount DESC,id) AS deterministic_row,
 amount / NULLIF(SUM(amount) OVER(),0) AS share
FROM revenue ORDER BY id;
-- Deterministic cumulative booking count.
SELECT student_id,event_id,booked_at,
 COUNT(*) OVER(ORDER BY booked_at,student_id,event_id
              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_count
FROM bookings ORDER BY booked_at,student_id,event_id;
-- Traversal from a chosen node, with explicit cycle guard and depth bound.
WITH RECURSIVE tree AS (
 SELECT id,name,parent_id,0 AS depth,ARRAY[id] AS path FROM topics WHERE id=1
 UNION ALL
 SELECT t.id,t.name,t.parent_id,p.depth+1,p.path||t.id
 FROM topics t JOIN tree p ON t.parent_id=p.id
 WHERE NOT t.id=ANY(p.path) AND p.depth<20
)
SELECT * FROM tree ORDER BY path;

