import { PuzzleData } from '../types/puzzleData';

export function parseCSV(content: string): string[][] {
  return content
    .trim()
    .split('\n')
    .map(line => line.split(',').map(cell => cell.trim()));
}

export async function loadPuzzleData(puzzleId: string): Promise<PuzzleData> {
  // Load CSV files using fetch
  const loadCSV = async (filename: string) => {
    const response = await fetch(`/puzzles/${puzzleId}/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    const text = await response.text();
    return parseCSV(text);
  };

  const [solution, emptyGrid, helper1, helper2, helper3, helper4] = await Promise.all([
    loadCSV('Solution_Matrix.csv'),
    loadCSV('Empty_Character_Grid_with_Coordinates.csv'),
    loadCSV('Helper_Table_1__Horizontal_Start_Offset_.csv'),
    loadCSV('Helper_Table_2__Horizontal_End_Offset_.csv'),
    loadCSV('Helper_Table_3__Vertical_Start_Offset_.csv'),
    loadCSV('Helper_Table_4__Vertical_End_Offset_.csv'),
  ]);

  // Convert empty grid to required format
  const formattedEmptyGrid = emptyGrid.map(row =>
    row.map(cell => ({
      value: cell === '#' ? '#' : '',
      isBlocked: cell === '#'
    }))
  );

  // Convert helper tables to numbers
  const convertToNumberGrid = (grid: string[][]): number[][] =>
    grid.map(row => row.map(cell => parseInt(cell, 10) || 0));

  const puzzleData: PuzzleData = {
    id: puzzleId,
    name: puzzleId.replace(/-/g, ' '),
    
    image: {
      src: `/puzzles/${puzzleId}/puzzle.jpg`,
      width: 800,
      height: 600
    },

    gridConfig: {
      rows: solution.length,
      columns: solution[0].length,
      cellWidth: 40,
      cellHeight: 40,
      offsetX: 0,
      offsetY: 0
    },

    tables: {
      solutionGrid: solution,
      emptyGrid: formattedEmptyGrid,
      wordHelpers: {
        horizontal: {
          startOffset: convertToNumberGrid(helper1),
          endOffset: convertToNumberGrid(helper2)
        },
        vertical: {
          startOffset: convertToNumberGrid(helper3),
          endOffset: convertToNumberGrid(helper4)
        }
      }
    }
  };

  return puzzleData;
}
