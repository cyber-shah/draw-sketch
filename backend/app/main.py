from flask import Flask, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
# Enable CORS for all routesapp

HOST = 'localhost'
PORT = 55556
clients = {}


@socketio.on('connect')
def test_connect():
    data = request.args
    if 'nickname' in data:
        clients[request.sid] = data['nickname']

        print("Client {} is now known as {}".format(
            str(request.sid), data['nickname']))

        socketio.emit(
            'message',
            {"nickname": "server",
             "message": "User {} has connected".format(data['nickname'])})


@socketio.on('disconnect')
def emit_disconnect():
    print("Client disconnected : " + str(request.sid))
    socketio.emit(
        'message',
        {"nickname": "server",
         "message": "User {} has disconnected".format(clients[request.sid])})


@socketio.on('message')
def handle_message(data):
    # get the nickname of the sender
    nickname = clients.get(request.sid, None)
    # if the nickname is not None, then send the message
    if nickname is not None:
        print("Message from {}:".format(nickname), data['message'])
        socketio.emit(
            'message', {"nickname": nickname, "message": data['message']})
    else:
        print("Unknown user sent a message")


if __name__ == '__main__':
    socketio.run(app, debug=True, host=HOST, port=PORT)
    print("Server is live at http://{}:{}".format(HOST, PORT))
