import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Studio from './pages/Studio';
import theme from './styles/theme';
import Creator from './pages/Creator';
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
        transition: 'all 0.2s ease',
        opacity: isHovered ? 0.9 : 1,
        background: isActive ? 'rgba(255,255,255,0.1)' : 'none',
        border: 'none',
        padding: theme.spacing.sm + ' ' + theme.spacing.md,
        borderRadius: theme.borderRadius.small,
        cursor: 'pointer',
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily
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
      backgroundColor: theme.colors.primary,
      marginBottom: theme.spacing.lg,
      boxShadow: theme.shadows.medium
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
