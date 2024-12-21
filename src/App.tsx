import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './components/ImageUpload';
import Studio from './pages/Studio';
import { theme } from './styles/theme';

const App: React.FC = () => {
  const handleImageUpload = (file: File) => {
    // Handle the file upload
    console.log('File uploaded:', file.name);
  };

  return (
    <Router>
      <div className="App">
        <div className="snow-container">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="snowflake">❅</div>
          ))}
        </div>
        <Routes>
          <Route 
            path="/" 
            element={
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
                  <ImageUpload onImageUpload={handleImageUpload} />
                </header>
              </div>
            } 
          />
          <Route path="/studio" element={<Studio />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
