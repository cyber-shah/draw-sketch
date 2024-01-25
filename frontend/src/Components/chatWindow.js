import React, { useRef, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';

const ChatWindow = (props) => {
  const isCurrentUser = (msg) => msg.sender === props.name;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.message]);

  return (
    <Paper
      className="container"
      elevation={3}
      style={{
        height: '95vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        borderRadius: '20px', // Rounded corners
        overflow: 'hidden', // Hide overflowing content
      }}
    >
      <div
        className="message-container"
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '16px',
        }}
      >
        {props.messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isCurrentUser(msg) ? 'flex-end' : 'flex-start',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                backgroundColor: isCurrentUser(msg) ? '#007AFF' : '#e0e0e0',
                color: isCurrentUser(msg) ? 'white' : 'black',
                padding: '12px',
                borderRadius: '15px',
                maxWidth: '70%',
                wordWrap: 'break-word',
                boxShadow:
                  '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
              }}
            >
              <Typography
                variant="caption"
                style={{
                  marginBottom: '4px',
                  color: isCurrentUser(msg)
                    ? 'rgba(255, 255, 255, 0.7)'
                    : '#888',
                }}
              >
                {isCurrentUser(msg) ? 'You' : msg.sender}
              </Typography>
              <Typography>{msg.payload}</Typography>
            </div>
            <Typography
              variant="caption"
              style={{
                alignSelf: 'flex-end',
                marginTop: '4px',
                color: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              {msg.timestamp}
            </Typography>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <TextField
        className="message-input"
        label="Message"
        onChange={(event) => props.setMessage(event.target.value)}
        variant="filled"
        fullWidth
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: 'white',
          marginBottom: '8px',
        }}
        InputProps={{
          style: { padding: '12px', fontWeight: 'normal' },
        }}
      />

      <Button
        className="send-button"
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => {
          props.sendMessage(props.message);
          scrollToBottom();
        }}
        style={{ borderRadius: '20px' }}
      >
        Send
      </Button>
    </Paper>
  );
};

export default ChatWindow;

