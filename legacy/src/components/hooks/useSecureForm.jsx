/**
 * Secure Form Hook
 * Provides CSRF protection, input validation, and rate limiting for forms
 */

import { useState, useCallback, useRef } from 'react';
import { securityService } from '../services/SecurityService';
import { rateLimiter } from '../services/RateLimiter';
import { useXP } from '../XPContext';
import { useToast } from './use-toast';

export function useSecureForm(options = {}) {
  const {
    onSubmit,
    validationRules = {},
    rateLimitType = 'mutations',
    sanitizeInputs = true,
    requireCSRF = true
  } = options;

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useXP();
  const { toast } = useToast();
  const csrfToken = useRef(securityService.getCSRFToken());

  const validateField = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${fieldName} is required`;
    }

    // Type-specific validation
    if (value) {
      if (rules.type === 'email' && !securityService.validateEmail(value)) {
        return 'Invalid email format';
      }

      if (rules.type === 'phone' && !securityService.validatePhone(value)) {
        return 'Invalid phone number';
      }

      if (rules.type === 'url' && !securityService.validateURL(value)) {
        return 'Invalid URL';
      }

      if (rules.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) return 'Must be a number';
        if (rules.min && num < rules.min) return `Must be at least ${rules.min}`;
        if (rules.max && num > rules.max) return `Must be no more than ${rules.max}`;
      }

      // Length validation
      if (rules.minLength && value.length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `Must be no more than ${rules.maxLength} characters`;
      }

      // Pattern validation
      if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
        return rules.patternMessage || 'Invalid format';
      }

      // Custom validation
      if (rules.custom) {
        const error = rules.custom(value, formData);
        if (error) return error;
      }
    }

    return null;
  }, [validationRules, formData]);

  const updateField = useCallback((fieldName, value) => {
    // Sanitize input if enabled
    const sanitizedValue = sanitizeInputs && typeof value === 'string'
      ? securityService.sanitizeInput(value, validationRules[fieldName]?.sanitizeOptions || {})
      : value;

    setFormData(prev => ({
      ...prev,
      [fieldName]: sanitizedValue
    }));

    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, [sanitizeInputs, validationRules]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField, validationRules]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    // Validate all fields
    if (!validateAll()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fix the errors in the form'
      });
      return;
    }

    // Check rate limit
    if (user?.id) {
      try {
        const allowed = await rateLimiter.checkLimit(user.id, rateLimitType);
        if (!allowed) {
          toast({
            variant: 'destructive',
            title: 'Too Many Requests',
            description: 'Please wait a moment before trying again'
          });
          return;
        }
      } catch (error) {
        console.error('Rate limit check failed:', error);
      }
    }

    // Verify CSRF token
    if (requireCSRF) {
      const tokenValid = securityService.validateCSRFToken(csrfToken.current);
      if (!tokenValid) {
        toast({
          variant: 'destructive',
          title: 'Security Error',
          description: 'Invalid security token. Please refresh the page.'
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Add CSRF token to form data
      const submitData = {
        ...formData,
        _csrf: csrfToken.current
      };

      await onSubmit(submitData);
      
      // Reset form on success
      setFormData({});
      setErrors({});
      
      // Generate new CSRF token
      csrfToken.current = securityService.generateCSRFToken();
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateAll, onSubmit, requireCSRF, rateLimitType, user, toast]);

  const reset = useCallback(() => {
    setFormData({});
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    reset,
    validateField,
    setFormData,
    csrfToken: csrfToken.current
  };
}