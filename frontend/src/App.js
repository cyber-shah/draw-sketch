import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';

const socket = io('http://localhost:55556');

function App() {
  // ---------------------------- STATES -------------------------------------------
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  // ---------------------------- STATES -------------------------------------------



  // ---------------------------- FUNCTIONS -------------------------------------------
  //TODO : learn how this works like useffecet only ruuns once so why
  //do we need to put on message here?
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to the server at ' + socket.id);
      setIsConnected(true);
    })
    // Listen for incoming messages and update the state
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  const connectToServer = () => {
    // Connect to the server with the provided IP address
    socket.connect(`http://${ipAddress}:5000`);
  };

  const sendMessage = (message) => {
    socket.emit('message', { name: name, message: message });
  };
  // ---------------------------- FUNCTIONS -------------------------------------------





  // ---------------------------- RETURN -------------------------------------------
  return (
    <div className="App">
      <Paper elevation={3} className="paper">
        <Typography variant="h4" className="header">Chat App</Typography>
        <Container className="container">
          <TextField
            fullWidth
            label="Enter your name"
            onChange={input => setName(input.target.value)}
            variant="standard" />

          <TextField
            fullWidth
            label="Enter your message"
            onChange={input => setMessage(input.target.value)}
            variant="standard" />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => sendMessage(message)}>
            Send
          </Button>

          <div className="message-container">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <Typography variant="subtitle1">
                  {msg.name}: {msg.message}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </Paper>

    </div>
  );
}

export default App;
