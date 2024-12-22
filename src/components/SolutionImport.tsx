import React, { useState } from 'react';
import theme from '../styles/theme';

interface SolutionImportProps {
  gridWidth: number;
  gridHeight: number;
  onSolutionImported: (solution: string[][]) => void;
}

export const SolutionImport: React.FC<SolutionImportProps> = ({ gridWidth, gridHeight, onSolutionImported }) => {
  const [isValid, setIsValid] = useState(false);
  const [matrixText, setMatrixText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAndProcessSolution = () => {
    try {
      setError(null);

      // Split into rows and clean up whitespace
      const rows = matrixText.trim().split('\n').map(row => 
        row.trim().split(',').map(cell => {
          // Convert empty strings to single space
          const trimmed = cell.trim();
          return trimmed === '' ? ' ' : trimmed;
        })
      );
      
      // For a 10x12 grid, we expect:
      // - 12 rows (height)
      // - 10 characters per row (width)
      if (rows.length !== gridHeight) {
        throw new Error(`Solution must have exactly ${gridHeight} rows (current: ${rows.length})`);
      }

      // Validate each row has the correct width
      const invalidRow = rows.findIndex(row => row.length !== gridWidth);
      if (invalidRow !== -1) {
        throw new Error(`Row ${invalidRow + 1} has ${rows[invalidRow].length} characters (expected: ${gridWidth})`);
      }

      // Validate characters (only letters and spaces)
      const isValidChar = (char: string) => /^[A-ZÄÖ ]$/.test(char);
      let invalidChar = '';
      let invalidPos = { row: -1, col: -1 };

      const hasInvalidChar = rows.some((row, rowIndex) => 
        row.some((cell, colIndex) => {
          if (!isValidChar(cell)) {
            invalidChar = cell;
            invalidPos = { row: rowIndex + 1, col: colIndex + 1 };
            return true;
          }
          return false;
        })
      );

      if (hasInvalidChar) {
        throw new Error(`Invalid character "${invalidChar}" at row ${invalidPos.row}, column ${invalidPos.col}. Only uppercase letters, Ä, Ö, or spaces are allowed.`);
      }

      // Create the solution matrix with correct dimensions
      setIsValid(true);
      onSolutionImported(rows);
    } catch (error) {
      setIsValid(false);
      setError(error instanceof Error ? error.message : 'Invalid solution format');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMatrixText(e.target.value);
    setIsValid(false);
    setError(null);
  };

  return (
    <div style={{
      position: 'absolute',
      right: window.innerWidth < 600 ? '16px' : '32px',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: theme.colors.surface,
      padding: window.innerWidth < 600 ? '16px' : '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      zIndex: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      border: `2px solid ${theme.colors.border}`,
      width: window.innerWidth < 600 ? 'calc(100% - 32px)' : window.innerWidth < 900 ? '300px' : '320px',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <h3 style={{
        margin: 0,
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.large,
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        Solution Matrix
      </h3>
      
      <p style={{
        margin: 0,
        marginBottom: '12px',
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.small,
        textAlign: 'center'
      }}>
        {gridWidth} × {gridHeight} matrix
      </p>

      <textarea
        value={matrixText}
        onChange={handleTextChange}
        placeholder={`Enter ${gridWidth}x${gridHeight} matrix\nExample:\nA,S,K,O, ,T,A,S,A,N\nL,A,A,T,T,A,P,I,N,O\n...`}
        style={{
          width: '100%',
          height: '200px',
          padding: '8px',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '4px',
          resize: 'vertical',
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: '1.4'
        }}
      />

      <button
        onClick={validateAndProcessSolution}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: theme.colors.primary,
          color: theme.colors.text.inverse,
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: theme.typography.fontSize.medium,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
      >
        <span role="img" aria-label="upload">📥</span>
        Upload Solution
      </button>

      {error && (
        <p style={{
          margin: 0,
          color: theme.colors.error,
          fontSize: theme.typography.fontSize.small,
          textAlign: 'center'
        }}>
          ❌ {error}
        </p>
      )}

      {isValid && (
        <p style={{
          margin: 0,
          color: theme.colors.success,
          fontSize: theme.typography.fontSize.small,
          textAlign: 'center'
        }}>
          ✓ Solution matrix is valid
        </p>
      )}
    </div>
  );
};
