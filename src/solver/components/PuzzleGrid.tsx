import React, { useState, useEffect, KeyboardEvent } from 'react';
import { GridCell, GridDimensions } from '../../common/types/grid';
import { PuzzleWord } from '../../common/types/puzzle';

interface PuzzleGridProps {
  dimensions: {
    rows: number;
    columns: number;
  };
  words?: PuzzleWord[];
  onCellChange?: (row: number, col: number, value: string) => void;
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({ dimensions, words, onCellChange }) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');

  useEffect(() => {
    const newGrid: GridCell[][] = Array(dimensions.rows).fill(null).map(() =>
      Array(dimensions.columns).fill(null).map(() => ({
        letter: '',
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

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>, row: number, col: number) => {
    if (grid[row][col].isBlocked) return;

    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      const newGrid = [...grid];
      newGrid[row][col] = {
        ...newGrid[row][col],
        letter: e.key.toUpperCase()
      };
      setGrid(newGrid);
      onCellChange?.(row, col, e.key.toUpperCase());

      // Move to next cell
      const nextCell = getNextCell(row, col);
      if (nextCell) {
        setSelectedCell(nextCell);
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      const newGrid = [...grid];
      newGrid[row][col] = {
        ...newGrid[row][col],
        letter: ''
      };
      setGrid(newGrid);
      onCellChange?.(row, col, '');
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
        gridTemplateColumns: `repeat(${dimensions.columns}, 40px)`,
        gap: '2px',
        padding: '10px'
      }}
    >
      {grid.map((row, rowIndex) => 
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            onKeyDown={(e) => handleKeyPress(e, rowIndex, colIndex)}
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid #ccc',
              backgroundColor: cell.isBlocked ? '#333' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: cell.isBlocked ? 'not-allowed' : 'text',
              outline: selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? '2px solid #007bff' : 'none'
            }}
            tabIndex={cell.isBlocked ? -1 : 0}
          >
            {cell.letter}
          </div>
        ))
      )}
    </div>
  );
};
