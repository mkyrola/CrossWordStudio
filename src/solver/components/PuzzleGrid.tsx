import React, { useState, useEffect } from 'react';
import { GridCell, GridDimensions } from '../../common/types/grid';
import { PuzzleWord } from '../../common/types/puzzle';

interface PuzzleGridProps {
  dimensions: GridDimensions;
  words?: PuzzleWord[];
  onCellChange?: (row: number, col: number, value: string) => void;
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({ dimensions, words, onCellChange }) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');

  // Initialize empty grid
  useEffect(() => {
    const newGrid = Array(dimensions.rows).fill(null).map(() =>
      Array(dimensions.columns).fill(null).map(() => ({
        value: '',
        isBlocked: false
      }))
    );
    setGrid(newGrid);
  }, [dimensions]);

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlocked) return;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      setDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (grid[row][col].isBlocked) return;

    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      const newGrid = [...grid];
      newGrid[row][col] = {
        ...newGrid[row][col],
        value: e.key.toUpperCase()
      };
      setGrid(newGrid);
      onCellChange?.(row, col, e.key.toUpperCase());

      // Move to next cell
      const nextCell = getNextCell(row, col);
      if (nextCell) {
        setSelectedCell(nextCell);
      }
    }
  };

  const getNextCell = (row: number, col: number): {row: number; col: number} | null => {
    if (direction === 'across') {
      if (col + 1 < dimensions.columns && !grid[row][col + 1].isBlocked) {
        return { row, col: col + 1 };
      }
    } else {
      if (row + 1 < dimensions.rows && !grid[row + 1][col].isBlocked) {
        return { row: row + 1, col };
      }
    }
    return null;
  };

  return (
    <div 
      className="puzzle-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${dimensions.columns}, ${dimensions.cellWidth}px)`,
        gap: '1px',
        backgroundColor: '#000',
        padding: '1px',
      }}
    >
      {grid.map((row, rowIndex) => 
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: dimensions.cellWidth,
              height: dimensions.cellHeight,
              backgroundColor: cell.isBlocked ? '#000' : '#fff',
              border: selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                ? '2px solid #0066cc'
                : '1px solid #ccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: `${Math.min(dimensions.cellWidth, dimensions.cellHeight) * 0.6}px`,
              cursor: cell.isBlocked ? 'default' : 'pointer',
              position: 'relative'
            }}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
            tabIndex={cell.isBlocked ? -1 : 0}
          >
            {cell.value}
          </div>
        ))
      )}
    </div>
  );
};
