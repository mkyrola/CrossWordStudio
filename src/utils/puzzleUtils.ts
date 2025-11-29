import { GridCell } from '../types/grid';
import { CrosswordPuzzle, PuzzleCell, PuzzleWord } from '../types/puzzle';

interface WordPosition {
  number: number;
  startX: number;
  startY: number;
  length: number;
  direction: 'across' | 'down';
}

export const findWords = (grid: GridCell[][]): WordPosition[] => {
  const words: WordPosition[] = [];
  let currentNumber = 1;
  const height = grid.length;
  const width = grid[0]?.length || 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      if (cell.isBlocked) continue;

      // Check if this cell starts an across word
      const isAcrossStart = x === 0 || grid[y][x - 1]?.isBlocked;
      if (isAcrossStart && x < width - 1 && !grid[y][x + 1]?.isBlocked) {
        // Find word length
        let length = 1;
        while (x + length < width && !grid[y][x + length]?.isBlocked) {
          length++;
        }
        if (length > 1) {
          words.push({
            number: currentNumber,
            startX: x,
            startY: y,
            length,
            direction: 'across'
          });
        }
      }

      // Check if this cell starts a down word
      const isDownStart = y === 0 || grid[y - 1][x]?.isBlocked;
      if (isDownStart && y < height - 1 && !grid[y + 1][x]?.isBlocked) {
        // Find word length
        let length = 1;
        while (y + length < height && !grid[y + length][x]?.isBlocked) {
          length++;
        }
        if (length > 1) {
          words.push({
            number: currentNumber,
            startX: x,
            startY: y,
            length,
            direction: 'down'
          });
        }
      }

      // Increment number only if we found at least one word
      if ((isAcrossStart && x < width - 1 && !grid[y][x + 1]?.isBlocked) ||
          (isDownStart && y < height - 1 && !grid[y + 1][x]?.isBlocked)) {
        currentNumber++;
      }
    }
  }

  return words;
};

export const gridToPuzzleCells = (grid: GridCell[][]): PuzzleCell[] => {
  const cells: PuzzleCell[] = [];
  const words = findWords(grid);
  const height = grid.length;
  const width = grid[0]?.length || 0;

  // Create a map of cell positions to word numbers
  const cellWordMap = new Map<string, { across?: number; down?: number }>();
  words.forEach(word => {
    for (let i = 0; i < word.length; i++) {
      const x = word.direction === 'across' ? word.startX + i : word.startX;
      const y = word.direction === 'down' ? word.startY + i : word.startY;
      const key = `${x},${y}`;
      const existing = cellWordMap.get(key) || {};
      cellWordMap.set(key, {
        ...existing,
        [word.direction]: word.number
      });
    }
  });

  // Create puzzle cells with word references
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      const wordRefs = cellWordMap.get(`${x},${y}`) || {};
      const number = words.find(w => w.startX === x && w.startY === y)?.number;

      cells.push({
        x,
        y,
        letter: cell.letter || '',
        isBlocked: cell.isBlocked || false,
        number,
        wordRefs
      });
    }
  }

  return cells;
};

export const createPuzzle = (
  grid: GridCell[][],
  name: string
): CrosswordPuzzle => {
  const height = grid.length;
  const width = grid[0]?.length || 0;
  const cells = gridToPuzzleCells(grid);
  const wordPositions = findWords(grid);

  // Create puzzle words
  const words: PuzzleWord[] = wordPositions.map(pos => ({
    ...pos,
    answer: Array.from({ length: pos.length }, (_, i) => {
      const x = pos.direction === 'across' ? pos.startX + i : pos.startX;
      const y = pos.direction === 'down' ? pos.startY + i : pos.startY;
      return grid[y][x].letter || '';
    }).join('')
  }));

  return {
    name,
    dimensions: { width, height },
    cells,
    words,
    version: '1.0.0'
  };
};

export const savePuzzle = async (puzzle: CrosswordPuzzle): Promise<void> => {
  const jsonString = JSON.stringify(puzzle, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Get puzzle name from name field or metadata, fallback to 'crossword'
  const puzzleName = puzzle.name || puzzle.metadata?.name || 'crossword';
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${puzzleName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
