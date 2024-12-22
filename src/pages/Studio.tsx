import React, { useEffect, useState, useRef } from 'react';
import theme from '../styles/theme';
import GridCalibration, { GridCalibrationData } from '../components/GridCalibration';
import GridOverlay from '../components/GridOverlay';
import { detectGrid } from '../utils/gridDetection';

interface StudioProps {
  imageUrl: string | null;
  onNavigate: () => void;
}

const Studio: React.FC<StudioProps> = ({ imageUrl, onNavigate }) => {
  const [calibrationData, setCalibrationData] = useState<GridCalibrationData>({
    gridWidth: 15,
    gridHeight: 15,
    cellWidth: 30,
    cellHeight: 30,
    offsetX: 0,
    offsetY: 0
  });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Only navigate away if there's no image URL on mount
  useEffect(() => {
    if (!imageUrl) {
      console.log('No image URL provided, returning to home');
      onNavigate();
    }
  }, []); // Run only on mount

  const handleImageLoad = () => {
    console.log('Image loaded:', imageRef.current?.naturalWidth, 'x', imageRef.current?.naturalHeight);
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageDimensions({ width: naturalWidth, height: naturalHeight });
    }
  };

  const handleImageError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Failed to load image:', error);
  };

  const handleCalibrationChange = (newCalibration: GridCalibrationData) => {
    setCalibrationData(newCalibration);
  };

  const handleAutoDetect = async () => {
    if (!imageUrl) return;

    const result = await detectGrid(imageUrl);
    if (result.success && result.calibration) {
      setCalibrationData(result.calibration);
    } else {
      console.error('Grid detection failed:', result.error);
      // TODO: Show error message to user
    }
  };

  if (!imageUrl) {
    console.log('No imageUrl provided, returning null');
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
      padding: '0',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        width: '95%',
        height: '90vh',
        backgroundColor: theme.colors.surface,
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '8px solid #BB2528',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 2
        }}>
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Puzzle"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          {imageDimensions.width > 0 && (
            <GridOverlay
              calibrationData={calibrationData}
              imageWidth={imageDimensions.width}
              imageHeight={imageDimensions.height}
            />
          )}
        </div>

        <GridCalibration
          onCalibrationChange={handleCalibrationChange}
          onAutoDetect={handleAutoDetect}
        />

        {/* Back Button */}
        <button
          onClick={onNavigate}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
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
          ← Back
        </button>
      </div>
    </div>
  );
};

export default Studio;
