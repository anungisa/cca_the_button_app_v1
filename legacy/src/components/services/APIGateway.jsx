import { APIEcosystemService } from './APIEcosystemService';

/**
 * APIGateway provides a single entry point for all external API requests.
 * It ensures that requests are only made to configured and enabled APIs.
 */
export class APIGateway {
  static async request(apiName, method, endpoint, data = null) {
    console.log(`[APIGateway] Mock request to ${apiName}: ${method} ${endpoint}`);
    
    // Check if the API is configured and enabled
    const config = await APIEcosystemService.getApiConfiguration(apiName);
    
    // If config is null (like for 'base44') or disabled, block the request.
    // This is the core fix for the persistent "base44 not found" error.
    if (!config || !config.is_enabled) {
      const errorMsg = `API "${apiName}" is not configured or is disabled.`;
      console.warn(`[APIGateway] Call blocked: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }

    // Simulate network delay for realistic loading states
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a generic mock success response
    return { 
        success: true, 
        data: { message: `Mock response from ${apiName} for ${endpoint}` },
        status: 200
    };
  }
}