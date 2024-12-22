import { GridCell, GridDimensions } from '../../common/types/grid';

export interface SolverPuzzle {
  id: string;
  image: string;  // Base64 or URL of the puzzle image
  grid: GridCell[][];
  dimensions: GridDimensions;
}

export interface SolverProgress {
  puzzleId: string;
  userGrid: GridCell[][];
  lastUpdated: string;
}

// Helper structure for word handling
export interface WordLocation {
  startRow: number;
  startCol: number;
  length: number;
  direction: 'across' | 'down';
  number?: number;
}
