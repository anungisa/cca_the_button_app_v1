/**
 * Prefetch Service
 * Intelligently prefetches data user is likely to need
 */

import { enhancedCache } from './EnhancedCacheService';

class PrefetchService {
  constructor() {
    this.prefetchQueue = [];
    this.isProcessing = false;
  }

  // Prefetch data in the background
  async prefetch(key, fetchFn, priority = 'low') {
    // Don't prefetch if already cached
    if (enhancedCache.get(key)) {
      return;
    }

    this.prefetchQueue.push({
      key,
      fetchFn,
      priority,
      timestamp: Date.now()
    });

    // Sort by priority
    this.prefetchQueue.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.prefetchQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const item = this.prefetchQueue.shift();

    try {
      // Wait for browser to be idle
      if ('requestIdleCallback' in window) {
        await new Promise(resolve => window.requestIdleCallback(resolve));
      }

      const data = await item.fetchFn();
      enhancedCache.set(item.key, data, 10); // Cache for 10 minutes
      console.log(`Prefetched: ${item.key}`);
    } catch (error) {
      console.warn(`Prefetch failed for ${item.key}:`, error);
    }

    // Process next item
    setTimeout(() => this.processQueue(), 100);
  }

  // Prefetch related data based on user navigation patterns
  prefetchRelated(currentPage, userData) {
    const prefetchRules = {
      'Home': ['Events', 'Clubs', 'LoyaltyProgram'],
      'Events': ['EventDetails', 'Streaming'],
      'Clubs': ['BusinessHub', 'ClubSurvey'],
      'Profile': ['PurchaseHistory', 'LoyaltyProgram']
    };

    const relatedPages = prefetchRules[currentPage] || [];
    
    relatedPages.forEach(page => {
      this.prefetch(
        `prefetch-${page}`,
        () => this.fetchPageData(page, userData),
        'low'
      );
    });
  }

  async fetchPageData(pageName, userData) {
    // Mock implementation - would fetch actual page data
    return { page: pageName, prefetched: true };
  }

  clearQueue() {
    this.prefetchQueue = [];
  }
}

export const prefetchService = new PrefetchService();
export default prefetchService;