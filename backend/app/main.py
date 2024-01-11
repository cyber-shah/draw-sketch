from flask import Flask, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
# Enable CORS for all routesapp

HOST = 'localhost'
PORT = 55556


@socketio.on('connect')
def test_connect():
    print("Client connected : " + str(request.sid))


@socketio.on('message')
def handle_message(data):
    print('Message from {}: {}'.format(data['name'], data['message']))
    emit('message', data, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True, host=HOST, port=PORT)
    print("Server is live at http://{}:{}".format(HOST, PORT))
