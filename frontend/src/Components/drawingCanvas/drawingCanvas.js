import { Paper, Typography, Box, } from '@mui/material';
import { Stage, Layer, Line } from 'react-konva';
import { useRef, useState, useEffect } from 'react';

export default function Canvas() {
  // ---------------------------- HOOKS ---------------------------- //
  const canvasRef = useRef();
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  // ---------------------------- HOOKS ---------------------------- //

  // =========================== MOUSE EVENT HANDLERS =========================== //
  const handleMouseDown = () => {
    setIsDrawing(true);
    setLines([...lines, []]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) {
      return;
    }

    const stage = canvasRef.current.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];

    setLines(
      lines.slice(0, -1).concat([
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
  }, [isDrawing, lines]);
  // =========================== CANVAS EVENT LISTENERS =========================== //

  // ============================ RETURN ============================ //
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      ref={canvasRef}
    >
      {/* For each line in lines, create a Line component with the points of the line. */}
      <Layer>
        {lines.map((line, index) => (
          <Line
            key={index}
            points={line.flatMap((point) => [point.x, point.y])}
            stroke="black"
            strokeWidth={5}
          />
        ))}
      </Layer>
    </Stage>
  );
};

