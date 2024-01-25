from flask import Flask, request
from flask_socketio import SocketIO
from flask_socketio import Namespace, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

# TODO: figure out how to send messages to specific clients
# TODO: users to be able to join and create rooms

"""
The Socket.IO protocol supports multiple logical connections, all multiplexed
on the same physical connection
Clients can open multiple connections by specifying a different namespace on each.
A namespace is given by the client as a pathname following the hostname and port.
For example, connecting to http://example.com:8000/chat would open a connection
to the namespace /chat.

The method names are mapped to the event names. For example, if the client
emits an event named "my_event," the server looks for a method named
on_my_event in the namespace class.
The methods in your class-based namespace should follow a
specific naming convention: on_<event_name>.
"""


class Room(Namespace):
    """_summary_

    Args:
        socketio (_type_): _description_

        {
            sender: <str>,
            status: <str>,
            message: <str>,
        }
    """

    def __init__(self, namespace):
        """
        Constructor for Room
        Initialize the clients dictionary
        Args:
            namespace (socketio.Namespace): The namespace of the room
        """
        super().__init__(namespace)
        self.clients = {}

    def on_connect(self):
        sender = request.args.get('sender')
        color = request.args.get('color')
        if sender:
            self.clients[sender] = {'sid': request.sid, 'color': color}
            emit(
                'message',
                {
                    "status": "success",
                    "sender": "server",
                    "payload": "User {} has connected".format(sender)
                },
                broadcast=True
            )
            print(self.clients)

    def on_disconnect(self):
        print("Client disconnected: " + request.sid)
        print(request)
        """
        sender = self.clients.get(request.sid, None)
        if sender is not None:
            socketio.emit(
                'message',
                {   "status": "success",
                    "sender": "server",
                    "payload": "User {} has disconnected".format(sender)
                },
            )
        """

    def on_message(self, data):
        # for debug purposes
        print(request)
        print(data)
        # get the sender of the sender
        sender = request.args.get('sender')
        # if the sender is not None, then send the message
        if sender is not None:
            print("Message from {}:".format(sender), data['payload'])
            emit(
                'message',
                {"status": "success",
                    "sender": sender,
                    "payload": data['payload']
                 },
                broadcast=True)
        else:
            print("Unknown user sent a message")

    def on_drawLines(self, data):
        # for debug purposes
        # print(data)
        # get the sender of the sender
        sender = request.args.get('sender')
        # if the sender is not None, then send the message
        if sender is not None:
            print(format(sender) + "drawed this line", data['payload'])
            emit(
                'drawLines',
                {"status": "success",
                 "sender": sender,
                 "payload": data['payload']
                 },
                broadcast=True)
        else:
            print("Unknown user sent a message")

    def on_cursorUpdate(self, data):
        # for debug purposes
        # print(data['payload'])
        # get the sender of the sender
        sender = request.args.get('sender')
        # if the sender is not None, then send the message
        if sender is not None:
            print(format(sender)+"moved his cursor to ", data['payload'])
            emit(
                'cursorUpdate',
                {"status": "success",
                 "sender": sender,
                 "payload": data['payload']
                 },
                broadcast=True)
        else:
            print("Unknown user sent a message")
