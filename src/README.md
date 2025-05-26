# Py project Setup

### 1. Create a virtual environment
Use VS Code to create virtual environment. Open the command palette and type `Python: Select Interpreter` -> create new environment -> select the base interpreter. This will create a virtual environment in the project folder. Now go to the terminal and activate the virtual environment by running `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac). Now in terminal type `pip install -r requirements.txt` to install the required packages.

### 2. Runnig the project
To run the project, open the terminal and activate the virtual environment. Now type `python main.py` to run the project.

### 3. Viewing DB
To view the database, install extension `SQLite` (alexcvzz) in VS Code. Now you will see, below the `PROJEKT-19` tab, a new tab `SQLITE EXPLORER`. Click on it and you will see the database file. Click on the file to view the tables and data. You can click on the play next to the table to view the data.
