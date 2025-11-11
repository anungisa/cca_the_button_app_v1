/**
 * Content Security Policy Manager
 * Dynamically manages CSP headers and nonce generation
 */

class ContentSecurityPolicy {
  constructor() {
    this.nonce = this.generateNonce();
    this.violations = [];
  }

  generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array));
  }

  getCSPHeader() {
    return {
      'Content-Security-Policy': this.buildCSPString()
    };
  }

  buildCSPString() {
    const directives = {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        `'nonce-${this.nonce}'`,
        'https://www.youtube.com',
        'https://www.google.com',
        'https://js.stripe.com'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for Tailwind
        'https://fonts.googleapis.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:',
        'https://images.unsplash.com',
        'https://*.supabase.co'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com'
      ],
      'connect-src': [
        "'self'",
        'https://*.supabase.co',
        'wss://*.supabase.co',
        'https://api.stripe.com'
      ],
      'frame-src': [
        "'self'",
        'https://www.youtube.com',
        'https://js.stripe.com'
      ],
      'media-src': [
        "'self'",
        'blob:',
        'https:'
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'self'"],
      'upgrade-insecure-requests': []
    };

    return Object.entries(directives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');
  }

  reportViolation(violation) {
    this.violations.push({
      ...violation,
      timestamp: new Date().toISOString()
    });

    // Log to monitoring service
    console.warn('CSP Violation:', violation);

    // In production, send to logging service
    if (this.violations.length > 100) {
      this.violations.shift(); // Keep only last 100 violations
    }
  }

  getViolations() {
    return this.violations;
  }
}

export const cspManager = new ContentSecurityPolicy();
export default cspManager;