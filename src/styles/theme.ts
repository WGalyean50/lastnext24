// Central theme configuration for LastNext24
export const theme = {
  colors: {
    // Primary Blue Palette
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main brand blue
      600: '#2563eb', // Hover states
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    
    // White & Gray Palette
    white: '#ffffff',
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9', 
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    
    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b', 
    error: '#ef4444',
    info: '#3b82f6',
    
    // Background Colors
    background: {
      primary: '#f8fafc', // Light gray background
      secondary: '#ffffff', // Pure white
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Landing page gradient
    }
  },
  
  // Typography
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px  
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem'      // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500, 
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.6
    }
  },
  
  // Spacing
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem'   // 64px
  },
  
  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    blue: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    sm: '480px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px'
  },
  
  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  },
  
  // Transitions
  transitions: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.3s ease'
  }
} as const;

// Type for the theme
export type Theme = typeof theme;

// CSS Helper functions for styled-components
export const css = {
  // Button variants
  button: {
    primary: `
      background: ${theme.colors.primary[500]};
      color: ${theme.colors.white};
      border: none;
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      border-radius: ${theme.borderRadius.md};
      font-weight: ${theme.typography.fontWeight.semibold};
      cursor: pointer;
      transition: all ${theme.transitions.base};
      box-shadow: ${theme.shadows.blue};
      
      &:hover {
        background: ${theme.colors.primary[600]};
        transform: translateY(-1px);
        box-shadow: ${theme.shadows.lg};
      }
      
      &:active {
        transform: translateY(0);
      }
      
      &:disabled {
        background: ${theme.colors.gray[300]};
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    `,
    
    secondary: `
      background: transparent;
      color: ${theme.colors.gray[600]};
      border: 1px solid ${theme.colors.gray[300]};
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      border-radius: ${theme.borderRadius.md};
      font-weight: ${theme.typography.fontWeight.medium};
      cursor: pointer;
      transition: all ${theme.transitions.base};
      
      &:hover {
        border-color: ${theme.colors.primary[500]};
        color: ${theme.colors.primary[600]};
      }
    `,
    
    ghost: `
      background: transparent;
      color: ${theme.colors.primary[500]};
      border: none;
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      border-radius: ${theme.borderRadius.md};
      font-weight: ${theme.typography.fontWeight.medium};
      cursor: pointer;
      transition: all ${theme.transitions.base};
      
      &:hover {
        background: ${theme.colors.primary[50]};
        color: ${theme.colors.primary[600]};
      }
    `
  },
  
  // Card styles
  card: `
    background: ${theme.colors.white};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.base};
    transition: box-shadow ${theme.transitions.base};
    
    &:hover {
      box-shadow: ${theme.shadows.md};
    }
  `,
  
  // Input styles  
  input: `
    width: 100%;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.gray[300]};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.typography.fontSize.base};
    transition: border-color ${theme.transitions.base};
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
    }
  `
};