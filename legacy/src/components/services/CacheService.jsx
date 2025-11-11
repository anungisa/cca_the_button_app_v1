/**
 * @file CacheService.js
 * @description Enhanced caching service with TTL, namespaces, and performance monitoring
 */

class CacheServiceClass {
  constructor() {
    this.cache = new Map();
    this.expiry = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }

  /**
   * Store a value in the cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} [ttlMinutes=30] - Time to live in minutes
   * @param {string} [namespace='default'] - Cache namespace for organization
   */
  set(key, value, ttlMinutes = 30, namespace = 'default') {
    const fullKey = `${namespace}:${key}`;
    this.cache.set(fullKey, value);
    const expiryTime = Date.now() + (ttlMinutes * 60 * 1000);
    this.expiry.set(fullKey, expiryTime);
    this.stats.sets++;
  }

  /**
   * Retrieve a value from the cache
   * @param {string} key - Cache key
   * @param {string} [namespace='default'] - Cache namespace
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key, namespace = 'default') {
    const fullKey = `${namespace}:${key}`;
    const expiryTime = this.expiry.get(fullKey);
    
    if (expiryTime && Date.now() > expiryTime) {
      this.remove(key, namespace);
      this.stats.misses++;
      return null;
    }
    
    const value = this.cache.get(fullKey);
    if (value !== undefined) {
      this.stats.hits++;
      return value;
    }
    
    this.stats.misses++;
    return null;
  }

  /**
   * Remove a specific entry from cache
   * @param {string} key - Cache key
   * @param {string} [namespace='default'] - Cache namespace
   */
  remove(key, namespace = 'default') {
    const fullKey = `${namespace}:${key}`;
    this.cache.delete(fullKey);
    this.expiry.delete(fullKey);
  }

  /**
   * Clear all cache entries or specific namespace
   * @param {string} [namespace] - Optional namespace to clear
   */
  clear(namespace) {
    if (namespace) {
      const prefix = `${namespace}:`;
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
          this.expiry.delete(key);
        }
      }
    } else {
      this.cache.clear();
      this.expiry.clear();
    }
  }

  /**
   * Get cache statistics
   * @returns {object} Cache performance metrics
   */
  getStats() {
    const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      sets: this.stats.sets,
      hitRate: (hitRate * 100).toFixed(2) + '%',
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Cache wrapper for async functions
   * @param {string} key - Cache key
   * @param {Function} fn - Async function to execute if cache misses
   * @param {number} [ttlMinutes=30] - Cache TTL
   * @param {string} [namespace='default'] - Cache namespace
   * @returns {Promise<any>} Cached or fresh data
   */
  async wrap(key, fn, ttlMinutes = 30, namespace = 'default') {
    const cached = this.get(key, namespace);
    if (cached !== null) {
      return cached;
    }

    const value = await fn();
    this.set(key, value, ttlMinutes, namespace);
    return value;
  }

  /**
   * Invalidate cache by pattern
   * @param {RegExp} pattern - Pattern to match keys
   */
  invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        this.expiry.delete(key);
      }
    }
  }
}

// Export singleton instance
export const CacheService = new CacheServiceClass();

// Auto-cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, expiry] of CacheService.expiry.entries()) {
      if (now > expiry) {
        CacheService.cache.delete(key);
        CacheService.expiry.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}