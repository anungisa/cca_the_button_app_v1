import { useState, useEffect } from 'react';

/**
 * Custom hook to detect media queries
 * @param {string} query - Media query string
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    // Safe check for window object (SSR compatibility)
    if (typeof window === 'undefined') return false;
    
    try {
      return window.matchMedia(query).matches;
    } catch (error) {
      console.error('Error with matchMedia:', error);
      return false;
    }
  });

  useEffect(() => {
    // Safe check for window object
    if (typeof window === 'undefined') return;

    let mediaQuery;
    
    try {
      mediaQuery = window.matchMedia(query);
    } catch (error) {
      console.error('Error creating media query:', error);
      return;
    }

    const updateMatches = (e) => {
      setMatches(e.matches);
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatches);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(updateMatches);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMatches);
      } else {
        mediaQuery.removeListener(updateMatches);
      }
    };
  }, [query]);

  return matches;
}