import React, { useState, useEffect } from 'react';
import { PuzzleData } from '../types/puzzleData';
import { WordHighlight } from '../../common/types/grid';
import theme from '../../styles/theme';

interface PuzzleManagerProps {
  puzzle: PuzzleData;
  onCellChange: (row: number, col: number, value: string) => void;
}

export const PuzzleManager: React.FC<PuzzleManagerProps> = ({
  puzzle,
  onCellChange
}) => {
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [isVertical, setIsVertical] = useState(false);
  const [highlight, setHighlight] = useState<WordHighlight | null>(null);
  const [userGrid, setUserGrid] = useState<typeof puzzle.tables.emptyGrid>([]);

  // Initialize user grid from puzzle's empty grid
  useEffect(() => {
    if (puzzle?.tables?.emptyGrid) {
      setUserGrid(puzzle.tables.emptyGrid);
    }
  }, [puzzle]);

  const getWordBoundaries = (x: number, y: number, vertical: boolean): WordHighlight | null => {
    if (!puzzle?.tables?.wordHelpers) return null;

    try {
      if (vertical) {
        const startY = y + puzzle.tables.wordHelpers.vertical.startOffset[y][x];
        const endY = y + puzzle.tables.wordHelpers.vertical.endOffset[y][x];
        return { startX: x, endX: x, startY, endY, isVertical: true };
      } else {
        const startX = x + puzzle.tables.wordHelpers.horizontal.startOffset[y][x];
        const endX = x + puzzle.tables.wordHelpers.horizontal.endOffset[y][x];
        return { startX, endX, startY: y, endY: y, isVertical: false };
      }
    } catch {
      // Return null on boundary calculation errors - UI will gracefully degrade
      return null;
    }
  };

  const handleCellClick = (x: number, y: number) => {
    if (!puzzle?.tables?.emptyGrid?.[y]?.[x]?.isBlocked) {
      if (selectedCell?.x === x && selectedCell?.y === y) {
        // Same cell clicked - toggle direction
        setIsVertical(!isVertical);
        const newHighlight = getWordBoundaries(x, y, !isVertical);
        if (newHighlight) setHighlight(newHighlight);
      } else {
        // New cell clicked
        setSelectedCell({ x, y });
        setIsVertical(false);
        const newHighlight = getWordBoundaries(x, y, false);
        if (newHighlight) setHighlight(newHighlight);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, x: number, y: number) => {
    if (!selectedCell || !puzzle?.tables?.emptyGrid?.[y]?.[x]) return;

    if (event.key === 'Tab' || event.key === ' ') {
      // Toggle direction
      event.preventDefault();
      setIsVertical(!isVertical);
      const newHighlight = getWordBoundaries(x, y, !isVertical);
      if (newHighlight) setHighlight(newHighlight);
      return;
    }

    if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
      const newValue = event.key.toUpperCase();
      onCellChange(y, x, newValue);

      // Move to next cell
      if (!highlight) return;
      
      const { startX, startY, endX, endY } = highlight;
      let nextX = x;
      let nextY = y;

      if (isVertical) {
        nextY = y < endY ? y + 1 : startY;
      } else {
        nextX = x < endX ? x + 1 : startX;
      }

      if (puzzle.tables.emptyGrid?.[nextY]?.[nextX] && !puzzle.tables.emptyGrid[nextY][nextX].isBlocked) {
        setSelectedCell({ x: nextX, y: nextY });
        const newHighlight = getWordBoundaries(nextX, nextY, isVertical);
        if (newHighlight) setHighlight(newHighlight);
      }
    }
  };

  const getCellStyle = (x: number, y: number) => {
    const cell = puzzle.tables.emptyGrid?.[y]?.[x];
    if (!cell) return {};

    const isBlocked = cell.isBlocked;
    const isSelected = selectedCell?.x === x && selectedCell?.y === y;
    const isHighlighted = highlight && 
      x >= highlight.startX && x <= highlight.endX &&
      y >= highlight.startY && y <= highlight.endY;

    return {
      width: puzzle.gridConfig.cellWidth,
      height: puzzle.gridConfig.cellHeight,
      border: `1px solid ${theme.colors.border}`,
      backgroundColor: isBlocked ? theme.colors.text.primary :
                     isSelected ? `${theme.colors.primary}20` :
                     isHighlighted ? `${theme.colors.primary}10` : theme.colors.surface,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: theme.typography.fontSize.large,
      fontFamily: theme.typography.fontFamily,
      cursor: isBlocked ? 'default' : 'pointer',
      outline: isSelected ? `2px solid ${theme.colors.primary}` : 'none',
      color: theme.colors.text.primary,
      transition: 'all 0.2s ease'
    };
  };

  if (!puzzle?.tables?.emptyGrid) {
    return (
      <div style={{ 
        padding: theme.spacing.xl,
        color: theme.colors.text.primary,
        textAlign: 'center',
        fontFamily: theme.typography.fontFamily
      }}>
        Loading puzzle grid...
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${puzzle.gridConfig.columns}, ${puzzle.gridConfig.cellWidth}px)`,
      gap: '1px',
      backgroundColor: theme.colors.border,
      padding: '2px',
      borderRadius: theme.borderRadius.small,
      boxShadow: theme.shadows.medium
    }}>
      {userGrid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            style={getCellStyle(x, y)}
            onClick={() => handleCellClick(x, y)}
            onKeyDown={(e) => handleKeyPress(e, x, y)}
            tabIndex={cell.isBlocked ? -1 : 0}
          >
            {cell.value}
          </div>
        ))
      )}
    </div>
  );
};
