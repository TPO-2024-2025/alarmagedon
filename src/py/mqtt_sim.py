# mqtt_simulation.py
import json
import time
import paho.mqtt.publish as publish
from const import MQTT_BROKER, MQTT_PORT

def publish_sensor(sensor_id: str, sensor_state: str, sensor_type: str):
    topic = f"homeassistant/binary_sensor/{sensor_id}/config"
    payload = {
        "name": sensor_id,
        "state_topic": f"home/{sensor_id}/state",
        "device_class": sensor_type,
        "unique_id": sensor_id,
        "payload_on": "ON",
        "payload_off": "OFF"
    }
    publish.single(topic, json.dumps(payload), hostname=MQTT_BROKER, port=MQTT_PORT)
    time.sleep(0.1)
    publish.single(f"home/{sensor_id}/state", sensor_state, hostname=MQTT_BROKER, port=MQTT_PORT)

def send_sensor_state(sensor_id: str, sensor_state: str):
    topic = f"home/{sensor_id}/state"
    publish.single(topic, sensor_state, hostname=MQTT_BROKER, port=MQTT_PORT)
    
def remove_sensor(sensor_id: str):
    topic = f"homeassistant/binary_sensor/{sensor_id}/config"
    # Sending an empty payload to the config topic to remove the sensor
    publish.single(topic, "", hostname=MQTT_BROKER, port=MQTT_PORT)
    
