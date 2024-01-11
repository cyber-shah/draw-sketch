import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';

const PreConnection = ({ connectToServer, setName, setIpAddress }) => (
  <Container className="container">
    <TextField
      className="name-input"
      fullWidth
      label="Enter your nickname"
      onChange={(event) => setName(event.target.value)}
      variant="standard"
    />

    <TextField
      className="ip-input"
      fullWidth
      label="Enter the server IP address"
      onChange={(event) => setIpAddress(event.target.value)}
      variant="standard"
    />

    <Button
      className="connect-button"
      variant="contained"
      color="primary"
      fullWidth
      onClick={connectToServer}
    >
      Connect
    </Button>
  </Container>
);


const ChatWindow = ({ sendMessage, messages, setMessage, message }) => (
  <Container className="container" style={{ maxWidth: '500px', width: '33.33vw' }}>
    <TextField
      className="message-input"
      fullWidth
      label="Enter your message"
      onChange={(event) => setMessage(event.target.value)}
      variant="standard"
    />

    <Button
      className="send-button"
      variant="contained"
      color="primary"
      fullWidth
      onClick={() => sendMessage(message)}
    >
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
);




function App() {
  // ---------------------------- STATES -------------------------------------------
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [socketInstance, setSocketInstance] = useState(null);
  // ---------------------------- STATES -------------------------------------------



  // ---------------------------- FUNCTIONS -------------------------------------------
  //TODO : learn how this works like useffecet only ruuns once so why
  //do we need to put on message here?
  const connectToServer = () => {
    const socketInstance = io(`http://${ipAddress}`);
    setSocketInstance(socketInstance);

    socketInstance.on('connect', () => {
      console.log('connected to the server');
      setIsConnected(true);
    });

    // Listen for incoming messages and update the state
    socketInstance.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  };

  const sendMessage = () => {
    socketInstance.emit('message', { name: name, message: message });
  };
  // ---------------------------- FUNCTIONS -------------------------------------------





  // ---------------------------- RETURN -------------------------------------------
  return (
    <div className="App">
      <Paper elevation={3} className="paper">
        <Typography variant="h4" className="header">Chat App</Typography>
        {!isConnected ? (
          <PreConnection
            connectToServer={connectToServer}
            setIpAddress={setIpAddress}
            setName={setName}
          />
        ) : (
          <ChatWindow
            sendMessage={sendMessage}
            messages={messages}
            setMessage={setMessage}
            message={message}
          />
        )}
      </Paper>
    </div>
  );
}

export default App;
