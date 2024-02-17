from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room, emit

from flask import request

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
clients_by_room = {}
rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print("Client connected: " + request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected: " + request.sid)
    sender = clients_by_room.get(request.sid, None)
    if sender is not None:
        room = leave_user_room(request.sid)
        update_clients(room)

@socketio.on('join')
def handle_join(data):
    sender = data['sender']
    room = data['room']
    if sender is not None and room is not None:
        if room not in rooms:
            rooms[room] = {}

        rooms[room][sender] = {'sid': request.sid, 'status': 'online', 'timestamp': 'now'}       
        join_room(room)
        emit('updateClients', 
             {
             'status': 'success', 
             'sender': 'server', 
            'payload': rooms[room]
             },
             room=room)
        print(rooms)

@socketio.on('message')
def handle_message(data):
    room = data['room']
    sender = clients_by_room.get(request.sid, None)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=666, allow_unsafe_werkzeug=True)

