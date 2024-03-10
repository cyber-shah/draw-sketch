from flask import render_template
from flask_socketio import join_room, leave_room, emit
from flask import request

from manager import app, socketio
from manager import clients, rooms, lines_db


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

    print("client", client)
    print("room", room)

    if room in rooms:
        # remove the client from the room
        del rooms[room][request.sid]
        # if the room is empty, remove it
        if len(rooms[room]) == 0:
            del rooms[room]
        else:
            # notify the other clients in the room
            emit('message',
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
        # notify the other clients in the room
        emit('message',
             {
                 'status': 'success',
                 'sender': 'server',
                 'payload': "user " + user_name + "has joined " + room
             },
             room=room)
        clients[request.sid] = {'room': room, 'name': user_name}

        # send all the previous lines
        print(rooms)


@socketio.on('message')
# BUG: instead of just emitting the message,
# we should also store it in the database
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


@socketio.on('cursorUpdate')
def handle_cursor_update(data):
    user_name = data['sender']
    room = data['room']
    if user_name is not None and room is not None:
        (emit('cursorUpdate',
              {
                  'status': 'success',
                  'sender': user_name,
                  'payload': data['payload']
              },
              room=room)
         )


@socketio.on('drawLines')
def handle_draw_lines(data):
    user_name = data['sender']
    # get the room of the user
    room = clients[request.sid]['room']
    if user_name is not None and room is not None:

        if room not in lines_db:
            lines_db[room] = []
        lines_db[room].append(data['payload'])
        emit('drawLines',
             {
                 'status': 'success',
                 'sender': user_name,
                 'payload': data['payload']
             },
             room=room)


@socketio.on('clearScreen')
def handle_clear_screen(data):
    user_name = data['sender']
    room = clients[request.sid]['room']
    if user_name is not None and room is not None:
        lines_db[room] = []
        emit('drawLines',
             {
                 'status': 'success',
                 'sender': user_name,
                 'payload': []
             },
             room=room)


def run():
    socketio.run(app, host='0.0.0.0', port=666, allow_unsafe_werkzeug=True)
    print("server running")
