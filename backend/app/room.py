from flask import Flask, request
from flask_socketio import SocketIO
from flask_socketio import Namespace

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

class Room(Namespace):

    @socketio.on('start')
    def __init__(self, namespace=None):
        super().__init__(namespace)
        self.clients = {}
        
    @socketio.on('connect')
    def on_connect(self):
        data = request.args
        if 'nickname' in data:
            self.clients[request.sid] = data['nickname']
            print("Client {} is now known as {}".format(
                str(request.sid), data['nickname']))
            socketio.emit(
                'message',
                {"nickname": "server",
                 "message": "User {} has connected".format(data['nickname'])})
   
    @socketio.on('disconnect')
    def on_disconnect(self):
        print("Client disconnected : " + str(request.sid))
        socketio.emit(
            'message',
            {"nickname": "server",
            "message": "User {} has disconnected".format(self.clients[request.sid])})
    
    @socketio.on('message')
    def on_message(self, data):
        # get the nickname of the sender
        nickname = self.clients.get(request.sid, None)
        # if the nickname is not None, then send the message
        if nickname is not None:
            print("Message from {}:".format(nickname), data['message'])
            socketio.emit(
                'message', {"nickname": nickname, "message": data['message']})
        else:
            print("Unknown user sent a message")