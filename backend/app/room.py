from flask import Flask, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

    # TODO: change nickname to sender
    # TODO: figure out how to send messages to specific clients

"""
The Socket.IO protocol supports multiple logical connections, all multiplexed 
on the same physical connection. 
Clients can open multiple connections by specifying a different namespace on each. 
A namespace is given by the client as a pathname following the hostname and port. 
For example, connecting to http://example.com:8000/chat would open a connection 
to the namespace /chat.

The method names are mapped to the event names. For example, if the client emits 
an event named "my_event," the server looks for a method named on_my_event in the namespace class.
The methods in your class-based namespace should follow a specific naming convention: on_<event_name>.
"""

class Room(socketio.Namespace):
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

    def on_connect(self, sid, environ):
        nickname = request.args.get('nickname')
        if nickname:
            self.clients[sid] = nickname
            print("Client {} is now known as {}".format(sid, nickname))
            socketio.emit(
                'message',
                {   "status": "success",
                    "sender": "server",
                    "message": "User {} has connected".format(nickname)
                },
            )
            print(self.clients)

    def on_disconnect(self, sid):
        print("Client disconnected: " + str(sid))
        nickname = self.clients.get(sid, None)
        if nickname is not None:
            socketio.emit(
                'message',
                {   "status": "success",
                    "sender": "server",
                    "message": "User {} has disconnected".format(nickname)
                },
            )

    def on_message(self):
        # get the nickname of the sender
        nickname = self.clients.get(request.sid, None)
        data = request.args
        # if the nickname is not None, then send the message
        if nickname is not None:
            print("Message from {}:".format(nickname), data['message'])
            socketio.emit(
                'message', 
                {   "status": "success",
                    "sender": nickname,
                    "message": data['message']})
        else:
            print("Unknown user sent a message")