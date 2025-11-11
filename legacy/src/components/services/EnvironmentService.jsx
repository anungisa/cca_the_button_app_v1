/**
 * Environment Service
 * Manages environment-specific behavior and configuration
 */

import { getEnvironmentConfig } from '../utils/environment';

class EnvironmentService {
  constructor() {
    this.config = getEnvironmentConfig();
  }

  getConfig() {
    return this.config;
  }

  shouldEnableFeature(featureName) {
    const featureFlags = {
      // Security features
      clickjackingProtection: this.config.enableClickjackingProtection,
      contentSecurityPolicy: this.config.enableCSP,
      strictValidation: this.config.enableStrictSecurity,
      
      // Performance features
      caching: this.config.cacheEnabled,
      prefetching: true,
      lazyLoading: true,
      
      // Monitoring features
      performanceMonitoring: true,
      errorTracking: true,
      auditLogging: this.config.enableAuditLogging,
      
      // Development features
      debugPanel: this.config.enableDebugMode,
      verboseLogging: this.config.enableDebugMode,
      mockData: this.config.isDevelopment
    };

    return featureFlags[featureName] ?? false;
  }

  getAPIConfig() {
    return {
      timeout: this.config.apiTimeout,
      retries: this.config.isProduction ? 3 : 1,
      baseURL: this.getBaseURL()
    };
  }

  getBaseURL() {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
  }

  getCacheTTL(defaultTTL = 5) {
    return this.config.cacheTTL || defaultTTL;
  }

  shouldLogToConsole(level = 'info') {
    if (this.config.isProduction && level === 'debug') return false;
    return true;
  }

  isTrustedDomain(url) {
    try {
      const urlObj = new URL(url);
      const trustedDomains = [
        'curling.ca',
        'curlingcanada.ca',
        'base44.app',
        'localhost',
        'supabase.co'
      ];

      return trustedDomains.some(domain => 
        urlObj.hostname.includes(domain)
      );
    } catch {
      return false;
    }
  }
}

export const environmentService = new EnvironmentService();
export default environmentService;