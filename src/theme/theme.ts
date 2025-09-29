import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    neutral?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern blue
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // Modern pink
      light: '#f472b6',
      dark: '#be185d',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#8b5cf6', // Modern purple
      light: '#a78bfa',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    neutral: {
      main: '#6b7280',
      light: '#9ca3af',
      dark: '#374151',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 30px -6px rgb(0 0 0 / 0.1), 0 10px 12px -7px rgb(0 0 0 / 0.1)',
    '0 30px 35px -7px rgb(0 0 0 / 0.1), 0 12px 14px -8px rgb(0 0 0 / 0.1)',
    '0 35px 40px -8px rgb(0 0 0 / 0.1), 0 14px 16px -9px rgb(0 0 0 / 0.1)',
    '0 40px 45px -9px rgb(0 0 0 / 0.1), 0 16px 18px -10px rgb(0 0 0 / 0.1)',
    '0 45px 50px -10px rgb(0 0 0 / 0.1), 0 18px 20px -11px rgb(0 0 0 / 0.1)',
    '0 50px 55px -11px rgb(0 0 0 / 0.1), 0 20px 22px -12px rgb(0 0 0 / 0.1)',
    '0 55px 60px -12px rgb(0 0 0 / 0.1), 0 22px 24px -13px rgb(0 0 0 / 0.1)',
    '0 60px 65px -13px rgb(0 0 0 / 0.1), 0 24px 26px -14px rgb(0 0 0 / 0.1)',
    '0 65px 70px -14px rgb(0 0 0 / 0.1), 0 26px 28px -15px rgb(0 0 0 / 0.1)',
    '0 70px 75px -15px rgb(0 0 0 / 0.1), 0 28px 30px -16px rgb(0 0 0 / 0.1)',
    '0 75px 80px -16px rgb(0 0 0 / 0.1), 0 30px 32px -17px rgb(0 0 0 / 0.1)',
    '0 80px 85px -17px rgb(0 0 0 / 0.1), 0 32px 34px -18px rgb(0 0 0 / 0.1)',
    '0 85px 90px -18px rgb(0 0 0 / 0.1), 0 34px 36px -19px rgb(0 0 0 / 0.1)',
    '0 90px 95px -19px rgb(0 0 0 / 0.1), 0 36px 38px -20px rgb(0 0 0 / 0.1)',
    '0 95px 100px -20px rgb(0 0 0 / 0.1), 0 38px 40px -21px rgb(0 0 0 / 0.1)',
    '0 100px 105px -21px rgb(0 0 0 / 0.1), 0 40px 42px -22px rgb(0 0 0 / 0.1)',
    '0 105px 110px -22px rgb(0 0 0 / 0.1), 0 42px 44px -23px rgb(0 0 0 / 0.1)',
    '0 110px 115px -23px rgb(0 0 0 / 0.1), 0 44px 46px -24px rgb(0 0 0 / 0.1)',
    '0 115px 120px -24px rgb(0 0 0 / 0.1), 0 46px 48px -25px rgb(0 0 0 / 0.1)',
  ],
});

export default theme;
