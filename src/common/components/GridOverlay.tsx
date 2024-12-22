import React, { useState, useEffect } from 'react';
import theme from '../../../styles/theme';

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
  onGridChange?: (grid: CellState[][]) => void;
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
    // TODO: Implement save functionality
    console.log('Saving grid:', grid);
  };

  return (
    <>
      {/* Grid and Solution Overlay */}
      <svg
        width={imageWidth}
        height={imageHeight}
        style={{
          position: 'absolute',
          top: offsetY,
          left: offsetX,
          zIndex: 2
        }}
      >
        {/* Draw grid lines */}
        {Array(gridHeight + 1).fill(0).map((_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * cellHeight}
            x2={gridWidth * cellWidth}
            y2={i * cellHeight}
            stroke="red"
            strokeWidth="1"
            opacity="1"
          />
        ))}
        {Array(gridWidth + 1).fill(0).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * cellWidth}
            y1={0}
            x2={i * cellWidth}
            y2={gridHeight * cellHeight}
            stroke="red"
            strokeWidth="1"
            opacity="1"
          />
        ))}

        {/* Draw solution cells */}
        {grid.map((row, y) => row.map((cell, x) => (
          <g key={`${x}-${y}`}>
            {/* Cell background - clickable */}
            <rect
              x={x * cellWidth}
              y={y * cellHeight}
              width={cellWidth}
              height={cellHeight}
              fill={!cell.isEditable ? '#f0f0f0' : 'transparent'}
              fillOpacity={!cell.isEditable ? "0.9" : "0"}
              stroke="none"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleCellEditable(y, x)}
            />

            {/* Cross for space cells */}
            {cell.letter === ' ' && (
              <>
                <line
                  x1={x * cellWidth}
                  y1={y * cellHeight}
                  x2={(x + 1) * cellWidth}
                  y2={(y + 1) * cellHeight}
                  stroke="black"
                  strokeWidth="1"
                  opacity="0.8"
                />
                <line
                  x1={(x + 1) * cellWidth}
                  y1={y * cellHeight}
                  x2={x * cellWidth}
                  y2={(y + 1) * cellHeight}
                  stroke="black"
                  strokeWidth="1"
                  opacity="0.8"
                />
              </>
            )}

            {/* Cell letter */}
            {cell.letter !== ' ' && (
              <text
                x={x * cellWidth + cellWidth / 2}
                y={y * cellHeight + cellHeight / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                fontSize={Math.min(cellWidth, cellHeight) * 0.6}
                fontFamily="Arial"
                style={{ userSelect: 'none' }}
              >
                {cell.letter}
              </text>
            )}
          </g>
        )))}
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
