# database.py

"""
This module provides functions to interact with a SQLite database for a security system. 
It includes functionality for managing event logs, sensors, and system state logs.\n
:Tables:
- :system_state_logs: Logs system state changes.
- :event_logs: Logs events that occur in the system.
- :sensors: Stores information about sensors in the system.\n
:Functions:
- :get_all_state_logs(): Retrieves all system state logs from the database.
- :log_system_state(state): Logs system state changes to the database.
- :log_event(event_type, description): Logs events to the database.
- :get_events_up_to_date(date): Retrieves all event logs from the database up until a certain date.
- :get_events_from_date(date): Retrieves all event logs from the database starting from a certain date.
- :get_events_by_type(event_type): Retrieves all event logs of a certain type from the database.
- :get_all_events(): Retrieves all event logs from the database.
- :add_sensor(sensor_type, status, location): Adds a new sensor to the database.
- :get_sensor_by_id(sensor_id): Retrieves a sensor from the database by its ID.
- :get_sensor_by_type(sensor_type): Retrieves a sensor from the database by its type.
- :get_sensor_by_location(location): Retrieves a sensor from the database by its location.
- :get_sensors_by_status(status): Retrieves sensors from the database by their status.
- :get_all_sensors(): Retrieves all sensors from the database.
- :update_sensor_status(sensor_id, status): Updates the status of a sensor in the database.
- :remove_sensor(sensor_id): Removes a sensor from the database.
- :create_db(): Creates the database and necessary tables if they do not exist.
- :clear_db(): Clears all data from the database.\n
"""

import sqlite3
from datetime import datetime

DB_NAME = "security_system.db"

def log_system_state(state):
    """
    This function logs system state changes to the database.\n
    :param state: The state of the system (e.g., "Home", "Away", "Disarmed").
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("INSERT INTO system_state_logs (state, timestamp) VALUES (?, ?)",
                   (state, timestamp))
    conn.commit()
    conn.close()

def get_all_state_logs():
    """
    This function retrieves all system state logs from the database.\n
    :return: A list of tuples containing the state and timestamp of each log entry.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM system_state_logs")
    state_logs = cursor.fetchall()
    conn.close()

    return state_logs

def log_event(event_type, description):
    """
    This function logs events to the database.\n
    :param event_type: The type of event (e.g., "Motion", "Sound").
    :param description: A description of the event.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS event_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT,
            description TEXT,
            timestamp TEXT
        )
    ''')

    cursor.execute("INSERT INTO event_logs (event_type, description, timestamp) VALUES (?, ?, ?)",
                   (event_type, description, timestamp))
    conn.commit()
    conn.close()
    
def get_events_up_to_date(date):
    """
    This function retrieves all event logs from the database up until a certain date.\n
    :param date: The cutoff date in the format "YYYY-MM-DD".
    :return: A list of tuples containing the event type, description, and timestamp of each log entry.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM event_logs WHERE DATE(timestamp) <= ?", (date,))
    events = cursor.fetchall()
    conn.close()

    return events

def get_events_from_date(date):
    """
    This function retrieves all event logs from the database starting from a certain date.\n
    :param date: The starting date in the format "YYYY-MM-DD".
    :return: A list of tuples containing the event type, description, and timestamp of each log entry.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM event_logs WHERE DATE(timestamp) >= ?", (date,))
    events = cursor.fetchall()
    conn.close()

    return events

def get_events_by_type(event_type):
    """
    This function retrieves all event logs of a certain type from the database.\n
    :param event_type: The type of event to filter by (e.g., "Motion", "Sound").
    :return: A list of tuples containing the event type, description, and timestamp of each log entry.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM event_logs WHERE event_type = ?", (event_type,))
    events = cursor.fetchall()
    conn.close()

    return events

def get_all_events():
    """
    This function retrieves all event logs from the database.\n
    :return: A list of tuples containing the event type, description, and timestamp of each log entry.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM event_logs")
    events = cursor.fetchall()
    conn.close()

    return events

def add_sensor(sensor_type, status, location):
    """
    This function adds a new sensor to the database.\n
    :param sensor_type: The type of sensor (e.g., "Motion", "Sound").
    :param status: The status of the sensor (e.g., "Active", "Inactive").
    :param location: The location of the sensor (e.g., "Living Room", "Bedroom").
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sensors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sensor_type TEXT,
            status TEXT,
            location TEXT
        )
    ''')

    cursor.execute("INSERT INTO sensors (sensor_type, status, location) VALUES (?, ?, ?)",
                   (sensor_type, status, location))
    conn.commit()
    conn.close()

def get_sensor_by_id(sensor_id):
    """
    This function retrieves a sensor from the database by its ID.\n
    :param sensor_id: The ID of the sensor to retrieve.
    :return: A tuple containing the sensor type, status, and location of the sensor.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sensors WHERE id = ?", (sensor_id,))
    sensor = cursor.fetchone()
    conn.close()

    return sensor

def get_sensor_by_type(sensor_type):
    """
    This function retrieves a sensor from the database by its type.\n
    :param sensor_type: The type of sensor to retrieve (e.g., "Motion", "Sound").
    :return: A tuple containing the sensor type, status, and location of the sensor.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sensors WHERE sensor_type = ?", (sensor_type,))
    sensor = cursor.fetchone()
    conn.close()

    return sensor

def get_sensor_by_location(location):
    """
    This function retrieves a sensor from the database by its location.\n
    :param location: The location of the sensor to retrieve (e.g., "Living Room", "Bedroom").
    :return: A tuple containing the sensor type, status, and location of the sensor.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sensors WHERE location = ?", (location,))
    sensor = cursor.fetchone()
    conn.close()

    return sensor

def get_sensors_by_status(status):
    """
    This function retrieves sensors from the database by their status.\n
    :param status: The status of the sensors to retrieve (e.g., "Active", "Inactive").
    :return: A list of tuples containing the sensor type, status, and location of each sensor.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sensors WHERE status = ?", (status,))
    sensors = cursor.fetchall()
    conn.close()

    return sensors

def get_all_sensors():
    """
    This function retrieves all sensors from the database.\n
    :return: A list of tuples containing the sensor type, status, and location of each sensor.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM sensors")
    sensors = cursor.fetchall()
    conn.close()

    return sensors

def update_sensor_status(sensor_id, status):
    """
    This function updates the status of a sensor in the database.\n
    :param sensor_id: The ID of the sensor to update.
    :param status: The new status of the sensor (e.g., "Active", "Inactive").
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("UPDATE sensors SET status = ? WHERE id = ?",
                   (status, sensor_id))
    conn.commit()
    conn.close()

def remove_sensor(sensor_id):
    """
    This function removes a sensor from the database.\n
    :param sensor_id: The ID of the sensor to remove.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("DELETE FROM sensors WHERE id = ?", (sensor_id,))
    conn.commit()
    conn.close()

def create_db():
    """
    This function creates the database and necessary tables if they do not exist.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS system_state_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            state TEXT,
            timestamp TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS event_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT,
            description TEXT,
            timestamp TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sensors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sensor_type TEXT,
            status TEXT,
            location TEXT
        )
    ''')

    conn.commit()
    conn.close()
    
def clear_db():
    """
    This function clears all data from the database.
    """
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute('DROP TABLE IF EXISTS user_logs')
    cursor.execute('DROP TABLE IF EXISTS event_logs')
    cursor.execute('DROP TABLE IF EXISTS sensors')

    conn.commit()
    conn.close()
