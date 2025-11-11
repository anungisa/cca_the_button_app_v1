
/**
 * Centralized service for all external API interactions
 * Replaces individual API hooks with unified interface
 */
import { eventBus, EVENTS } from './EventBus';

class InteroperabilityService {
  constructor() {
    this.apiConfigs = new Map();
    this.requestCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.retryAttempts = 3;
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Register an API configuration
   */
  registerAPI(name, config) {
    this.apiConfigs.set(name, {
      baseUrl: config.baseUrl,
      headers: config.headers || {},
      auth: config.auth || {},
      rateLimit: config.rateLimit || { requests: 100, window: 60000 },
      timeout: config.timeout || 30000,
      retries: config.retries || 3
    });
  }

  /**
   * Make an API request
   * @param {string} apiName - Name of the registered API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   */
  async fetch(apiName, endpoint, options = {}) {
    const config = this.apiConfigs.get(apiName);
    if (!config) {
      throw new Error(`API configuration not found: ${apiName}`);
    }

    const cacheKey = `${apiName}:${endpoint}:${JSON.stringify(options)}`;
    
    // Check cache first
    if (options.useCache !== false && this.requestCache.has(cacheKey)) {
      const cached = this.requestCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const requestConfig = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
        ...options.headers
      },
      ...options
    };

    // Add authentication
    if (config.auth.type === 'bearer') {
      requestConfig.headers.Authorization = `Bearer ${config.auth.token}`;
    } else if (config.auth.type === 'apikey') {
      requestConfig.headers[config.auth.header || 'X-API-Key'] = config.auth.key;
    }

    const url = `${config.baseUrl}${endpoint}`;
    
    try {
      const response = await this.makeRequest(url, requestConfig, config.retries);
      const data = await response.json();

      // Cache successful responses
      if (response.ok && options.useCache !== false) {
        this.requestCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      // Publish success event
      eventBus.publish(EVENTS.DATA_SYNC_COMPLETED, {
        api: apiName,
        endpoint,
        success: true,
        recordCount: Array.isArray(data) ? data.length : 1
      });

      return data;

    } catch (error) {
      // Publish error event
      eventBus.publish(EVENTS.INTEGRATION_ERROR, {
        api: apiName,
        endpoint,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(url, config, retries) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  /**
   * Batch multiple requests
   */
  async batchFetch(requests) {
    const promises = requests.map(req => 
      this.fetch(req.api, req.endpoint, req.options)
        .catch(error => ({ error, ...req }))
    );

    return Promise.all(promises);
  }

  /**
   * Clear cache
   */
  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.requestCache.keys()) {
        if (key.includes(pattern)) {
          this.requestCache.delete(key);
        }
      }
    } else {
      this.requestCache.clear();
    }
  }

  /**
   * Get API health status
   */
  async getAPIHealth() {
    const health = {};
    
    for (const [name, config] of this.apiConfigs) {
      try {
        const start = Date.now();
        await this.fetch(name, '/health', { useCache: false, timeout: 5000 });
        health[name] = {
          status: 'healthy',
          responseTime: Date.now() - start
        };
      } catch (error) {
        health[name] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }
    
    return health;
  }
}

// Create singleton instance
export const interopService = new InteroperabilityService();

// Register common APIs - using environment variables safely
const getEnvVar = (name) => {
  // In a browser environment, process.env is not available.
  // We assume environment variables might be exposed via a global 'window.env' object,
  // typically populated during a build process (e.g., by webpack DefinePlugin, Vite, etc.)
  // or explicitly set in the HTML.
  if (typeof window !== 'undefined' && window.env) {
    return window.env[name];
  }
  // For Node.js or environments where process.env is available
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  return undefined;
};

interopService.registerAPI('curlingio', {
  baseUrl: 'https://api.curling.io/v1',
  auth: { type: 'apikey', header: 'X-API-Key', key: getEnvVar('CURLINGIO_API_KEY') },
  rateLimit: { requests: 100, window: 60000 }
});

interopService.registerAPI('trustevents', {
  baseUrl: 'https://api.trustevents.com/v1',
  auth: { type: 'bearer', token: getEnvVar('TRUSTEVENTS_TOKEN') },
  rateLimit: { requests: 50, window: 60000 }
});

interopService.registerAPI('curlingreg', {
  baseUrl: 'https://api.curlingreg.com/v1',
  auth: { type: 'apikey', header: 'Authorization', key: getEnvVar('CURLINGREG_API_KEY') },
  rateLimit: { requests: 200, window: 60000 }
});

export default interopService;
