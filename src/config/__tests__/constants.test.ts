import { 
  GRID_CONFIG, 
  IMAGE_CONFIG, 
  DETECTION_CONFIG, 
  AUDIO_CONFIG, 
  API_CONFIG, 
  STORAGE_KEYS, 
  UI_TIMING, 
  FILE_NAMES 
} from '../constants';

describe('constants', () => {
  describe('GRID_CONFIG', () => {
    it('should have valid default grid dimensions', () => {
      expect(GRID_CONFIG.DEFAULT_WIDTH).toBeGreaterThan(0);
      expect(GRID_CONFIG.DEFAULT_HEIGHT).toBeGreaterThan(0);
      expect(GRID_CONFIG.DEFAULT_CELL_SIZE).toBeGreaterThan(0);
    });

    it('should have reasonable min/max values', () => {
      expect(GRID_CONFIG.MIN_CELLS).toBeLessThan(GRID_CONFIG.MAX_CELLS);
      expect(GRID_CONFIG.MIN_CELL_SIZE).toBeLessThan(GRID_CONFIG.MAX_CELL_SIZE);
    });

    it('should have default values within min/max range', () => {
      expect(GRID_CONFIG.DEFAULT_WIDTH).toBeGreaterThanOrEqual(GRID_CONFIG.MIN_CELLS);
      expect(GRID_CONFIG.DEFAULT_WIDTH).toBeLessThanOrEqual(GRID_CONFIG.MAX_CELLS);
      expect(GRID_CONFIG.DEFAULT_CELL_SIZE).toBeGreaterThanOrEqual(GRID_CONFIG.MIN_CELL_SIZE);
      expect(GRID_CONFIG.DEFAULT_CELL_SIZE).toBeLessThanOrEqual(GRID_CONFIG.MAX_CELL_SIZE);
    });
  });

  describe('IMAGE_CONFIG', () => {
    it('should have allowed image types', () => {
      expect(IMAGE_CONFIG.ALLOWED_TYPES).toContain('image/jpeg');
      expect(IMAGE_CONFIG.ALLOWED_TYPES).toContain('image/png');
    });

    it('should have valid minimum dimensions', () => {
      expect(IMAGE_CONFIG.MIN_WIDTH).toBeGreaterThan(0);
      expect(IMAGE_CONFIG.MIN_HEIGHT).toBeGreaterThan(0);
    });
  });

  describe('DETECTION_CONFIG', () => {
    it('should have valid edge detection threshold', () => {
      expect(DETECTION_CONFIG.EDGE_THRESHOLD).toBeGreaterThan(0);
    });

    it('should have valid default cell size', () => {
      expect(DETECTION_CONFIG.DEFAULT_CELL_SIZE).toBeGreaterThan(0);
    });
  });

  describe('AUDIO_CONFIG', () => {
    it('should have valid default volume', () => {
      expect(AUDIO_CONFIG.DEFAULT_VOLUME).toBeGreaterThanOrEqual(0);
      expect(AUDIO_CONFIG.DEFAULT_VOLUME).toBeLessThanOrEqual(1);
    });

    it('should have available songs', () => {
      expect(AUDIO_CONFIG.AVAILABLE_SONGS).toBeDefined();
      expect(Array.isArray(AUDIO_CONFIG.AVAILABLE_SONGS)).toBe(true);
      expect(AUDIO_CONFIG.AVAILABLE_SONGS.length).toBeGreaterThan(0);
    });
  });

  describe('API_CONFIG', () => {
    it('should have base URL defined', () => {
      expect(API_CONFIG.BASE_URL).toBeDefined();
      expect(typeof API_CONFIG.BASE_URL).toBe('string');
    });

    it('should have puzzles path defined', () => {
      expect(API_CONFIG.PUZZLES_PATH).toBeDefined();
      expect(typeof API_CONFIG.PUZZLES_PATH).toBe('string');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have puzzle progress key prefix', () => {
      expect(STORAGE_KEYS.PUZZLE_PROGRESS_PREFIX).toBeDefined();
      expect(typeof STORAGE_KEYS.PUZZLE_PROGRESS_PREFIX).toBe('string');
    });

    it('should have puzzle progress key suffix', () => {
      expect(STORAGE_KEYS.PUZZLE_PROGRESS_SUFFIX).toBeDefined();
      expect(typeof STORAGE_KEYS.PUZZLE_PROGRESS_SUFFIX).toBe('string');
    });
  });

  describe('UI_TIMING', () => {
    it('should have valid toast duration', () => {
      expect(UI_TIMING.TOAST_DURATION).toBeGreaterThan(0);
      // Should be reasonable (between 1 and 10 seconds)
      expect(UI_TIMING.TOAST_DURATION).toBeGreaterThanOrEqual(1000);
      expect(UI_TIMING.TOAST_DURATION).toBeLessThanOrEqual(10000);
    });

    it('should have valid animation durations', () => {
      expect(UI_TIMING.ANIMATION_DURATION).toBeGreaterThan(0);
    });

    it('should have valid debounce delay', () => {
      expect(UI_TIMING.DEBOUNCE_DELAY).toBeGreaterThan(0);
    });
  });

  describe('FILE_NAMES', () => {
    it('should have valid file extensions', () => {
      expect(FILE_NAMES.SOLUTION_MATRIX).toContain('.csv');
      expect(FILE_NAMES.PUZZLE_IMAGE).toMatch(/\.(jpg|jpeg|png)$/);
    });

    it('should have all helper table files defined', () => {
      expect(FILE_NAMES.HORIZONTAL_START).toContain('.csv');
      expect(FILE_NAMES.HORIZONTAL_END).toContain('.csv');
      expect(FILE_NAMES.VERTICAL_START).toContain('.csv');
      expect(FILE_NAMES.VERTICAL_END).toContain('.csv');
    });
  });
});
