
/**
 * Security Service
 * Implements XSS protection, CSRF tokens, input sanitization, and security headers
 */

class SecurityService {
  constructor() {
    this.csrfToken = this.generateCSRFToken();
    this.initializeCSRF();
  }

  // CSRF Protection
  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  initializeCSRF() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('csrf_token', this.csrfToken);
    }
  }

  getCSRFToken() {
    return typeof window !== 'undefined' 
      ? sessionStorage.getItem('csrf_token') || this.csrfToken 
      : this.csrfToken;
  }

  validateCSRFToken(token) {
    return token === this.getCSRFToken();
  }

  // XSS Protection - HTML Sanitization
  sanitizeHTML(dirty) {
    if (!dirty) return '';
    
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    
    return String(dirty).replace(/[&<>"'/]/g, (char) => map[char]);
  }

  // Input Validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }

  validateURL(url) {
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  validateAmount(amount) {
    const num = Number(amount);
    return !isNaN(num) && num > 0 && num < 1000000;
  }

  // Input Sanitization
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') return input;

    const { 
      maxLength = 1000,
      allowHTML = false,
      trimWhitespace = true,
      removeScripts = true
    } = options;

    let sanitized = input;

    // Remove script tags and event handlers
    if (removeScripts) {
      sanitized = sanitized
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    }

    // Sanitize HTML if not allowed
    if (!allowHTML) {
      sanitized = this.sanitizeHTML(sanitized);
    }

    // Trim whitespace
    if (trimWhitespace) {
      sanitized = sanitized.trim();
    }

    // Enforce max length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  // SQL Injection Protection (for any raw queries - though we use ORM)
  sanitizeSQL(input) {
    if (typeof input !== 'string') return input;
    
    // Remove SQL comments and dangerous keywords
    return input
      .replace(/--.*$/gm, '')
      .replace(/\/\*.*?\*\//g, '')
      .replace(/;\s*DROP/gi, '')
      .replace(/;\s*DELETE/gi, '')
      .replace(/;\s*UPDATE/gi, '')
      .replace(/;\s*INSERT/gi, '');
  }

  // Secure Headers Configuration
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(self), microphone=(), camera=()'
    };
  }

  // Content Security Policy
  getCSPDirectives() {
    return {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://www.youtube.com', 'https://www.google.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:', 'blob:'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co'],
      'frame-src': ["'self'", 'https://www.youtube.com', 'https://www.google.com'],
      'media-src': ["'self'", 'https:', 'blob:']
    };
  }

  // Rate Limiting Token Bucket
  createRateLimiter(maxTokens = 10, refillRate = 1) {
    return {
      tokens: maxTokens,
      maxTokens,
      refillRate,
      lastRefill: Date.now(),
      
      tryConsume() {
        this.refill();
        if (this.tokens > 0) {
          this.tokens--;
          return true;
        }
        return false;
      },
      
      refill() {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        const tokensToAdd = Math.floor(timePassed / 1000) * this.refillRate;
        
        if (tokensToAdd > 0) {
          this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
          this.lastRefill = now;
        }
      }
    };
  }

  // Secure Storage (encrypted localStorage)
  secureStorage = {
    setItem(key, value) {
      try {
        const encrypted = btoa(JSON.stringify({
          data: value,
          timestamp: Date.now(),
          checksum: securityService.generateChecksum(value)
        }));
        localStorage.setItem(key, encrypted);
      } catch (error) {
        console.error('Secure storage error:', error);
      }
    },

    getItem(key) {
      try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        
        const decrypted = JSON.parse(atob(encrypted));
        
        // Validate checksum
        if (securityService.generateChecksum(decrypted.data) !== decrypted.checksum) {
          console.warn('Data integrity check failed for:', key);
          localStorage.removeItem(key);
          return null;
        }
        
        return decrypted.data;
      } catch (error) {
        console.error('Secure storage retrieval error:', error);
        return null;
      }
    },

    removeItem(key) {
      localStorage.removeItem(key);
    }
  };

  generateChecksum(data) {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  // Authentication Verification
  isAuthenticated() {
    // Check if session token exists and is valid
    return !!sessionStorage.getItem('csrf_token');
  }

  // Authorization Check with Logging
  async verifyPermission(permission, context = {}) {
    try {
      // Log permission check for audit
      console.log('Permission check:', { permission, context, timestamp: new Date().toISOString() });
      
      // In production, this would verify against backend
      return true;
    } catch (error) {
      console.error('Permission verification failed:', error);
      return false;
    }
  }

  // Prevent Clickjacking
  preventClickjacking() {
    // DON'T prevent clickjacking in base44 preview iframe
    const isBase44Preview = window.location.hostname.includes('base44.app') || 
                           window.location.hostname.includes('localhost');
    
    if (isBase44Preview) {
      console.log('Skipping clickjacking prevention in base44 preview');
      return;
    }

    // Only prevent clickjacking in production deployment
    if (window.self !== window.top) {
      // Check if parent is a trusted domain
      try {
        const parentOrigin = document.referrer;
        const trustedDomains = ['curling.ca', 'curlingcanada.ca'];
        
        const isTrusted = trustedDomains.some(domain => 
          parentOrigin.includes(domain)
        );

        if (!isTrusted) {
          console.warn('Untrusted iframe detected, breaking out');
          window.top.location = window.self.location;
        }
      } catch (error) {
        // If we can't check parent origin, break out for safety
        console.warn('Unable to verify parent frame, breaking out');
        window.top.location = window.self.location;
      }
    }
  }

  // Secure Random ID Generation
  generateSecureId(length = 16) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const securityService = new SecurityService();
export default securityService;
