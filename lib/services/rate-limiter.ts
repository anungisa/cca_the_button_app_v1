/**
 * Rate Limiter
 * Implements token bucket algorithm for API rate limiting
 */

interface RateLimitConfig {
  requests: number; // Number of requests allowed
  window: number; // Time window in milliseconds
}

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.tokens = config.requests;
    this.lastRefill = Date.now();
  }

  /**
   * Wait until a token is available
   */
  async wait(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Calculate wait time until next token is available
    const timePerToken = this.config.window / this.config.requests;
    const waitTime = timePerToken - (Date.now() - this.lastRefill);

    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.refill();
      this.tokens -= 1;
    }
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;

    if (elapsed >= this.config.window) {
      // Full refill if window has passed
      this.tokens = this.config.requests;
      this.lastRefill = now;
    } else {
      // Partial refill based on elapsed time
      const tokensToAdd = (elapsed / this.config.window) * this.config.requests;
      this.tokens = Math.min(this.config.requests, this.tokens + tokensToAdd);
      
      if (tokensToAdd >= 1) {
        this.lastRefill = now;
      }
    }
  }

  /**
   * Check if tokens are available without consuming
   */
  hasTokens(): boolean {
    this.refill();
    return this.tokens >= 1;
  }

  /**
   * Get current token count
   */
  getTokens(): number {
    this.refill();
    return this.tokens;
  }
}
