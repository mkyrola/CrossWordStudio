export interface PuzzleWord {
  id: string;
  number: number;
  clue: string;
  answer: string;
  startX: number;
  startY: number;
  length: number;
  direction: 'across' | 'down';
}

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

export interface PuzzleClue {
  number: number;
  clue: string;
  direction: 'across' | 'down';
}

export interface PuzzleMetadata {
  id: string;
  name: string;
  author: string;
  difficulty: 'easy' | 'medium' | 'hard';
  date: string;
}

export interface CrosswordPuzzle {
  metadata: PuzzleMetadata;
  dimensions: {
    width: number;
    height: number;
  };
  cells: PuzzleCell[];
  words: PuzzleWord[];
  version: string;
}
