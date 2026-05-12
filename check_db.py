import sqlite3

def check_db():
    try:
        conn = sqlite3.connect('e:/Ticketing System/backend/tickets.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tickets")
        rows = cursor.fetchall()
        print(f"Found {len(rows)} tickets.")
        for row in rows:
            print(row)
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
