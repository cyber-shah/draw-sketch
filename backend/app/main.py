from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins='*')
# Enable CORS for all routes


@app.route('/')
def index():
    return "Hello, this is your Flask-SocketIO server!"


# This event will be called when the server recieves a 'message'
# event from the client
@socketio.on('message')
def handle_message(msg):
    print('Message:', msg)
    socketio.emit('message', msg)


@socketio.on('connect')
def test_connect():
    print('Client connected')


if __name__ == '__main__':
    socketio.run(app, debug=True)
