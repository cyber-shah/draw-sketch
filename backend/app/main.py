from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room, emit

from flask import request

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')


"""
Stores rooms as keys and a dictionary of clients as values.
{room1 :
    {client1_sid: {name: '123', status: 'online', timestamp: 'now'},
    {client2_sid: {name: '456', status: 'online', timestamp: 'now'},
}
"""
rooms = {}


"""
Needed to access/find the room of a client in O(1) time.
Therefore this stores:
{client.sid: {room: room1, name: name1}}
"""
clients = {}


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('connect')
def handle_connect():
    print("Client connected: " + request.sid)


@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected: " + request.sid)
    # get the client's name
    client = clients[request.sid]
    room = client['room']
    if room in rooms:
        # remove the client from the room
        del rooms[room][request.sid]
        # if the room is empty, remove it
        if len(rooms[room]) == 0:
            del rooms[room]
        else:
            # notify the other clients in the room
            emit('updateClients',
                 {
                     'status': 'success',
                     'sender': 'server',
                     'payload': "user " + client['name'] + "has left " + room
                 },
                 room=room)
    leave_room(room)


@socketio.on('join')
def handle_join(data):
    user_name = data['sender']
    room = data['room']
    if user_name is not None and room is not None:
        if room not in rooms:
            rooms[room] = {}
        # put the sender in the room
        rooms[room][request.sid] = {'name': user_name,
                                    'status': 'online',
                                    'timestamp': 'now'}
        join_room(room)
        emit('updateClients',
             {
                 'status': 'success',
                 'sender': 'server',
                 'payload': "user " + user_name + "has joined " + room
             },
             room=room)
        clients[request.sid] = {'room': room, 'name': user_name}
        print(rooms)


@socketio.on('message')
def handle_message(data):
    user_name = data['sender']
    room = data['room']

    print("user_name", user_name)
    print("room", room)
    print("message", data['payload'])

    if user_name is not None and room is not None:
        emit('message',
             {
                 'status': 'success',
                 'sender': user_name,
                 'payload': data['payload']
             },
             room=room)
        print("emitted message")


@socketio.on('cursorUpdate')
def handle_cursor_update(data):
    user_name = data['sender']
    """
    print(data)
    print(request.sid)
    # get the room of the user
    room = clients[request.sid]['room']
    if user_name is not None and room is not None:
        print(user_name, room, data['payload'])
        if user_name in rooms[room]:
            emit('cursorUpdate',
                 {
                     'status': 'success',
                     'sender': user_name,
                     'payload': data['payload']
                 },
                 room=room)

    """


@socketio.on('drawLines')
def handle_draw_lines(data):
    user_name = data['sender']
    # get the room of the user
    room = clients[request.sid]['room']
    print(user_name)
    print(room)
    if user_name is not None and room is not None:
        emit('drawLines',
             {
                 'status': 'success',
                 'sender': user_name,
                 'payload': data['payload']
             },
             room=room)
        print("emitted drawLines")


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=666, allow_unsafe_werkzeug=True)
