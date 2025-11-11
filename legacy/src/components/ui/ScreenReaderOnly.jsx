import React from 'react';

/**
 * @file ScreenReaderOnly.js
 * @description A utility component to visually hide content while keeping it
 * accessible to screen readers. Essential for accessibility features like skip links.
 */
export const ScreenReaderOnly = ({ as: Component = 'span', ...props }) => {
  return (
    <Component 
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
      {...props} 
    />
  );
};

/**
 * @description A specific implementation of ScreenReaderOnly for creating a "skip to content" link.
 * This should be the first focusable element on the page.
 */
export const SkipLink = ({ targetId = 'main-content' }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:border focus:border-black"
    >
      Skip to main content
    </a>
  );
};