import React, { useState, useEffect } from 'react';
import { PuzzleManager } from '../components/PuzzleManager';
import { loadPuzzleData } from '../utils/csvConverter';
import { PuzzleData } from '../types/puzzleData';
import theme from '../../styles/theme';

interface SolverState {
  progress: number;
  error: string | null;
}

const saveProgress = (puzzleId: string, grid: PuzzleData['tables']['emptyGrid']) => {
  localStorage.setItem(`puzzle_${puzzleId}_progress`, JSON.stringify(grid));
};

const loadSavedProgress = (puzzleId: string): PuzzleData['tables']['emptyGrid'] | null => {
  const saved = localStorage.getItem(`puzzle_${puzzleId}_progress`);
  return saved ? JSON.parse(saved) : null;
};

export const Solver: React.FC = () => {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        const puzzleData = await loadPuzzleData('christmas-2024');
        
        // Try to load saved progress
        try {
          const savedProgress = loadSavedProgress(puzzleData.id);
          if (savedProgress) {
            puzzleData.tables.emptyGrid = savedProgress;
          }
        } catch (err) {
          setError((err as Error).message);
        }

        setPuzzle(puzzleData);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    loadPuzzle();
  }, []);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (!puzzle) return;

    const newGrid = puzzle.tables.emptyGrid.map((gridRow, i) =>
      gridRow.map((cell, j) => {
        if (i === row && j === col) {
          return { ...cell, value };
        }
        return cell;
      })
    );

    setPuzzle({
      ...puzzle,
      tables: {
        ...puzzle.tables,
        emptyGrid: newGrid
      }
    });

    saveProgress(puzzle.id, newGrid);

    // Update progress percentage
    const totalCells = newGrid.flat().filter(cell => !cell.isBlocked).length;
    const filledCells = newGrid.flat().filter(cell => !cell.isBlocked && cell.value !== '').length;
    setProgress(Math.round((filledCells / totalCells) * 100));
  };

  const handleClear = () => {
    if (!puzzle) return;

    const emptyGrid = puzzle.tables.emptyGrid.map(row =>
      row.map(cell => ({
        ...cell,
        value: cell.isBlocked ? '#' : ''
      }))
    );

    setPuzzle({
      ...puzzle,
      tables: {
        ...puzzle.tables,
        emptyGrid
      }
    });

    localStorage.removeItem(`puzzle_${puzzle.id}_progress`);
    setProgress(0);
  };

  if (error) {
    return (
      <div style={{ 
        padding: theme.spacing.xl,
        color: theme.colors.error,
        textAlign: 'center',
        fontFamily: theme.typography.fontFamily
      }}>
        Error: {error}
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div style={{ 
        padding: theme.spacing.xl,
        color: theme.colors.text.primary,
        textAlign: 'center',
        fontFamily: theme.typography.fontFamily
      }}>
        Loading puzzle...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      fontFamily: theme.typography.fontFamily
    }}>
      <h1 style={{ 
        fontSize: theme.typography.fontSize.xlarge,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg
      }}>
        {puzzle.name}
      </h1>
      
      <div style={{ 
        marginBottom: theme.spacing.md,
        fontSize: theme.typography.fontSize.large,
        color: theme.colors.text.secondary
      }}>
        Progress: {progress}%
      </div>

      <button 
        onClick={handleClear}
        style={{
          marginBottom: theme.spacing.lg,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          backgroundColor: theme.colors.secondary,
          color: theme.colors.text.inverse,
          border: 'none',
          borderRadius: theme.borderRadius.small,
          cursor: 'pointer',
          fontSize: theme.typography.fontSize.medium,
          fontFamily: theme.typography.fontFamily,
          boxShadow: theme.shadows.small,
          transition: 'all 0.2s ease'
        }}
      >
        Clear Grid
      </button>

      <PuzzleManager
        puzzle={puzzle}
        onCellChange={handleCellChange}
      />
    </div>
  );
};
