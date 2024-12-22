import { SolverProgress } from '../types/solverData';
import { GridCell } from '../../common/types/grid';

const STORAGE_KEY = 'crossword_progress';

export const saveProgress = (puzzleId: string, grid: GridCell[][]) => {
  const progress: SolverProgress = {
    puzzleId,
    userGrid: grid,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const loadProgress = (puzzleId: string): GridCell[][] | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  const progress: SolverProgress = JSON.parse(stored);
  if (progress.puzzleId !== puzzleId) return null;

  return progress.userGrid;
};

export const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
};
