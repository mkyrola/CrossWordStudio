import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../styles/theme';
import ImageUpload from '../creator/components/ImageUpload';
import Studio from './Studio';

const Creator: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleNavigateBack = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.colors.background,
      overflow: 'hidden'
    }}>
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {imageUrl ? (
          <Studio imageUrl={imageUrl} onNavigate={handleNavigateBack} />
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.lg
          }}>
            <ImageUpload onImageUpload={handleImageUpload} onNavigate={() => navigate('/')} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Creator;
