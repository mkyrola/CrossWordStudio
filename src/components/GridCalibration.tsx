import React, { useState } from 'react';
import { theme } from '../styles/theme';

interface GridCalibrationProps {
  onCalibrationChange: (calibration: GridCalibrationData) => void;
}

export interface GridCalibrationData {
  gridWidth: number;
  gridHeight: number;
  offsetX: number;
  offsetY: number;
}

const GridCalibration: React.FC<GridCalibrationProps> = ({ onCalibrationChange }) => {
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [calibration, setCalibration] = useState<GridCalibrationData>({
    gridWidth: 15,
    gridHeight: 15,
    offsetX: 0,
    offsetY: 0
  });

  const handleCalibrationChange = (field: keyof GridCalibrationData, value: number) => {
    const newCalibration = {
      ...calibration,
      [field]: value
    };
    setCalibration(newCalibration);
    onCalibrationChange(newCalibration);
  };

  const handleAutoDetect = async () => {
    // TODO: Implement grid detection algorithm
    console.log('Auto detecting grid...');
  };

  return (
    <div style={{
      position: 'absolute',
      right: '32px',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      zIndex: 5,
      width: '300px'
    }}>
      <h3 style={{
        color: theme.colors.primary,
        marginBottom: '16px',
        fontSize: theme.typography.fontSize.large
      }}>
        Grid Calibration
      </h3>

      {/* Mode Selection */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setIsAutoDetect(true)}
          style={{
            backgroundColor: isAutoDetect ? theme.colors.primary : '#fff',
            color: isAutoDetect ? '#fff' : theme.colors.primary,
            border: `2px solid ${theme.colors.primary}`,
            padding: '8px 16px',
            borderRadius: '8px 0 0 8px',
            cursor: 'pointer'
          }}
        >
          Auto Detection
        </button>
        <button
          onClick={() => setIsAutoDetect(false)}
          style={{
            backgroundColor: !isAutoDetect ? theme.colors.primary : '#fff',
            color: !isAutoDetect ? '#fff' : theme.colors.primary,
            border: `2px solid ${theme.colors.primary}`,
            padding: '8px 16px',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer'
          }}
        >
          Manual Setup
        </button>
      </div>

      {isAutoDetect ? (
        // Auto Detection UI
        <div>
          <button
            onClick={handleAutoDetect}
            style={{
              backgroundColor: theme.colors.accent,
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold'
            }}
          >
            Detect Grid
          </button>
        </div>
      ) : (
        // Manual Setup UI
        <div>
          {/* Grid Size Dropdowns */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.colors.text.primary }}>
              Grid Size
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: theme.colors.text.secondary }}>Width</label>
                <select
                  value={calibration.gridWidth}
                  onChange={(e) => handleCalibrationChange('gridWidth', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  {Array.from({ length: 46 }, (_, i) => i + 5).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: theme.colors.text.secondary }}>Height</label>
                <select
                  value={calibration.gridHeight}
                  onChange={(e) => handleCalibrationChange('gridHeight', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  {Array.from({ length: 46 }, (_, i) => i + 5).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grid Size Sliders */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.colors.text.primary }}>
              Fine-tune Grid Size
            </label>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                Width: {calibration.gridWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={calibration.gridWidth}
                onChange={(e) => handleCalibrationChange('gridWidth', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                Height: {calibration.gridHeight}px
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={calibration.gridHeight}
                onChange={(e) => handleCalibrationChange('gridHeight', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Grid Offset Sliders */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: theme.colors.text.primary }}>
              Grid Offset
            </label>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                X-Axis: {calibration.offsetX}px
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={calibration.offsetX}
                onChange={(e) => handleCalibrationChange('offsetX', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                Y-Axis: {calibration.offsetY}px
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={calibration.offsetY}
                onChange={(e) => handleCalibrationChange('offsetY', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridCalibration;
