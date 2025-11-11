/**
 * Secure Textarea Component
 * Textarea with built-in sanitization
 */

import React, { useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { securityService } from '../services/SecurityService';
import { cn } from '@/components/utils/cn';

export function SecureTextarea({ 
  value, 
  onChange, 
  maxLength = 2000,
  allowHTML = false,
  sanitize = true,
  className,
  ...props 
}) {
  const handleChange = useCallback((e) => {
    let newValue = e.target.value;

    if (sanitize) {
      newValue = securityService.sanitizeInput(newValue, {
        maxLength,
        allowHTML,
        trimWhitespace: false
      });
    }

    onChange({ ...e, target: { ...e.target, value: newValue } });
  }, [onChange, sanitize, maxLength, allowHTML]);

  return (
    <Textarea
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      className={cn("bg-brand-card-bg border-brand-border text-brand-text-primary", className)}
      {...props}
    />
  );
}

export default SecureTextarea;