import { Paper, Typography, Box, Icon, } from '@mui/material';
import { Stage, Layer, Line } from 'react-konva';
import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NorthWestOutlinedIcon from '@mui/icons-material/NorthWestOutlined';

// TODO: user transform from react-konva to make the canvas responsive
// TODO: add zoom in and out functionality
// add undo and redo functionality
// add clear canvas functionality
// add save canvas functionality
export default function Canvas(props) {
  // ---------------------------- HOOKS ---------------------------- //
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  // ---------------------------- HOOKS ---------------------------- //

  // =========================== MOUSE EVENT HANDLERS =========================== //
  const handleMouseDown = () => {
    setIsDrawing(true);
    props.setLines([...props.lines, []]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

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
    return Object.entries(props.cursors).map(([username, cursor]) => (
      <div
        key={username}
        style={{
          position: 'absolute',
          left: cursor.x - 12, // Adjust the position to center the icon
          top: cursor.y - 12,
          color: 'red',
          fontSize: '24px',
        }}
      >
        <Icon component={NorthWestOutlinedIcon} />
        <Typography variant='caption'>{username}</Typography>
        {console.log(username)}
      </div>
    ));
  };


  // =========================== RENDER CURSORS ======================================//

  // =========================== CANVAS EVENT LISTENERS =========================== //
  useEffect(() => {
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

      {/* Render the cursors */}
      {renderCursors()}
      {/* Use absolute positioning for the Stage */}
      <Stage
        width={window.innerWidth}
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
