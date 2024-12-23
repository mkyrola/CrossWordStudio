import React, { useCallback, useState, useRef } from 'react';
import theme from '../../styles/theme';
import { validateImage } from '../../utils/imageValidation';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onNavigate: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onNavigate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleImageValidation = async (file: File) => {
    try {
      const result = await validateImage(file);
      if (result.isValid) {
        setError(null);
        onImageUpload(file);
      } else {
        setError(result.error || 'Invalid image file');
      }
    } catch (err) {
      setError('Error validating image');
      console.error('Image validation error:', err);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleImageValidation(file);
      e.dataTransfer.clearData();
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleImageValidation(file);
    }
  }, [onImageUpload]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: theme.colors.background,
      color: theme.colors.text.primary
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: theme.colors.text.primary
        }}>
          CrossWord Studio
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          color: theme.colors.text.secondary
        }}>
          Upload a crossword puzzle image to get started
        </p>

        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          style={{
            border: `2px dashed ${isDragging ? theme.colors.accent : theme.colors.border}`,
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragging ? `${theme.colors.accent}10` : 'transparent',
            transition: 'all 0.3s ease',
            marginBottom: '20px'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <div style={{
            marginBottom: '15px'
          }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDragging ? theme.colors.accent : theme.colors.text.secondary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div style={{
            fontSize: '1.1rem',
            color: isDragging ? theme.colors.accent : theme.colors.text.primary,
            marginBottom: '0.5rem'
          }}>
            {isDragging ? 'Drop image here' : 'Drag and drop image here'}
          </div>
          
          <div style={{
            fontSize: '0.9rem',
            color: theme.colors.text.secondary
          }}>
            or click to browse
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            color: theme.colors.error,
            marginBottom: '20px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: `${theme.colors.error}10`
          }}>
            {error}
          </div>
        )}

        {/* Navigation Button */}
        <button
          onClick={onNavigate}
          style={{
            padding: theme.spacing.md,
            backgroundColor: 'transparent',
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.medium,
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.colors.border}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Continue without image
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
