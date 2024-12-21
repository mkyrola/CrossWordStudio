import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import GridCalibration, { GridCalibrationData } from '../components/GridCalibration';

const Studio: React.FC = () => {
  const navigate = useNavigate();
  const imageUrl = localStorage.getItem('puzzleImageUrl');
  const [calibrationData, setCalibrationData] = useState<GridCalibrationData>({
    gridWidth: 15,
    gridHeight: 15,
    offsetX: 0,
    offsetY: 0
  });

  useEffect(() => {
    if (!imageUrl) {
      navigate('/');
    }
    return () => {
      localStorage.removeItem('puzzleImageUrl');
    };
  }, [imageUrl, navigate]);

  const handleCalibrationChange = (newCalibration: GridCalibrationData) => {
    setCalibrationData(newCalibration);
    // TODO: Update grid overlay with new calibration
    console.log('New calibration:', newCalibration);
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      background: `linear-gradient(135deg, 
        ${theme.colors.secondary} 0%, 
        #d42d30 50%, 
        ${theme.colors.secondary} 100%)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0'
    }}>
      <div style={{
        position: 'relative',
        width: '95%',
        height: '100%',
        backgroundColor: theme.colors.secondary,
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '8px solid #BB2528',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Horizontal Ribbon */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '-24px',
          right: '-24px',
          height: '96px',
          backgroundColor: theme.colors.accent,
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 8px rgba(248,178,41,0.3)',
          borderRadius: '8px',
          zIndex: 1
        }} />

        {/* Vertical Ribbon */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '-24px',
          bottom: '-24px',
          width: '96px',
          backgroundColor: theme.colors.accent,
          transform: 'translateX(-50%)',
          boxShadow: '0 4px 8px rgba(248,178,41,0.3)',
          borderRadius: '8px',
          zIndex: 1
        }} />

        {/* Image Container */}
        <div style={{
          position: 'relative',
          width: '90%',
          height: '90%',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: theme.spacing.md,
          zIndex: 2,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src={imageUrl} 
            alt="Crossword Puzzle"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
          {/* TODO: Add grid overlay here using calibrationData */}
        </div>

        {/* Grid Calibration Panel */}
        <GridCalibration onCalibrationChange={handleCalibrationChange} />

        {/* Ribbon Bow - Left Loop */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          marginLeft: '-45px',
          width: '45px',
          height: '45px',
          backgroundColor: theme.colors.accent,
          borderRadius: '45px 0 0 45px',
          transform: 'rotate(-15deg)',
          boxShadow: '0 4px 8px rgba(248,178,41,0.3)',
          zIndex: 3
        }} />

        {/* Ribbon Bow - Right Loop */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          width: '45px',
          height: '45px',
          backgroundColor: theme.colors.accent,
          borderRadius: '0 45px 45px 0',
          transform: 'rotate(15deg)',
          boxShadow: '0 4px 8px rgba(248,178,41,0.3)',
          zIndex: 3
        }} />

        {/* Ribbon Bow - Center Knot */}
        <div style={{
          position: 'absolute',
          top: '-25px',
          left: '50%',
          width: '32px',
          height: '32px',
          backgroundColor: theme.colors.accent,
          borderRadius: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '0 4px 8px rgba(248,178,41,0.3)',
          zIndex: 4
        }} />
      </div>
    </div>
  );
};

export default Studio;
