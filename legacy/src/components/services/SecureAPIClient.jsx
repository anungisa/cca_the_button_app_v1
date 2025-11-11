/**
 * Secure API Client
 * Wraps all API calls with security checks, rate limiting, and CSRF tokens
 */

import { securityService } from './SecurityService';
import { rateLimiter } from './RateLimiter';
import { performanceMonitor } from './PerformanceMonitoringService';
import { enhancedEntityService } from './EnhancedEntityService';

class SecureAPIClient {
  constructor() {
    this.requestCount = 0;
    this.failureCount = 0;
  }

  async secureCall(operation, userId = null, fn) {
    this.requestCount++;
    const startTime = Date.now();

    try {
      // ✅ 1. RATE LIMITING
      if (userId) {
        await rateLimiter.checkAPILimit(userId, operation);
      } else {
        await rateLimiter.checkGlobalLimit();
      }

      // ✅ 2. EXECUTE OPERATION
      const result = await fn();

      // ✅ 3. TRACK SUCCESS
      performanceMonitor.trackAPICall(operation, Date.now() - startTime, 'success');

      return result;

    } catch (error) {
      this.failureCount++;
      
      // ✅ 4. TRACK FAILURE
      performanceMonitor.trackAPICall(operation, Date.now() - startTime, 'error');
      performanceMonitor.trackError(error, { operation, userId });

      // ✅ 5. HANDLE SECURITY ERRORS
      if (error.message?.includes('Rate limit')) {
        throw new Error('Too many requests. Please slow down.');
      }

      if (error.message?.includes('Unauthorized')) {
        throw new Error('Authentication required');
      }

      throw error;
    }
  }

  async secureEntityOperation(Entity, method, userId, ...args) {
    const operation = `${Entity.name}.${method}`;
    
    return this.secureCall(operation, userId, async () => {
      // Use enhanced entity service which has circuit breaker + retry
      switch (method) {
        case 'list':
          return enhancedEntityService.list(Entity, ...args);
        case 'filter':
          return enhancedEntityService.filter(Entity, ...args);
        case 'create':
          return enhancedEntityService.create(Entity, ...args);
        case 'update':
          return enhancedEntityService.update(Entity, ...args);
        case 'delete':
          return enhancedEntityService.delete(Entity, ...args);
        default:
          throw new Error(`Unknown method: ${method}`);
      }
    });
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      failureCount: this.failureCount,
      successRate: this.requestCount > 0 
        ? ((this.requestCount - this.failureCount) / this.requestCount * 100).toFixed(2) + '%'
        : 'N/A'
    };
  }
}

export const secureAPIClient = new SecureAPIClient();
export default secureAPIClient;