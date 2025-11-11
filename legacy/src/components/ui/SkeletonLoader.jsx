import React from 'react';

/**
 * @file SkeletonLoader.js
 * @description A generic, reusable skeleton loader component to indicate loading states.
 * It provides a better user experience than a simple spinner by showing a placeholder
 * shape that mimics the final content layout.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional classes for custom styling.
 * @returns {JSX.Element} A shimmering, animated placeholder.
 */
const SkeletonLoader = ({ className }) => {
  return (
    <div className={`animate-pulse bg-brand-border rounded-lg ${className}`} />
  );
};

export default SkeletonLoader;