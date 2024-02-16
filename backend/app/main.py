from flask import Flask
from flask_socketio import SocketIO
from room import Room

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

rooms = {}


def create_room(port):
    namespace = f"/room_{port}"
    room = socketio.on_namespace(Room(namespace))
    rooms[namespace] = room
    print("room started at " + namespace)


@app.route('/create_room', methods=['POST'])
def create_room():
    # get the room name from the request
    data = request.get_json()
    room_name = data.get('roomName')


    # create the room and add it to the rooms dictionary
    namespace = f"/room_{room_name}"
    room = socketio.on_namespace(Room(namespace))
    rooms[namespace] = room
    create_room(room_name)

    return jsonify({'status': 'success'})

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
