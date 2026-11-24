# Consolidation QA

Run from the repository root:

```text
python -m unittest discover -s scripts -p "test_*.py" -v
python scripts/validate_site.py
python scripts/generate-mongodb-slides.py --check
npm install --prefix qa
node qa/test_sql.cjs
node qa/test_lab_queries.cjs
python -m pip install -r qa/requirements.txt
python -m playwright install chromium
python qa/test_browser.py
```

Alternatively set `CHROME_PATH` to an installed Chrome executable and skip the browser download. Set `PGLITE_MODULE` to an existing absolute module path if not using npm installation. Browser output stays in ignored `work/browser/`. External discussion scripts are stubbed and no posts are sent. SQL tests use a disposable in-memory database, not a configured server.

The checked-in JSON records describe this consolidation run. SQL snippet evidence includes one expected foreign-key rejection; it is not an unexplained test failure. `visual-review/findings.md` and its alignment map were imported as historical evidence; the system-color defect is now corrected, while other documented fidelity limits remain. See `../docs/consolidation-f26.md` for scope and unresolved checks.
