import { useState, useEffect } from 'react';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export const useResponsiveLayout = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });

      // Determine current breakpoint
      let breakpoint = 'xs';
      Object.entries(breakpoints).forEach(([name, minWidth]) => {
        if (width >= minWidth) {
          breakpoint = name;
        }
      });
      setCurrentBreakpoint(breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize.width < breakpoints.md;
  const isTablet = screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg;
  const isDesktop = screenSize.width >= breakpoints.lg;

  const getColumnsForBreakpoint = (breakpointConfig) => {
    if (typeof breakpointConfig === 'number') return breakpointConfig;
    
    return breakpointConfig[currentBreakpoint] || 
           breakpointConfig.default || 
           1;
  };

  return {
    screenSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    getColumnsForBreakpoint,
    // Utility functions
    showSidebar: !isMobile,
    showMobileMenu: isMobile,
    cardSpacing: isMobile ? 'gap-4' : 'gap-6',
    containerPadding: isMobile ? 'px-4' : 'px-6',
    headerHeight: isMobile ? 'h-14' : 'h-16'
  };
};