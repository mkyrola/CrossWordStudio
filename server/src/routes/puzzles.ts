import express from 'express';
import { z } from 'zod';

// Local type definition to avoid importing from outside server rootDir
interface PuzzleWord {
  number: number;
  direction: 'across' | 'down';
  startX: number;
  startY: number;
  length: number;
  answer: string;
}

const router = express.Router();

// Validation schemas
const puzzleWordSchema = z.object({
  number: z.number().int().positive(),
  direction: z.enum(['across', 'down']),
  startX: z.number().int().min(0),
  startY: z.number().int().min(0),
  length: z.number().int().min(1).max(50),
  answer: z.string().min(1).max(50).regex(/^[A-ZÄÖÅ]+$/, 'Answer must be uppercase letters only')
});

const puzzleDimensionsSchema = z.object({
  rows: z.number().int().min(5).max(50),
  columns: z.number().int().min(5).max(50),
  cellWidth: z.number().int().min(10).max(100).optional(),
  cellHeight: z.number().int().min(10).max(100).optional()
});

const createPuzzleSchema = z.object({
  title: z.string().min(1).max(100).trim(),
  dimensions: puzzleDimensionsSchema,
  words: z.array(puzzleWordSchema).min(1).max(500)
});

const validateSolutionSchema = z.object({
  solution: z.record(z.string().max(50))
});

// ID parameter validation
const idParamSchema = z.string().regex(/^\d+$/, 'ID must be a number');

// Sample puzzle data
const samplePuzzles: Array<{
  id: string;
  title: string;
  dimensions: z.infer<typeof puzzleDimensionsSchema>;
  words: PuzzleWord[];
}> = [
  {
    id: '1',
    title: 'Sample Puzzle 1',
    dimensions: {
      rows: 15,
      columns: 15,
      cellWidth: 40,
      cellHeight: 40
    },
    words: [
      {
        number: 1,
        direction: 'across',
        startX: 0,
        startY: 0,
        length: 5,
        answer: 'HELLO'
      },
      {
        number: 2,
        direction: 'down',
        startX: 0,
        startY: 0,
        length: 5,
        answer: 'HAPPY'
      }
    ] as PuzzleWord[]
  }
];

// Get all puzzles
router.get('/', (_req, res) => {
  // Return only public fields, not answers
  const publicPuzzles = samplePuzzles.map(({ id, title, dimensions, words }) => ({
    id,
    title,
    dimensions,
    wordCount: words.length
  }));
  res.json(publicPuzzles);
});

// Get puzzle by ID
router.get('/:id', (req, res) => {
  // Validate ID parameter
  const idResult = idParamSchema.safeParse(req.params.id);
  if (!idResult.success) {
    return res.status(400).json({ error: 'Invalid puzzle ID format' });
  }

  const puzzle = samplePuzzles.find(p => p.id === req.params.id);
  if (!puzzle) {
    return res.status(404).json({ error: 'Puzzle not found' });
  }
  
  // Return puzzle without answers for security
  const { words, ...puzzleWithoutAnswers } = puzzle;
  res.json({
    ...puzzleWithoutAnswers,
    words: words.map(({ answer, ...word }) => word)
  });
});

// Create new puzzle
router.post('/', (req, res) => {
  // Validate request body
  const result = createPuzzleSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Invalid puzzle data',
      details: result.error.issues.map((i: z.ZodIssue) => ({
        path: i.path.join('.'),
        message: i.message
      }))
    });
  }

  const newPuzzle = {
    id: (samplePuzzles.length + 1).toString(),
    ...result.data
  };
  samplePuzzles.push(newPuzzle);
  res.status(201).json({ id: newPuzzle.id, title: newPuzzle.title });
});

// Validate puzzle solution
router.post('/:id/validate', (req, res) => {
  // Validate ID parameter
  const idResult = idParamSchema.safeParse(req.params.id);
  if (!idResult.success) {
    return res.status(400).json({ error: 'Invalid puzzle ID format' });
  }

  const puzzle = samplePuzzles.find(p => p.id === req.params.id);
  if (!puzzle) {
    return res.status(404).json({ error: 'Puzzle not found' });
  }

  // Validate request body
  const bodyResult = validateSolutionSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ 
      error: 'Invalid solution format',
      details: bodyResult.error.issues.map((i: z.ZodIssue) => ({
        path: i.path.join('.'),
        message: i.message
      }))
    });
  }

  const userSolution = bodyResult.data.solution;
  const results = puzzle.words.map(word => ({
    number: word.number,
    direction: word.direction,
    isCorrect: userSolution[`${word.number}-${word.direction}`]?.toUpperCase() === word.answer
  }));

  res.json({
    isComplete: results.every(r => r.isCorrect),
    results
  });
});

export const puzzleRoutes = router;
