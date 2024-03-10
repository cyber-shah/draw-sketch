import React from 'react';
import { Paper, TextField, Button, Stack, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { red } from '@mui/material/colors';

const css = {
  tile: {
    padding: '20px',
    marginTop: '0',
    position: 'absolute',
    top: '0',
  },
};



export default function LoginPage(props) {
  return (
    <>
      <Typography variant="h4" className="header"
        style={css.tile}>
        Sync Sketch
      </Typography>
      <Paper className="container" elevation={3} style={{ maxWidth: '400px', width: '80vw', padding: '40px', borderRadius: '15px', textAlign: 'center' }}>
        <Stack spacing={3}>
          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
            Let's get started
          </Typography>

          <TextField
            className="name-input"
            label="Pick a fun name!"
            onChange={(event) => props.setName(event.target.value)}
            value={props.name}
            variant="outlined"
            fullWidth
            autoFocus
            style={{ marginBottom: '20px' }}
          />

          <TextField
            className="ip-input"
            label="Room ID"
            onChange={(event) => props.setRoomNumber(event.target.value)}
            variant="outlined"
            fullWidth
            style={{ marginBottom: '20px' }}
          />

          <Button
            className="join-button"
            variant="contained"
            color="primary"
            onClick={() => props.joinRoom(props.roomNumber)}
            fullWidth
            style={{ borderRadius: '20px', padding: '10px', fontWeight: 'bold', marginBottom: '10px' }}
          >
            Join Room
          </Button>


          <Typography variant="caption" style={{ marginTop: '20px', color: '#888' }}>
            Developed by cyber-shah
          </Typography>

          <Link
            href="https://github.com/cyber-shah"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="none"
            style={{}}
          >
            <GitHubIcon />
            <Typography variant="subtitle1" style={{ marginLeft: '4px' }}>
              View on GitHub
            </Typography>
          </Link>
        </Stack>
      </Paper>


      <Typography variant="h6" style={{ marginTop: '100px', color: '#888' }} >
        Please be aware that this project is self hosted on a really small computer :)
      </Typography>

      <Typography variant="caption" style={{ marginTop: '10px', color: '#888' }}>
        and therefore to make sure that it's not overloaded, all the rooms will be cleared after 10 minutes.
        Thank you!
      </Typography>
    </>
  );
};
