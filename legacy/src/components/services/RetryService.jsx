/**
 * Retry Service with Exponential Backoff
 * Implements intelligent retry logic for failed requests
 */

export class RetryService {
  static async withRetry(
    fn,
    options = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      shouldRetry: (error) => true
    }
  ) {
    const { maxRetries, baseDelay, maxDelay, shouldRetry } = options;
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Don't retry if we shouldn't or if it's the last attempt
        if (!shouldRetry(error) || attempt === maxRetries) {
          throw error;
        }

        // Calculate exponential backoff with jitter
        const exponentialDelay = Math.min(
          baseDelay * Math.pow(2, attempt),
          maxDelay
        );
        const jitter = Math.random() * 0.3 * exponentialDelay;
        const delay = exponentialDelay + jitter;

        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  static shouldRetryError(error) {
    // Retry on network errors, 5xx errors, timeouts
    if (error.message?.includes('Network Error')) return true;
    if (error.message?.includes('timeout')) return true;
    if (error.response?.status >= 500) return true;
    if (error.response?.status === 429) return true; // Rate limit
    
    // Don't retry on 4xx client errors (except 429)
    if (error.response?.status >= 400 && error.response?.status < 500) return false;
    
    return true;
  }
}

export default RetryService;