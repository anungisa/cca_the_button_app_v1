/**
 * Fallback Service
 * Provides graceful degradation strategies when services fail
 */

class FallbackService {
  constructor() {
    this.fallbackStrategies = new Map();
    this.registerDefaultStrategies();
  }

  registerDefaultStrategies() {
    // Entity list fallback - return empty array
    this.register('entity.list', () => []);
    
    // Entity filter fallback - return empty array
    this.register('entity.filter', () => []);
    
    // User data fallback - return minimal user
    this.register('user.me', () => ({
      id: 'offline',
      email: 'offline@user.com',
      full_name: 'Offline User',
      role: 'user'
    }));

    // Loyalty data fallback
    this.register('loyalty.data', () => ({
      curl_points: 0,
      tier: 'granite_rookie',
      badges: [],
      tier_progress: { current_xp: 0, next_tier_xp: 500 }
    }));

    // Integration fallback - return cached or static data
    this.register('integration.call', (params) => {
      console.warn('Integration fallback:', params);
      return { error: 'Service temporarily unavailable', cached: true };
    });
  }

  register(key, fallbackFn) {
    this.fallbackStrategies.set(key, fallbackFn);
  }

  async execute(key, params = {}) {
    const strategy = this.fallbackStrategies.get(key);
    
    if (!strategy) {
      console.warn(`No fallback strategy for: ${key}`);
      return null;
    }

    try {
      return await strategy(params);
    } catch (error) {
      console.error(`Fallback strategy failed for ${key}:`, error);
      return null;
    }
  }

  has(key) {
    return this.fallbackStrategies.has(key);
  }
}

export const fallbackService = new FallbackService();
export default fallbackService;