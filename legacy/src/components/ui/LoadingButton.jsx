import React from 'react';
import { AccessibleButton } from './AccessibleButton';

/**
 * A button component with accessible loading states
 */
export const LoadingButton = ({
  isLoading,
  loadingText = "Loading...",
  children,
  ...props
}) => {
  return (
    <AccessibleButton
      isLoading={isLoading}
      loadingText={loadingText}
      {...props}
    >
      {children}
    </AccessibleButton>
  );
};