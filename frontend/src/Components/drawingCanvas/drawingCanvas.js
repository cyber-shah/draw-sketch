import { Paper, Typography, Box, Icon, } from '@mui/material';
import { Stage, Layer, Line } from 'react-konva';
import { useRef, useState, useEffect } from 'react';

// TODO: user transform from react-konva to make the canvas responsive
// TODO: add zoom in and out functionality
//
// TODO: find out why does this re render itself when the cursor moves
// add undo and redo functionality








export default function Canvas(props) {
  // ---------------------------- HOOKS ---------------------------- //
  // useRef works like useState but it doesn't cause a re-render when the value changes
  // and we can reference elements in the DOM with it and retrieve them later
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
  // TODO: instead of emitting the entire lines array, only emit the new points

  // BUG: when a new user joins the room, the canvas is cleared
  // BUG: screen resizes takes some time to update the canvas
  const handleMouseMove = (e) => {
    const stage = props.canvasRef.current.getStage();
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

    if (isDrawing && (props.selectedTool === 'pencil' || props.selectedTool === 'eraser')) {
      const lastLine = props.lines[props.lines.length - 1];

      // Append new points to the last line array
      const updatedLines = props.lines.slice(0, -1).concat([
        [...lastLine, {
          points: [point.x, point.y],
          x: point.x,
          y: point.y,
          color: props.selectedColor,
          size: props.brushSize,
          tool: props.selectedTool,
        }],
      ]);

      // Set the updated lines immediately
      props.setLines(updatedLines);

      // Emit the drawn lines to other users
      props.socket.emit('drawLines', {
        response: 'success',
        sender: props.name,
        payload: updatedLines,
      });
    }
  };
  // =========================== MOUSE EVENT HANDLERS =========================== //


  // =========================== CANVAS EVENT LISTENERS =========================== //
  // So while the user is drawing, we want to add event listeners to the canvas
  // once the user stops drawing, we want to remove the event listeners
  useEffect(() => {
    // uses useRef to get the canvas element
    const canvas = props.canvasRef.current;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawing, props.lines]);


  useEffect(() => {
    if (props.selectedTool === 'trash') {
      props.setLines([]);
    }
  }, [props.selectedTool]);
  // =========================== CANVAS EVENT LISTENERS =========================== //

  // ============================ RETURN ============================ //
  return (
    <Box style={{ position: 'relative' }}>

      {/* Use absolute positioning for the Stage */}
      <Stage
        width={window.innerWidth * 0.73}
        height={window.innerHeight - 90}
        ref={props.canvasRef}
        style={{ position: 'absolute' }}
      >

        {/* For each line in lines, create a Line component with the points of the line.
        TODO: find a better way to do this
        */}
        <Layer>
          {props.lines.map((line, index) => {
            if (line[0]) {
              return (
                <Line
                  key={index}
                  globalCompositeOperation={
                    line[0].tool === 'eraser' ? "destination-out" : "source-over"
                  }
                  points={line.flatMap((point) => [point.x, point.y])}
                  stroke={line[0].color}
                  strokeWidth={line[0].size}
                  tension={0.1}
                  lineCap="round"
                />
              );
            } else {
              return null; // or any other logic you want for false condition
            }
          })}
        </Layer>
      </Stage>
    </Box>
  );
};
