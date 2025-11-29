import React, { useEffect, useState, useRef, useCallback } from 'react';
import theme from '../styles/theme';
import GridCalibration, { GridCalibrationData } from '../components/GridCalibration';
import { GridOverlay, CellState } from '../components/GridOverlay';
import { SolutionImport } from '../components/SolutionImport';
import Toolbar from '../components/Toolbar';
import { detectGrid } from '../utils/gridDetection';
import { printPuzzle } from '../utils/exportUtils';
import { GridCell } from '../types/grid';
import SavePuzzleDialog from '../creator/components/SavePuzzleDialog';
import { generatePuzzleFiles, savePuzzleFiles } from '../creator/utils/puzzleFileGenerator';
import { useToast } from '../components/Toast';

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
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const { showToast } = useToast();

  // Only navigate away if there's no image URL on mount
  useEffect(() => {
    if (!imageUrl) {
      onNavigate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally run only on mount - imageUrl and onNavigate are stable

  // Initialize audio with error handling
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.onerror = () => {
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

  const handleImageError = () => {
    showToast('Failed to load image', 'error');
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
      showToast('Grid detected successfully', 'success');
    } else {
      showToast(result.error || 'Grid detection failed', 'error');
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
        setIsPlaying(false);
        showToast('Could not load or play the selected song', 'error');
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
        setIsPlaying(false);
        showToast('Could not play the audio', 'error');
      }
    }
  };

  const handleSaveGrid = () => {
    if (!solution || !solution.length) {
      showToast('Please import a solution first', 'warning');
      return;
    }
    
    if (!imageUrl) {
      showToast('Please upload an image first', 'warning');
      return;
    }
    
    setIsSaveDialogOpen(true);
  };

  const handleSavePuzzle = async (puzzleName: string) => {
    // Validate required data before attempting save
    if (!solution || solution.length === 0) {
      setSaveError('No solution data available to save');
      return;
    }
    
    if (!imageUrl) {
      setSaveError('No image available to save');
      return;
    }

    try {
      // Generate all puzzle files
      const files = generatePuzzleFiles(solution);

      // Get the image file from URL
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();

      // Save all files
      await savePuzzleFiles(puzzleName, files, imageBlob);

      // Close dialog and show success message
      setIsSaveDialogOpen(false);
      setSaveError(null);
      
      // Navigate back to home
      onNavigate();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save puzzle');
    }
  };

  const handlePrint = async () => {
    if (!imageUrl || !gridData.length) {
      showToast('Please create a grid first', 'warning');
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
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)', // Account for header
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        style={{
          display: 'none'
        }}
      />

      {/* Main Content Area */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: 'calc(100vh - 112px)' // Account for header (64px) and bottom controls (48px)
      }}>
        {/* Toolbar */}
        <Toolbar
          onSave={handleSaveGrid}
          onPrint={handlePrint}
          onToggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10
          }}
        />

        {/* Image and Grid Container */}
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'relative',
            maxHeight: '100%',
            maxWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Puzzle"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                maxHeight: 'calc(100vh - 184px)', // Account for header (64px), padding (32px), and bottom controls (48px)
                width: 'auto',
                objectFit: 'contain'
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

        {/* Controls Container */}
        <div style={{
          padding: '4px',
          backgroundColor: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
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
        </div>
      </div>

      {/* Music Controls - Floating */}
      <div style={{
        position: 'fixed',
        bottom: '32px',
        right: '8px',
        zIndex: 1000,
        backgroundColor: theme.colors.surface,
        padding: '8px',
        borderRadius: theme.borderRadius.medium,
        boxShadow: theme.shadows.medium,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        maxWidth: '160px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4px'
        }}>
          {(['christmas', 'jingle-bells', 'jingle', 'song1', 'song2'] as const).map((song) => (
            <button
              key={song}
              onClick={() => changeSong(song)}
              style={{
                padding: '4px',
                backgroundColor: currentSong === song ? (isPlaying ? theme.colors.error : theme.colors.accent) : 'transparent',
                color: theme.colors.text.inverse,
                border: `1px solid ${isPlaying && currentSong === song ? theme.colors.error : theme.colors.accent}`,
                borderRadius: theme.borderRadius.small,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.small,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {currentSong === song ? '🎵' : song.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
        <button
          onClick={toggleMusic}
          style={{
            padding: '8px',
            backgroundColor: isPlaying ? theme.colors.error : theme.colors.accent,
            color: theme.colors.text.inverse,
            border: 'none',
            borderRadius: theme.borderRadius.small,
            cursor: 'pointer',
            fontSize: theme.typography.fontSize.small
          }}
        >
          {isPlaying ? '🔇 Stop' : '🎵 Play'}
        </button>
      </div>

      {/* Back Button - Floating */}
      <button
        onClick={onNavigate}
        style={{
          position: 'fixed',
          top: '8px',
          left: '8px',
          padding: '4px 8px',
          backgroundColor: theme.colors.primary,
          color: theme.colors.text.inverse,
          border: 'none',
          borderRadius: theme.borderRadius.small,
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        ←
      </button>

      {/* Save Puzzle Dialog */}
      <SavePuzzleDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={handleSavePuzzle}
      />

      {/* Error Message */}
      {saveError && (
        <div style={{
          position: 'fixed',
          bottom: theme.spacing.lg,
          right: theme.spacing.lg,
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.error,
          color: theme.colors.text.inverse,
          borderRadius: theme.borderRadius.medium,
          boxShadow: theme.shadows.medium,
          zIndex: 1000
        }}>
          {saveError}
        </div>
      )}
    </div>
  );
};

export default Studio;
