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
  imageDimensions: { width: number; height: number };
}

const GridCalibration: React.FC<GridCalibrationProps> = ({ onCalibrationChange, onAutoDetect, imageDimensions }) => {
  const [calibration, setCalibration] = useState<GridCalibrationData>({
    gridWidth: 15,
    gridHeight: 15,
    cellWidth: Math.floor(imageDimensions.width / 15), // Initialize cell sizes based on image dimensions
    cellHeight: Math.floor(imageDimensions.height / 15), // Initialize cell sizes based on image dimensions
    offsetX: 0,
    offsetY: 0
  });

  // Initialize calibration with proper cell sizes
  useEffect(() => {
    if (imageDimensions.width > 0 && imageDimensions.height > 0) {
      // Calculate initial cell sizes only if they haven't been set
      setCalibration(prev => {
        const initialWidth = prev.cellWidth || Math.floor(imageDimensions.width / prev.gridWidth);
        const initialHeight = prev.cellHeight || Math.floor(imageDimensions.height / prev.gridHeight);
        
        return {
          ...prev,
          cellWidth: initialWidth,
          cellHeight: initialHeight
        };
      });
    }
  }, [imageDimensions.width, imageDimensions.height]);

  const handleChange = (key: keyof GridCalibrationData, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      let newCalibration = { ...calibration };

      switch (key) {
        case 'gridWidth':
          newCalibration.gridWidth = numValue;
          if (!newCalibration.cellWidth) {
            newCalibration.cellWidth = Math.floor(imageDimensions.width / numValue);
          }
          break;
        case 'gridHeight':
          newCalibration.gridHeight = numValue;
          if (!newCalibration.cellHeight) {
            newCalibration.cellHeight = Math.floor(imageDimensions.height / numValue);
          }
          break;
        case 'cellWidth':
          // Only update width, keep height unchanged
          newCalibration = {
            ...newCalibration,
            cellWidth: Math.max(10, Math.min(100, numValue))
          };
          break;
        case 'cellHeight':
          // Only update height, keep width unchanged
          newCalibration = {
            ...newCalibration,
            cellHeight: Math.max(10, Math.min(100, numValue))
          };
          break;
        default:
          newCalibration[key] = Math.max(0, numValue);
      }

      setCalibration(newCalibration);
      onCalibrationChange(newCalibration);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      left: window.innerWidth < 600 ? '16px' : '32px',
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
          Cell Width (pixels)
        </label>
        <input
          id="cellWidth"
          type="range"
          min="10"
          max="100"
          value={calibration.cellWidth}
          onChange={(e) => handleChange('cellWidth', e.target.value)}
          style={{ width: '100%' }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: theme.typography.fontSize.small,
          color: theme.colors.text.secondary
        }}>
          <span>10px</span>
          <span>{calibration.cellWidth}px</span>
          <span>100px</span>
        </div>
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
          Cell Height (pixels)
        </label>
        <input
          id="cellHeight"
          type="range"
          min="10"
          max="100"
          value={calibration.cellHeight}
          onChange={(e) => handleChange('cellHeight', e.target.value)}
          style={{ width: '100%' }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: theme.typography.fontSize.small,
          color: theme.colors.text.secondary
        }}>
          <span>10px</span>
          <span>{calibration.cellHeight}px</span>
          <span>100px</span>
        </div>
      </div>

      {/* X Offset */}
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
          X Offset
        </label>
        <input
          id="offsetX"
          type="range"
          min="0"
          max="500"
          value={calibration.offsetX}
          onChange={(e) => handleChange('offsetX', e.target.value)}
          style={{ width: '100%' }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: theme.typography.fontSize.small,
          color: theme.colors.text.secondary
        }}>
          <span>0</span>
          <span>{calibration.offsetX}px</span>
          <span>500px</span>
        </div>
      </div>

      {/* Y Offset */}
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
          Y Offset
        </label>
        <input
          id="offsetY"
          type="range"
          min="0"
          max="500"
          value={calibration.offsetY}
          onChange={(e) => handleChange('offsetY', e.target.value)}
          style={{ width: '100%' }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: theme.typography.fontSize.small,
          color: theme.colors.text.secondary
        }}>
          <span>0</span>
          <span>{calibration.offsetY}px</span>
          <span>500px</span>
        </div>
      </div>

      <button
        onClick={onAutoDetect}
        style={{
          width: '100%',
          padding: theme.spacing.md,
          backgroundColor: theme.colors.primary,
          color: theme.colors.text.inverse,
          border: 'none',
          borderRadius: theme.borderRadius.small,
          cursor: 'pointer',
          fontSize: theme.typography.fontSize.medium,
          fontWeight: theme.typography.fontWeight.medium,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.sm
        }}
      >
        <span role="img" aria-label="detect">🔍</span>
        Auto Detect Grid
      </button>
    </div>
  );
};

export default GridCalibration;
