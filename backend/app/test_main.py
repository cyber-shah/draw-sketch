import unittest
from flask_socketio import SocketIOTestClient
from main import app, socketio

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

    def test_join_nonexistent_room(self):
        print("\n \n") 
        self.client.emit('joinRoom', {'roomName': 'nonexistent_room'})
        response = self.client.get_received()

        print("\n join_nonexistent_room response: ", response)

        # Check that the server responds with an error message
        self.assertEqual(response[0]['name'], 'response')
        self.assertEqual(response[0]['args'][0]['status'], 'error')
        self.assertEqual(response[0]['args'][0]['message'], 'Room nonexistent_room does not exist')

    def test_join_existing_room(self):
        print("\n \n") 
        # Create a room before attempting to join
        self.client.emit('createRoom', {'roomName': 'existing_room'})

        # Join the existing room
        self.client.emit('joinRoom', {'roomName': 'existing_room'})
        response = self.client.get_received()

        print("\n join_existing_room response: ", response)

        # Check that the server responds with the expected message
        self.assertEqual(response[0]['name'], 'response')
        self.assertEqual(response[0]['args'][0]['status'], 'success')
        self.assertEqual(response[0]['args'][0]['message'], 'Joined room existing_room')

if __name__ == '__main__':
    unittest.main()

