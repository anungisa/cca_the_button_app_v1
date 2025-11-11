
import { eventBus, EVENTS } from './EventBus';
import { DrillLog } from '@/api/entities'; // Updated DrillLog import path
import { Incident } from '@/api/entities';
import { EventPlan } from '@/api/entities';
import { EventPlanningService } from './EventPlanningService';

/**
 * Advanced Offline Support Service
 * Enables full workflow completion without internet connectivity
 */
export class OfflineInteroperabilityService {
  constructor() {
    this.queue = [];
    this.isSyncing = false;
    this.isOnline = navigator.onLine;
    this.loadQueueFromStorage();

    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Service worker registration disabled - platform doesn't support root-level files
  }

  handleOnline() {
    this.isOnline = true;
    this.syncOfflineActions();
  }

  handleOffline() {
    this.isOnline = false;
  }

  // Removed initializeServiceWorker method as it's commented out in the constructor
  // Removed setupEventListeners method as its logic is now directly in the constructor

  /**
   * Queue actions for offline execution
   */
  queueAction(action) {
    const queuedAction = {
      id: Date.now() + Math.random(),
      action,
      timestamp: Date.now(),
      attempts: 0,
      maxAttempts: 3
    };

    this.queue.push(queuedAction);
    this.saveQueue();

    return queuedAction.id;
  }

  /**
   * Execute action - online immediately, offline queued
   */
  async executeAction(actionType, data, options = {}) {
    const action = {
      type: actionType,
      data,
      options,
      timestamp: Date.now()
    };

    if (this.isOnline && !options.forceOffline) {
      try {
        return await this.executeOnlineAction(action);
      } catch (error) {
        if (options.allowOfflineFallback !== false) {
          console.warn('Online action failed, queuing for later:', error);
          this.queueAction(action);
          return { success: true, queued: true };
        }
        throw error;
      }
    } else {
      // Execute offline
      const result = await this.executeOfflineAction(action);
      if (!result.immediate) {
        this.queueAction(action);
      }
      return result;
    }
  }

  async executeOnlineAction(action) {
    const { type, data } = action;

    switch (type) {
      case 'create_incident':
        return await Incident.create(data);

      case 'update_event_plan':
        return await EventPlan.update(data.id, data.updates);

      case 'complete_task':
        // const { EventPlanningService } = await import('./EventPlanningService'); // This import is now global
        return await EventPlanningService.completeTask(data.taskId, data.userId);

      case 'win_deal':
        const { SponsorshipService } = await import('./SponsorshipService');
        return await SponsorshipService.winDeal(data.dealId, data.contractDetails);

      case 'log_drill': // Changed case name from create_drill_log to log_drill
        return await DrillLog.create(data);

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  async executeOfflineAction(action) {
    const { type, data } = action;

    // Some actions can be executed immediately offline
    switch (type) {
      case 'create_incident':
        // Store locally with temporary ID
        const tempIncident = {
          ...data,
          id: `offline_${Date.now()}`,
          _offline: true,
          _created_offline: Date.now()
        };
        this.storeOfflineData('incidents', tempIncident);
        return { success: true, immediate: true, tempId: tempIncident.id };

      case 'update_event_plan':
        // Store update locally
        const existingPlan = this.getOfflineData('event_plans', data.id);
        if (existingPlan) {
          const updatedPlan = { ...existingPlan, ...data.updates, _updated_offline: Date.now() };
          this.storeOfflineData('event_plans', updatedPlan);
          return { success: true, immediate: true };
        }
        return { success: true, immediate: false };

      case 'complete_task':
        // Mark task as completed locally
        const taskCompletion = {
          planId: data.planId, // Keeping these properties for local storage consistency, but they might not be used by the online service
          taskId: data.taskId,
          completionData: data.completionData,
          _completed_offline: Date.now()
        };
        this.storeOfflineData('task_completions', taskCompletion);
        return { success: true, immediate: true };

      default:
        return { success: true, immediate: false };
    }
  }

  /**
   * Sync all offline actions when back online
   */
  async syncOfflineActions() {
    if (this.isSyncing || !this.isOnline) return;

    this.isSyncing = true;

    try {
      const queue = [...this.queue];

      for (const queuedAction of queue) {
        try {
          await this.executeOnlineAction(queuedAction.action);

          // Remove from queue on success
          this.queue = this.queue.filter(a => a.id !== queuedAction.id);

          // Publish sync success event
          eventBus.publish(EVENTS.OFFLINE_SYNC_SUCCESS, {
            actionId: queuedAction.id,
            actionType: queuedAction.action.type
          });

        } catch (error) {
          queuedAction.attempts++;

          if (queuedAction.attempts >= queuedAction.maxAttempts) {
            // Remove failed actions after max attempts
            this.queue = this.queue.filter(a => a.id !== queuedAction.id);

            eventBus.publish(EVENTS.OFFLINE_SYNC_FAILED, {
              actionId: queuedAction.id,
              actionType: queuedAction.action.type,
              error: error.message
            });
          }
        }
      }

      this.saveQueue();

    } finally {
      this.isSyncing = false;
    }
  }

  // Removed cacheCriticalData method (criticalData property no longer exists)
  // Removed getCriticalData method (criticalData property no longer exists)

  /**
   * Store data locally
   */
  storeOfflineData(collection, data) {
    try {
      const existing = JSON.parse(localStorage.getItem(`offline_${collection}`) || '{}');
      existing[data.id] = data;
      localStorage.setItem(`offline_${collection}`, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }

  /**
   * Get offline data
   */
  getOfflineData(collection, id = null) {
    try {
      const data = JSON.parse(localStorage.getItem(`offline_${collection}`) || '{}');
      return id ? data[id] : Object.values(data);
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return id ? null : [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem('offline_queue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  // Removed saveCriticalDataCache method (criticalData property no longer exists)

  loadQueueFromStorage() {
    try {
      const saved = localStorage.getItem('offline_queue');
      this.queue = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  // Removed loadCriticalDataCache method (criticalData property no longer exists)

  /**
   * Check if we're currently offline
   */
  isOffline() {
    return !this.isOnline;
  }

  /**
   * Get offline queue status
   */
  getQueueStatus() {
    return {
      pending: this.queue.length,
      syncInProgress: this.isSyncing,
      isOnline: this.isOnline
    };
  }
}

export const offlineService = new OfflineInteroperabilityService();
