import { GridCell } from '../../common/types/grid';

export interface PuzzleData {
  // Basic puzzle info
  id: string;
  name: string;
  
  // Image information
  image: {
    src: string;      // Base64 or URL
    width: number;
    height: number;
  };

  // Grid configuration
  gridConfig: {
    rows: number;
    columns: number;
    cellWidth: number;
    cellHeight: number;
    offsetX: number;  // Grid offset from image left
    offsetY: number;  // Grid offset from image top
  };

  // The actual puzzle data tables
  tables: {
    // The solution matrix (correct answers)
    solutionGrid: string[][];
    
    // Empty grid with blocked cells
    emptyGrid: {
      value: string;    // Empty string or blocked cell marker
      isBlocked: boolean;
    }[][];

    // Helper tables for word highlighting
    wordHelpers: {
      horizontal: {
        startOffset: number[][];  // Helper Table 1
        endOffset: number[][];    // Helper Table 2
      };
      vertical: {
        startOffset: number[][];  // Helper Table 3
        endOffset: number[][];    // Helper Table 4
      };
    };
  };
}
