import React from 'react';
import { GridCalibrationData } from './GridCalibration';

interface GridOverlayProps {
  calibrationData: GridCalibrationData;
  imageWidth: number;
  imageHeight: number;
}

const GridOverlay: React.FC<GridOverlayProps> = ({
  calibrationData,
  imageWidth,
  imageHeight
}) => {
  const { gridWidth, gridHeight, cellWidth, cellHeight, offsetX, offsetY } = calibrationData;

  // Calculate total grid dimensions
  const totalWidth = gridWidth * cellWidth;
  const totalHeight = gridHeight * cellHeight;

  // Calculate scale to fit the grid to the image
  const scaleX = imageWidth / totalWidth;
  const scaleY = imageHeight / totalHeight;
  const scale = Math.min(scaleX, scaleY);

  // Draw grid lines
  const lines = [];
  
  // Vertical lines
  for (let i = 0; i <= gridWidth; i++) {
    const x = (i * cellWidth * scale) + offsetX;
    lines.push(
      <line
        key={`v${i}`}
        x1={x}
        y1={offsetY}
        x2={x}
        y2={totalHeight * scale + offsetY}
        stroke="red"
        strokeWidth="1"
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i <= gridHeight; i++) {
    const y = (i * cellHeight * scale) + offsetY;
    lines.push(
      <line
        key={`h${i}`}
        x1={offsetX}
        y1={y}
        x2={totalWidth * scale + offsetX}
        y2={y}
        stroke="red"
        strokeWidth="1"
      />
    );
  }

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      preserveAspectRatio="none"
    >
      {lines}
    </svg>
  );
};

export default GridOverlay;
