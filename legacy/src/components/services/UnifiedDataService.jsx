import { eventBus, EVENTS } from './EventBus';
import { APIEcosystemService } from './APIEcosystemService';

/**
 * Unified Data Service - Manages data flow between different systems
 * Handles data transformation, validation, and routing
 */
export class UnifiedDataService {
  static cache = new Map();
  
  static async getData(entityType, filters = {}, options = {}) {
    const cacheKey = `${entityType}_${JSON.stringify(filters)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey) && !options.forceRefresh) {
      console.log(`[UnifiedDataService] Cache hit for ${entityType}`);
      return this.cache.get(cacheKey);
    }

    try {
      // Determine which API to use based on entity type
      const apiName = this.getApiForEntity(entityType);
      
      // Get API configuration safely
      const apiConfig = await APIEcosystemService.getApiConfiguration(apiName);
      
      // Check if API is available and enabled
      if (!apiConfig || !apiConfig.is_enabled) {
        console.warn(`[UnifiedDataService] API ${apiName} is not available or disabled for ${entityType}`);
        // Return mock data instead of throwing error
        return this.getMockData(entityType, filters);
      }

      // Simulate API call
      const data = await this.fetchFromApi(apiName, entityType, filters);
      
      // Cache the result
      this.cache.set(cacheKey, data);
      
      // Emit data updated event
      eventBus.emit(EVENTS.DATA_UPDATED, { entityType, data });
      
      return data;
    } catch (error) {
      console.error(`[UnifiedDataService] Error fetching ${entityType}:`, error);
      
      // Return mock data as fallback
      return this.getMockData(entityType, filters);
    }
  }

  static getApiForEntity(entityType) {
    const apiMapping = {
      'User': 'CurlingReg',
      'Club': 'CurlingReg',
      'Event': 'Curling.io',
      'Game': 'Curling.io',
      'Volunteer': 'TrustEvents',
      'Analytics': 'DOMO',
      'Payment': 'Stripe',
    };
    
    return apiMapping[entityType] || 'base44';
  }

  static getMockData(entityType, filters) {
    console.log(`[UnifiedDataService] Returning mock data for ${entityType}`);
    
    const mockData = {
      User: { users: [], total: 0 },
      Club: { clubs: [], total: 0 },
      Event: { events: [], total: 0 },
      Game: { games: [], total: 0 },
      Volunteer: { volunteers: [], total: 0 },
      Analytics: { metrics: {}, dashboards: [] },
      Payment: { transactions: [], total: 0 },
    };
    
    return mockData[entityType] || { data: [], total: 0 };
  }

  static async fetchFromApi(apiName, entityType, filters) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`[UnifiedDataService] Mock fetch from ${apiName} for ${entityType}`);
    
    // Return mock data
    return this.getMockData(entityType, filters);
  }

  static clearCache(entityType = null) {
    if (entityType) {
      // Clear specific entity cache
      for (const key of this.cache.keys()) {
        if (key.startsWith(entityType)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }
}