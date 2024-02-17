import io from 'socket.io-client';

export function connectMainSocket() {
  return new Promise((resolve, reject) => {
    const mainSocket = io('http://localhost:666');
    mainSocket.on('connect', () => {
      resolve(mainSocket);
    });
  });
}


export function joinRoom(mainSocket, roomName, name) {
  return new Promise((resolve, reject) => {
    // STEP 1: emit name of the room so that the server can check if it exists
    mainSocket.emit('joinRoom', { roomName: roomName, sender: name });
    // STEP 2: listen to the server's response:
    mainSocket.on('response', (data) => {
      // the room exists, then connect to the room and set the socket instance
      if (data.status === 'success') {
        const roomSocket = io(`http://localhost:666/room_${roomName}`);
        roomSocket.emit('join', { roomName: roomName, sender: name });
        roomSocket.on('connect', () => {
        });
        resolve(roomSocket);
      }
      else {
        reject('Room does not exist');
      }
    });
  });
}


export function createRoom(mainSocket, roomName, name) {
  return new Promise((resolve, reject) => {
    // first emit the name so that the server cna CREATE the room
    // for this to connect
    mainSocket.emit('createRoom', { roomName: roomName, sender: name });
    // STEP 2: listen to the server's response:
    mainSocket.on('response', (data) => {
      if (data.status === 'success') {
        const roomSocket = io(`http://localhost:666/room_${roomName}`);
        roomSocket.emit('join', { roomName: roomName, sender: name });
        roomSocket.on('connect', () => {
          resolve(roomSocket);
        });
      }
      else {
        reject('Room already exists');
      }
    });
  });
}


export function registerSocketEvents(roomSocket, setMessages, setCursors, setLines) {
  roomSocket.on('message', (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  });

  // Listen for INCOMING drawn lines and update the Canvas component
  roomSocket.on('drawLines', (data) => {
    // Update Canvas component with the received lines
    setLines(data['payload'])
  });

  // Listen for INCOMING cursor positions and update the Canvas component
  roomSocket.on('cursorUpdate', (cursorData) => {
    // Update the cursors state with the received cursor data
    setCursors((prevCursors) => ({
      ...prevCursors,
      [cursorData.sender]: cursorData.payload,
    }));
  });
}

export function sendMessage(roomSocket, message, name) {
  roomSocket.emit('message', {
    "response": "success",
    "sender": name,
    "payload": message,
  });
}
