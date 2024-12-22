import React, { useState } from 'react';
import { GridCell } from '../types/grid';
import { createPuzzle, savePuzzle } from '../utils/puzzleUtils';
import theme from '../styles/theme';

interface PuzzleSaveProps {
  grid: GridCell[][];
  onClose: () => void;
}

export const PuzzleSave: React.FC<PuzzleSaveProps> = ({ grid, onClose }) => {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a puzzle name');
      return;
    }

    try {
      setIsSaving(true);
      const puzzle = createPuzzle(grid, name.trim());
      await savePuzzle(puzzle);
      onClose(); // Close the dialog after successful save
    } catch (error) {
      console.error('Error saving puzzle:', error);
      alert('Failed to save puzzle. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSave();
    } else if (e.key === 'Escape' && !isSaving) {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: theme.colors.surface,
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ 
          margin: '0 0 16px 0',
          color: theme.colors.text.primary
        }}>
          Save Puzzle
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter puzzle name"
            autoFocus
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '16px',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '4px',
              backgroundColor: theme.colors.background
            }}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '4px',
              backgroundColor: 'transparent',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              color: theme.colors.text.primary,
              opacity: isSaving ? 0.5 : 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.inverse,
              border: 'none',
              borderRadius: '4px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.5 : 1
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
