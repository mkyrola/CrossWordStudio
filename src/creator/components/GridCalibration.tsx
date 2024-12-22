import React, { useState, useEffect } from 'react';
import theme from '../../styles/theme';

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
    cellWidth: Math.floor(imageDimensions.width / 15),
    cellHeight: Math.floor(imageDimensions.height / 15),
    offsetX: 0,
    offsetY: 0
  });

  useEffect(() => {
    if (imageDimensions.width > 0 && imageDimensions.height > 0) {
      setCalibration(prev => ({
        ...prev,
        cellWidth: Math.floor(imageDimensions.width / prev.gridWidth),
        cellHeight: Math.floor(imageDimensions.height / prev.gridHeight)
      }));
    }
  }, [imageDimensions]);

  useEffect(() => {
    onCalibrationChange(calibration);
  }, [calibration, onCalibrationChange]);

  const handleInputChange = (field: keyof GridCalibrationData, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setCalibration(prev => {
        const newCalibration = { ...prev, [field]: numValue };
        
        // Adjust cell sizes when grid dimensions change
        if (field === 'gridWidth') {
          newCalibration.cellWidth = Math.floor(imageDimensions.width / numValue);
        }
        if (field === 'gridHeight') {
          newCalibration.cellHeight = Math.floor(imageDimensions.height / numValue);
        }
        
        return newCalibration;
      });
    }
  };

  const handleOffsetChange = (axis: 'x' | 'y', delta: number) => {
    setCalibration(prev => ({
      ...prev,
      [axis === 'x' ? 'offsetX' : 'offsetY']: prev[axis === 'x' ? 'offsetX' : 'offsetY'] + delta
    }));
  };

  const handleCellSizeChange = (dimension: 'Width' | 'Height', delta: number) => {
    setCalibration(prev => ({
      ...prev,
      [`cell${dimension}`]: Math.max(10, prev[`cell${dimension}`] + delta)
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      backgroundColor: theme.colors.background,
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: theme.colors.text.primary }}>Grid Calibration</h3>
      
      {/* Grid Dimensions */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ color: theme.colors.text.primary }}>Grid Size:</label>
        <input
          type="number"
          value={calibration.gridWidth}
          onChange={(e) => handleInputChange('gridWidth', e.target.value)}
          style={{
            width: '50px',
            padding: '4px',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '4px'
          }}
        />
        <span style={{ color: theme.colors.text.primary }}>×</span>
        <input
          type="number"
          value={calibration.gridHeight}
          onChange={(e) => handleInputChange('gridHeight', e.target.value)}
          style={{
            width: '50px',
            padding: '4px',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Cell Size Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: theme.colors.text.primary }}>Cell Width:</label>
          <button onClick={() => handleCellSizeChange('Width', -1)} style={buttonStyle}>-</button>
          <span style={{ color: theme.colors.text.primary, minWidth: '30px', textAlign: 'center' }}>
            {calibration.cellWidth}
          </span>
          <button onClick={() => handleCellSizeChange('Width', 1)} style={buttonStyle}>+</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: theme.colors.text.primary }}>Cell Height:</label>
          <button onClick={() => handleCellSizeChange('Height', -1)} style={buttonStyle}>-</button>
          <span style={{ color: theme.colors.text.primary, minWidth: '30px', textAlign: 'center' }}>
            {calibration.cellHeight}
          </span>
          <button onClick={() => handleCellSizeChange('Height', 1)} style={buttonStyle}>+</button>
        </div>
      </div>

      {/* Offset Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: theme.colors.text.primary }}>Offset X:</label>
          <button onClick={() => handleOffsetChange('x', -1)} style={buttonStyle}>←</button>
          <span style={{ color: theme.colors.text.primary, minWidth: '30px', textAlign: 'center' }}>
            {calibration.offsetX}
          </span>
          <button onClick={() => handleOffsetChange('x', 1)} style={buttonStyle}>→</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: theme.colors.text.primary }}>Offset Y:</label>
          <button onClick={() => handleOffsetChange('y', -1)} style={buttonStyle}>↑</button>
          <span style={{ color: theme.colors.text.primary, minWidth: '30px', textAlign: 'center' }}>
            {calibration.offsetY}
          </span>
          <button onClick={() => handleOffsetChange('y', 1)} style={buttonStyle}>↓</button>
        </div>
      </div>

      {/* Auto-detect button */}
      <button
        onClick={onAutoDetect}
        style={{
          ...buttonStyle,
          width: '100%',
          marginTop: '10px',
          padding: '8px',
          backgroundColor: theme.colors.accent,
          color: theme.colors.text.inverse
        }}
      >
        Auto-detect Grid
      </button>
    </div>
  );
};

const buttonStyle = {
  padding: '4px 8px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: theme.colors.secondary,
  color: theme.colors.text.primary,
  cursor: 'pointer',
  minWidth: '30px'
};

export default GridCalibration;
