/**
 * Optimistic Update Service
 * Provides instant UI feedback while API calls process in background
 */

export class OptimisticUpdateService {
  constructor() {
    this.rollbacks = new Map();
  }

  async update(key, optimisticData, apiCall, onSuccess, onError) {
    // Store rollback data
    const rollbackId = `${key}-${Date.now()}`;
    
    try {
      // Apply optimistic update immediately
      if (onSuccess) {
        onSuccess(optimisticData);
      }

      // Execute actual API call
      const result = await apiCall();

      // Clean up rollback
      this.rollbacks.delete(rollbackId);

      return result;
    } catch (error) {
      console.error('Optimistic update failed, rolling back:', error);

      // Rollback optimistic changes
      if (onError) {
        onError(error);
      }

      this.rollbacks.delete(rollbackId);
      throw error;
    }
  }

  async batchUpdate(updates) {
    const results = await Promise.allSettled(
      updates.map(({ key, optimisticData, apiCall, onSuccess, onError }) =>
        this.update(key, optimisticData, apiCall, onSuccess, onError)
      )
    );

    return results;
  }
}

export const optimisticUpdateService = new OptimisticUpdateService();
export default optimisticUpdateService;