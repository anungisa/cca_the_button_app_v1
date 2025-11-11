import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

conn_params = {
    'host': 'aws-1-ca-central-1.pooler.supabase.com',
    'port': '6543',
    'database': 'postgres',
    'user': 'postgres.ntqrqcmllkgrhwjreohn',
    'password': '@Cehyjygj001'
}

try:
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    
    # Count tables
    cursor.execute("""
        SELECT COUNT(*) 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    """)
    count = cursor.fetchone()[0]
    print(f"Total tables in database: {count}")
    
    # List all tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    """)
    tables = cursor.fetchall()
    print(f"\nTables created:")
    for table in tables:
        print(f"  - {table[0]}")
    
    cursor.close()
    conn.close()
    print("\n✅ Database schema successfully deployed!")
    
except Exception as e:
    print(f"Error: {e}")
