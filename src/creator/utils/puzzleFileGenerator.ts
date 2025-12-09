import { GridCell } from '../../common/types/grid';
import JSZip from 'jszip';

interface PuzzleFiles {
  emptyGrid: string;
  solutionMatrix: string;
  horizontalStartOffset: string;
  horizontalEndOffset: string;
  verticalStartOffset: string;
  verticalEndOffset: string;
}

// Helper function to convert string grid to GridCell grid
function convertToGridCells(grid: string[][]): GridCell[][] {
  return grid.map(row =>
    row.map(cell => ({
      letter: cell === '#' ? '' : cell,
      isBlocked: cell === '#',
      number: undefined
    }))
  );
}

export function generateEmptyGrid(grid: string[][]): string {
  const gridCells = convertToGridCells(grid);
  return gridCells.map(row => 
    row.map(cell => cell.isBlocked ? '#' : '').join(',')
  ).join('\n');
}

export function generateSolutionMatrix(grid: string[][]): string {
  const gridCells = convertToGridCells(grid);
  return gridCells.map(row =>
    row.map(cell => cell.isBlocked ? '#' : cell.letter).join(',')
  ).join('\n');
}

function generateOffsetTable(grid: string[][], type: 'horizontal' | 'vertical', position: 'start' | 'end'): string {
  const gridCells = convertToGridCells(grid);
  const rows = gridCells.length;
  const cols = gridCells[0].length;
  const offsetGrid: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));

  if (type === 'horizontal') {
    for (let i = 0; i < rows; i++) {
      let wordStart = -1;
      for (let j = 0; j < cols; j++) {
        if (!gridCells[i][j].isBlocked) {
          if (wordStart === -1) wordStart = j;
          if (j === cols - 1 || gridCells[i][j + 1].isBlocked) {
            // Found a word
            if (position === 'start') {
              offsetGrid[i][wordStart] = 1;
            } else {
              offsetGrid[i][j] = 1;
            }
            wordStart = -1;
          }
        } else {
          wordStart = -1;
        }
      }
    }
  } else {
    for (let j = 0; j < cols; j++) {
      let wordStart = -1;
      for (let i = 0; i < rows; i++) {
        if (!gridCells[i][j].isBlocked) {
          if (wordStart === -1) wordStart = i;
          if (i === rows - 1 || gridCells[i + 1][j].isBlocked) {
            // Found a word
            if (position === 'start') {
              offsetGrid[wordStart][j] = 1;
            } else {
              offsetGrid[i][j] = 1;
            }
            wordStart = -1;
          }
        } else {
          wordStart = -1;
        }
      }
    }
  }

  return offsetGrid.map(row => row.join(',')).join('\n');
}

export function generatePuzzleFiles(grid: string[][]): PuzzleFiles {
  return {
    emptyGrid: generateEmptyGrid(grid),
    solutionMatrix: generateSolutionMatrix(grid),
    horizontalStartOffset: generateOffsetTable(grid, 'horizontal', 'start'),
    horizontalEndOffset: generateOffsetTable(grid, 'horizontal', 'end'),
    verticalStartOffset: generateOffsetTable(grid, 'vertical', 'start'),
    verticalEndOffset: generateOffsetTable(grid, 'vertical', 'end')
  };
}

/**
 * Save puzzle files as a ZIP download
 */
export async function savePuzzleFiles(
  puzzleName: string,
  files: PuzzleFiles,
  imageBlob: Blob
): Promise<void> {
  const zip = new JSZip();
  
  // Create a folder for the puzzle
  const folder = zip.folder(puzzleName);
  
  if (!folder) {
    throw new Error('Failed to create ZIP folder');
  }
  
  // Add all CSV files to the ZIP
  folder.file('Empty_Character_Grid.csv', files.emptyGrid);
  folder.file('Solution_Matrix.csv', files.solutionMatrix);
  folder.file('Helper_Table_1_Horizontal_Start.csv', files.horizontalStartOffset);
  folder.file('Helper_Table_2_Horizontal_End.csv', files.horizontalEndOffset);
  folder.file('Helper_Table_3_Vertical_Start.csv', files.verticalStartOffset);
  folder.file('Helper_Table_4_Vertical_End.csv', files.verticalEndOffset);
  
  // Add image to the ZIP
  folder.file('puzzle.png', imageBlob);
  
  // Generate the ZIP file
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  
  // Download the ZIP file
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${puzzleName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
