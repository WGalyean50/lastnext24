import { theme } from './theme';

// Responsive utilities for styled-components
export const media = {
  // Mobile-first breakpoints
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  
  // Max-width breakpoints (for mobile-first approach)
  maxSm: `@media (max-width: calc(${theme.breakpoints.sm} - 1px))`,
  maxMd: `@media (max-width: calc(${theme.breakpoints.md} - 1px))`,
  maxLg: `@media (max-width: calc(${theme.breakpoints.lg} - 1px))`,
  maxXl: `@media (max-width: calc(${theme.breakpoints.xl} - 1px))`,
  
  // Common device targets
  mobile: `@media (max-width: calc(${theme.breakpoints.md} - 1px))`,
  tablet: `@media (min-width: ${theme.breakpoints.md}) and (max-width: calc(${theme.breakpoints.lg} - 1px))`,
  desktop: `@media (min-width: ${theme.breakpoints.lg})`,
  
  // Orientation queries
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',
  
  // Touch vs non-touch
  hover: '@media (hover: hover)',
  touch: '@media (hover: none)'
};

// Container utilities
export const container = {
  maxWidth: '1400px',
  padding: {
    mobile: theme.spacing.md,
    tablet: theme.spacing.lg,
    desktop: theme.spacing.xl
  },
  css: `
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.md};
    
    ${media.md} {
      padding: 0 ${theme.spacing.lg};
    }
    
    ${media.lg} {
      padding: 0 ${theme.spacing.xl};
    }
  `
};

// Grid utilities
export const grid = {
  // Responsive grid columns
  columns: (cols: { sm?: number; md?: number; lg?: number; xl?: number }) => `
    display: grid;
    gap: ${theme.spacing.md};
    grid-template-columns: 1fr;
    
    ${cols.sm && media.sm} {
      grid-template-columns: repeat(${cols.sm}, 1fr);
    }
    
    ${cols.md && media.md} {
      grid-template-columns: repeat(${cols.md}, 1fr);
    }
    
    ${cols.lg && media.lg} {
      grid-template-columns: repeat(${cols.lg}, 1fr);
    }
    
    ${cols.xl && media.xl} {
      grid-template-columns: repeat(${cols.xl}, 1fr);
    }
  `,
  
  // Responsive gap
  gap: (gaps: { mobile?: string; tablet?: string; desktop?: string }) => `
    gap: ${gaps.mobile || theme.spacing.md};
    
    ${media.md} {
      gap: ${gaps.tablet || theme.spacing.lg};
    }
    
    ${media.lg} {
      gap: ${gaps.desktop || theme.spacing.xl};
    }
  `
};

// Flexbox utilities
export const flex = {
  // Responsive flex direction
  direction: (directions: { mobile?: string; tablet?: string; desktop?: string }) => `
    flex-direction: ${directions.mobile || 'column'};
    
    ${media.md} {
      flex-direction: ${directions.tablet || directions.mobile || 'column'};
    }
    
    ${media.lg} {
      flex-direction: ${directions.desktop || directions.tablet || directions.mobile || 'column'};
    }
  `,
  
  // Responsive alignment
  align: (alignments: { mobile?: string; tablet?: string; desktop?: string }) => `
    align-items: ${alignments.mobile || 'stretch'};
    
    ${media.md} {
      align-items: ${alignments.tablet || alignments.mobile || 'stretch'};
    }
    
    ${media.lg} {
      align-items: ${alignments.desktop || alignments.tablet || alignments.mobile || 'stretch'};
    }
  `
};

// Typography utilities
export const typography = {
  // Responsive font sizes
  fontSize: (sizes: { mobile?: string; tablet?: string; desktop?: string }) => `
    font-size: ${sizes.mobile || theme.typography.fontSize.base};
    
    ${media.md} {
      font-size: ${sizes.tablet || sizes.mobile || theme.typography.fontSize.base};
    }
    
    ${media.lg} {
      font-size: ${sizes.desktop || sizes.tablet || sizes.mobile || theme.typography.fontSize.base};
    }
  `,
  
  // Responsive line heights
  lineHeight: (heights: { mobile?: string; tablet?: string; desktop?: string }) => `
    line-height: ${heights.mobile || theme.typography.lineHeight.normal};
    
    ${media.md} {
      line-height: ${heights.tablet || heights.mobile || theme.typography.lineHeight.normal};
    }
    
    ${media.lg} {
      line-height: ${heights.desktop || heights.tablet || heights.mobile || theme.typography.lineHeight.normal};
    }
  `
};

// Spacing utilities
export const spacing = {
  // Responsive padding
  padding: (paddings: { mobile?: string; tablet?: string; desktop?: string }) => `
    padding: ${paddings.mobile || theme.spacing.md};
    
    ${media.md} {
      padding: ${paddings.tablet || paddings.mobile || theme.spacing.md};
    }
    
    ${media.lg} {
      padding: ${paddings.desktop || paddings.tablet || paddings.mobile || theme.spacing.md};
    }
  `,
  
  // Responsive margin
  margin: (margins: { mobile?: string; tablet?: string; desktop?: string }) => `
    margin: ${margins.mobile || '0'};
    
    ${media.md} {
      margin: ${margins.tablet || margins.mobile || '0'};
    }
    
    ${media.lg} {
      margin: ${margins.desktop || margins.tablet || margins.mobile || '0'};
    }
  `
};

// Visibility utilities
export const visibility = {
  // Hide on specific breakpoints
  hideOnMobile: `${media.maxMd} { display: none; }`,
  hideOnTablet: `${media.tablet} { display: none; }`,
  hideOnDesktop: `${media.desktop} { display: none; }`,
  
  // Show only on specific breakpoints
  showOnMobileOnly: `
    display: block;
    ${media.md} { display: none; }
  `,
  showOnTabletOnly: `
    display: none;
    ${media.tablet} { display: block; }
    ${media.lg} { display: none; }
  `,
  showOnDesktopOnly: `
    display: none;
    ${media.lg} { display: block; }
  `
};