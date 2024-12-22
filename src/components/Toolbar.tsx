import React from 'react';
import theme from '../styles/theme';

interface ToolbarProps {
  onSave: () => void;
  onPrint: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onPrint,
  onToggleDarkMode,
  isDarkMode
}) => {
  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: isDarkMode ? theme.colors.accent : theme.colors.primary,
    color: theme.colors.text.inverse,
    border: 'none',
    borderRadius: theme.borderRadius.small,
    cursor: 'pointer',
    marginLeft: '8px',
    fontSize: theme.typography.fontSize.small,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
    boxShadow: theme.shadows.small,
    '&:hover': {
      boxShadow: theme.shadows.medium,
      transform: 'translateY(-1px)'
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      display: 'flex',
      gap: '8px',
      zIndex: 1000,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(5px)',
      boxShadow: theme.shadows.medium
    }}>
      <button 
        onClick={onSave} 
        style={{
          ...buttonStyle,
          backgroundColor: theme.colors.primary
        }}
      >
        💾 Save JSON
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
