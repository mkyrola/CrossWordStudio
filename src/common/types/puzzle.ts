export interface PuzzleWord {
  number: number;
  direction: 'across' | 'down';
  startX: number;
  startY: number;
  length: number;
  answer: string;
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
