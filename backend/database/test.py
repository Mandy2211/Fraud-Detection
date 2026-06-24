import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connections import engine

conn = engine.connect()

print("Connected!")

conn.close()