import './App.css';
import { useState, } from 'react';
import io from 'socket.io-client';
import { Paper, Typography, Box, Grid } from '@mui/material';
import LoginPage from './Components/LoginPage.js';
import ChatWindow from './Components/chatWindow.js';
import Canvas from './Components/drawingCanvas/drawingCanvas.js';
import Chance from 'chance';
const chance = new Chance()

const css = {
  background: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatWindow: {
    padding: '5px',
    margin: 'auto',
  }
};


function App() {
  // ---------------------------- STATES -------------------------------------------
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState(chance.word({ syllables: 2 }));
  const [isConnected, setIsConnected] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [socketInstance, setSocketInstance] = useState(null);
  // ---------------------------- STATES -------------------------------------------

  // ---------------------------- FUNCTIONS -------------------------------------------
  const connectToServer = (command) => {
    // TODO: make sure none of the fields are empty
    // TODO: get multiple rooms workin


    // what we do here:
    // 1. create a socket instance with senders name and room number
    // 2. everything after that is handled by the server

    // Connect to the server and send the sender
    const socketInstance = io(`http://localhost:55556/room_${roomNumber}`, {
      query: {
        sender: name,
        roomNumber: roomNumber,
      },
    });
    setSocketInstance(socketInstance);

    // Listen to the connect event from the server
    socketInstance.on('connect', () => {
      console.log('connected to the server');
      setIsConnected(true);
    });

    // Listen for INCOMING messages and update the state by appending the incoming message
    socketInstance.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  };

  const sendMessage = () => {
    socketInstance.emit('message', {
      "response": "success",
      "sender": name,
      "payload": message,
    });
  };

  // ---------------------------- FUNCTIONS -------------------------------------------


  // ---------------------------- RETURN -------------------------------------------
  return (
    <Paper
      style={css.background} >
      {
        !isConnected ? (
          <LoginPage
            connectToServer={connectToServer}
            setRoomNumber={setRoomNumber}
            setName={setName}
            name={name}
            roomNumber={roomNumber}
          />
        ) : (

          <Grid container spacing={2} style={{ width: "100vw" }}>
            <Grid item xs={9} >
              <Canvas />
            </Grid>


            <Grid item xs={3} style={css.chatWindow} >
              <ChatWindow
                sendMessage={sendMessage}
                messages={messages}
                setMessage={setMessage}
                message={message}
                name={name}
              />
            </Grid>


          </Grid>
        )
      }

    </Paper >
  );
}

export default App;
