import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Studio from './pages/Studio';
import theme from './styles/theme';
import { Creator } from './pages/Creator';
import { Solver } from './solver/pages/Solver';

const CustomNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const navigate = useNavigate();
  const isActive = window.location.pathname === to;
  
  return (
    <button 
      onClick={() => navigate(to)}
      style={{
        color: theme.colors.text.inverse,
        marginRight: theme.spacing.lg,
        textDecoration: 'none',
        fontWeight: isActive ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium,
        transition: 'opacity 0.2s ease',
        opacity: isHovered ? 0.8 : 1,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontSize: 'inherit',
        fontFamily: 'inherit'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

const Navigation = () => {
  return (
    <nav style={{
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.secondary,
      marginBottom: theme.spacing.lg,
      boxShadow: '0 4px 6px rgba(187,37,40,0.15)'
    }}>
      <CustomNavLink to="/">Home</CustomNavLink>
      <CustomNavLink to="/creator">Creator</CustomNavLink>
      <CustomNavLink to="/solver">Solver</CustomNavLink>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App" style={{ 
        backgroundColor: theme.colors.background,
        minHeight: '100vh',
        fontFamily: theme.typography.fontFamily
      }}>
        <Navigation />
        <div className="snow-container">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="snowflake">❅</div>
          ))}
        </div>
        <Routes>
          <Route path="/" element={
            <div style={{ 
              textAlign: 'center', 
              padding: theme.spacing.xl,
              color: theme.colors.text.primary
            }}>
              <h1 style={{ 
                fontSize: theme.typography.fontSize.xlarge,
                marginBottom: theme.spacing.lg,
                color: theme.colors.secondary
              }}>
                Welcome to CrossWord Studio
              </h1>
              <p style={{ 
                fontSize: theme.typography.fontSize.large,
                color: theme.colors.text.secondary
              }}>
                Choose Creator to make puzzles or Solver to solve them
              </p>
            </div>
          } />
          <Route path="/creator" element={<Creator />} />
          <Route path="/solver" element={<Solver />} />
          <Route path="*" element={
            <div style={{ 
              textAlign: 'center', 
              padding: theme.spacing.xl,
              color: theme.colors.text.primary
            }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
