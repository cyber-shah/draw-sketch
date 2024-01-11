import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import LoginPage from './Components/LoginPage.js';
import ChatWindow from './Components/ChatWindow.js';
import Chance from 'chance';
const chance = new Chance()

function App() {
  // ---------------------------- STATES -------------------------------------------
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState(chance.word({ syllables: 2 }));
  const [isConnected, setIsConnected] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [socketInstance, setSocketInstance] = useState(null);
  // ---------------------------- STATES -------------------------------------------


  // ---------------------------- FUNCTIONS -------------------------------------------
  //TODO : learn how this works like useffecet only ruuns once so why
  //do we need to put on message here?
  const connectToServer = () => {

    // Connect to the server and send the nickname
    const socketInstance = io(`http://${ipAddress}`, {
      query: {
        nickname: name,
      },
    });
    setSocketInstance(socketInstance);

    socketInstance.on('connect', () => {
      console.log('connected to the server');
      setIsConnected(true);
    });

    // Listen for incoming messages and update the state by appending the incoming message
    socketInstance.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  };

  const sendMessage = () => {
    socketInstance.emit('message', { message: message });
  };
  // ---------------------------- FUNCTIONS -------------------------------------------

  // ---------------------------- RETURN -------------------------------------------
  return (
    <Paper
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Typography variant="h4" className="header"
        style={{
          padding: '20px',
          marginTop: '0',
          position: 'absolute',
          top: '0',
        }}>
        Sync Sketch
      </Typography>

      {!isConnected ? (
        <LoginPage
          connectToServer={connectToServer}
          setIpAddress={setIpAddress}
          setName={setName}
          name={name}
        />
      ) : (
        <ChatWindow
          sendMessage={sendMessage}
          messages={messages}
          setMessage={setMessage}
          message={message}
          name={name}
        />
      )}
    </Paper>
  );
}

export default App;
