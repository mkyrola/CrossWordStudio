export interface GridCell {
  letter: string;
  isBlocked?: boolean;
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
