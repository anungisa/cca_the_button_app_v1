/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by monitoring API call success/failure rates
 */

class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, monitoringPeriod = 10000) {
    this.failureThreshold = threshold;
    this.timeout = timeout;
    this.monitoringPeriod = monitoringPeriod;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
    this.successCount = 0;
  }

  async call(fn, fallback = null) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        console.warn('Circuit breaker is OPEN, using fallback');
        return fallback ? fallback() : Promise.reject(new Error('Circuit breaker is OPEN'));
      }
      this.state = 'HALF_OPEN';
      this.successCount = 0;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) {
        return fallback();
      }
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 2) {
        this.state = 'CLOSED';
        console.log('Circuit breaker CLOSED - service recovered');
      }
    }
  }

  onFailure() {
    this.failureCount++;
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      console.error(`Circuit breaker OPEN - too many failures (${this.failureCount})`);
    }
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      nextAttempt: this.nextAttempt
    };
  }
}

export default CircuitBreaker;