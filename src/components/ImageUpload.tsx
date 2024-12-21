import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import { validateImage } from '../utils/imageValidation';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageValidation = async (file: File) => {
    const result = await validateImage(file);
    if (result.isValid) {
      setError(null);
      onImageUpload(file);
      // Store the image URL in localStorage instead of sessionStorage
      const imageUrl = URL.createObjectURL(file);
      localStorage.setItem('puzzleImageUrl', imageUrl);
      navigate('/studio');
    } else {
      setError(result.error || 'Invalid image file');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      await handleImageValidation(imageFile);
    }
  }, []);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await handleImageValidation(files[0]);
    }
  }, []);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: `3px dashed ${isDragging ? theme.colors.primary : theme.colors.secondary}`,
        borderRadius: '16px',
        padding: theme.spacing.xl,
        textAlign: 'center',
        backgroundColor: isDragging ? `${theme.colors.primary}10` : 'transparent',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: isDragging ? theme.shadows.large : 'none'
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
        <div 
          style={{ 
            marginBottom: theme.spacing.md,
            backgroundColor: theme.colors.secondary,
            width: '140px',
            height: '140px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 6px 12px rgba(187,37,40,0.3)',
            border: '6px solid #BB2528',
            transition: 'transform 0.2s ease',
            transform: isDragging ? 'scale(1.05)' : 'scale(1)',
            background: `linear-gradient(135deg, 
              ${theme.colors.secondary} 0%, 
              #d42d30 50%, 
              ${theme.colors.secondary} 100%)`
          }}
        >
          {/* Horizontal Ribbon */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '-12px',
            right: '-12px',
            height: '24px',
            backgroundColor: theme.colors.accent,
            transform: 'translateY(-50%)',
            boxShadow: '0 2px 4px rgba(248,178,41,0.3)',
            borderRadius: '4px'
          }} />

          {/* Vertical Ribbon */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '-12px',
            bottom: '-12px',
            width: '24px',
            backgroundColor: theme.colors.accent,
            transform: 'translateX(-50%)',
            boxShadow: '0 2px 4px rgba(248,178,41,0.3)',
            borderRadius: '4px'
          }} />

          {/* Ribbon Bow - Left Loop */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            marginLeft: '-20px',
            width: '20px',
            height: '20px',
            backgroundColor: theme.colors.accent,
            borderRadius: '20px 0 0 20px',
            transform: 'rotate(-15deg)',
            boxShadow: '0 2px 4px rgba(248,178,41,0.3)'
          }} />

          {/* Ribbon Bow - Right Loop */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            width: '20px',
            height: '20px',
            backgroundColor: theme.colors.accent,
            borderRadius: '0 20px 20px 0',
            transform: 'rotate(15deg)',
            boxShadow: '0 2px 4px rgba(248,178,41,0.3)'
          }} />

          {/* Ribbon Bow - Center Knot */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            width: '14px',
            height: '14px',
            backgroundColor: theme.colors.accent,
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            boxShadow: '0 2px 4px rgba(248,178,41,0.3)',
            zIndex: 2
          }} />

          <span role="img" aria-label="upload" style={{ 
            fontSize: '3.5em',
            color: '#FFFFFF',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            position: 'relative',
            zIndex: 1
          }}>
            📷
          </span>
        </div>
        <p style={{ 
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing.sm,
          fontSize: theme.typography.fontSize.large
        }}>
          Drag and Drop your puzzle image to the package
        </p>
        <p style={{ 
          color: theme.colors.text.secondary,
          fontSize: theme.typography.fontSize.small,
          opacity: 0.7
        }}>
          or click to select a file
        </p>
      </label>
      {error && (
        <p style={{
          color: theme.colors.error,
          marginTop: theme.spacing.md,
          fontSize: theme.typography.fontSize.small,
          fontWeight: theme.typography.fontWeight.medium
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
