import express from 'express';
import request from 'supertest';
import { puzzleRoutes } from '../puzzles';

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/puzzles', puzzleRoutes);
  return app;
};

describe('Puzzle Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /api/puzzles', () => {
    it('should return all puzzles', async () => {
      const response = await request(app).get('/api/puzzles');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return puzzles without answers', async () => {
      const response = await request(app).get('/api/puzzles');
      
      expect(response.status).toBe(200);
      // Puzzles in list should not include word answers
      response.body.forEach((puzzle: { answer?: string }) => {
        expect(puzzle.answer).toBeUndefined();
      });
    });
  });

  describe('GET /api/puzzles/:id', () => {
    it('should return puzzle by ID', async () => {
      const response = await request(app).get('/api/puzzles/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', '1');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('dimensions');
    });

    it('should return 404 for non-existent puzzle', async () => {
      const response = await request(app).get('/api/puzzles/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/puzzles/invalid');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should not include word answers in response', async () => {
      const response = await request(app).get('/api/puzzles/1');
      
      expect(response.status).toBe(200);
      if (response.body.words) {
        response.body.words.forEach((word: { answer?: string }) => {
          expect(word.answer).toBeUndefined();
        });
      }
    });
  });

  describe('POST /api/puzzles', () => {
    const validPuzzle = {
      title: 'Test Puzzle',
      dimensions: {
        rows: 15,
        columns: 15,
        cellWidth: 40,
        cellHeight: 40,
      },
      words: [
        {
          number: 1,
          direction: 'across',
          startX: 0,
          startY: 0,
          length: 5,
          answer: 'HELLO',
        },
      ],
    };

    it('should create a new puzzle with valid data', async () => {
      const response = await request(app)
        .post('/api/puzzles')
        .send(validPuzzle);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'Test Puzzle');
    });

    it('should return 400 for missing title', async () => {
      const invalidPuzzle = { ...validPuzzle, title: undefined };
      
      const response = await request(app)
        .post('/api/puzzles')
        .send(invalidPuzzle);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid dimensions', async () => {
      const invalidPuzzle = {
        ...validPuzzle,
        dimensions: { rows: 0, columns: -1 },
      };
      
      const response = await request(app)
        .post('/api/puzzles')
        .send(invalidPuzzle);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid word direction', async () => {
      const invalidPuzzle = {
        ...validPuzzle,
        words: [{ ...validPuzzle.words[0], direction: 'diagonal' }],
      };
      
      const response = await request(app)
        .post('/api/puzzles')
        .send(invalidPuzzle);
      
      expect(response.status).toBe(400);
    });

    it('should return 400 for answer with invalid characters', async () => {
      const invalidPuzzle = {
        ...validPuzzle,
        words: [{ ...validPuzzle.words[0], answer: 'hello123' }],
      };
      
      const response = await request(app)
        .post('/api/puzzles')
        .send(invalidPuzzle);
      
      expect(response.status).toBe(400);
    });

    it('should trim whitespace from title', async () => {
      const puzzleWithWhitespace = {
        ...validPuzzle,
        title: '  Test Puzzle  ',
      };
      
      const response = await request(app)
        .post('/api/puzzles')
        .send(puzzleWithWhitespace);
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test Puzzle');
    });
  });

  describe('POST /api/puzzles/:id/validate', () => {
    it('should validate correct solution', async () => {
      const solution = {
        solution: {
          '1-across': 'HELLO',
          '2-down': 'HAPPY',
        },
      };
      
      const response = await request(app)
        .post('/api/puzzles/1/validate')
        .send(solution);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isComplete');
      expect(response.body).toHaveProperty('results');
    });

    it('should return 404 for non-existent puzzle', async () => {
      const response = await request(app)
        .post('/api/puzzles/999/validate')
        .send({ solution: {} });
      
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .post('/api/puzzles/invalid/validate')
        .send({ solution: {} });
      
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing solution object', async () => {
      const response = await request(app)
        .post('/api/puzzles/1/validate')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle case-insensitive validation', async () => {
      const solution = {
        solution: {
          '1-across': 'hello', // lowercase
          '2-down': 'HAPPY',
        },
      };
      
      const response = await request(app)
        .post('/api/puzzles/1/validate')
        .send(solution);
      
      expect(response.status).toBe(200);
      // The first word should be validated correctly (case-insensitive)
    });
  });
});
