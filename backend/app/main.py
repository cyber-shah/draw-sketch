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
    create_room('chat')
    socketio.run(app, host='0.0.0.0', port=55556, allow_unsafe_werkzeug=True)
