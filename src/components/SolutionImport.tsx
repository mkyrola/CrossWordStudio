import React, { useState } from 'react';
import theme from '../styles/theme';

interface SolutionImportProps {
  onSolutionImport: (matrix: string[][]) => void;
  gridWidth: number;
  gridHeight: number;
}

const SolutionImport: React.FC<SolutionImportProps> = ({ 
  onSolutionImport, 
  gridWidth, 
  gridHeight 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAndParseMatrix = (text: string): string[][] | null => {
    try {
      // Split into rows
      const rows = text.trim().split('\n');
      
      // Validate row count
      if (rows.length !== gridHeight) {
        throw new Error(`Expected ${gridHeight} rows, but got ${rows.length}`);
      }

      // Parse and validate each row
      const matrix = rows.map(row => {
        const cells = row.split(',').map(cell => cell.trim());
        if (cells.length !== gridWidth) {
          throw new Error(`Expected ${gridWidth} columns in each row, but got ${cells.length}`);
        }
        return cells;
      });

      return matrix;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid matrix format');
      return null;
    }
  };

  const handleImport = () => {
    const matrix = validateAndParseMatrix(inputText);
    if (matrix) {
      onSolutionImport(matrix);
      setIsOpen(false);
      setError(null);
      setInputText('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: theme.colors.primary,
          color: theme.colors.text.inverse,
          border: 'none',
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          borderRadius: theme.borderRadius.small,
          cursor: 'pointer',
          fontSize: theme.typography.fontSize.medium,
          fontWeight: theme.typography.fontWeight.medium,
          zIndex: 3
        }}
      >
        Import Solution
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: '32px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.large,
          boxShadow: theme.shadows.large,
          zIndex: 3,
          width: '300px',
          border: `2px solid ${theme.colors.border}`
        }}>
          <h3 style={{
            margin: 0,
            marginBottom: theme.spacing.md,
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.large
          }}>
            Import Solution Matrix
          </h3>

          <p style={{
            fontSize: theme.typography.fontSize.small,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.md
          }}>
            Paste your {gridWidth}x{gridHeight} solution matrix below.
            Use commas to separate cells and spaces for empty/blocked cells.
          </p>

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError(null);
            }}
            placeholder="A,S,K,O, ,T,A,S,A,N\nL,A,A,T,T,A,P,I,N,O\n..."
            style={{
              width: '100%',
              height: '200px',
              padding: theme.spacing.sm,
              marginBottom: theme.spacing.md,
              borderRadius: theme.borderRadius.small,
              border: `1px solid ${theme.colors.border}`,
              fontSize: theme.typography.fontSize.small,
              fontFamily: 'monospace'
            }}
          />

          {error && (
            <p style={{
              color: theme.colors.error,
              fontSize: theme.typography.fontSize.small,
              marginBottom: theme.spacing.md
            }}>
              {error}
            </p>
          )}

          <div style={{
            display: 'flex',
            gap: theme.spacing.sm,
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => {
                setIsOpen(false);
                setError(null);
                setInputText('');
              }}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.small,
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                backgroundColor: theme.colors.primary,
                color: theme.colors.text.inverse,
                border: 'none',
                borderRadius: theme.borderRadius.small,
                cursor: 'pointer'
              }}
            >
              Import
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SolutionImport;
