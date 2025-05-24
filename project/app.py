from flask import Flask, request, render_template, jsonify
import datetime
import pywhatkit
import threading
import time
import json
import os

app = Flask(__name__)

# Store scheduled wishes
scheduled_wishes = []

def send_whatsapp_message(phone, message, hour, minute):
    try:
        # Remove any spaces or special characters from phone
        phone = ''.join(filter(lambda x: x.isdigit() or x == '+', phone))
        
        # Send message using pywhatkit
        pywhatkit.sendwhatmsg(phone, message, hour, minute)
        return True
    except Exception as e:
        print(f"Error sending message: {e}")
        return False

def schedule_handler():
    """Background thread to check for messages to send"""
    while True:
        current_time = datetime.datetime.now()
        
        # Check if there are messages to send
        for wish in list(scheduled_wishes):
            wish_time = datetime.datetime.strptime(wish['send_time'], "%Y-%m-%dT%H:%M")
            
            if current_time >= wish_time:
                # Time to send this wish
                success = send_whatsapp_message(
                    wish['phone'],
                    wish['message'],
                    current_time.hour,
                    current_time.minute + 1  # Send one minute from now
                )
                
                if success:
                    # Remove from scheduled list
                    scheduled_wishes.remove(wish)
                    print(f"Successfully sent wish to {wish['name']}")
                
        # Save updated schedule to file
        save_scheduled_wishes()
        
        # Sleep for a minute before checking again
        time.sleep(60)

def save_scheduled_wishes():
    """Save scheduled wishes to a JSON file"""
    with open('scheduled_wishes.json', 'w') as f:
        json.dump(scheduled_wishes, f)

def load_scheduled_wishes():
    """Load scheduled wishes from a JSON file"""
    global scheduled_wishes
    if os.path.exists('scheduled_wishes.json'):
        with open('scheduled_wishes.json', 'r') as f:
            scheduled_wishes = json.load(f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/send_wish', methods=['POST'])
def send_wish():
    name = request.form.get('name')
    phone = request.form.get('phone')
    template = request.form.get('template')
    send_time = request.form.get('sendTime')
    
    # Handle custom message
    if template == 'template4':
        message = request.form.get('customMessage')
    else:
        templates = {
            'template1': f"Happy birthday, {name}! 🎂 Wishing you a day filled with happiness and a year filled with joy. May all your dreams come true! 🎉🎈",
            'template2': f"Guess who's getting older today? It's you, {name}! 🤣 Hope your birthday is as awesome as you are! 🎉 Don't eat too much cake... or do, I'm not your boss! 🍰",
            'template3': f"Happy birthday, {name}! 🌟 Another year of amazing experiences and growth. May this new chapter of your life be filled with success and happiness. Remember, the best is yet to come! 💫"
        }
        message = templates.get(template)
    
    # Parse send time
    wish_time = datetime.datetime.strptime(send_time, "%Y-%m-%dT%H:%M")
    
    # Add to scheduled wishes
    wish = {
        'name': name,
        'phone': phone,
        'message': message,
        'send_time': send_time
    }
    scheduled_wishes.append(wish)
    
    # Save updated schedule
    save_scheduled_wishes()
    
    return jsonify({'success': True})

@app.route('/get_scheduled_wishes')
def get_scheduled_wishes():
    return jsonify(scheduled_wishes)

@app.route('/delete_wish', methods=['POST'])
def delete_wish():
    index = int(request.form.get('index'))
    if 0 <= index < len(scheduled_wishes):
        del scheduled_wishes[index]
        save_scheduled_wishes()
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Invalid index'})

if __name__ == '__main__':
    # Load saved wishes
    load_scheduled_wishes()
    
    # Start the background thread for scheduling
    scheduler_thread = threading.Thread(target=schedule_handler)
    scheduler_thread.daemon = True
    scheduler_thread.start()
    
    # Start the Flask app
    app.run(debug=True, use_reloader=False)