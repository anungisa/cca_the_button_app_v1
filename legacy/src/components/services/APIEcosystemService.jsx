import { ApiConfiguration } from '@/api/entities';

// Mock API configurations to prevent live calls during demo/development
const MOCK_API_CONFIGS = [
  { id: '1', api_name: 'Curling.io', friendly_name: 'Curling.io', status: 'ok', auth_method: 'API Key', base_url: 'https://api.curling.io', is_enabled: true, last_sync: new Date().toISOString(), error_count_24h: 0, latency_avg_ms: 120 },
  { id: '2', api_name: 'CurlingReg', friendly_name: 'CurlingReg', status: 'ok', auth_method: 'OAuth2', base_url: 'https://api.curlingreg.com', is_enabled: true, last_sync: new Date().toISOString(), error_count_24h: 1, latency_avg_ms: 250 },
  { id: '3', api_name: 'TrustEvents', friendly_name: 'TrustEvents (Volunteers)', status: 'warning', auth_method: 'API Key', base_url: 'https://api.trustevents.com', is_enabled: true, last_sync: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), error_count_24h: 5, latency_avg_ms: 450 },
  { id: '4', api_name: 'DOMO', friendly_name: 'DOMO (Analytics)', status: 'ok', auth_method: 'OAuth2', base_url: 'https://api.domo.com', is_enabled: true, last_sync: new Date().toISOString(), error_count_24h: 0, latency_avg_ms: 800 },
  { id: '5', api_name: 'Stripe', friendly_name: 'Stripe (Payments)', status: 'ok', auth_method: 'API Key', base_url: 'https://api.stripe.com', is_enabled: true, last_sync: new Date().toISOString(), error_count_24h: 0, latency_avg_ms: 90 },
  // Add the base44 configuration to prevent the error
  { id: '6', api_name: 'base44', friendly_name: 'Base44 Platform', status: 'ok', auth_method: 'Internal', base_url: 'https://internal.base44.com', is_enabled: true, last_sync: new Date().toISOString(), error_count_24h: 0, latency_avg_ms: 50 },
];

export class APIEcosystemService {
  static async getApiConfigurations() {
    try {
      // Try to get configurations from the entity first
      const configs = await ApiConfiguration.list();
      if (configs && configs.length > 0) {
        return configs;
      }
    } catch (error) {
      console.warn('[APIEcosystemService] Failed to load from entity, using mock data:', error);
    }
    
    // Return mock configurations if entity loading fails
    return Promise.resolve(MOCK_API_CONFIGS);
  }

  static async getApiConfiguration(apiName) {
    try {
      // Try to get from entity first
      const configs = await ApiConfiguration.filter({ api_name: apiName });
      if (configs && configs.length > 0) {
        return configs[0];
      }
    } catch (error) {
      console.warn(`[APIEcosystemService] Failed to load ${apiName} from entity, using mock data:`, error);
    }
    
    // Fallback to mock data
    const config = MOCK_API_CONFIGS.find(c => c.api_name === apiName);
    if (config) {
      return Promise.resolve(config);
    }
    
    // For any unknown API, return a disabled dummy object
    console.warn(`[APIEcosystemService] API config for "${apiName}" not found. Returning disabled dummy config.`);
    return Promise.resolve({
      api_name: apiName,
      friendly_name: apiName,
      status: 'disabled',
      is_enabled: false,
      auth_method: 'None',
      base_url: '',
      last_sync: null,
      error_count_24h: 0,
      latency_avg_ms: 0
    });
  }

  static async updateApiConfiguration(id, updates) {
    console.log(`[Mock] Updating API config ${id} with`, updates);
    const index = MOCK_API_CONFIGS.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_API_CONFIGS[index] = { ...MOCK_API_CONFIGS[index], ...updates };
      return Promise.resolve(MOCK_API_CONFIGS[index]);
    }
    return Promise.reject(new Error('API configuration not found for update.'));
  }

  static async testConnection(apiName) {
    console.log(`[Mock] Simulating connection test for ${apiName}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, latency: Math.floor(Math.random() * 200) + 50 };
  }
}