@echo off
echo Checking dependencies...
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat

echo Installing requirements...
pip install -r requirements.txt

echo Starting AI Architect Backend...
python main.py
pause
