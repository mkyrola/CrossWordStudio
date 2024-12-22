import { PuzzleData } from '../types/puzzleData';

interface ValidationError {
  field: string;
  message: string;
}

export class PuzzleValidationError extends Error {
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Puzzle validation failed');
    this.errors = errors;
  }
}

export function validatePuzzleData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check basic structure
  if (!data.id) errors.push({ field: 'id', message: 'Missing puzzle ID' });
  if (!data.name) errors.push({ field: 'name', message: 'Missing puzzle name' });

  // Check image data
  if (!data.image || typeof data.image !== 'object') {
    errors.push({ field: 'image', message: 'Missing or invalid image data' });
  } else {
    if (!data.image.src) errors.push({ field: 'image.src', message: 'Missing image source' });
    if (!data.image.width) errors.push({ field: 'image.width', message: 'Missing image width' });
    if (!data.image.height) errors.push({ field: 'image.height', message: 'Missing image height' });
  }

  // Check grid configuration
  if (!data.gridConfig || typeof data.gridConfig !== 'object') {
    errors.push({ field: 'gridConfig', message: 'Missing or invalid grid configuration' });
  } else {
    if (!data.gridConfig.rows) errors.push({ field: 'gridConfig.rows', message: 'Missing grid rows' });
    if (!data.gridConfig.columns) errors.push({ field: 'gridConfig.columns', message: 'Missing grid columns' });
    if (!data.gridConfig.cellWidth) errors.push({ field: 'gridConfig.cellWidth', message: 'Missing cell width' });
    if (!data.gridConfig.cellHeight) errors.push({ field: 'gridConfig.cellHeight', message: 'Missing cell height' });
  }

  // Check tables
  if (!data.tables || typeof data.tables !== 'object') {
    errors.push({ field: 'tables', message: 'Missing or invalid tables data' });
  } else {
    // Check solution grid
    if (!Array.isArray(data.tables.solutionGrid)) {
      errors.push({ field: 'tables.solutionGrid', message: 'Missing or invalid solution grid' });
    }

    // Check empty grid
    if (!Array.isArray(data.tables.emptyGrid)) {
      errors.push({ field: 'tables.emptyGrid', message: 'Missing or invalid empty grid' });
    }

    // Check word helpers
    if (!data.tables.wordHelpers || typeof data.tables.wordHelpers !== 'object') {
      errors.push({ field: 'tables.wordHelpers', message: 'Missing or invalid word helpers' });
    } else {
      const { horizontal, vertical } = data.tables.wordHelpers;
      
      if (!horizontal || !Array.isArray(horizontal.startOffset) || !Array.isArray(horizontal.endOffset)) {
        errors.push({ field: 'tables.wordHelpers.horizontal', message: 'Invalid horizontal word helpers' });
      }
      
      if (!vertical || !Array.isArray(vertical.startOffset) || !Array.isArray(vertical.endOffset)) {
        errors.push({ field: 'tables.wordHelpers.vertical', message: 'Invalid vertical word helpers' });
      }
    }
  }

  return errors;
}

function validateGridDimensions(grid: any[][], expectedRows: number, expectedCols: number): boolean {
  if (!Array.isArray(grid) || grid.length !== expectedRows) return false;
  return grid.every(row => Array.isArray(row) && row.length === expectedCols);
}

function validateEmptyGridDimensions(grid: { value: string; isBlocked: boolean; }[][], expectedRows: number, expectedCols: number): boolean {
  if (!Array.isArray(grid) || grid.length !== expectedRows) return false;
  return grid.every(row => 
    Array.isArray(row) && 
    row.length === expectedCols &&
    row.every(cell => 
      typeof cell === 'object' &&
      'value' in cell &&
      'isBlocked' in cell
    )
  );
}

export function loadPuzzleFromJSON(jsonData: string): PuzzleData {
  try {
    const data = JSON.parse(jsonData) as PuzzleData;
    const errors = validatePuzzleData(data);
    
    if (errors.length > 0) {
      throw new PuzzleValidationError(errors);
    }
    
    return data;
  } catch (error) {
    if (error instanceof PuzzleValidationError) {
      throw error;
    }
    throw new Error('Failed to parse puzzle data: ' + (error as Error).message);
  }
}

export function validateWordBoundaries(data: PuzzleData): ValidationError[] {
  const errors: ValidationError[] = [];
  const { tables, gridConfig } = data;
  const { rows, columns } = gridConfig;

  // Helper function to check if coordinates are within grid
  const isValidPosition = (x: number, y: number) => 
    x >= 0 && x < columns && y >= 0 && y < rows;

  // Check each cell's word boundaries
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      // Skip blocked cells
      if (tables.emptyGrid[y][x].isBlocked) continue;

      // Check horizontal word boundaries
      const hStart = x + tables.wordHelpers.horizontal.startOffset[y][x];
      const hEnd = x + tables.wordHelpers.horizontal.endOffset[y][x];
      
      if (!isValidPosition(hStart, y) || !isValidPosition(hEnd, y)) {
        errors.push({
          field: `wordHelpers.horizontal[${y}][${x}]`,
          message: `Invalid horizontal word boundaries at (${x},${y})`
        });
      }

      // Check vertical word boundaries
      const vStart = y + tables.wordHelpers.vertical.startOffset[y][x];
      const vEnd = y + tables.wordHelpers.vertical.endOffset[y][x];
      
      if (!isValidPosition(x, vStart) || !isValidPosition(x, vEnd)) {
        errors.push({
          field: `wordHelpers.vertical[${y}][${x}]`,
          message: `Invalid vertical word boundaries at (${x},${y})`
        });
      }
    }
  }

  return errors;
}

// Example usage:
export function loadAndValidatePuzzle(jsonData: string): PuzzleData {
  const puzzle = loadPuzzleFromJSON(jsonData);
  const boundaryErrors = validateWordBoundaries(puzzle);
  
  if (boundaryErrors.length > 0) {
    throw new PuzzleValidationError(boundaryErrors);
  }
  
  return puzzle;
}
