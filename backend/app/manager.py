import main
import threading
import schedule

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

"""
Stores messages as keys and a dictionary of clients as values.
{room1 : {timestamp1: {sender: '123', message: 'hello'},}
        {timestamp2: {sender: '456', message: 'hi'},}
"""
messages_db = {}


"""
Stores lines in one dictionary with arrays for rooms
{room1: [{x1: 1, y1: 1, x2: 2, y2: 2}, {x1: 3, y1: 3, x2: 4, y2: 4}]}
"""
lines_db = {}


def clean_db():
