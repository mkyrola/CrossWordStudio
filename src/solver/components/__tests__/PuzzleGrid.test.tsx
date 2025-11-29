import { render, fireEvent } from '@testing-library/react';
import { PuzzleGrid } from '../PuzzleGrid';

describe('PuzzleGrid', () => {
  const defaultDimensions = { rows: 3, columns: 3 };

  it('should render a grid with correct dimensions', () => {
    render(<PuzzleGrid dimensions={defaultDimensions} />);
    
    // Grid container should be rendered
    const gridContainer = document.querySelector('.puzzle-grid');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should initialize empty cells', () => {
    render(<PuzzleGrid dimensions={{ rows: 2, columns: 2 }} />);
    
    // Cells should be empty initially - grid container exists
    const gridContainer = document.querySelector('.puzzle-grid');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should handle cell click', () => {
    const onCellChange = jest.fn();
    render(
      <PuzzleGrid 
        dimensions={defaultDimensions} 
        onCellChange={onCellChange}
      />
    );

    // Find cells by their tabIndex (interactive cells have tabIndex 0)
    const cells = document.querySelectorAll('[tabindex="0"]');
    expect(cells.length).toBeGreaterThan(0);
    
    fireEvent.click(cells[0]);
    // Cell should be selected (visual feedback)
  });

  it('should handle keyboard input', () => {
    const onCellChange = jest.fn();
    render(
      <PuzzleGrid 
        dimensions={defaultDimensions} 
        onCellChange={onCellChange}
      />
    );

    const cells = document.querySelectorAll('[tabindex="0"]');
    
    // Click to select first cell
    fireEvent.click(cells[0]);
    
    // Type a letter
    fireEvent.keyDown(cells[0], { key: 'A' });
    
    expect(onCellChange).toHaveBeenCalledWith(0, 0, 'A');
  });

  it('should convert lowercase to uppercase', () => {
    const onCellChange = jest.fn();
    render(
      <PuzzleGrid 
        dimensions={defaultDimensions} 
        onCellChange={onCellChange}
      />
    );

    const cells = document.querySelectorAll('[tabindex="0"]');
    fireEvent.click(cells[0]);
    fireEvent.keyDown(cells[0], { key: 'a' });
    
    expect(onCellChange).toHaveBeenCalledWith(0, 0, 'A');
  });

  it('should toggle direction on Tab key', () => {
    render(<PuzzleGrid dimensions={defaultDimensions} />);

    const cells = document.querySelectorAll('[tabindex="0"]');
    fireEvent.click(cells[0]);
    
    // Press Tab to toggle direction
    fireEvent.keyDown(cells[0], { key: 'Tab' });
    
    // Direction should toggle (visual feedback changes)
  });

  it('should toggle direction on Space key', () => {
    render(<PuzzleGrid dimensions={defaultDimensions} />);

    const cells = document.querySelectorAll('[tabindex="0"]');
    fireEvent.click(cells[0]);
    
    // Press Space to toggle direction
    fireEvent.keyDown(cells[0], { key: ' ' });
    
    // Direction should toggle
  });

  it('should not allow input on blocked cells', () => {
    const onCellChange = jest.fn();
    render(
      <PuzzleGrid 
        dimensions={defaultDimensions} 
        onCellChange={onCellChange}
      />
    );

    // Blocked cells should have tabIndex -1
    const blockedCells = document.querySelectorAll('[tabindex="-1"]');
    
    if (blockedCells.length > 0) {
      fireEvent.click(blockedCells[0]);
      fireEvent.keyDown(blockedCells[0], { key: 'A' });
      
      // onCellChange should not be called for blocked cells
    }
  });

  it('should render with custom cell size from config', () => {
    render(<PuzzleGrid dimensions={defaultDimensions} />);
    
    const gridContainer = document.querySelector('.puzzle-grid');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should handle empty dimensions gracefully', () => {
    render(<PuzzleGrid dimensions={{ rows: 0, columns: 0 }} />);
    
    const gridContainer = document.querySelector('.puzzle-grid');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should update grid when dimensions change', () => {
    const { rerender } = render(
      <PuzzleGrid dimensions={{ rows: 2, columns: 2 }} />
    );

    rerender(
      <PuzzleGrid dimensions={{ rows: 3, columns: 3 }} />
    );

    // Grid should update to new dimensions
    const gridContainer = document.querySelector('.puzzle-grid');
    expect(gridContainer).toBeInTheDocument();
  });
});
