import React, { useEffect, useState, useRef } from 'react';
import theme from '../styles/theme';
import GridCalibration, { GridCalibrationData } from '../components/GridCalibration';
import { GridOverlay, CellState } from '../components/GridOverlay';
import { SolutionImport } from '../components/SolutionImport';
import { Toolbar } from '../components/Toolbar';
import { PuzzleSave } from '../components/PuzzleSave';
import { detectGrid } from '../utils/gridDetection';
import { exportToJson, printPuzzle } from '../utils/exportUtils';
import { GridCell } from '../types/grid';

interface StudioProps {
  imageUrl: string | null;
  onNavigate: () => void;
}

const Studio: React.FC<StudioProps> = ({ imageUrl, onNavigate }) => {
  const [calibrationData, setCalibrationData] = useState<GridCalibrationData>({
    gridWidth: 15,
    gridHeight: 15,
    cellWidth: 1,
    cellHeight: 1,
    offsetX: 0,
    offsetY: 0
  });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [solution, setSolution] = useState<string[][]>();
  const [imageBounds, setImageBounds] = useState({ left: 0, top: 0 });
  const [gridData, setGridData] = useState<GridCell[][]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<'christmas' | 'jingle-bells' | 'jingle' | 'song1' | 'song2'>('christmas');
  const audioRef = useRef<HTMLAudioElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Only navigate away if there's no image URL on mount
  useEffect(() => {
    if (!imageUrl) {
      console.log('No image URL provided, returning to home');
      onNavigate();
    }
  }, []); // Run only on mount

  // Initialize audio with error handling
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.onerror = (e) => {
        console.error('Audio loading error:', e);
        setIsPlaying(false);
      };
    }
  }, []);

  useEffect(() => {
    // Initialize grid data when calibration data changes
    const newGrid: GridCell[][] = Array(calibrationData.gridHeight).fill(0).map(() =>
      Array(calibrationData.gridWidth).fill(0).map(() => ({
        letter: '',
        isBlocked: false
      }))
    );
    setGridData(newGrid);
  }, [calibrationData.gridWidth, calibrationData.gridHeight]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const rect = imageRef.current.getBoundingClientRect();
      
      // Calculate the scale factor
      const scaleX = rect.width / naturalWidth;
      const scaleY = rect.height / naturalHeight;
      const scale = Math.min(scaleX, scaleY);

      // Set dimensions using the scaled size
      const scaledWidth = Math.floor(naturalWidth * scale);
      const scaledHeight = Math.floor(naturalHeight * scale);
      setImageDimensions({
        width: scaledWidth,
        height: scaledHeight
      });

      const containerRect = imageRef.current.parentElement?.getBoundingClientRect();
      if (containerRect) {
        const imageLeft = rect.left - containerRect.left;
        const imageTop = rect.top - containerRect.top;
        
        setImageBounds({ left: imageLeft, top: imageTop });

        // Only set initial cell sizes if they haven't been manually adjusted
        setCalibrationData(prev => ({

          ...prev,
          cellWidth: prev.cellWidth === 1 ? Math.floor(scaledWidth / prev.gridWidth) : prev.cellWidth,
          cellHeight: prev.cellHeight === 1 ? Math.floor(scaledHeight / prev.gridHeight) : prev.cellHeight,
          offsetX: Math.floor(imageLeft),
          offsetY: Math.floor(imageTop)
        }));
      }
    }
  };

  const handleImageError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Failed to load image:', error);
  };

  const handleCalibrationChange = (newCalibration: GridCalibrationData) => {
    // Keep existing cell sizes unless explicitly changed
    setCalibrationData(prev => ({
      ...prev,
      ...newCalibration,
      cellWidth: newCalibration.cellWidth !== prev.cellWidth ? newCalibration.cellWidth : prev.cellWidth,
      cellHeight: newCalibration.cellHeight !== prev.cellHeight ? newCalibration.cellHeight : prev.cellHeight
    }));
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

  const handleSolutionImported = (importedSolution: string[][]) => {
    setSolution(importedSolution);
  };

  // Add resize handler to update positions when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const containerRect = imageRef.current.parentElement?.getBoundingClientRect();
        
        if (containerRect) {
          const imageLeft = rect.left - containerRect.left;
          const imageTop = rect.top - containerRect.top;
          
          setImageBounds({ left: imageLeft, top: imageTop });
          
          setCalibrationData(prev => ({
            ...prev,
            offsetX: Math.floor(imageLeft),
            offsetY: Math.floor(imageTop)
          }));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const changeSong = async (song: 'christmas' | 'jingle-bells' | 'jingle' | 'song1' | 'song2') => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      // Pause current playback
      audioRef.current.pause();
      setIsPlaying(false);
      
      // Change the source
      setCurrentSong(song);
      audioRef.current.src = `/audio/${song}.mp3`;

      // Wait for the audio to be loaded before playing
      try {
        await audioRef.current.load();
        if (wasPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error('Error loading or playing audio:', error);
        setIsPlaying(false);
        alert('Could not load or play the selected song. Please try again.');
      }
    }
  };

  const toggleMusic = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.load();
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        alert('Could not play the audio. Please try again.');
      }
    }
  };

  const handleSaveGrid = () => {
    console.log('Save grid clicked');
    console.log('Grid data:', gridData);
    console.log('Grid data length:', gridData.length);
    console.log('Show save dialog state:', showSaveDialog);
    
    if (!gridData || !gridData.length) {
      console.log('No grid data available');
      alert('Please create a grid first');
      return;
    }
    
    console.log('Opening save dialog');
    setShowSaveDialog(true);
    console.log('Set show save dialog to true');
  };

  const handleSaveComplete = () => {
    console.log('Save completed, closing dialog');
    setShowSaveDialog(false);
    console.log('Set show save dialog to false');
  };

  const handlePrint = async () => {
    if (!imageUrl || !gridData.length) {
      alert('Please create a grid first');
      return;
    }
    await printPuzzle(imageUrl, gridData);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? '#F0F4F7' : '#1a1a1a';
  };

  const handleGridChange = (newGrid: CellState[][]) => {
    // Convert CellState[][] to GridCell[][]
    const convertedGrid: GridCell[][] = newGrid.map(row =>
      row.map(cell => ({
        letter: cell.letter,
        isBlocked: !cell.isEditable,
        number: null
      }))
    );
    setGridData(convertedGrid);
  };

  if (!imageUrl) {
    console.log('No imageUrl provided, returning null');
    return null;
  }

  return (
    <>
      <div className="App" style={{
        backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F4F7',
        minHeight: '100vh',
        height: '100vh',
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
          backgroundColor: isDarkMode ? '#1a1a1a' : theme.colors.secondary,
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '8px solid #BB2528',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
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

          {/* Ribbon Bow */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 6,
            width: '180px',
            height: '90px'
          }}>
            {/* Left loop */}
            <div style={{
              position: 'absolute',
              left: '10px',
              bottom: '15px',
              width: '70px',
              height: '45px',
              background: theme.colors.accent,
              borderRadius: '35px 35px 0 0',
              transform: 'rotate(-35deg)',
              transformOrigin: 'bottom right',
              boxShadow: '-2px -2px 6px rgba(0,0,0,0.1)'
            }} />

            {/* Right loop */}
            <div style={{
              position: 'absolute',
              right: '10px',
              bottom: '15px',
              width: '70px',
              height: '45px',
              background: theme.colors.accent,
              borderRadius: '35px 35px 0 0',
              transform: 'rotate(35deg)',
              transformOrigin: 'bottom left',
              boxShadow: '2px -2px 6px rgba(0,0,0,0.1)'
            }} />

            {/* Center knot */}
            <div style={{
              position: 'absolute',
              left: '50%',
              bottom: '10px',
              width: '40px',
              height: '25px',
              background: theme.colors.accent,
              transform: 'translateX(-50%)',
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              zIndex: 2
            }} />

            {/* Left tail */}
            <div style={{
              position: 'absolute',
              left: '50%',
              bottom: '-30px',
              width: '25px',
              height: '60px',
              background: theme.colors.accent,
              transform: 'translateX(-140%) rotate(15deg)',
              transformOrigin: 'top center',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.1)'
            }} />

            {/* Right tail */}
            <div style={{
              position: 'absolute',
              left: '50%',
              bottom: '-30px',
              width: '25px',
              height: '60px',
              background: theme.colors.accent,
              transform: 'translateX(40%) rotate(-15deg)',
              transformOrigin: 'top center',
              clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)',
              boxShadow: '-2px 2px 6px rgba(0,0,0,0.1)'
            }} />
          </div>

          {/* White workspace with clipping mask */}
          <div style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            right: '32px',
            bottom: '32px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            zIndex: 2
          }} />

          {/* Add Toolbar */}
          <Toolbar
            onSave={handleSaveGrid}
            onPrint={handlePrint}
            onToggleDarkMode={toggleDarkMode}
            isDarkMode={isDarkMode}
          />

          {/* Save Dialog */}
          {showSaveDialog && (
            <PuzzleSave
              grid={gridData}
              onClose={handleSaveComplete}
            />
          )}

          {/* Content container */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 200px)',
            backgroundColor: isDarkMode ? '#1a1a1a' : theme.colors.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: 2,
            padding: '32px'
          }}>
            <div style={{
              position: 'relative',
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="grid-container" ref={gridRef} style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Puzzle"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    height: '100%',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
                {imageDimensions.width > 0 && (
                  <GridOverlay
                    gridWidth={calibrationData.gridWidth}
                    gridHeight={calibrationData.gridHeight}
                    cellWidth={calibrationData.cellWidth}
                    cellHeight={calibrationData.cellHeight}
                    offsetX={calibrationData.offsetX}
                    offsetY={calibrationData.offsetY}
                    solution={solution}
                    imageWidth={imageDimensions.width}
                    imageHeight={imageDimensions.height}
                    onGridChange={handleGridChange}
                  />
                )}
              </div>
            </div>
          </div>

          <GridCalibration
            onCalibrationChange={handleCalibrationChange}
            onAutoDetect={handleAutoDetect}
            imageDimensions={imageDimensions}
          />

          <SolutionImport
            gridWidth={calibrationData.gridWidth}
            gridHeight={calibrationData.gridHeight}
            onSolutionImported={handleSolutionImported}
          />

          {/* Audio player */}
          <audio
            ref={audioRef}
            src={`/audio/${currentSong}.mp3`}
            loop
            preload="auto"
            onError={(e) => {
              console.error('Audio error:', e);
              setIsPlaying(false);
              alert('Could not load music file. Please try refreshing the page.');
            }}
          />
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'stretch',
            zIndex: 1000,
            minWidth: '180px',
            backgroundColor: theme.colors.background,
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            {/* Song Selection Buttons */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '8px',
              marginBottom: '10px'
            }}>
              {(['christmas', 'jingle-bells', 'jingle', 'song1', 'song2'] as const).map((song) => (
                <button
                  key={song}
                  onClick={() => changeSong(song)}
                  style={{
                    padding: '8px',
                    backgroundColor: currentSong === song ? (isPlaying ? '#d32f2f' : theme.colors.accent) : 'transparent',
                    color: theme.colors.text.inverse,
                    border: `2px solid ${isPlaying && currentSong === song ? '#d32f2f' : theme.colors.accent}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: theme.typography.fontSize.small,
                    transition: 'all 0.3s ease',
                    opacity: currentSong === song ? 1 : 0.7,
                    fontWeight: currentSong === song ? 'bold' : 'normal',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {currentSong === song ? '🎵 Playing' : song.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
            
            {/* Play/Stop Button */}
            <button
              onClick={toggleMusic}
              style={{
                padding: '12px 24px',
                backgroundColor: isPlaying ? '#d32f2f' : theme.colors.accent,
                color: theme.colors.text.inverse,
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontSize: theme.typography.fontSize.medium,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                userSelect: 'none',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
              }}
            >
              {isPlaying ? '🔇 Stop Music' : '🎵 Play Music'}
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={onNavigate}
            style={{
              position: 'absolute',
              top: '32px',
              left: '32px',
              padding: '8px 16px',
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.inverse,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>
      </div>

    </>
  );
};

export default Studio;
