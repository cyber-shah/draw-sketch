from flask import Flask
from flask_socketio import SocketIO
from room import Room

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

rooms = {}

@socketio.on('createRoom')
def createRoom(data):
    room_name = data['roomName']
    # check if the room already exists
    if room_name in rooms:
        socketio.emit('response', {
            'status': 'error', 
            'message': f'Room {room_name} already exists'
        })
        return

    # create the room and add it to the rooms dictionary
    namespace = f"/room_{room_name}"
    room = socketio.on_namespace(Room(namespace))
    rooms[room_name] = namespace
    socketio.emit('response', {
        'status': 'success', 
        'message': f'Room {room_name} created successfully'
    })
    print(rooms)

@socketio.on('joinRoom')
def join_room(data):
    data = request.get_json()
    room_number = data.get('roomNumber')
    username = data.get('username')
    if f"/room_{room_number}" in rooms:
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'error', 'message': 'Room does not exist'})


"""
@app.route('/check_room', methods=['POST'])
def check_room():
    data = request.get_json()
    room_number = data.get('roomNumber')

    if f"/room_{room_number}" in rooms:
        return jsonify({'exists': True})
    else:
        return jsonify({'exists': False})
"""

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=666, allow_unsafe_werkzeug=True)
