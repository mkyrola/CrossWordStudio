import React, { useState } from 'react';
import theme from '../../styles/theme';

interface SavePuzzleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (puzzleName: string) => void;
}

const SavePuzzleDialog: React.FC<SavePuzzleDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [puzzleName, setPuzzleName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!puzzleName.trim()) {
      setError('Puzzle name is required');
      return;
    }
    
    // Format puzzle name (replace spaces with hyphens, remove special chars)
    const formattedName = puzzleName
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    onSave(formattedName);
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
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: theme.colors.background,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.large,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          margin: 0,
          marginBottom: theme.spacing.lg,
          color: theme.colors.text.primary
        }}>
          Save Puzzle
        </h2>
        
        <div style={{ marginBottom: theme.spacing.md }}>
          <label
            htmlFor="puzzleName"
            style={{
              display: 'block',
              marginBottom: theme.spacing.sm,
              color: theme.colors.text.secondary
            }}
          >
            Puzzle Name
          </label>
          <input
            id="puzzleName"
            type="text"
            value={puzzleName}
            onChange={(e) => {
              setPuzzleName(e.target.value);
              setError(null);
            }}
            placeholder="e.g., Christmas-2024"
            style={{
              width: '100%',
              padding: theme.spacing.md,
              border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
              borderRadius: theme.borderRadius.medium,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              fontSize: '1rem'
            }}
          />
          {error && (
            <div style={{
              color: theme.colors.error,
              fontSize: '0.875rem',
              marginTop: theme.spacing.sm
            }}>
              {error}
            </div>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          gap: theme.spacing.md,
          justifyContent: 'flex-end',
          marginTop: theme.spacing.xl
        }}>
          <button
            onClick={onClose}
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              backgroundColor: 'transparent',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.medium,
              color: theme.colors.text.primary,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              backgroundColor: theme.colors.accent,
              border: 'none',
              borderRadius: theme.borderRadius.medium,
              color: theme.colors.text.inverse,
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePuzzleDialog;
