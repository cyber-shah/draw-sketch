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
    // emit name of the room so that the server can check if it exists
    mainSocket.emit('join', { room: roomName, sender: name });
    resolve(mainSocket);
  });
}

export function createRoom(mainSocket, roomName, name) {
  return new Promise((resolve, reject) => {
    // emit the name so that the server can CREATE the room
    mainSocket.emit('join', { room: roomName, sender: name });
    resolve(mainSocket);
  });
}



export function registerSocketEvents(
  roomSocket, setMessages, setCursors, setLines, setClients, clients, messages) {

  roomSocket.on('message', (data) => {
    console.log(data);
    console.log(messages);
    setMessages((prevMessages) => [...prevMessages, data]);
  });

  // Listen for INCOMING drawn lines and update the Canvas component
  roomSocket.on('drawLines', (data) => {
    // Update Canvas component with the received lines
    // BUG: solve this here to avoid redrawing when new user joins
    console.log(data);
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

  roomSocket.on('updateClients', (data) => {
    console.log(data);
    setClients((prevClients) => [...prevClients, data]);
  });
}

export function sendMessage(roomSocket, message, name, roomName) {
  roomSocket.emit('message', {
    "response": "success",
    "room": roomName,
    "sender": name,
    "payload": message,
  });
}
