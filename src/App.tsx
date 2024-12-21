import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Studio from './pages/Studio';
import theme from './styles/theme';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'studio'>('home');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const handleImageUpload = (file: File) => {
    try {
      // Create an object URL for the uploaded file
      const newImageUrl = URL.createObjectURL(file);
      console.log('Created image URL:', newImageUrl);
      setImageUrl(newImageUrl);
    } catch (error) {
      console.error('Error creating object URL:', error);
    }
  };

  const handleNavigateToStudio = () => {
    console.log('Navigating to studio...');
    setCurrentPage('studio');
  };

  const handleNavigateToHome = () => {
    console.log('Navigating to home...');
    if (imageUrl) {
      console.log('Revoking URL:', imageUrl);
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
    setCurrentPage('home');
  };

  return (
    <div className="App">
      <div className="snow-container">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="snowflake">❅</div>
        ))}
      </div>
      {currentPage === 'home' ? (
        <div className="content-card">
          <header className="App-header">
            <h1 style={{ 
              fontSize: theme.typography.fontSize.xlarge,
              fontFamily: theme.typography.fontFamily,
              color: theme.colors.primary,
              marginBottom: theme.spacing.md
            }}>
              Arto's CrossWord Studio
            </h1>
            <p style={{
              fontSize: theme.typography.fontSize.medium,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.xl
            }}>
              Create festive crossword puzzles for your Christmas cards!
            </p>
            <ImageUpload 
              onImageUpload={handleImageUpload} 
              onNavigate={handleNavigateToStudio}
            />
          </header>
        </div>
      ) : (
        <Studio 
          imageUrl={imageUrl} 
          onNavigate={handleNavigateToHome} 
        />
      )}
    </div>
  );
};

export default App;
