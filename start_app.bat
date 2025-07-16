@echo off
REM Change directory to where app.py is located
cd /d "%~dp0"

REM Activate your virtual environment if you have one
REM If you are using a virtual environment (highly recommended), uncomment and adjust the line below
REM .\venv\Scripts\activate.bat

REM Run the Flask application
python app.py

REM Keep the window open after the app exits (optional, for debugging)
pause