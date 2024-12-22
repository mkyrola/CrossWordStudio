import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Studio from '../../pages/Studio';
import ImageUpload from '../../components/ImageUpload';
import theme from '../../styles/theme';

export const Creator: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const navigate = useNavigate();

  const handleImageUpload = async (file: File) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
    } catch (error) {
      console.error('Error creating object URL:', error);
    }
  };

  const handleNavigate = () => {
    navigate('/');
  };

  if (!imageUrl) {
    return (
      <div style={{
        padding: theme.spacing.xl,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing.lg,
        backgroundColor: theme.colors.background,
        minHeight: '100vh',
        fontFamily: theme.typography.fontFamily
      }}>
        <h1 style={{
          fontSize: theme.typography.fontSize.xlarge,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.lg
        }}>
          Create New Puzzle
        </h1>
        <ImageUpload 
          onImageUpload={handleImageUpload}
          onNavigate={handleNavigate}
        />
      </div>
    );
  }

  return (
    <Studio 
      imageUrl={imageUrl} 
      onNavigate={() => {
        URL.revokeObjectURL(imageUrl); // Clean up the object URL
        setImageUrl('');
        navigate('/creator');
      }} 
    />
  );
};
