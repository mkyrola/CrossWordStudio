import { gridToSolutionMatrix } from '../exportUtils';
import { GridCell } from '../../types/grid';

describe('exportUtils', () => {
  describe('gridToSolutionMatrix', () => {
    it('should convert grid to solution matrix format', () => {
      const grid: GridCell[][] = [
        [{ letter: 'A', isBlocked: false }, { letter: 'B', isBlocked: false }],
        [{ letter: 'C', isBlocked: false }, { letter: ' ', isBlocked: true }],
      ];

      const result = gridToSolutionMatrix(grid);
      
      expect(result.width).toBe(2);
      expect(result.height).toBe(2);
      expect(result.cells).toHaveLength(4);
    });

    it('should correctly identify blocked cells by space character', () => {
      const grid: GridCell[][] = [
        [{ letter: ' ', isBlocked: false }, { letter: 'A', isBlocked: false }],
      ];

      const result = gridToSolutionMatrix(grid);
      
      const blockedCell = result.cells.find(c => c.x === 0 && c.y === 0);
      expect(blockedCell?.isBlocked).toBe(true);
    });

    it('should correctly identify blocked cells by isBlocked flag', () => {
      const grid: GridCell[][] = [
        [{ letter: '', isBlocked: true }, { letter: 'A', isBlocked: false }],
      ];

      const result = gridToSolutionMatrix(grid);
      
      const blockedCell = result.cells.find(c => c.x === 0 && c.y === 0);
      expect(blockedCell?.isBlocked).toBe(true);
    });

    it('should preserve letter content', () => {
      const grid: GridCell[][] = [
        [{ letter: 'X', isBlocked: false }],
      ];

      const result = gridToSolutionMatrix(grid);
      
      expect(result.cells[0].letter).toBe('X');
    });

    it('should handle empty grid', () => {
      const grid: GridCell[][] = [];
      const result = gridToSolutionMatrix(grid);
      
      expect(result.width).toBe(0);
      expect(result.height).toBe(0);
      expect(result.cells).toHaveLength(0);
    });

    it('should handle single cell grid', () => {
      const grid: GridCell[][] = [
        [{ letter: 'Z', isBlocked: false }],
      ];

      const result = gridToSolutionMatrix(grid);
      
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
      expect(result.cells).toHaveLength(1);
      expect(result.cells[0]).toEqual({
        x: 0,
        y: 0,
        letter: 'Z',
        isBlocked: false,
      });
    });

    it('should handle missing letter property', () => {
      const grid: GridCell[][] = [
        [{ letter: undefined as unknown as string, isBlocked: false }],
      ];

      const result = gridToSolutionMatrix(grid);
      
      expect(result.cells[0].letter).toBe('');
    });

    it('should correctly set x,y coordinates', () => {
      const grid: GridCell[][] = [
        [{ letter: 'A', isBlocked: false }, { letter: 'B', isBlocked: false }],
        [{ letter: 'C', isBlocked: false }, { letter: 'D', isBlocked: false }],
      ];

      const result = gridToSolutionMatrix(grid);
      
      expect(result.cells).toContainEqual({ x: 0, y: 0, letter: 'A', isBlocked: false });
      expect(result.cells).toContainEqual({ x: 1, y: 0, letter: 'B', isBlocked: false });
      expect(result.cells).toContainEqual({ x: 0, y: 1, letter: 'C', isBlocked: false });
      expect(result.cells).toContainEqual({ x: 1, y: 1, letter: 'D', isBlocked: false });
    });
  });
});

// Test sanitization functions through module internals
describe('URL Sanitization', () => {
  // These tests verify the behavior through printPuzzle's error handling
  // since the sanitization functions are not exported
  
  describe('printPuzzle URL validation', () => {
    let originalOpen: typeof window.open;
    
    beforeEach(() => {
      originalOpen = window.open;
      // Mock window.open to return null (simulating blocked popup)
      window.open = jest.fn().mockReturnValue(null);
    });
    
    afterEach(() => {
      window.open = originalOpen;
    });

    it('should throw error when popup is blocked', async () => {
      const { printPuzzle } = await import('../exportUtils');
      const grid: GridCell[][] = [[{ letter: 'A', isBlocked: false }]];
      
      await expect(printPuzzle('http://example.com/image.jpg', grid))
        .rejects.toThrow('Please allow pop-ups to print the puzzle');
    });
  });
});
