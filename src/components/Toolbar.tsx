import React from 'react';
import theme from '../styles/theme';

interface ToolbarProps {
  onSave: () => void;
  onPrint: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  style?: React.CSSProperties;
}

const Toolbar: React.FC<ToolbarProps> = ({ onSave, onPrint, onToggleDarkMode, isDarkMode, style }) => {
  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: isDarkMode ? theme.colors.accent : theme.colors.primary,
    color: theme.colors.text.inverse,
    border: 'none',
    borderRadius: theme.borderRadius.small,
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.small,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
    boxShadow: theme.shadows.small
  };

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(5px)',
      boxShadow: theme.shadows.medium,
      ...style
    }}>
      <button 
        onClick={onSave}
        style={{
          ...buttonStyle,
          backgroundColor: theme.colors.primary
        }}
      >
        💾 Save
      </button>
      <button 
        onClick={onPrint}
        style={{
          ...buttonStyle,
          backgroundColor: theme.colors.secondary
        }}
      >
        🖨️ Print
      </button>
      <button 
        onClick={onToggleDarkMode}
        style={{
          ...buttonStyle,
          backgroundColor: isDarkMode ? theme.colors.accent : theme.colors.primary
        }}
      >
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </div>
  );
};

export default Toolbar;
