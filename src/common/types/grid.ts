export interface GridCell {
  letter: string;
  isBlocked: boolean;
  number?: number;
}

export interface GridDimensions {
  rows: number;
  columns: number;
  cellWidth: number;
  cellHeight: number;
}

export interface GridOffset {
  x: number;
  y: number;
}

export interface WordHighlight {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isVertical: boolean;
}

export interface GridConfig {
  theme: {
    cellBorderColor: string;
    cellBackgroundColor: string;
    blockedCellColor: string;
    highlightColor: string;
  };
}
