# ui.py
import sys
import json
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QVBoxLayout,
    QWidget, QPushButton, QLineEdit, QLabel, QComboBox, QSizePolicy
)
from mqtt_sim import publish_sensor, send_sensor_state, remove_sensor
from sensor_data import get_available_sensors

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Home Assistant MQTT UI")

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        # Create a main layout with some padding and spacing
        self.layout = QVBoxLayout()
        self.layout.setContentsMargins(10, 10, 10, 10)
        self.layout.setSpacing(15)

        # Allow vertical resizing
        self.central_widget.setSizePolicy(QSizePolicy.Policy.Preferred, QSizePolicy.Policy.Expanding)

        self.central_widget.setLayout(self.layout)

        # Sensor UI
        self.sensor_id_input = QLineEdit()
        self.sensor_type_dropdown = QComboBox()
        self.sensor_type_dropdown.addItems(["motion", "sound"])
        self.sensor_state_dropdown = QComboBox()
        self.sensor_state_dropdown.addItems(["ON", "OFF"])

        self.layout.addWidget(QLabel("Sensor ID:"))
        self.layout.addWidget(self.sensor_id_input)
        self.layout.addWidget(QLabel("Sensor Type:"))
        self.layout.addWidget(self.sensor_type_dropdown)
        self.layout.addWidget(QLabel("Sensor State:"))
        self.layout.addWidget(self.sensor_state_dropdown)

        add_sensor_button = QPushButton("Add Sensor")
        add_sensor_button.clicked.connect(self.add_sensor)
        self.layout.addWidget(add_sensor_button)
        
        remove_sensor_button = QPushButton("Remove Sensor")
        remove_sensor_button.clicked.connect(self.remove_sensor)
        self.layout.addWidget(remove_sensor_button)

        send_state_button = QPushButton("Send Sensor State")
        send_state_button.clicked.connect(self.send_state)
        self.layout.addWidget(send_state_button)

    def add_sensor(self):
        sensor_id = self.sensor_id_input.text()
        sensor_type = self.sensor_type_dropdown.currentText()
        sensor_state = self.sensor_state_dropdown.currentText()
        if sensor_id and sensor_type:
            publish_sensor(sensor_id, sensor_state, sensor_type)
            
    def remove_sensor(self):
        sensor_id = self.sensor_id_input.text()
        if sensor_id:
            remove_sensor(sensor_id)
        self.sensor_id_input.clear()

    def send_state(self):
        sensor_id = self.sensor_id_input.text()
        sensor_state = self.sensor_state_dropdown.currentText()
        if sensor_id:
            send_sensor_state(sensor_id, sensor_state)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
