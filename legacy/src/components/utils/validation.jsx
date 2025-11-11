// Validation utilities for form data and API responses
export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    pattern: /^(\+1)?[\s.-]?\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/,
    message: 'Please enter a valid phone number'
  },
  postalCode: {
    pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    message: 'Please enter a valid Canadian postal code'
  },
  strongPassword: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  },
  url: {
    pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    message: 'Please enter a valid URL'
  }
};

export const validateField = (value, rules) => {
  const errors = [];

  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('This field is required');
    return errors;
  }

  if (value && rules.minLength && value.toString().length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  if (value && rules.maxLength && value.toString().length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters`);
  }

  if (value && rules.pattern && !rules.pattern.test(value.toString())) {
    errors.push(rules.message || 'Invalid format');
  }

  if (value && rules.min && Number(value) < rules.min) {
    errors.push(`Must be at least ${rules.min}`);
  }

  if (value && rules.max && Number(value) > rules.max) {
    errors.push(`Must be no more than ${rules.max}`);
  }

  if (rules.custom && typeof rules.custom === 'function') {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return errors;
};

export const validateForm = (data, schema) => {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach(field => {
    const fieldErrors = validateField(data[field], schema[field]);
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Common validation schemas
export const ProfileValidationSchema = {
  full_name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    pattern: ValidationRules.email.pattern,
    message: ValidationRules.email.message
  },
  phone: {
    pattern: ValidationRules.phone.pattern,
    message: ValidationRules.phone.message
  }
};

export const EventValidationSchema = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 200
  },
  start_date: {
    required: true,
    custom: (value) => {
      if (new Date(value) < new Date()) {
        return 'Start date cannot be in the past';
      }
      return null;
    }
  },
  end_date: {
    required: true,
    custom: (value, data) => {
      if (data.start_date && new Date(value) <= new Date(data.start_date)) {
        return 'End date must be after start date';
      }
      return null;
    }
  }
};

export const validateProfileData = (data) => {
  return validateForm(data, ProfileValidationSchema);
};

export const validateEventData = (data) => {
  return validateForm(data, EventValidationSchema);
};

// API Response validation
export const validateApiResponse = (response, expectedSchema) => {
  try {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format');
    }

    // Basic structure validation
    if (expectedSchema.required) {
      expectedSchema.required.forEach(field => {
        if (!(field in response)) {
          throw new Error(`Missing required field: ${field}`);
        }
      });
    }

    return { isValid: true, data: response };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};