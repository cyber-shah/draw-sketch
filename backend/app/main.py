from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins='*')
# Enable CORS for all routesapp


@socketio.on('connect')
def test_connect():
    print("Client connected")


@socketio.on('message')
def handle_message(data):
    print('Message from {}: {}'.format(data['name'], data['message']))
    emit('message', data, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
