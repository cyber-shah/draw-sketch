
import React from 'react';
import { Paper, TextField, Button, Stack, Typography, IconButton, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';


export default function LoginPage(props) {
  return (
    <Paper className="container" elevation={3} style={{ maxWidth: '400px', width: '80vw', padding: '40px', borderRadius: '15px', textAlign: 'center' }}>
      <Stack spacing={3}>
        <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Let's get started
        </Typography>

        <TextField
          className="name-input"
          label="Enter your nickname"
          onChange={(event) => props.setName(event.target.value)}
          value={props.name}
          variant="outlined"
          fullWidth
          autoFocus
          style={{ marginBottom: '20px' }}
        />

        <TextField
          className="ip-input"
          label="Enter the server IP address"
          onChange={(event) => props.setIpAddress(event.target.value)}
          variant="outlined"
          fullWidth
          style={{ marginBottom: '20px' }}
        />

        <Button
          className="connect-button"
          variant="contained"
          color="primary"
          onClick={props.connectToServer}
          fullWidth
          style={{ borderRadius: '20px', padding: '10px', fontWeight: 'bold' }}
        >
          Continue
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
  );
};


