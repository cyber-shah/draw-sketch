import './App.css';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Icon, Paper, Grid, Typography } from '@mui/material';
import LoginPage from './Components/LoginPage.js';
import ChatWindow from './Components/chatWindow.js';
import Canvas from './Components/drawingCanvas/drawingCanvas.js';
import Chance from 'chance';
import DrawingToolbar from './Components/Toolbars/mainToolbar';

import * as Socket from './Socket';
import NorthWestOutlinedIcon from '@mui/icons-material/NorthWestOutlined';



// TODO : sends error about rooms to all because its on the main socket
// Server sends a lot of new users messages to all users
// drawing clears when new user joins
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
  const [mainSocket, setMainSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState(chance.word({ syllables: 2 }));
  const [isConnected, setIsConnected] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomSocket, setRoomSocket] = useState(null);
  const [clients, setClients] = useState([]);


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
  /* In JavaScript, operations that involve asynchronous tasks, 
   * like network requests or callbacks, are non-blocking. 
   * This means that the next line of code will execute without waiting for 
   * the asynchronous task to complete unless you explicitly use mechanisms 
   * like Promises or async/await.
   */

  async function connectMainSocket() {
    const tempSocket = await Socket.connectMainSocket();
    setMainSocket(tempSocket);
  }

  async function joinRoom() {
    if (!roomSocket) {
      const tempSocket = await Socket.joinRoom(mainSocket, roomName, name);
      setRoomSocket(tempSocket);
      setIsConnected(true);
      setColor(chance.color({ format: 'hex' }));
    }
  }

  async function createRoom() {
    if (!roomSocket) {
      console.log(mainSocket);
      const tempSocket = await Socket.createRoom(mainSocket, roomName, name);
      // NOTE: React state updates, including setRoomSocket, are asynchronous, 
      // and they don't immediately update the state. 
      setRoomSocket(tempSocket);
      setIsConnected(true);
      setColor(chance.color({ format: 'hex' }));
    }
  }

  async function registerSockets() {
    Socket.registerSocketEvents(roomSocket, setMessages, setCursors, setLines, setClients, clients);
  }

  function sendMessage() {
    Socket.sendMessage(roomSocket, message, name, color);
  }

  // ---------------------------- FUNCTIONS -------------------------------------------

  // =========================== SAVE CANVAS IMAGE =========================== //
  const canvasRef = useRef();

  const handleSaveClick = (canvasRef) => {
    const stage = canvasRef.current.getStage();
    if (stage) {
      const dataURL = stage.toDataURL();
      // Create a temporary anchor element
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = dataURL;
      downloadAnchor.download = 'canvas_image.png';
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
    document.title = "DrawSync";
    connectMainSocket();
    console.log('connecting main socket');
  }, [])

  useEffect(() => {
    if (roomSocket) {
      registerSockets();
      console.log('registering sockets');
      console.log(roomSocket);
    }
  }, [roomSocket])
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
