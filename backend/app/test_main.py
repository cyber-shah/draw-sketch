import unittest
from flask_socketio import SocketIOTestClient
from main import app, socketio

"""
The reason why that happens is because for each app, we have 
a Main socket and a Room socket. So no matter what you do with rooms,
it GOES THROUGH the main socket and therefore creating new connections!
"""



class TestWebSocketServer(unittest.TestCase):

    def setUp(self):
        self.client = SocketIOTestClient(app, socketio)

    def test_create_room(self):
        print("\n \n") 
        self.client.emit('createRoom', {'roomName': 'test_room'})
        response = self.client.get_received()
        print("\n create_room response: ", response)

        # Check that the server responds with the expected message
        self.assertEqual(response[0]['name'], 'response')
        self.assertEqual(response[0]['args'][0]['status'], 'success')
        self.assertEqual(response[0]['args'][0]['message'], 'Room test_room created successfully')


    def test_join_existing_room(self):
        # Create a room before attempting to join
        self.client.emit('createRoom', {'roomName': 'existing_room'})
        # Join the existing room
        self.client.emit('joinRoom', {'roomName': 'existing_room'})
        response = self.client.get_received()
        print("\n join_existing_room response: ", response)

        self.client.socket = SocketIOTestClient(app, socketio, namespace='/room_existing_room')
        response = self.client.get_received()
        print("\n join_existing_room response: ", response)

        self.client.emit('join', {'sender': 'test_user'})


if __name__ == '__main__':
    unittest.main()

