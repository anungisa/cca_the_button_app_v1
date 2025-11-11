/**
 * Data validation utilities for production safety
 */

export const validators = {
  // Validate user object
  isValidUser: (user) => {
    if (!user) return false;
    if (typeof user.id !== 'string' || user.id.length === 0) return false;
    if (user.id.includes('sample')) return false;
    if (!user.email || typeof user.email !== 'string') return false;
    return true;
  },

  // Validate entity ID
  isValidEntityId: (id) => {
    if (!id || typeof id !== 'string') return false;
    if (id.includes('sample')) return false;
    if (id.length < 10) return false; // Base44 IDs are typically longer
    return true;
  },

  // Validate email
  isValidEmail: (email) => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Canadian format)
  isValidPhone: (phone) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  },

  // Validate date string
  isValidDate: (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },

  // Validate URL
  isValidUrl: (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validate XP amount
  isValidXP: (xp) => {
    if (typeof xp !== 'number') return false;
    if (xp < 0 || xp > 1000000) return false; // Reasonable limits
    return true;
  },

  // Sanitize string input
  sanitizeString: (str, maxLength = 1000) => {
    if (!str || typeof str !== 'string') return '';
    return str.trim().slice(0, maxLength);
  },

  // Validate tier name
  isValidTier: (tier) => {
    const validTiers = [
      'granite_rookie',
      'sheet_star',
      'house_hero',
      'button_boss',
      'hack_master',
      'granite_legacy'
    ];
    return validTiers.includes(tier);
  }
};

/**
 * Safe data extractor - returns default if data is invalid
 */
export const safeGet = (obj, path, defaultValue = null) => {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) return defaultValue;
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Validate and clean entity data before API calls
 */
export const cleanEntityData = (data, requiredFields = []) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data object');
  }

  // Check required fields
  for (const field of requiredFields) {
    if (!(field in data) || data[field] === null || data[field] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Remove undefined values
  const cleaned = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }

  return cleaned;
};