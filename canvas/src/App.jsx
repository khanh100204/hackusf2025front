import './App.css';
import ModelViewer from './ModelViewer';
import React, { useEffect, useRef, useState } from 'react';

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isPaintingRef = useRef(false);

  const [lineWidth, setLineWidth] = useState(5);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [showModel, setShowModel] = useState(false);

  const lineWidthRef = useRef(lineWidth);
  const strokeColorRef = useRef(strokeColor);
  const isEraserRef = useRef(isEraser);
  const undoStackRef = useRef(undoStack);


  // Keep refs in sync with state
  useEffect(() => {
    lineWidthRef.current = lineWidth;
  }, [lineWidth]);

  useEffect(() => {
    strokeColorRef.current = strokeColor;
  }, [strokeColor]);

  useEffect(() => {
    isEraserRef.current = isEraser;
  }, [isEraser]);



  useEffect(() => {
    undoStackRef.current = undoStack;
  }, [undoStack]);


  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    isPaintingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    setUndoStack((prev) => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const handleMouseUp = () => {
    isPaintingRef.current = false;
    const ctx = ctxRef.current;
    ctx.stroke();
    ctx.beginPath();
  };

  const handleMouseMove = (e) => {
    if (!isPaintingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.lineWidth = lineWidthRef.current;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isEraserRef.current ? 'white' : strokeColorRef.current;
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
  };

  const handleKeyDown = (e) => {
    const stack = undoStackRef.current;
    if (e.ctrlKey && e.key.toLowerCase() === 'z') {
      console.log("undo stack: " + stack.length);
      e.preventDefault();
      if (stack.length > 0) {
        const ctx = ctxRef.current;
        const newStack = [...stack];
        const last = newStack.pop();
        ctx.putImageData(last, 0, 0);
        setUndoStack(newStack);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    canvas.width = window.innerWidth - canvas.offsetLeft;
    canvas.height = window.innerHeight - canvas.offsetTop;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Only run once

  const handleClear = () => { 
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      const goodImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let newStack = [undoStackRef.current, goodImg];
      setUndoStack(newStack);
      console.log(newStack.length);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  };  



  const handleUndo = () => {
    console.log("stack:" + undoStack.length);
    const ctx = ctxRef.current;
    if (undoStack.length > 0) {
      const newStack = [...undoStack];
      const last = newStack.pop();
      ctx.putImageData(last, 0, 0);
      setUndoStack(newStack);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURI;
    link.download = 'drawing.png';
    link.click();
  };

  return (
    <section className="container">
      <div className="toolbar">
        <h1>Draw.</h1>
        <label htmlFor="stroke">Stroke</label>
        <input
          id="stroke"
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
        />

        <label htmlFor="lineWidth">Line Width</label>
        <input
          id="lineWidth"
          type="number"
          min="1"
          max="100"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        />

        <button onClick={() => setIsEraser(!isEraser)} id={isEraser? "button" : "button-eraser"}>
          {isEraser ? 'Brush' : 'Eraser'} 
          
        </button>
        <button onClick={handleClear}>Clear</button>
        <button id="button-undo" onClick={handleUndo}>Undo</button>
        <button id="button-download" onClick={handleDownload}>Download</button>
        <button id="button-3d" onClick={() => setShowModel(!showModel)}>
          {showModel ? 'Hide 3D Model' : 'Show 3D Model'}
        </button>
      </div>
    
      {!showModel && 
      <div className="drawing-board">
        <canvas ref={canvasRef} id="drawing-board" />
      </div>
      }
      {showModel && 
      <ModelViewer modelUrl="/response.glb"/>
      }
    
    </section>
  );
};

export default DrawingApp;
