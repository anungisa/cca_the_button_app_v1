import React, { Suspense } from 'react';
import SkeletonPage from './ui/SkeletonPage';

/**
 * A wrapper to standardize the loading of lazy-loaded pages/components.
 * It shows a consistent skeleton loading state.
 */
const LazyPageWrapper = ({ children, variant = 'dashboard' }) => {
  // Safety check to ensure children is provided
  if (!children) {
    return <SkeletonPage variant={variant} />;
  }

  return (
    <Suspense fallback={<SkeletonPage variant={variant} />}>
      {children}
    </Suspense>
  );
};

export default LazyPageWrapper;