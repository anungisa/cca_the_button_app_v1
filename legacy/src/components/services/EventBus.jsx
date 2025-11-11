/**
 * Centralized Event Bus for inter-service communication
 * Implements pub/sub pattern to decouple platform components
 */
class EventBus {
  constructor() {
    this.subscribers = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 1000;
  }

  /**
   * Subscribe to events
   * @param {string} eventName - Event name to subscribe to
   * @param {Function} callback - Function to call when event is published
   * @param {Object} options - Options like priority, once, etc.
   */
  subscribe(eventName, callback, options = {}) {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }

    const subscription = {
      id: Date.now() + Math.random(),
      callback,
      priority: options.priority || 0,
      once: options.once || false,
      context: options.context || null
    };

    this.subscribers.get(eventName).push(subscription);
    
    // Sort by priority (higher priority first)
    this.subscribers.get(eventName).sort((a, b) => b.priority - a.priority);

    // Return unsubscribe function
    return () => this.unsubscribe(eventName, subscription.id);
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(eventName, subscriptionId) {
    if (this.subscribers.has(eventName)) {
      const subs = this.subscribers.get(eventName);
      const index = subs.findIndex(sub => sub.id === subscriptionId);
      if (index > -1) {
        subs.splice(index, 1);
      }
    }
  }

  /**
   * Publish an event
   * @param {string} eventName - Event name
   * @param {Object} data - Event data
   * @param {Object} metadata - Event metadata
   */
  async publish(eventName, data = {}, metadata = {}) {
    const event = {
      name: eventName,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: metadata.source || 'unknown',
        ...metadata
      }
    };

    // Add to history
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.pop();
    }

    // Notify subscribers
    if (this.subscribers.has(eventName)) {
      const subscribers = [...this.subscribers.get(eventName)];
      
      for (const subscription of subscribers) {
        try {
          await subscription.callback(event.data, event.metadata);
          
          // Remove one-time subscriptions
          if (subscription.once) {
            this.unsubscribe(eventName, subscription.id);
          }
        } catch (error) {
          console.error(`Event handler error for ${eventName}:`, error);
        }
      }
    }

    // Also publish to wildcard subscribers
    if (this.subscribers.has('*')) {
      const wildcardSubs = [...this.subscribers.get('*')];
      for (const subscription of wildcardSubs) {
        try {
          await subscription.callback(event.data, { ...event.metadata, eventName });
        } catch (error) {
          console.error(`Wildcard event handler error:`, error);
        }
      }
    }

    return event;
  }

  /**
   * Get event history
   */
  getHistory(eventName = null, limit = 100) {
    let history = this.eventHistory;
    
    if (eventName) {
      history = history.filter(event => event.name === eventName);
    }
    
    return history.slice(0, limit);
  }

  /**
   * Clear all subscribers (useful for testing)
   */
  clear() {
    this.subscribers.clear();
    this.eventHistory = [];
  }
}

// Create singleton instance
export const eventBus = new EventBus();

// Event name constants to prevent typos
export const EVENTS = {
  // User events
  USER_REGISTERED: 'user.registered',
  USER_PROFILE_UPDATED: 'user.profile.updated',
  USER_LOGIN: 'user.login',
  
  // Sponsorship events
  DEAL_CREATED: 'sponsorship.deal.created',
  DEAL_WON: 'sponsorship.deal.won',
  DEAL_LOST: 'sponsorship.deal.lost',
  CONTRACT_SIGNED: 'sponsorship.contract.signed',
  DELIVERABLE_COMPLETED: 'sponsorship.deliverable.completed',
  
  // Event planning events
  EVENT_PLAN_CREATED: 'eventops.plan.created',
  EVENT_TASK_COMPLETED: 'eventops.task.completed',
  EVENT_MILESTONE_REACHED: 'eventops.milestone.reached',
  
  // Volunteer events
  VOLUNTEER_REGISTERED: 'volunteer.registered',
  VOLUNTEER_ASSIGNED: 'volunteer.assigned',
  COMPLIANCE_EXPIRED: 'volunteer.compliance.expired',
  
  // Finance events
  BUDGET_APPROVED: 'finance.budget.approved',
  PAYMENT_RECEIVED: 'finance.payment.received',
  EXPENSE_SUBMITTED: 'finance.expense.submitted',
  
  // Incident events
  INCIDENT_CREATED: 'incident.created',
  INCIDENT_ESCALATED: 'incident.escalated',
  INCIDENT_RESOLVED: 'incident.resolved',
  
  // Compliance events
  POLICY_VIOLATION: 'compliance.violation',
  CERTIFICATION_EXPIRING: 'compliance.certification.expiring',
  
  // Marketing events
  CAMPAIGN_LAUNCHED: 'marketing.campaign.launched',
  PRESS_RELEASE_PUBLISHED: 'marketing.press_release.published',
  
  // System events
  DATA_SYNC_COMPLETED: 'system.data_sync.completed',
  INTEGRATION_ERROR: 'system.integration.error',
  WORKFLOW_TRIGGERED: 'system.workflow.triggered'
};

export default eventBus;