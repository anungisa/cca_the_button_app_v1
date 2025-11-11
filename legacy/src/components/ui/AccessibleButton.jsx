import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/components/utils/cn';

/**
 * An accessible button component with proper ARIA attributes and loading states
 */
export const AccessibleButton = React.forwardRef(({
  children,
  isLoading = false,
  loadingText,
  disabled,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  className,
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;
  
  return (
    <Button
      ref={ref}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading}
      className={cn(
        "focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {isLoading && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading</span>
        </>
      )}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
});

AccessibleButton.displayName = "AccessibleButton";