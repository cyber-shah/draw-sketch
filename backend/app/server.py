from flask_socketio import SocketIO
clients = []
nicknames = []


class Server:
    app = None

    # Create a socketio instance and pass in the flask app
    def __init__(self, app):
        self.socketio = SocketIO(app)
        self.app = app

    # Start the socketio server
    def run(self):
        self.socketio.run(self.app, debug=True)
        return ('Server running... at port 5000')

    def broadcast(self, event, data):
        @self.socketio.on('message')
        def handle_message():
            for client in clients:
                self.socketio.emit(event, data, room=client)
