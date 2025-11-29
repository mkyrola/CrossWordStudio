/**
 * Application configuration constants
 * Values can be overridden via environment variables prefixed with REACT_APP_
 */

// Grid configuration defaults
export const GRID_CONFIG = {
  DEFAULT_WIDTH: parseInt(process.env.REACT_APP_DEFAULT_GRID_WIDTH || '15', 10),
  DEFAULT_HEIGHT: parseInt(process.env.REACT_APP_DEFAULT_GRID_HEIGHT || '15', 10),
  MIN_CELLS: 1,
  MAX_CELLS: 50,
  DEFAULT_CELL_SIZE: 40,
  MIN_CELL_SIZE: 10,
  MAX_CELL_SIZE: 100,
  MAX_OFFSET: 500,
} as const;

// Image validation
export const IMAGE_CONFIG = {
  MIN_WIDTH: 200,
  MIN_HEIGHT: 200,
  ALLOWED_TYPES: ['image/jpeg', 'image/png'] as const,
} as const;

// Grid detection thresholds
export const DETECTION_CONFIG = {
  EDGE_THRESHOLD: 200,
  DEFAULT_CELL_SIZE: 30,
} as const;

// Audio configuration
export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: 0.3,
  AVAILABLE_SONGS: ['christmas', 'jingle-bells', 'jingle', 'song1', 'song2'] as const,
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  PUZZLES_PATH: '/puzzles',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  PUZZLE_PROGRESS_PREFIX: 'puzzle_',
  PUZZLE_PROGRESS_SUFFIX: '_progress',
} as const;

// UI timing
export const UI_TIMING = {
  TOAST_DURATION: 4000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 100,
} as const;

// File naming
export const FILE_NAMES = {
  EMPTY_GRID: 'Empty_Character_Grid_with_Coordinates.csv',
  SOLUTION_MATRIX: 'Solution_Matrix.csv',
  HORIZONTAL_START: 'Helper_Table_1__Horizontal_Start_Offset_.csv',
  HORIZONTAL_END: 'Helper_Table_2__Horizontal_End_Offset_.csv',
  VERTICAL_START: 'Helper_Table_3__Vertical_Start_Offset_.csv',
  VERTICAL_END: 'Helper_Table_4__Vertical_End_Offset_.csv',
  PUZZLE_IMAGE: 'puzzle.png',
} as const;
