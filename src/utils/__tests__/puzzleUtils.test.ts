import { findWords, gridToPuzzleCells, createPuzzle } from '../puzzleUtils';
import { GridCell } from '../../types/grid';

describe('puzzleUtils', () => {
  describe('findWords', () => {
    it('should find horizontal words', () => {
      const grid: GridCell[][] = [
        [{ letter: 'H', isBlocked: false }, { letter: 'I', isBlocked: false }, { letter: '', isBlocked: true }],
        [{ letter: '', isBlocked: true }, { letter: '', isBlocked: true }, { letter: '', isBlocked: true }],
      ];

      const words = findWords(grid);
      
      expect(words).toHaveLength(1);
      expect(words[0]).toEqual({
        number: 1,
        startX: 0,
        startY: 0,
        length: 2,
        direction: 'across',
      });
    });

    it('should find vertical words', () => {
      const grid: GridCell[][] = [
        [{ letter: 'H', isBlocked: false }, { letter: '', isBlocked: true }],
        [{ letter: 'I', isBlocked: false }, { letter: '', isBlocked: true }],
        [{ letter: '', isBlocked: true }, { letter: '', isBlocked: true }],
      ];

      const words = findWords(grid);
      
      expect(words).toHaveLength(1);
      expect(words[0]).toEqual({
        number: 1,
        startX: 0,
        startY: 0,
        length: 2,
        direction: 'down',
      });
    });

    it('should find both across and down words starting from same cell', () => {
      const grid: GridCell[][] = [
        [{ letter: 'A', isBlocked: false }, { letter: 'B', isBlocked: false }],
        [{ letter: 'C', isBlocked: false }, { letter: '', isBlocked: true }],
      ];

      const words = findWords(grid);
      
      expect(words).toHaveLength(2);
      expect(words).toContainEqual({
        number: 1,
        startX: 0,
        startY: 0,
        length: 2,
        direction: 'across',
      });
      expect(words).toContainEqual({
        number: 1,
        startX: 0,
        startY: 0,
        length: 2,
        direction: 'down',
      });
    });

    it('should handle empty grid', () => {
      const grid: GridCell[][] = [];
      const words = findWords(grid);
      expect(words).toHaveLength(0);
    });

    it('should handle grid with only blocked cells', () => {
      const grid: GridCell[][] = [
        [{ letter: '', isBlocked: true }, { letter: '', isBlocked: true }],
        [{ letter: '', isBlocked: true }, { letter: '', isBlocked: true }],
      ];

      const words = findWords(grid);
      expect(words).toHaveLength(0);
    });

    it('should not count single cells as words', () => {
      const grid: GridCell[][] = [
        [{ letter: 'A', isBlocked: false }, { letter: '', isBlocked: true }],
        [{ letter: '', isBlocked: true }, { letter: '', isBlocked: true }],
      ];

      const words = findWords(grid);
      expect(words).toHaveLength(0);
    });

    it('should handle multiple words with correct numbering', () => {
      const grid: GridCell[][] = [
        [{ letter: 'A', isBlocked: false }, { letter: 'B', isBlocked: false }, { letter: '', isBlocked: true }, { letter: 'C', isBlocked: false }, { letter: 'D', isBlocked: false }],
      ];

      const words = findWords(grid);
      
      expect(words).toHaveLength(2);
      expect(words[0].number).toBe(1);
      expect(words[1].number).toBe(2);
    });
  });

  describe('gridToPuzzleCells', () => {
    it('should convert grid to puzzle cells', () => {
      const grid: GridCell[][] = [
        [{ letter: 'A', isBlocked: false }, { letter: 'B', isBlocked: false }],
        [{ letter: 'C', isBlocked: false }, { letter: '', isBlocked: true }],
      ];

      const cells = gridToPuzzleCells(grid);
      
      expect(cells).toHaveLength(4);
      expect(cells[0]).toMatchObject({
        x: 0,
        y: 0,
        letter: 'A',
        isBlocked: false,
      });
      expect(cells[3]).toMatchObject({
        x: 1,
        y: 1,
        letter: '',
        isBlocked: true,
      });
    });

    it('should include word numbers for starting cells', () => {
      const grid: GridCell[][] = [
        [{ letter: 'A', isBlocked: false }, { letter: 'B', isBlocked: false }],
        [{ letter: '', isBlocked: true }, { letter: '', isBlocked: true }],
      ];

      const cells = gridToPuzzleCells(grid);
      
      const startCell = cells.find(c => c.x === 0 && c.y === 0);
      expect(startCell?.number).toBe(1);
    });

    it('should handle empty grid', () => {
      const grid: GridCell[][] = [];
      const cells = gridToPuzzleCells(grid);
      expect(cells).toHaveLength(0);
    });
  });

  describe('createPuzzle', () => {
    it('should create a complete puzzle object', () => {
      const grid: GridCell[][] = [
        [{ letter: 'H', isBlocked: false }, { letter: 'I', isBlocked: false }],
        [{ letter: 'A', isBlocked: false }, { letter: '', isBlocked: true }],
      ];

      const puzzle = createPuzzle(grid, 'Test Puzzle');
      
      expect(puzzle.name).toBe('Test Puzzle');
      expect(puzzle.dimensions).toEqual({ width: 2, height: 2 });
      expect(puzzle.version).toBe('1.0.0');
      expect(puzzle.cells).toHaveLength(4);
      expect(puzzle.words.length).toBeGreaterThan(0);
    });

    it('should extract word answers correctly', () => {
      const grid: GridCell[][] = [
        [{ letter: 'H', isBlocked: false }, { letter: 'I', isBlocked: false }],
        [{ letter: '', isBlocked: true }, { letter: '', isBlocked: true }],
      ];

      const puzzle = createPuzzle(grid, 'Test');
      
      const acrossWord = puzzle.words.find(w => w.direction === 'across');
      expect(acrossWord?.answer).toBe('HI');
    });

    it('should handle empty name', () => {
      const grid: GridCell[][] = [
        [{ letter: 'A', isBlocked: false }, { letter: 'B', isBlocked: false }],
      ];

      const puzzle = createPuzzle(grid, '');
      expect(puzzle.name).toBe('');
    });
  });
});
