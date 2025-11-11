/**
 * Enhanced Cache Service
 * Multi-tier caching with TTL, pattern invalidation, and statistics
 */

class EnhancedCacheService {
  constructor(maxSize = 500) {
    this.cache = new Map();
    this.ttls = new Map();
    this.accessCount = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
  }

  set(key, value, ttlMinutes = 5) {
    // Enforce size limit with LRU eviction
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, value);
    this.ttls.set(key, Date.now() + (ttlMinutes * 60 * 1000));
    this.accessCount.set(key, 0);
  }

  get(key) {
    if (!this.cache.has(key)) {
      this.misses++;
      return null;
    }

    const ttl = this.ttls.get(key);
    if (ttl && Date.now() > ttl) {
      this.remove(key);
      this.misses++;
      return null;
    }

    this.hits++;
    this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
    return this.cache.get(key);
  }

  remove(key) {
    this.cache.delete(key);
    this.ttls.delete(key);
    this.accessCount.delete(key);
  }

  invalidatePattern(pattern) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.remove(key);
        count++;
      }
    }
    if (count > 0) {
      console.log(`Invalidated ${count} cache entries matching pattern: ${pattern}`);
    }
    return count;
  }

  evictLRU() {
    // Find least recently used entry
    let lruKey = null;
    let minAccess = Infinity;

    for (const [key, count] of this.accessCount.entries()) {
      if (count < minAccess) {
        minAccess = count;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.remove(lruKey);
      console.log(`Evicted LRU cache entry: ${lruKey}`);
    }
  }

  clear() {
    this.cache.clear();
    this.ttls.clear();
    this.accessCount.clear();
  }

  getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;

    // Calculate total size
    let totalSizeBytes = 0;
    for (const value of this.cache.values()) {
      try {
        totalSizeBytes += JSON.stringify(value).length;
      } catch (e) {
        // Skip circular references
      }
    }

    // Find expired entries
    const now = Date.now();
    let expiredEntries = 0;
    for (const [key, ttl] of this.ttls.entries()) {
      if (ttl < now) {
        expiredEntries++;
      }
    }

    return {
      entries: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: hitRate.toFixed(2) + '%',
      totalSizeBytes,
      expiredEntries,
      topKeys: this.getTopKeys(10)
    };
  }

  getTopKeys(limit = 10) {
    return Array.from(this.accessCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, count]) => ({ key, accessCount: count }));
  }

  // Preload critical data
  async warmup(warmupFunctions) {
    console.log('Warming up cache...');
    const results = await Promise.allSettled(warmupFunctions.map(fn => fn()));
    const successful = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Cache warmup complete: ${successful}/${warmupFunctions.length} succeeded`);
  }
}

export const enhancedCache = new EnhancedCacheService(500);
export default enhancedCache;