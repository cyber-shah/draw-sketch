import { Paper, Typography, Box, Icon, } from '@mui/material';
import { Stage, Layer, Line } from 'react-konva';
import { useRef, useState, useEffect } from 'react';
import NorthWestOutlinedIcon from '@mui/icons-material/NorthWestOutlined';

// TODO: user transform from react-konva to make the canvas responsive
// TODO: add zoom in and out functionality
// add undo and redo functionality
export default function Canvas(props) {
  // ---------------------------- HOOKS ---------------------------- //
  // useRef works like useState but it doesn't cause a re-render when the value changes
  // and we can reference elements in the DOM with it and retrieve them later
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  // ---------------------------- HOOKS ---------------------------- //

  // =========================== MOUSE EVENT HANDLERS =========================== //
  // whenever the mouse is pressed, we want to start a new line hence append an empty array to the lines array
  const handleMouseDown = () => {
    setIsDrawing(true);
    props.setLines([...props.lines, []]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // whenever the mouse moves:
  // 1. emit the cursor position to other users
  // 2. if the user is drawing, append new points to the last line array and set the updated lines immediately
  const handleMouseMove = (e) => {
    const stage = canvasRef.current.getStage();
    const point = stage.getPointerPosition();

    // Emit the cursor position to other users
    props.socket.emit('cursorUpdate', {
      response: 'success',
      sender: props.name,
      payload: {
        x: point.x,
        y: point.y,
      },
    });

    if (isDrawing) {
      const lastLine = props.lines[props.lines.length - 1];

      // Append new points to the last line array
      const updatedLines = props.lines.slice(0, -1).concat([
        [...lastLine, { x: point.x, y: point.y }],
      ]);

      // Set the updated lines immediately
      props.setLines(updatedLines);

      // Emit the drawn lines to other users
      // TODO: instead of emitting the entire lines array, only emit the new points
      // BUG: when a new user joins the room, the canvas is cleared
      // BUG: screen resizes takes some time to update the canvas
      props.socket.emit('drawLines', {
        response: 'success',
        sender: props.name,
        payload: updatedLines,
      });
    }
  };
  // =========================== MOUSE EVENT HANDLERS =========================== //

  // =========================== RENDER CURSORS =========================== //
  const renderCursors = () => {
    return Object.entries(props.cursors).map(([username, cursor]) => {
      if (username !== props.name) {
        return (
          <div
            key={username}
            style={{
              position: 'absolute',
              left: cursor.x - 12,
              top: cursor.y - 12,
              color: props.color,
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

  // =========================== CANVAS EVENT LISTENERS =========================== //
  // So while the user is drawing, we want to add event listeners to the canvas
  // once the user stops drawing, we want to remove the event listeners
  useEffect(() => {
    // uses useRef to get the canvas element
    const canvas = canvasRef.current;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawing, props.lines]);
  // =========================== CANVAS EVENT LISTENERS =========================== //

  // ============================ RETURN ============================ //
  return (
    <Box style={{ position: 'relative' }}>

      {/* whenver props.cursors state changes, it triggers a rerender of that component.
        This re-rendering process is cascading, meaning it can also trigger re-renders in child components that depend on the updated state.
        and therefore the canvas component will be re-rendered whenever the cursor state changes 
      */}
      {renderCursors()}
      {/* Use absolute positioning for the Stage */}
      <Stage
        width={window.innerWidth * 0.73}
        height={window.innerHeight - 90}
        ref={canvasRef}
        style={{ position: 'absolute' }}
      >
        {/* For each line in lines, create a Line component with the points of the line. */}
        <Layer>
          {props.lines.map((line, index) => (
            <Line
              key={index}
              points={line.flatMap((point) => [point.x, point.y])}
              stroke="black"
              strokeWidth={5}
            />
          ))}
        </Layer>


      </Stage>
    </Box>
  );
};
