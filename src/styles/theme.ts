const theme = {
  colors: {
    primary: '#146B3A',    // Christmas green
    secondary: '#BB2528',  // Christmas red
    accent: '#F8B229',     // Christmas gold/yellow
    background: '#F0F4F7', // Snow white
    surface: '#FFFFFF',    // Pure white
    text: {
      primary: '#2F4F4F',   // Dark slate gray for main text
      secondary: '#666666', // Medium gray for secondary text
      inverse: '#FFFFFF'    // White for text on dark backgrounds
    },
    border: '#146B3A',     // Christmas green
    success: '#146B3A',    // Christmas green
    error: '#BB2528'       // Christmas red
  },
  typography: {
    fontFamily: "'Playfair Display', 'Georgia', serif",  // More elegant, festive font
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '2rem'
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',   // Black shadows
    medium: '0 4px 6px rgba(0,0,0,0.15)',  // Black shadows
    large: '0 8px 16px rgba(0,0,0,0.2)'    // Black shadows
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px'
  }
} as const;

export default theme;
