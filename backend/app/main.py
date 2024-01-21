from flask import Flask, request
from flask_socketio import SocketIO
from room import Room
from flask_socketio import Namespace

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

rooms = {}

def create_room(port):
    namespace = f"/room_{port}" 
    room = socketio.on_namespace(Room(namespace))
    rooms[namespace] = room
    print("room started at " + namespace)
    
    
if __name__ == '__main__':
    create_room('chat')
    socketio.run(app, host='localhost', port=55556, debug=True)