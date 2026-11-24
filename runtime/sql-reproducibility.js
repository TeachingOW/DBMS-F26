(() => {
  const config = window.DBMS_SQL_REPRO;
  const {syntaxCatalog, databaseSubsets} = config;
  function databaseSubsetForSlide(number) {
    return databaseSubsets.find(subset => number >= subset.start && number <= subset.end) || null;
  }

  function setupFileForSlide(number) {
    return databaseSubsetForSlide(number)?.file || 'demo-database.sql';
  }

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

  Object.assign(config, {databaseSubsetForSlide, setupFileForSlide, syntaxKeyFor, syntaxInfoFor, syntaxFor});
})();
