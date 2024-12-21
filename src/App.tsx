import React from 'react';
import './App.css';
import { theme } from './styles/theme';

function App() {
  // Create more snowflakes with different characters
  const snowflakes = Array(20).fill('').map(() => {
    const flakes = ['❅', '❆', '❄'];
    return flakes[Math.floor(Math.random() * flakes.length)];
  });

  return (
    <div className="App">
      {/* Snow effect */}
      <div className="snow-container">
        {snowflakes.map((flake, index) => (
          <div 
            key={index} 
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 6}s, ${3 + Math.random() * 2}s`,
              animationDelay: `${Math.random() * 4}s, ${Math.random() * 2}s`,
              fontSize: `${1.2 + Math.random()}em`
            }}
          >
            {flake}
          </div>
        ))}
      </div>

      <div className="content-card">
        <header className="App-header">
          <h1 style={{ 
            fontSize: theme.typography.fontSize.xlarge,
            fontFamily: theme.typography.fontFamily,
            color: theme.colors.primary
          }}>
            Arto's CrossWord Studio
          </h1>
          <p style={{
            fontSize: theme.typography.fontSize.medium,
            marginTop: theme.spacing.md,
            color: theme.colors.text.secondary
          }}>
            Create festive crossword puzzles for your Christmas cards!
          </p>
          <button 
            className="christmas-button"
            style={{
              marginTop: theme.spacing.lg
            }}
          >
            Upload Puzzle Image
          </button>
        </header>
      </div>
    </div>
  );
}

export default App;
