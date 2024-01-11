import { Container, TextField, Button, Typography, Paper } from '@mui/material';

export default function ChatWindow(props) {
  return (
    <Paper className="container"
      style={{
        maxWidth: '500px',
        width: '33.33vw',
        padding: '20px',
        height: '80vh',

      }}>

      <div className="message-container">
        {props.messages.map((msg, index) => (
          <div key={index} className="message">
            <Typography variant="subtitle1">
              {msg.nickname}: {msg.message}
            </Typography>
          </div>
        ))}
      </div>
      <br />
      <TextField
        className="message-input"
        fullWidth
        label="Enter your message"
        onChange={(event) => props.setMessage(event.target.value)}
        variant="standard"
      />

      <Button
        className="send-button"
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => props.sendMessage(props.message)}
      >
        Send
      </Button>

    </Paper >
  );

}
