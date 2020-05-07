import React from 'react';
import CanvasDraw from 'react-canvas-draw';

export interface DrawingCanvasProps {}

const DrawingCanvas: React.FC<DrawingCanvasProps> = () => {
  return <CanvasDraw />;
};

export default DrawingCanvas;
