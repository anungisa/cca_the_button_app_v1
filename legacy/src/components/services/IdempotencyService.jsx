/**
 * Idempotency Service
 * Ensures critical operations (payments, updates) are executed only once
 */

class IdempotencyService {
  constructor() {
    this.processedKeys = new Map();
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
  }

  generateKey(operation, params) {
    // Create unique key from operation and params
    const paramsString = JSON.stringify(params, Object.keys(params).sort());
    return `${operation}-${this.hashCode(paramsString)}`;
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  async execute(key, fn, ttl = this.maxAge) {
    // Check if this operation was already executed
    const cached = this.processedKeys.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log(`Idempotency: Returning cached result for ${key}`);
      return cached.result;
    }

    try {
      const result = await fn();
      
      // Store result
      this.processedKeys.set(key, {
        result,
        timestamp: Date.now()
      });

      // Clean up old entries
      this.cleanup();

      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.processedKeys.entries()) {
      if (now - value.timestamp > this.maxAge) {
        this.processedKeys.delete(key);
      }
    }
  }

  clear(key) {
    if (key) {
      this.processedKeys.delete(key);
    } else {
      this.processedKeys.clear();
    }
  }
}

export const idempotencyService = new IdempotencyService();
export default idempotencyService;