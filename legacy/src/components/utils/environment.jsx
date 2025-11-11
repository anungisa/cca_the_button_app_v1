/**
 * Environment Detection Utility
 * Centralized environment detection for consistent behavior
 */

export const detectEnvironment = () => {
  if (typeof window === 'undefined') return 'server';
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  if (hostname.includes('base44.app')) {
    return 'preview';
  }
  
  if (hostname.includes('staging')) {
    return 'staging';
  }
  
  return 'production';
};

export const isProduction = () => detectEnvironment() === 'production';
export const isDevelopment = () => detectEnvironment() === 'development';
export const isPreview = () => detectEnvironment() === 'preview';
export const isStaging = () => detectEnvironment() === 'staging';

export const getEnvironmentConfig = () => {
  const env = detectEnvironment();
  
  return {
    environment: env,
    isProduction: env === 'production',
    isDevelopment: env === 'development',
    isPreview: env === 'preview',
    isStaging: env === 'staging',
    enableDebugMode: env !== 'production',
    enableStrictSecurity: env === 'production',
    enableClickjackingProtection: env === 'production',
    enableCSP: env === 'production',
    enableRateLimiting: true, // Always enabled
    enableAuditLogging: true, // Always enabled
    apiTimeout: env === 'production' ? 30000 : 60000,
    cacheEnabled: true,
    cacheTTL: env === 'production' ? 5 : 1
  };
};

export default {
  detectEnvironment,
  isProduction,
  isDevelopment,
  isPreview,
  isStaging,
  getEnvironmentConfig
};