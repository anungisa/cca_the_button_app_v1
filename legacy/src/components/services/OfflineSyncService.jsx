/**
 * Offline Sync Service
 * Queues mutations when offline and syncs when connection restored
 */

class OfflineSyncService {
  constructor() {
    this.queue = [];
    this.isOnline = navigator.onLine;
    this.isSyncing = false;
    this.initializeListeners();
  }

  initializeListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      console.log('✅ Connection restored');
      this.isOnline = true;
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      console.warn('⚠️ Connection lost - entering offline mode');
      this.isOnline = false;
    });

    // Load pending operations from localStorage
    this.loadPendingOperations();
  }

  loadPendingOperations() {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage).filter(k => 
      k.startsWith('pending-create-') || k.startsWith('pending-update-')
    );

    keys.forEach(key => {
      try {
        const operation = JSON.parse(localStorage.getItem(key));
        const age = Date.now() - operation.timestamp;
        
        // Skip operations older than 24 hours
        if (age < 86400000) {
          this.queue.push({
            ...operation,
            storageKey: key
          });
        } else {
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error('Failed to load pending operation:', error);
        localStorage.removeItem(key);
      }
    });

    if (this.queue.length > 0) {
      console.log(`Loaded ${this.queue.length} pending operations from offline queue`);
    }
  }

  queueOperation(operation) {
    this.queue.push({
      ...operation,
      timestamp: Date.now(),
      id: `op-${Date.now()}-${Math.random()}`
    });

    console.log(`Queued operation: ${operation.type} (${this.queue.length} in queue)`);
  }

  async syncQueue() {
    if (this.isSyncing || !this.isOnline || this.queue.length === 0) {
      return;
    }

    console.log(`Starting sync of ${this.queue.length} operations...`);
    this.isSyncing = true;

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    while (this.queue.length > 0) {
      const operation = this.queue[0];

      try {
        await this.executeOperation(operation);
        results.success++;
        
        // Remove from localStorage if it exists
        if (operation.storageKey) {
          localStorage.removeItem(operation.storageKey);
        }
        
        // Remove from queue
        this.queue.shift();
      } catch (error) {
        console.error('Sync operation failed:', error);
        results.failed++;
        results.errors.push({ operation, error: error.message });
        
        // Move to end of queue for retry later
        this.queue.push(this.queue.shift());
        
        // Stop if we've gone through the whole queue
        if (results.failed >= this.queue.length) {
          break;
        }
      }
    }

    this.isSyncing = false;
    
    console.log(`Sync complete: ${results.success} succeeded, ${results.failed} failed`);
    
    return results;
  }

  async executeOperation(operation) {
    // This would call the actual entity methods
    // For now, just simulate
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Simulated failure'));
        }
      }, 100);
    });
  }

  getQueueSize() {
    return this.queue.length;
  }

  getOnlineStatus() {
    return this.isOnline;
  }

  clearQueue() {
    this.queue = [];
    
    // Clear from localStorage
    const keys = Object.keys(localStorage).filter(k => 
      k.startsWith('pending-create-') || k.startsWith('pending-update-')
    );
    keys.forEach(key => localStorage.removeItem(key));
  }
}

export const offlineSyncService = new OfflineSyncService();
export default offlineSyncService;