import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';





function Socket() {

  // STEP 1: create the main socket instance and connect to the server
  var mainSocket = null;
  const connectMainSocket = () => {
    mainSocket = io('http://localhost:666', {
    });

    mainSocket.on('connect', () => {
      console.log('Connected to the server');
      console.log(mainSocket);
    }, [mainSocket]);
  }

  // if the user decides to join a room that already exists
  const joinRoom = (roomName, name, setRoomSocket) => {
    mainSocket.emit('joinRoom', { roomName: roomName, sender: name });

    mainSocket.on('response', (data) => {
      // if the room exists, then connect to the room and set the socket instance
      if (data.response === 'success') {
        const roomSocket = io(`http://localhost:666/room_${roomName}`, {
          query: {
            sender: name,
            roomNumber: roomName,
          },
        });
        setRoomSocket(mainSocket);
      }
      // otherwise, alert the user that the room already exists
      else {
        alert('Room already exists, please try another name.');
      }
    });
  };

  // if the user decides to create a new room
  const createRoom = (roomName, name, setRoomSocket, setIsConnected) => {
    mainSocket.emit('createRoom', { roomName: roomName, sender: name });
    // STEP 2: listen for the server's response
    mainSocket.on('response', (data) => {
      if (data.response === 'success') {
        setIsConnected(true);
        setRoomSocket(mainSocket);
      } else {
        alert('Room already exists, please try another name.');
      }
    });
  }







  const connectToServer = (command) => {
    // TODO: make sure none of the fields are empty
    // TODO: clean up after disconnecting

    // what we do here:
    // 1. create a socket instance with senders name and room number
    // 2. everything after that is handled by the server

    // Connect to the server and send the sender
    // URL is the address where client should connect to
    const roomSocket = io(`http://localhost:666/room_${roomName}`, {
      query: {
        sender: name,
        roomNumber: roomName,
      },
    });
    setRoomSocket(roomSocket);

    // Listen to the connect event from the server
    roomSocket.on('connect', () => {
      setIsConnected(true);
    });

    // Listen for INCOMING messages and update the state by appending the incoming message
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

    setColor(chance.color({ format: 'hex' }));
  };

  const sendMessage = () => {
    roomSocket.emit('message', {
      "response": "success",
      "sender": name,
      "payload": message,
    });
  };


  return {
    connectMainSocket,
    joinRoom,
    createRoom,
    connectToServer,
    sendMessage,
  };
};


export default Socket;
