/**
 * Request Deduplication Service
 * Prevents duplicate API calls for the same resource
 */

class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }

  async deduplicate(key, fn) {
    // If there's already a pending request for this key, return that promise
    if (this.pendingRequests.has(key)) {
      console.log(`Deduplicating request: ${key}`);
      return this.pendingRequests.get(key);
    }

    // Create new request promise
    const promise = fn()
      .finally(() => {
        // Clean up after request completes
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear(key) {
    if (key) {
      this.pendingRequests.delete(key);
    } else {
      this.pendingRequests.clear();
    }
  }

  hasPending(key) {
    return this.pendingRequests.has(key);
  }
}

export const requestDeduplicator = new RequestDeduplicator();
export default requestDeduplicator;