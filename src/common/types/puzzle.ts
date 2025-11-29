/**
 * Represents a word in the crossword puzzle
 */
export interface PuzzleWord {
  /** Unique identifier for the word (optional for legacy support) */
  id?: string;
  /** The clue number */
  number: number;
  /** The clue text (optional for solution-only puzzles) */
  clue?: string;
  /** The answer/solution */
  answer: string;
  /** Starting X position (column) */
  startX: number;
  /** Starting Y position (row) */
  startY: number;
  /** Length of the word */
  length: number;
  /** Direction of the word */
  direction: 'across' | 'down';
}

/**
 * Represents a single cell in the puzzle grid
 */
export interface PuzzleCell {
  x: number;
  y: number;
  letter: string;
  isBlocked: boolean;
  number?: number;
  wordRefs: {
    across?: number;
    down?: number;
  };
}

/**
 * Represents a clue for a word
 */
export interface PuzzleClue {
  number: number;
  clue: string;
  direction: 'across' | 'down';
}

/**
 * Puzzle metadata information
 */
export interface PuzzleMetadata {
  id?: string;
  name: string;
  author?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  date?: string;
}

/**
 * Complete crossword puzzle structure
 */
export interface CrosswordPuzzle {
  /** Puzzle name (for simple puzzles without full metadata) */
  name?: string;
  /** Full metadata (optional) */
  metadata?: PuzzleMetadata;
  /** Grid dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** All cells in the puzzle */
  cells: PuzzleCell[];
  /** All words in the puzzle */
  words: PuzzleWord[];
  /** Schema version */
  version: string;
}
