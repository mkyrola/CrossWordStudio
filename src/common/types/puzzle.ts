export interface PuzzleWord {
  id: string;
  clue: string;
  answer: string;
  startX: number;
  startY: number;
  length: number;
  direction: 'across' | 'down';
  number: number;
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
