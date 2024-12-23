import { GridCell } from '../../common/types/grid';

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

// Type definition for FileSystemDirectoryHandle from the File System Access API
interface FileSystemDirectoryHandle {
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: string | Blob): Promise<void>;
  close(): Promise<void>;
}

declare global {
  interface Window {
    showDirectoryPicker(options?: {
      mode?: 'read' | 'readwrite';
      startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
    }): Promise<FileSystemDirectoryHandle>;
  }
}

export async function savePuzzleFiles(
  puzzleName: string,
  files: PuzzleFiles,
  imageBlob: Blob
): Promise<void> {
  try {
    // Request permission to show file picker
    const dirHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents'
    });

    // Create puzzle directory
    const puzzleDirHandle = await dirHandle.getDirectoryHandle(puzzleName, { create: true });

    // Write a file helper
    const writeFile = async (name: string, content: string | Blob) => {
      const fileHandle = await puzzleDirHandle.getFileHandle(name, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    };

    // Write all CSV files
    await writeFile('Empty_Character_Grid_with_Coordinates.csv', files.emptyGrid);
    await writeFile('Solution_Matrix.csv', files.solutionMatrix);
    await writeFile('Helper_Table_1__Horizontal_Start_Offset_.csv', files.horizontalStartOffset);
    await writeFile('Helper_Table_2__Horizontal_End_Offset_.csv', files.horizontalEndOffset);
    await writeFile('Helper_Table_3__Vertical_Start_Offset_.csv', files.verticalStartOffset);
    await writeFile('Helper_Table_4__Vertical_End_Offset_.csv', files.verticalEndOffset);

    // Write image file
    await writeFile('puzzle.png', imageBlob);

  } catch (error) {
    console.error('Error saving puzzle files:', error);
    throw new Error('Failed to save puzzle files. Please try again.');
  }
}
