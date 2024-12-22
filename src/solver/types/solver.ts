import { PuzzleWord } from '../../common/types/puzzle';

export interface SolverState {
  currentWord?: {
    number: number;
    direction: 'across' | 'down';
  };
  progress: {
    [key: string]: string; // Format: "1-across" or "2-down" -> user input
  };
}

export interface WordProgress {
  word: PuzzleWord;
  userInput: string;
  isComplete: boolean;
  isCorrect: boolean;
}
