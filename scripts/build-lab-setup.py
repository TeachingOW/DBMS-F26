"""Regenerate the inline practice fixture from its downloadable SQL source."""
from pathlib import Path
import json
root = Path(__file__).resolve().parents[1]
sql = (root / 'lab-database.sql').read_text(encoding='utf-8')
(root / 'lab-database.js').write_text('// Generated from lab-database.sql; keep the download and inline setup identical.\nwindow.DBMS_LAB_SETUP = ' + json.dumps({'setup': sql, 'setupFile': 'lab-database.sql'}) + ';\n', encoding='utf-8')
