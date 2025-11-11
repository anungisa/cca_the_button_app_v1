/**
 * Interoperability Service
 * Centralized service for all external API interactions
 * Handles rate limiting, error handling, and retry logic
 */

import { RateLimiter } from './rate-limiter';

interface RetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number;
}

interface APIConfig {
  baseUrl: string;
  auth: {
    type: 'apikey' | 'bearer' | 'none';
    header?: string;
    key?: string;
    token?: string;
  };
  rateLimit: {
    requests: number;
    window: number;
  };
  retryPolicy?: RetryPolicy;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

const defaultRetryPolicy: RetryPolicy = {
  maxAttempts: 3,
  backoffMultiplier: 2,
  initialDelay: 1000,
};

class InteroperabilityService {
  private apis: Map<string, APIConfig & { rateLimiter: RateLimiter }> = new Map();
  private syncLogs: Map<string, { lastSync: Date; status: string }> = new Map();

  /**
   * Register an external API
   */
  registerAPI(name: string, config: APIConfig): void {
    this.apis.set(name, {
      ...config,
      rateLimiter: new RateLimiter(config.rateLimit),
      retryPolicy: config.retryPolicy || defaultRetryPolicy,
    });
    
    console.log(`[InteropService] Registered API: ${name} (${config.baseUrl})`);
  }

  /**
   * Fetch data from a registered API
   */
  async fetch(
    apiName: string,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<any> {
    const api = this.apis.get(apiName);

    if (!api) {
      throw new Error(`API ${apiName} is not registered`);
    }

    // Wait for rate limit token
    await api.rateLimiter.wait();

    const url = `${api.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(api);

    try {
      const response = await this.fetchWithTimeout(url, {
        ...options,
        headers: { ...headers, ...options.headers },
      }, options.timeout || 30000);

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`[InteropService] Fetch failed for ${apiName}: ${error}`);
      return await this.retry(api, apiName, endpoint, options);
    }
  }

  /**
   * Build authentication headers
   */
  private buildHeaders(api: APIConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (api.auth.type === 'apikey' && api.auth.key) {
      headers[api.auth.header || 'X-API-Key'] = api.auth.key;
    } else if (api.auth.type === 'bearer' && api.auth.token) {
      headers['Authorization'] = `Bearer ${api.auth.token}`;
    }

    return headers;
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${response.statusText} - ${errorText}`
      );
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else if (contentType?.includes('text/xml') || contentType?.includes('application/xml')) {
      return await response.text();
    } else {
      return await response.text();
    }
  }

  /**
   * Retry failed requests with exponential backoff
   */
  private async retry(
    api: APIConfig & { rateLimiter: RateLimiter },
    apiName: string,
    endpoint: string,
    options: RequestOptions,
    attempt: number = 1
  ): Promise<any> {
    const retryPolicy = api.retryPolicy!;

    if (attempt >= retryPolicy.maxAttempts) {
      throw new Error(
        `Max retry attempts (${retryPolicy.maxAttempts}) reached for ${apiName}${endpoint}`
      );
    }

    const delay = retryPolicy.initialDelay * Math.pow(retryPolicy.backoffMultiplier, attempt - 1);
    console.log(`[InteropService] Retrying ${apiName}${endpoint} in ${delay}ms (attempt ${attempt}/${retryPolicy.maxAttempts})`);

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      await api.rateLimiter.wait();
      const url = `${api.baseUrl}${endpoint}`;
      const headers = this.buildHeaders(api);

      const response = await this.fetchWithTimeout(url, {
        ...options,
        headers: { ...headers, ...options.headers },
      }, options.timeout || 30000);

      return await this.handleResponse(response);
    } catch (error) {
      return await this.retry(api, apiName, endpoint, options, attempt + 1);
    }
  }

  /**
   * Test connection to an API
   */
  async testConnection(apiName: string, testEndpoint: string = '/'): Promise<boolean> {
    try {
      await this.fetch(apiName, testEndpoint);
      console.log(`[InteropService] Connection test successful: ${apiName}`);
      return true;
    } catch (error) {
      console.error(`[InteropService] Connection test failed: ${apiName}`, error);
      return false;
    }
  }

  /**
   * Get sync status for an API
   */
  getSyncStatus(apiName: string): { lastSync: Date; status: string } | null {
    return this.syncLogs.get(apiName) || null;
  }

  /**
   * Update sync status
   */
  updateSyncStatus(apiName: string, status: string): void {
    this.syncLogs.set(apiName, {
      lastSync: new Date(),
      status,
    });
  }

  /**
   * Get list of registered APIs
   */
  getRegisteredAPIs(): string[] {
    return Array.from(this.apis.keys());
  }
}

// Create singleton instance
export const interopService = new InteroperabilityService();

// Register APIs with environment variables
const getEnvVar = (name: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  return undefined;
};

// Curling.io API
const curlingIOKey = getEnvVar('CURLINGIO_API_KEY');
if (curlingIOKey) {
  interopService.registerAPI('curlingio', {
    baseUrl: 'https://api.curling.io/v1',
    auth: { type: 'apikey', header: 'X-API-Key', key: curlingIOKey },
    rateLimit: { requests: 100, window: 60000 }, // 100 req/min
  });
}

// CurlingZone (no auth needed for XML feeds)
const curlingZoneUrl = getEnvVar('CURLINGZONE_BASE_URL') || 'https://curlingzone.com/feeds/';
interopService.registerAPI('curlingzone', {
  baseUrl: curlingZoneUrl,
  auth: { type: 'none' },
  rateLimit: { requests: 60, window: 60000 }, // 60 req/min
});

// CurlingReg API
const curlingRegKey = getEnvVar('CURLINGREG_API_KEY');
if (curlingRegKey) {
  interopService.registerAPI('curlingreg', {
    baseUrl: 'https://api.curlingreg.com/v1',
    auth: { type: 'apikey', header: 'Authorization', key: curlingRegKey },
    rateLimit: { requests: 200, window: 60000 }, // 200 req/min
  });
}

// TrustEvent API
const trustEventToken = getEnvVar('TRUSTEVENT_TOKEN');
if (trustEventToken) {
  interopService.registerAPI('trustevent', {
    baseUrl: 'https://api.trustevents.com/v1',
    auth: { type: 'bearer', token: trustEventToken },
    rateLimit: { requests: 50, window: 60000 }, // 50 req/min
  });
}

export default interopService;
