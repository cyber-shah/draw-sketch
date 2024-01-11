import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';

const socket = io('http://127.0.0.1:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to the server');
    })
  }, []);

  const sendMessage = (message) => {
    socket.emit('message', { name: name, message: message });
  };

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
        </Container>
      </Paper>

    </div>
  );
}

export default App;
