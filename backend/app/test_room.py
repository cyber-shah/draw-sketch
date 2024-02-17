import unittest
from unittest.mock import Mock, patch
from room import Room

class TestRoom(unittest.TestCase):

    def setUp(self):
        self.namespace = Mock()
        self.room = Room(self.namespace)

    def test_on_connect(self):
        data = {'sender': 'test_sender'}
        self.room.on_connect(data)

        # Add your assertions based on the expected behavior

    def test_on_join(self):
        data = {'sender': 'test_sender'}
        self.room.on_join(data)

        # Add your assertions based on the expected behavior

    def test_on_disconnect(self):
        # Mocking clients dictionary
        self.room.clients = {'test_sid': 'test_sender'}
        self.room.on_disconnect()

        # Add your assertions based on the expected behavior

    def test_on_message(self):
        data = {'sender': 'test_sender', 'payload': 'test_payload'}
        self.room.on_message(data)

        # Add your assertions based on the expected behavior

    # Add more test cases for other methods as needed

if __name__ == '__main__':
    unittest.main()

