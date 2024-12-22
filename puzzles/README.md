# Puzzle Data Directory

This directory contains puzzle data files for CrossWord Studio.

## Structure

Each puzzle should have its own directory with the following files:

```
puzzles/
├── puzzle1/
│   ├── solution.csv        # Solution Character Table
│   ├── empty_grid.csv      # Empty Grid with blocked cells
│   ├── helper1.csv         # Horizontal word start offsets
│   ├── helper2.csv         # Horizontal word end offsets
│   ├── helper3.csv         # Vertical word start offsets
│   ├── helper4.csv         # Vertical word end offsets
│   └── puzzle.jpg         # Puzzle image
├── puzzle2/
│   └── ...
└── ...
```

## File Formats

- CSV files: UTF-8 encoded, comma-separated
- Image files: JPEG format
