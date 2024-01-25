import { Paper, Typography, Box, } from '@mui/material';
import { Stage, Layer, Line } from 'react-konva';
import { useRef, useState, useEffect } from 'react';

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
    // TODO : maybe just emit last line instead of all lines
    props.socket.emit('drawLines', {
      "response": "success",
      "sender": props.name,
      "payload": props.lines,
    });
    console.log('emitted');
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) {
      return;
    }

    const stage = canvasRef.current.getStage();
    const point = stage.getPointerPosition();
    const lastLine = props.lines[props.lines.length - 1];

    // append new points to the last line array
    props.setLines(
      props.lines.slice(0, -1).concat([
        [...lastLine, {
          x: point.x,
          y: point.y,
        }],
      ])
    );
  };
  // =========================== MOUSE EVENT HANDLERS =========================== //


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
