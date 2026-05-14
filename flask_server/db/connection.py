import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
curr = conn.cursor()
curr.execute(
	'''CREATE TABLE IF NOT EXISTS sensor_data (id INTEGER PRIMARY KEY AUTOINCREMENT,timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,soil_moisture INTEGER,rain_status INTEGER,humidity INTEGER,temperature REAL,temperature_from_bmp REAL,altitude REAL,air_pressure REAL,battery REAL)'''
)
conn.commit()

print("Using database:", os.path.abspath(DB_PATH))