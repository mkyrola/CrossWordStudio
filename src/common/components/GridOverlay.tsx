import React, { useState, useEffect } from 'react';
import theme from '../../styles/theme';

interface GridOverlayProps {
  gridWidth: number;
  gridHeight: number;
  cellWidth: number;
  cellHeight: number;
  offsetX: number;
  offsetY: number;
  solution?: string[][];
  imageWidth: number;
  imageHeight: number;
  onGridChange: (newGrid: CellState[][]) => void;
}

export interface CellState {
  letter: string;
  isEditable: boolean;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({
  gridWidth,
  gridHeight,
  cellWidth,
  cellHeight,
  offsetX,
  offsetY,
  solution,
  imageWidth,
  imageHeight,
  onGridChange
}) => {
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Initialize or update grid when solution changes
  useEffect(() => {
    if (solution) {
      const newGrid = solution.map(row =>
        row.map(cell => ({
          letter: cell,
          isEditable: cell === ' '
        }))
      );
      setGrid(newGrid);
      setShowSaveButton(true);
    } else {
      // Initialize empty grid with correct dimensions
      setGrid(Array(gridHeight).fill(null).map(() =>
        Array(gridWidth).fill(null).map(() => ({
          letter: '',
          isEditable: true
        }))
      ));
      setShowSaveButton(false);
    }
  }, [solution, gridWidth, gridHeight]);

  // Update parent when grid changes
  useEffect(() => {
    if (onGridChange) {
      onGridChange(grid);
    }
  }, [grid, onGridChange]);

  const toggleCellEditable = (rowIndex: number, colIndex: number) => {
    const newGrid = [...grid];
    newGrid[rowIndex] = [...newGrid[rowIndex]];
    const currentCell = newGrid[rowIndex][colIndex];
    
    // Toggle between empty editable cell and blocked cell
    newGrid[rowIndex][colIndex] = {
      letter: currentCell.isEditable ? ' ' : '',
      isEditable: !currentCell.isEditable
    };
    
    setGrid(newGrid);
    if (onGridChange) {
      onGridChange(newGrid);
    }
  };

  const handleSaveGrid = () => {
    // Grid save is handled by parent component via onGridChange callback
    // This button triggers the parent's save logic
    if (onGridChange) {
      onGridChange(grid);
    }
  };

  return (
    <>
      {/* Grid and Solution Overlay */}
      <svg
        width={imageWidth}
        height={imageHeight}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
        viewBox={`0 0 ${imageWidth} ${imageHeight}`}
        preserveAspectRatio="none"
      >
        <g 
          style={{ pointerEvents: 'auto' }}
          transform={`translate(${offsetX}, ${offsetY})`}
        >
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              return (
                <g key={`cell-${rowIndex}-${colIndex}`}>
                  <rect
                    x={colIndex * cellWidth}
                    y={rowIndex * cellHeight}
                    width={cellWidth}
                    height={cellHeight}
                    fill={!cell.isEditable ? theme.colors.background : theme.colors.surface}
                    stroke={theme.colors.border}
                    strokeWidth="1"
                    onClick={() => toggleCellEditable(rowIndex, colIndex)}
                  />
                  {cell.letter !== ' ' && (
                    <text
                      x={colIndex * cellWidth + cellWidth * 0.1}
                      y={rowIndex * cellHeight + cellHeight * 0.2}
                      fontSize={Math.min(cellWidth, cellHeight) * 0.2}
                      fill={theme.colors.text.secondary}
                      style={{ pointerEvents: 'none' }}
                    >
                      {cell.letter}
                    </text>
                  )}
                </g>
              );
            })
          ))}
        </g>
      </svg>

      {showSaveButton && (
        <button
          onClick={handleSaveGrid}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            padding: '12px 24px',
            backgroundColor: theme.colors.accent,
            color: theme.colors.text.inverse,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Save Grid
        </button>
      )}
    </>
  );
};
