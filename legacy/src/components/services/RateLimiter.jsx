/**
 * Rate Limiter Service
 * Prevents abuse and protects against DoS attacks
 */

class RateLimiter {
  constructor() {
    this.buckets = new Map();
    this.globalLimits = {
      mutations: { max: 30, window: 60000 }, // 30 mutations per minute
      reads: { max: 100, window: 60000 }, // 100 reads per minute
      login: { max: 5, window: 300000 }, // 5 login attempts per 5 minutes
      api: { max: 60, window: 60000 } // 60 API calls per minute
    };
  }

  createBucket(key, maxTokens, refillRate) {
    return {
      tokens: maxTokens,
      maxTokens,
      refillRate, // tokens per second
      lastRefill: Date.now(),
      violations: 0,
      
      tryConsume(count = 1) {
        this.refill();
        if (this.tokens >= count) {
          this.tokens -= count;
          return true;
        }
        this.violations++;
        return false;
      },
      
      refill() {
        const now = Date.now();
        const timePassed = (now - this.lastRefill) / 1000; // seconds
        const tokensToAdd = Math.floor(timePassed * this.refillRate);
        
        if (tokensToAdd > 0) {
          this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
          this.lastRefill = now;
        }
      },

      reset() {
        this.tokens = this.maxTokens;
        this.lastRefill = Date.now();
        this.violations = 0;
      }
    };
  }

  getBucket(userId, limitType) {
    const key = `${userId}:${limitType}`;
    
    if (!this.buckets.has(key)) {
      const limit = this.globalLimits[limitType];
      if (!limit) {
        throw new Error(`Unknown limit type: ${limitType}`);
      }
      
      // Convert window to refill rate (tokens per second)
      const refillRate = limit.max / (limit.window / 1000);
      
      this.buckets.set(key, this.createBucket(key, limit.max, refillRate));
    }
    
    return this.buckets.get(key);
  }

  async checkLimit(userId, limitType, count = 1) {
    if (!userId) {
      console.warn('Rate limit check without user ID');
      return true; // Allow for now, but should be fixed
    }

    const bucket = this.getBucket(userId, limitType);
    const allowed = bucket.tryConsume(count);
    
    if (!allowed) {
      console.warn(`Rate limit exceeded for user ${userId}, type: ${limitType}`);
      
      // Track violation
      if (bucket.violations > 10) {
        console.error(`⚠️ Excessive rate limit violations: ${bucket.violations} for ${userId}`);
      }
    }
    
    return allowed;
  }

  async checkMutationLimit(userId) {
    return this.checkLimit(userId, 'mutations');
  }

  async checkReadLimit(userId) {
    return this.checkLimit(userId, 'reads');
  }

  async checkAPILimit(userId) {
    return this.checkLimit(userId, 'api');
  }

  async checkLoginLimit(identifier) {
    return this.checkLimit(identifier, 'login');
  }

  resetLimits(userId) {
    const keys = Array.from(this.buckets.keys()).filter(k => k.startsWith(userId));
    keys.forEach(key => {
      const bucket = this.buckets.get(key);
      if (bucket) bucket.reset();
    });
  }

  getStats(userId) {
    if (!userId) return {};
    
    const stats = {};
    Object.keys(this.globalLimits).forEach(limitType => {
      const key = `${userId}:${limitType}`;
      const bucket = this.buckets.get(key);
      if (bucket) {
        stats[limitType] = {
          tokensRemaining: bucket.tokens,
          maxTokens: bucket.maxTokens,
          violations: bucket.violations,
          utilizationPercent: Math.round(((bucket.maxTokens - bucket.tokens) / bucket.maxTokens) * 100)
        };
      }
    });
    
    return stats;
  }

  // Cleanup old buckets
  cleanup() {
    const now = Date.now();
    const maxAge = 3600000; // 1 hour
    
    this.buckets.forEach((bucket, key) => {
      if (now - bucket.lastRefill > maxAge && bucket.tokens === bucket.maxTokens) {
        this.buckets.delete(key);
      }
    });
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 600000);
}

export default rateLimiter;