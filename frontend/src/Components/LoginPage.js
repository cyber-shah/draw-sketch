import { Container, Paper, TextField, Button, Stack, Typography } from '@mui/material';

export default function LoginPage(props) {

  return (
    <Paper className="container" elevation={3} style={{ width: '500px', padding: '50px', }}>
      <Stack gap={4}>
        <TextField
          className="name-input"
          label="Enter your nickname"
          onChange={(event) => props.setName(event.target.value)}
          variant="standard"
        />

        <TextField
          className="ip-input"
          label="Enter the server IP address"
          onChange={(event) => props.setIpAddress(event.target.value)}
          variant="standard"
        />

        <Button
          className="connect-button"
          variant="contained"
          color="primary"
          onClick={props.connectToServer}
        >
          Connect!
        </Button>
      </Stack>
    </Paper>
  );
}
