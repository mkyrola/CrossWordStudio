import express from 'express';
import { PuzzleWord } from '../../../src/common/types/puzzle';

const router = express.Router();

// Sample puzzle data
const samplePuzzles = [
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
router.get('/', (req, res) => {
  res.json(samplePuzzles);
});

// Get puzzle by ID
router.get('/:id', (req, res) => {
  const puzzle = samplePuzzles.find(p => p.id === req.params.id);
  if (!puzzle) {
    return res.status(404).json({ error: 'Puzzle not found' });
  }
  res.json(puzzle);
});

// Create new puzzle
router.post('/', (req, res) => {
  const newPuzzle = {
    id: (samplePuzzles.length + 1).toString(),
    ...req.body
  };
  samplePuzzles.push(newPuzzle);
  res.status(201).json(newPuzzle);
});

// Validate puzzle solution
router.post('/:id/validate', (req, res) => {
  const puzzle = samplePuzzles.find(p => p.id === req.params.id);
  if (!puzzle) {
    return res.status(404).json({ error: 'Puzzle not found' });
  }

  const userSolution = req.body.solution;
  const results = puzzle.words.map(word => ({
    number: word.number,
    direction: word.direction,
    isCorrect: userSolution[`${word.number}-${word.direction}`] === word.answer
  }));

  res.json({
    isComplete: results.every(r => r.isCorrect),
    results
  });
});

export const puzzleRoutes = router;
