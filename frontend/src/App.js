import './App.css';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Icon, Paper, Grid, Typography } from '@mui/material';
import LoginPage from './Components/LoginPage.js';
import ChatWindow from './Components/chatWindow.js';
import Canvas from './Components/drawingCanvas/drawingCanvas.js';
import Chance from 'chance';
import DrawingToolbar from './Components/Toolbars/mainToolbar';

import NorthWestOutlinedIcon from '@mui/icons-material/NorthWestOutlined';



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
  const [roomName, setRoomName] = useState('');
  const [roomSocket, setRoomSocket] = useState(null);

  // states for the canvas: 
  const [lines, setLines] = useState([]);
  const [cursors, setCursors] = useState({});
  const [color, setColor] = useState(null);
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);

  // states for the toolbar :
  const [selectedColor, setSelectedColor] = useState('#000000'); // Default color is black
  const [brushSize, setBrushSize] = useState(5); // Default brush size is 5
  const [selectedTool, setSelectedTool] = useState('pencil');
  // ---------------------------- STATES -------------------------------------------

  // ---------------------------- FUNCTIONS -------------------------------------------

  // STEP 1: create the main socket instance and connect to the server
  var mainSocket = null;
  const connectMainSocket = () => {
    mainSocket = io('http://localhost:666', {
    });

    mainSocket.on('connect', () => {
      console.log('Connected to the server');
      console.log(mainSocket);
    }, [mainSocket]);
  }

  // if the user decides to join a room that already exists
  const joinRoom = () => {
    mainSocket.emit('joinRoom', { roomName: roomName, sender: name });

    mainSocket.on('response', (data) => {
      // if the room exists, then connect to the room and set the socket instance
      if (data.response === 'success') {
        const roomSocket = io(`http://localhost:666/room_${roomName}`, {
          query: {
            sender: name,
            roomNumber: roomName,
          },
        });
        setRoomSocket(mainSocket);
      }
      // otherwise, alert the user that the room already exists
      else {
        alert('Room already exists, please try another name.');
      }
    });
  };

  // if the user decides to create a new room
  const createRoom = () => {
    mainSocket.emit('createRoom', { roomName: roomName, sender: name });
    // STEP 2: listen for the server's response
    mainSocket.on('response', (data) => {
      if (data.response === 'success') {
        setIsConnected(true);
        setRoomSocket(mainSocket);
      } else {
        alert('Room already exists, please try another name.');
      }
    });
  }







  const connectToServer = (command) => {
    // TODO: make sure none of the fields are empty
    // TODO: clean up after disconnecting

    // what we do here:
    // 1. create a socket instance with senders name and room number
    // 2. everything after that is handled by the server

    // Connect to the server and send the sender
    // URL is the address where client should connect to
    const roomSocket = io(`http://localhost:666/room_${roomName}`, {
      query: {
        sender: name,
        roomNumber: roomName,
      },
    });
    setRoomSocket(roomSocket);

    // Listen to the connect event from the server
    roomSocket.on('connect', () => {
      setIsConnected(true);
    });

    // Listen for INCOMING messages and update the state by appending the incoming message
    roomSocket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Listen for INCOMING drawn lines and update the Canvas component
    roomSocket.on('drawLines', (data) => {
      // Update Canvas component with the received lines
      setLines(data['payload'])
    });

    // Listen for INCOMING cursor positions and update the Canvas component
    roomSocket.on('cursorUpdate', (cursorData) => {
      // Update the cursors state with the received cursor data
      setCursors((prevCursors) => ({
        ...prevCursors,
        [cursorData.sender]: cursorData.payload,
      }));
    });

    setColor(chance.color({ format: 'hex' }));
  };

  const sendMessage = () => {
    roomSocket.emit('message', {
      "response": "success",
      "sender": name,
      "payload": message,
    });
  };
  // ---------------------------- FUNCTIONS -------------------------------------------

  // =========================== SAVE CANVAS IMAGE =========================== //
  const canvasRef = useRef();

  const handleSaveClick = () => {
    const stage = canvasRef.current.getStage();

    if (stage) {
      const dataURL = stage.toDataURL();

      // Create a temporary anchor element
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = dataURL;
      downloadAnchor.download = 'canvas_image.png'; // You can change the filename and extension here

      // Append the anchor to the body and trigger a click on it
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();

      // Remove the anchor from the body
      document.body.removeChild(downloadAnchor);
    }
  };
  // =========================== SAVE CANVAS IMAGE =========================== //

  // =========================== RENDER CURSORS =========================== //
  // TODO: cursors are off by large margin
  const renderCursors = () => {
    return Object.entries(cursors).map(([username, cursor]) => {
      if (username !== name) {
        return (
          <div
            key={username}
            style={{
              position: 'absolute',
              left: cursor.x,
              top: cursor.y,
              color: color,
              fontSize: '24px',
            }}
          >
            <Icon component={NorthWestOutlinedIcon} />
            <Typography variant='caption'>{username}</Typography>
            {console.log(username)}
          </div>
        );
      } else {
        return null;
      }
    });
  };
  // =========================== RENDER CURSORS ======================================//


  // =========================== USE EFFECT ======================================//
  useEffect(() => {
    if (selectedTool === 'undo') {
      console.log(lines);
      lines.pop();
      console.log(lines);
    }
  }, [selectedTool]);

  useEffect(() => {
    document.title = "DrawSync";
    connectMainSocket();
  }, [])

  // ---------------------------- RETURN -------------------------------------------
  return (
    <Paper
      style={css.background} >
      {
        !isConnected ? (
          // if the user decides to join, or create, a room
          // relevant method will be fired inside the LoginPage component
          <LoginPage
            joinRoom={joinRoom}
            createRoom={createRoom}
            connectToServer={connectToServer}
            setRoomNumber={setRoomName}
            setName={setName}
            name={name}
            roomNumber={roomName}
          />
        ) : (

          <Grid container spacing={2} style={{ width: "100vw" }}>

            {/* whenver props.cursors state changes, it triggers a rerender of that component.
            This re-rendering process is cascading, meaning it can also trigger re-renders in child components that depend on the updated state.
            and therefore the canvas component will be re-rendered whenever the cursor state changes 
            */}
            {renderCursors()}

            <Grid item xs={9} >
              <DrawingToolbar
                setSelectedColor={setSelectedColor} selectedColor={selectedColor}
                setBrushSize={setBrushSize} brushSize={brushSize}
                setSelectedTool={setSelectedTool} selectedTool={selectedTool}
                handleSaveClick={handleSaveClick}
              />
              <Canvas
                canvasRef={canvasRef}
                cursors={cursors} setCursors={setCursors}
                name={name} socket={roomSocket}
                lines={lines} setLines={setLines}
                color={color}
                selectedColor={selectedColor}
                brushSize={brushSize}
                selectedTool={selectedTool}
                rectangles={rectangles} setRectangles={setRectangles}
                circles={circles} setCircles={setCircles}
              />
            </Grid>


            <Grid item xs={3} style={css.chatWindow} >
              <ChatWindow
                sendMessage={sendMessage}
                messages={messages}
                setMessage={setMessage}
                message={message}
                name={name}
                color={color}
              />
            </Grid>

          </Grid>
        )
      }

    </Paper >
  );
}

export default App;
