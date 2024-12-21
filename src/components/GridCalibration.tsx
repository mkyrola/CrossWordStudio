import React, { useState, useEffect } from 'react';
import theme from '../styles/theme';

export interface GridCalibrationData {
  gridWidth: number;  // number of cells horizontally
  gridHeight: number; // number of cells vertically
  cellWidth: number;  // width of each cell in pixels
  cellHeight: number; // height of each cell in pixels
  offsetX: number;
  offsetY: number;
}

interface GridCalibrationProps {
  onCalibrationChange: (calibration: GridCalibrationData) => void;
  onAutoDetect: () => void;
}

const GridCalibration: React.FC<GridCalibrationProps> = ({ onCalibrationChange, onAutoDetect }) => {
  const [calibration, setCalibration] = useState<GridCalibrationData>({
    gridWidth: 15,
    gridHeight: 15,
    cellWidth: 30,
    cellHeight: 30,
    offsetX: 0,
    offsetY: 0
  });

  const handleChange = (key: keyof GridCalibrationData, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const newCalibration = { ...calibration, [key]: numValue };
      setCalibration(newCalibration);
      onCalibrationChange(newCalibration);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      right: window.innerWidth < 600 ? '16px' : '32px',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: theme.colors.surface,
      padding: window.innerWidth < 600 ? theme.spacing.md : theme.spacing.lg,
      borderRadius: theme.borderRadius.large,
      boxShadow: theme.shadows.large,
      zIndex: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.md,
      border: `2px solid ${theme.colors.border}`,
      width: window.innerWidth < 600 ? 'calc(100% - 32px)' : window.innerWidth < 900 ? '300px' : '320px',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <h3 style={{
        margin: 0,
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.large,
        marginBottom: theme.spacing.xs,
        textAlign: 'center'
      }}>
        Grid Settings
      </h3>
      
      <p style={{
        margin: 0,
        marginBottom: theme.spacing.sm,
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.small,
        textAlign: 'center'
      }}>
        {calibration.gridWidth} × {calibration.gridHeight} cells
      </p>

      {/* Grid Width */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <label 
          htmlFor="gridWidth"
          style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.small
          }}
        >
          Number of Cells (Width)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <input
            id="gridWidth"
            type="number"
            min="1"
            max="50"
            value={calibration.gridWidth}
            onChange={(e) => handleChange('gridWidth', e.target.value)}
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.small,
              fontSize: theme.typography.fontSize.medium
            }}
          />
          <button
            onClick={() => handleChange('gridWidth', String(calibration.gridWidth - 1))}
            disabled={calibration.gridWidth <= 1}
            style={{
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.secondary,
              border: 'none',
              borderRadius: theme.borderRadius.small,
              cursor: calibration.gridWidth <= 1 ? 'not-allowed' : 'pointer',
              opacity: calibration.gridWidth <= 1 ? 0.5 : 1
            }}
          >
            -
          </button>
          <button
            onClick={() => handleChange('gridWidth', String(calibration.gridWidth + 1))}
            disabled={calibration.gridWidth >= 50}
            style={{
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.secondary,
              border: 'none',
              borderRadius: theme.borderRadius.small,
              cursor: calibration.gridWidth >= 50 ? 'not-allowed' : 'pointer',
              opacity: calibration.gridWidth >= 50 ? 0.5 : 1
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Grid Height */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <label 
          htmlFor="gridHeight"
          style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.small
          }}
        >
          Number of Cells (Height)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <input
            id="gridHeight"
            type="number"
            min="1"
            max="50"
            value={calibration.gridHeight}
            onChange={(e) => handleChange('gridHeight', e.target.value)}
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.small,
              fontSize: theme.typography.fontSize.medium
            }}
          />
          <button
            onClick={() => handleChange('gridHeight', String(calibration.gridHeight - 1))}
            disabled={calibration.gridHeight <= 1}
            style={{
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.secondary,
              border: 'none',
              borderRadius: theme.borderRadius.small,
              cursor: calibration.gridHeight <= 1 ? 'not-allowed' : 'pointer',
              opacity: calibration.gridHeight <= 1 ? 0.5 : 1
            }}
          >
            -
          </button>
          <button
            onClick={() => handleChange('gridHeight', String(calibration.gridHeight + 1))}
            disabled={calibration.gridHeight >= 50}
            style={{
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.secondary,
              border: 'none',
              borderRadius: theme.borderRadius.small,
              cursor: calibration.gridHeight >= 50 ? 'not-allowed' : 'pointer',
              opacity: calibration.gridHeight >= 50 ? 0.5 : 1
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Cell Width */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <label 
          htmlFor="cellWidth"
          style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.small
          }}
        >
          Cell Width (pixels): {calibration.cellWidth}
        </label>
        <input
          id="cellWidth"
          type="range"
          min="10"
          max="100"
          value={calibration.cellWidth}
          onChange={(e) => handleChange('cellWidth', e.target.value)}
          style={{
            width: '100%',
            accentColor: theme.colors.primary
          }}
        />
      </div>

      {/* Cell Height */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <label 
          htmlFor="cellHeight"
          style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.small
          }}
        >
          Cell Height (pixels): {calibration.cellHeight}
        </label>
        <input
          id="cellHeight"
          type="range"
          min="10"
          max="100"
          value={calibration.cellHeight}
          onChange={(e) => handleChange('cellHeight', e.target.value)}
          style={{
            width: '100%',
            accentColor: theme.colors.primary
          }}
        />
      </div>

      {/* Offset X */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <label 
          htmlFor="offsetX"
          style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.small
          }}
        >
          Offset X: {calibration.offsetX}
        </label>
        <input
          id="offsetX"
          type="range"
          min="-100"
          max="100"
          value={calibration.offsetX}
          onChange={(e) => handleChange('offsetX', e.target.value)}
          style={{
            width: '100%',
            accentColor: theme.colors.primary
          }}
        />
      </div>

      {/* Offset Y */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <label 
          htmlFor="offsetY"
          style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.small
          }}
        >
          Offset Y: {calibration.offsetY}
        </label>
        <input
          id="offsetY"
          type="range"
          min="-100"
          max="100"
          value={calibration.offsetY}
          onChange={(e) => handleChange('offsetY', e.target.value)}
          style={{
            width: '100%',
            accentColor: theme.colors.primary
          }}
        />
      </div>

      {/* Auto-detect Button */}
      <button
        onClick={onAutoDetect}
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.text.inverse,
          border: 'none',
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          borderRadius: theme.borderRadius.small,
          cursor: 'pointer',
          fontSize: theme.typography.fontSize.medium,
          fontWeight: theme.typography.fontWeight.medium,
          marginTop: theme.spacing.sm
        }}
      >
        Auto-detect Grid
      </button>
    </div>
  );
};

export default GridCalibration;
