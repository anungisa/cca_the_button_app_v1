/**
 * Input Validation Service
 * Comprehensive validation and sanitization for all user inputs
 */

import { securityService } from './SecurityService';

class InputValidationService {
  // Email validation
  validateEmail(email) {
    if (!email || typeof email !== 'string') return { valid: false, error: 'Email is required' };
    
    const trimmed = email.trim();
    
    if (trimmed.length > 254) return { valid: false, error: 'Email is too long' };
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(trimmed)) {
      return { valid: false, error: 'Invalid email format' };
    }
    
    return { valid: true, sanitized: trimmed.toLowerCase() };
  }

  // Phone validation
  validatePhone(phone) {
    if (!phone) return { valid: true, sanitized: '' }; // Optional field
    
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 15) {
      return { valid: false, error: 'Phone number must be 10-15 digits' };
    }
    
    if (!/^\+?[0-9]+$/.test(cleaned)) {
      return { valid: false, error: 'Phone number contains invalid characters' };
    }
    
    return { valid: true, sanitized: cleaned };
  }

  // Text validation (names, descriptions, etc.)
  validateText(text, options = {}) {
    const {
      minLength = 1,
      maxLength = 500,
      allowHTML = false,
      allowSpecialChars = true,
      fieldName = 'Field'
    } = options;

    if (!text || typeof text !== 'string') {
      return { valid: false, error: `${fieldName} is required` };
    }

    const trimmed = text.trim();

    if (trimmed.length < minLength) {
      return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }

    if (trimmed.length > maxLength) {
      return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
    }

    // Check for malicious patterns
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i
    ];

    if (maliciousPatterns.some(pattern => pattern.test(trimmed))) {
      return { valid: false, error: `${fieldName} contains prohibited content` };
    }

    // Sanitize
    const sanitized = allowHTML 
      ? this.sanitizeHTMLSafe(trimmed)
      : securityService.sanitizeHTML(trimmed);

    if (!allowSpecialChars) {
      const alphanumericRegex = /^[a-zA-Z0-9\s\-_]+$/;
      if (!alphanumericRegex.test(sanitized)) {
        return { valid: false, error: `${fieldName} can only contain letters, numbers, spaces, hyphens and underscores` };
      }
    }

    return { valid: true, sanitized };
  }

  // Number validation
  validateNumber(value, options = {}) {
    const {
      min = null,
      max = null,
      integer = false,
      fieldName = 'Value'
    } = options;

    if (value === null || value === undefined || value === '') {
      return { valid: false, error: `${fieldName} is required` };
    }

    const num = Number(value);

    if (isNaN(num)) {
      return { valid: false, error: `${fieldName} must be a number` };
    }

    if (integer && !Number.isInteger(num)) {
      return { valid: false, error: `${fieldName} must be a whole number` };
    }

    if (min !== null && num < min) {
      return { valid: false, error: `${fieldName} must be at least ${min}` };
    }

    if (max !== null && num > max) {
      return { valid: false, error: `${fieldName} must be at most ${max}` };
    }

    return { valid: true, sanitized: num };
  }

  // URL validation
  validateURL(url, options = {}) {
    const { requireHTTPS = false, allowedDomains = null } = options;

    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required' };
    }

    const trimmed = url.trim();

    try {
      const urlObj = new URL(trimmed);

      // Protocol validation
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { valid: false, error: 'URL must use HTTP or HTTPS protocol' };
      }

      if (requireHTTPS && urlObj.protocol !== 'https:') {
        return { valid: false, error: 'URL must use HTTPS' };
      }

      // Domain whitelist
      if (allowedDomains && !allowedDomains.some(domain => urlObj.hostname.endsWith(domain))) {
        return { valid: false, error: 'URL domain is not allowed' };
      }

      return { valid: true, sanitized: trimmed };
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  // Date validation
  validateDate(dateString, options = {}) {
    const { minDate = null, maxDate = null, fieldName = 'Date' } = options;

    if (!dateString) {
      return { valid: false, error: `${fieldName} is required` };
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }

    if (minDate && date < new Date(minDate)) {
      return { valid: false, error: `${fieldName} must be after ${new Date(minDate).toLocaleDateString()}` };
    }

    if (maxDate && date > new Date(maxDate)) {
      return { valid: false, error: `${fieldName} must be before ${new Date(maxDate).toLocaleDateString()}` };
    }

    return { valid: true, sanitized: date.toISOString() };
  }

  // File validation
  validateFile(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      fieldName = 'File'
    } = options;

    if (!file) {
      return { valid: false, error: `${fieldName} is required` };
    }

    if (file.size > maxSize) {
      const maxMB = (maxSize / (1024 * 1024)).toFixed(1);
      return { valid: false, error: `${fieldName} must be smaller than ${maxMB}MB` };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `${fieldName} type not allowed. Allowed: ${allowedTypes.join(', ')}` };
    }

    // Check file extension matches MIME type
    const extension = file.name.split('.').pop().toLowerCase();
    const mimeToExtension = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/gif': ['gif'],
      'application/pdf': ['pdf']
    };

    const expectedExtensions = mimeToExtension[file.type] || [];
    if (!expectedExtensions.includes(extension)) {
      return { valid: false, error: 'File extension does not match file type' };
    }

    return { valid: true, file };
  }

  // Amount/Currency validation
  validateAmount(amount, options = {}) {
    const { min = 0, max = 1000000, currency = 'CAD' } = options;

    const validation = this.validateNumber(amount, {
      min,
      max,
      integer: false,
      fieldName: 'Amount'
    });

    if (!validation.valid) return validation;

    // Ensure 2 decimal places for currency
    const rounded = Math.round(validation.sanitized * 100) / 100;

    return {
      valid: true,
      sanitized: rounded,
      formatted: new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency
      }).format(rounded)
    };
  }

  // Sanitize HTML while allowing safe tags
  sanitizeHTMLSafe(dirty) {
    const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'];
    const allowedAttributes = {
      'a': ['href', 'title', 'target']
    };

    // This is a basic implementation - in production use DOMPurify
    let clean = dirty;

    // Remove script tags
    clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers
    clean = clean.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    clean = clean.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: protocol
    clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');

    return clean;
  }

  // Batch validation
  validateFormData(formData, schema) {
    const errors = {};
    const sanitized = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = formData[field];
      let result;

      switch (rules.type) {
        case 'email':
          result = this.validateEmail(value);
          break;
        case 'phone':
          result = this.validatePhone(value);
          break;
        case 'text':
          result = this.validateText(value, rules);
          break;
        case 'number':
          result = this.validateNumber(value, rules);
          break;
        case 'url':
          result = this.validateURL(value, rules);
          break;
        case 'date':
          result = this.validateDate(value, rules);
          break;
        case 'amount':
          result = this.validateAmount(value, rules);
          break;
        default:
          result = { valid: true, sanitized: value };
      }

      if (!result.valid) {
        errors[field] = result.error;
      } else {
        sanitized[field] = result.sanitized;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      sanitized
    };
  }
}

export const inputValidationService = new InputValidationService();
export default inputValidationService;