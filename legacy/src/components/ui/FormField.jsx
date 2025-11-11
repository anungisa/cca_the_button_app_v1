import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/utils/cn';

/**
 * An accessible form field component with proper labeling and error handling
 */
export const FormField = ({
  children,
  label,
  error,
  required = false,
  description,
  className,
  id,
  ...props
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label htmlFor={fieldId} className="text-sm font-medium text-brand-text-primary">
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}
      
      {description && (
        <p id={descriptionId} className="text-sm text-brand-text-secondary">
          {description}
        </p>
      )}
      
      {React.cloneElement(children, {
        id: fieldId,
        'aria-invalid': !!error,
        'aria-describedby': [
          error ? errorId : null,
          description ? descriptionId : null
        ].filter(Boolean).join(' ') || undefined,
        'aria-required': required
      })}
      
      {error && (
        <p id={errorId} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};