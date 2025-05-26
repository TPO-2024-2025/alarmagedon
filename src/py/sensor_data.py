# sensor_data.py
import json
from const import SENSOR_FILE

def get_available_sensors():
    try:
        with open(SENSOR_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_sensor(sensor_id, state, sensor_type):
    sensors = get_available_sensors()
    for sensor in sensors:
        if sensor['id'] == sensor_id:
            return
    sensors.append({"id": sensor_id, "state": state, "type": sensor_type})
    with open(SENSOR_FILE, "w") as f:
        json.dump(sensors, f)

def update_sensor_state(sensor_id, new_state):
    sensors = get_available_sensors()
    for sensor in sensors:
        if sensor['id'] == sensor_id:
            sensor['state'] = new_state
    with open(SENSOR_FILE, "w") as f:
        json.dump(sensors, f)