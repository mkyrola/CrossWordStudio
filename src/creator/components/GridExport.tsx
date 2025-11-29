import React from 'react';
import { GridCell, GridDimensions, GridOffset } from '../../common/types/grid';

interface GridExportProps {
  gridRef: React.RefObject<HTMLDivElement>;
  grid: GridCell[][];
  gridDimensions: GridDimensions;
  offset: GridOffset;
}

export const GridExport: React.FC<GridExportProps> = ({
  gridRef,
  grid,
  gridDimensions,
  offset: _offset // Reserved for future use with positioned exports
}) => {
  const handleExport = () => {
    if (!gridRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size to match grid dimensions
    const totalWidth = gridDimensions.columns * gridDimensions.cellWidth;
    const totalHeight = gridDimensions.rows * gridDimensions.cellHeight;
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Draw grid lines
    context.strokeStyle = '#000000';
    context.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= gridDimensions.columns; x++) {
      context.beginPath();
      context.moveTo(x * gridDimensions.cellWidth, 0);
      context.lineTo(x * gridDimensions.cellWidth, totalHeight);
      context.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= gridDimensions.rows; y++) {
      context.beginPath();
      context.moveTo(0, y * gridDimensions.cellHeight);
      context.lineTo(totalWidth, y * gridDimensions.cellHeight);
      context.stroke();
    }

    // Draw cells and letters
    context.font = `${Math.min(gridDimensions.cellWidth, gridDimensions.cellHeight) * 0.6}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cellX = x * gridDimensions.cellWidth;
        const cellY = y * gridDimensions.cellHeight;

        // Fill blocked cells
        if (cell.isBlocked) {
          context.fillStyle = '#f0f0f0';
          context.fillRect(
            cellX + 1,
            cellY + 1,
            gridDimensions.cellWidth - 2,
            gridDimensions.cellHeight - 2
          );
        }

        // Draw letters
        if (cell.letter && !cell.isBlocked) {
          context.fillStyle = '#000000';
          context.fillText(
            cell.letter,
            cellX + gridDimensions.cellWidth / 2,
            cellY + gridDimensions.cellHeight / 2
          );
        }
      });
    });

    // Convert canvas to image and trigger download
    const link = document.createElement('a');
    link.download = 'crossword-grid.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <button
      onClick={handleExport}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 24px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      Export Grid
    </button>
  );
};
