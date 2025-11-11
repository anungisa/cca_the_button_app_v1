/**
 * Audit Logger Service
 * Logs all security-critical operations for compliance and forensics
 */

import { AuditLog } from '@/api/entities';

class AuditLogger {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.maxQueueSize = 100;
  }

  async log(action, details = {}) {
    const logEntry = {
      action,
      user_email: details.user_email || 'anonymous',
      user_id_hash: details.user_id ? this.hashUserId(details.user_id) : 'anonymous',
      entity_type: details.entity_type || null,
      entity_id: details.entity_id || null,
      changes: details.changes || null,
      feature: details.feature || 'GENERAL',
      context: {
        ...details.context,
        timestamp: new Date().toISOString(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        ip_address: 'hidden', // IP would come from server
        session_id: sessionStorage.getItem('session_id') || 'unknown'
      }
    };

    // Queue the log entry
    this.queue.push(logEntry);

    // Process queue if not already processing
    if (!this.isProcessing && this.queue.length > 0) {
      this.processQueue();
    }

    // Force flush if queue is getting large
    if (this.queue.length >= this.maxQueueSize) {
      await this.flush();
    }
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    try {
      // Process in batches of 10
      while (this.queue.length > 0) {
        const batch = this.queue.splice(0, 10);
        
        await Promise.all(
          batch.map(entry => 
            AuditLog.create(entry).catch(err => {
              console.error('Failed to write audit log:', err);
              // Re-queue on failure
              this.queue.push(entry);
            })
          )
        );

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async flush() {
    await this.processQueue();
  }

  hashUserId(userId) {
    // Simple hash for anonymization (in production use crypto.subtle)
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  // Specific audit methods
  async logAuthentication(user, action) {
    await this.log(`AUTH_${action.toUpperCase()}`, {
      user_email: user.email,
      user_id: user.id,
      feature: 'AUTHENTICATION',
      context: { action }
    });
  }

  async logPermissionChange(user, changes) {
    await this.log('PERMISSION_CHANGED', {
      user_email: user.email,
      user_id: user.id,
      feature: 'AUTHORIZATION',
      changes,
      context: { severity: 'high' }
    });
  }

  async logDataAccess(user, entityType, entityId, action) {
    await this.log(`DATA_${action.toUpperCase()}`, {
      user_email: user.email,
      user_id: user.id,
      entity_type: entityType,
      entity_id: entityId,
      feature: 'DATA_ACCESS',
      context: { action, sensitive: true }
    });
  }

  async logSecurityEvent(event, severity = 'medium') {
    await this.log(`SECURITY_${event.toUpperCase()}`, {
      feature: 'SECURITY',
      context: { 
        event, 
        severity,
        requires_review: severity === 'high' || severity === 'critical'
      }
    });
  }
}

export const auditLogger = new AuditLogger();
export default auditLogger;