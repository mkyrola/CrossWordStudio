import React from 'react';

interface SolverControlsProps {
  onClear: () => void;
  onToggleProgress: () => void;
  showProgress: boolean;
  progressPercentage: number;
}

export const SolverControls: React.FC<SolverControlsProps> = ({
  onClear,
  onToggleProgress,
  showProgress,
  progressPercentage
}) => {
  return (
    <div style={{
      padding: '10px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    }}>
      <button
        onClick={onClear}
        style={{
          padding: '8px 16px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Clear Grid
      </button>

      <button
        onClick={onToggleProgress}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {showProgress ? 'Hide Progress' : 'Show Progress'}
      </button>

      {showProgress && (
        <div style={{
          marginLeft: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '200px',
            height: '20px',
            backgroundColor: '#eee',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span>{progressPercentage.toFixed(1)}% Complete</span>
        </div>
      )}
    </div>
  );
};
