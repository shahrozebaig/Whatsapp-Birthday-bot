#!/usr/bin/env python3
import webbrowser
import os
import subprocess
import sys
import time

def check_dependencies():
    """Check if required packages are installed and install if needed"""
    try:
        import flask
        import pywhatkit
    except ImportError:
        print("Installing required dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def run_app():
    """Run the Flask application and open it in a browser"""
    # Start the Flask app in a separate process
    flask_process = subprocess.Popen([sys.executable, "app.py"])
    
    # Give Flask a moment to start
    time.sleep(2)
    
    # Open the web browser
    webbrowser.open("http://localhost:5000")
    
    print("\n\033[92m✓ WhatsApp Birthday Wishing Bot is running!\033[0m")
    print("--------------------------------------------------")
    print("\033[1mAccess the web interface at: \033[94mhttp://localhost:5000\033[0m")
    print("--------------------------------------------------")
    print("Press Ctrl+C to stop the server")
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        # Handle graceful shutdown
        print("\n\nShutting down server...")
        flask_process.terminate()
        flask_process.wait()
        print("Server stopped")

if __name__ == "__main__":
    print("\033[1m\033[95m===== WhatsApp Birthday Wishing Bot =====\033[0m")
    check_dependencies()
    run_app()