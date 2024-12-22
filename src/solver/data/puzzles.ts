import { PuzzleData } from '../types/puzzleData';

// Example of how to input the puzzle data
export const puzzle1: PuzzleData = {
  id: "puzzle1",
  name: "First Puzzle",
  
  image: {
    src: "/puzzles/puzzle1.jpg", // Path to your puzzle image
    width: 800,  // Actual image width
    height: 600  // Actual image height
  },

  gridConfig: {
    rows: 15,      // Example size
    columns: 15,   // Example size
    cellWidth: 40,
    cellHeight: 40,
    offsetX: 50,   // Grid offset from image left
    offsetY: 50    // Grid offset from image top
  },

  tables: {
    // Solution grid - the correct answers
    solutionGrid: [
      ["A", "B", "C", "#", "D"],
      ["E", "F", "G", "H", "I"],
      // ... rest of the solution grid
    ],

    // Empty grid with blocked cells marked
    emptyGrid: [
      [
        { value: "", isBlocked: false },
        { value: "", isBlocked: false },
        { value: "", isBlocked: false },
        { value: "#", isBlocked: true },
        { value: "", isBlocked: false }
      ],
      // ... rest of the empty grid
    ],

    // Helper tables for word highlighting
    wordHelpers: {
      horizontal: {
        startOffset: [
          [0, -1, -2, 0, 0],  // Helper Table 1
          // ... rest of the rows
        ],
        endOffset: [
          [2, 1, 0, 0, 2],    // Helper Table 2
          // ... rest of the rows
        ]
      },
      vertical: {
        startOffset: [
          [0, -2, -1, 0, 0],  // Helper Table 3
          // ... rest of the rows
        ],
        endOffset: [
          [2, 0, 1, 0, 3],    // Helper Table 4
          // ... rest of the rows
        ]
      }
    }
  }
};
