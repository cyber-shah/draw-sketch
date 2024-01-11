
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)


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
    return "Client connected"


if __name__ == '__main__':
    socketio.run(app, debug=True)
