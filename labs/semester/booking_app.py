"""PostgreSQL classroom booking starter. Usage: python booking_app.py STUDENT EVENT.

Install psycopg[binary]. Configure PGHOST, PGPORT, PGDATABASE, PGUSER.
Use a dedicated teaching database with setup.sql already loaded.
All booking/cancellation writers must lock the event row before changing bookings.
"""
import argparse
import getpass
import os
import sys

import psycopg


def book(conn, student_id: int, event_id: int) -> str:
    """Return only after commit; call on an idle connection at READ COMMITTED."""
    with conn.transaction():
        with conn.cursor() as cur:
            cur.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED')
            cur.execute('SELECT capacity FROM course32.events WHERE id=%s FOR UPDATE', (event_id,))
            row = cur.fetchone()
            if row is None:
                raise ValueError('Event not found')
            capacity = row[0]
            cur.execute('SELECT 1 FROM course32.students WHERE id=%s', (student_id,))
            if cur.fetchone() is None:
                raise ValueError('Student not found')
            cur.execute('SELECT 1 FROM course32.bookings WHERE student_id=%s AND event_id=%s',
                        (student_id, event_id))
            if cur.fetchone() is not None:
                outcome = 'Already booked'
            else:
                cur.execute('SELECT COUNT(*) FROM course32.bookings WHERE event_id=%s', (event_id,))
                if cur.fetchone()[0] >= capacity:
                    raise ValueError('Event is full')
                cur.execute('INSERT INTO course32.bookings(student_id,event_id) VALUES (%s,%s)',
                            (student_id, event_id))
                outcome = 'Booking confirmed'
    return outcome


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('student', type=int)
    parser.add_argument('event', type=int)
    args = parser.parse_args()
    password = os.environ.get('PGPASSWORD') or getpass.getpass('Database password: ')
    try:
        # Autocommit avoids an accidental outer transaction; book() creates its own.
        with psycopg.connect(password=password, autocommit=True) as conn:
            outcome = book(conn, args.student, args.event)
        print(outcome)
        return 0
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    except psycopg.Error as exc:
        # Never print the connection string/password. No success before commit.
        print(f'Database operation failed (SQLSTATE {exc.sqlstate or "unavailable"}). '
              'Check the teaching database and retry only after inspecting the outcome.', file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())

