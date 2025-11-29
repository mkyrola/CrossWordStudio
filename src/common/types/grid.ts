/**
 * Represents a single cell in a crossword grid
 */
export interface GridCell {
  /** The letter in this cell (empty string if no letter) */
  letter: string;
  /** Whether this cell is blocked (black square) */
  isBlocked?: boolean;
  /** The clue number displayed in this cell, if any */
  number?: number | null;
}

/**
 * Dimensions of a crossword grid
 */
export interface GridDimensions {
  rows: number;
  columns: number;
  cellWidth: number;
  cellHeight: number;
}

/**
 * Grid offset from origin (used for positioning overlay)
 */
export interface GridOffset {
  x: number;
  y: number;
}

/**
 * Defines a highlighted word region in the grid
 */
export interface WordHighlight {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isVertical: boolean;
}

/**
 * Grid theming configuration
 */
export interface GridConfig {
  theme: {
    cellBorderColor: string;
    cellBackgroundColor: string;
    blockedCellColor: string;
    highlightColor: string;
  };
}
