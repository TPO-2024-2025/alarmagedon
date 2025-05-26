import sys
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QVBoxLayout, QWidget, QPushButton,
    QLineEdit, QLabel, QComboBox, QSizePolicy, QMessageBox, QInputDialog
)
from database import log_system_state, get_all_state_logs, log_event, get_all_events, add_sensor, get_all_sensors, remove_sensor

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("DB UI")

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        # Create a main layout with some padding and spacing
        self.layout = QVBoxLayout()
        self.layout.setContentsMargins(10, 10, 10, 10)
        self.layout.setSpacing(15)

        # Allow vertical resizing
        self.central_widget.setSizePolicy(QSizePolicy.Policy.Preferred, QSizePolicy.Policy.Expanding)

        self.central_widget.setLayout(self.layout)
        
        # Database UI
        log_state_button = QPushButton("Log System State")
        log_state_button.clicked.connect(self.log_system_state_ui)
        self.layout.addWidget(log_state_button)

        view_logs_button = QPushButton("View All System State Logs")
        view_logs_button.clicked.connect(self.view_all_state_logs_ui)
        self.layout.addWidget(view_logs_button)

        log_event_button = QPushButton("Log Event")
        log_event_button.clicked.connect(self.log_event_ui)
        self.layout.addWidget(log_event_button)

        view_events_button = QPushButton("View All Events")
        view_events_button.clicked.connect(self.view_all_events_ui)
        self.layout.addWidget(view_events_button)
        
        add_sensor_button = QPushButton("Add Sensor")
        add_sensor_button.clicked.connect(self.add_sensor_ui)
        self.layout.addWidget(add_sensor_button)
        
        remove_sensor_button = QPushButton("Remove Sensor")
        remove_sensor_button.clicked.connect(self.remove_sensor_ui)
        self.layout.addWidget(remove_sensor_button)

        view_sensors_button = QPushButton("View All Sensors")
        view_sensors_button.clicked.connect(self.view_all_sensors_ui)
        self.layout.addWidget(view_sensors_button)
        
    def add_sensor_ui(self):
        sensor_id, ok1 = QInputDialog.getText(self, "Add Sensor", "Enter sensor ID:")
        if not ok1 or not sensor_id:
            return
        sensor_type, ok2 = QInputDialog.getText(self, "Add Sensor", "Enter sensor type (e.g., motion, sound):")
        if not ok2 or not sensor_type:
            return
        location, ok3 = QInputDialog.getText(self, "Add Sensor", "Enter sensor location:")
        if ok3 and location:
            try:
                add_sensor(sensor_id, sensor_type, location)
                QMessageBox.information(self, "Success", "Sensor added successfully.")
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Error adding sensor: {e}")
                
    def remove_sensor_ui(self):
        sensor_id, ok = QInputDialog.getText(self, "Remove Sensor", "Enter sensor ID to remove:")
        if ok and sensor_id:
            try:
                remove_sensor(sensor_id)
                QMessageBox.information(self, "Success", "Sensor removed successfully.")
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Error removing sensor: {e}")
        
    def log_system_state_ui(self):
        state, ok = QInputDialog.getText(self, "Log System State", "Enter system state (e.g., Home, Away, Disarmed):")
        if ok and state:
            try:
                log_system_state(state)
                QMessageBox.information(self, "Success", "System state logged successfully.")
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Error logging system state: {e}")

    def view_all_state_logs_ui(self):
        try:
            logs = get_all_state_logs()
            log_text = "\n".join([f"{log}" for log in logs])
            QMessageBox.information(self, "System State Logs", log_text)
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error retrieving system state logs: {e}")

    def log_event_ui(self):
        event_type, ok1 = QInputDialog.getText(self, "Log Event", "Enter event type (e.g., Motion, Sound):")
        if not ok1 or not event_type:
            return
        description, ok2 = QInputDialog.getText(self, "Log Event", "Enter event description:")
        if ok2 and description:
            try:
                log_event(event_type, description)
                QMessageBox.information(self, "Success", "Event logged successfully.")
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Error logging event: {e}")

    def view_all_events_ui(self):
        try:
            events = get_all_events()
            event_text = "\n".join([f"{event}" for event in events])
            QMessageBox.information(self, "Event Logs", event_text)
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error retrieving event logs: {e}")

    def view_all_sensors_ui(self):
        try:
            sensors = get_all_sensors()
            sensor_text = "\n".join([f"{sensor}" for sensor in sensors])
            QMessageBox.information(self, "Sensors", sensor_text)
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error retrieving sensors: {e}")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())