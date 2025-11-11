/**
 * Secure Input Component
 * Input with built-in sanitization and XSS protection
 */

import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { securityService } from '../services/SecurityService';
import { cn } from '@/components/utils/cn';

export function SecureInput({ 
  value, 
  onChange, 
  maxLength = 500,
  allowHTML = false,
  sanitize = true,
  type = "text",
  className,
  ...props 
}) {
  const handleChange = useCallback((e) => {
    let newValue = e.target.value;

    if (sanitize && type !== 'password') {
      newValue = securityService.sanitizeInput(newValue, {
        maxLength,
        allowHTML,
        trimWhitespace: false // Don't trim while typing
      });
    }

    onChange({ ...e, target: { ...e.target, value: newValue } });
  }, [onChange, sanitize, maxLength, allowHTML, type]);

  return (
    <Input
      type={type}
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      className={cn("bg-brand-card-bg border-brand-border text-brand-text-primary", className)}
      {...props}
    />
  );
}

export default SecureInput;