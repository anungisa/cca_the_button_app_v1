
import { AuditLog } from '@/api/entities';
import { User } from '@/api/entities';

export class AuditLogService {
  /**
   * Log an action to the audit trail
   * @param {string} action - The action taken (e.g., 'PLATFORM_SETTING_UPDATED')
   * @param {Object} context - Additional context about the action
   * @param {string} feature - The feature category (e.g., 'PLATFORM_SETTINGS')
   * @param {string} entityType - The type of entity changed (optional)
   * @param {string} entityId - The ID of the entity changed (optional)
   */
  static async log(action, context = {}, feature = 'GENERAL', entityType = null, entityId = null) {
    try {
      // Get current user for audit trail
      // User.me() should return the current authenticated user object or throw an error.
      // We catch the error to handle cases where there's no authenticated user.
      const user = await User.me().catch(() => null);
      
      if (!user) {
        console.warn('Could not log audit entry: No authenticated user');
        return;
      }

      // Create audit log entry
      await AuditLog.create({
        user_id_hash: this.hashUserId(user.id),
        user_email: user.email,
        action,
        entity_type: entityType,
        entity_id: entityId,
        feature,
        context: {
          ...context,
          // Add common context elements for browser-based applications
          timestamp: new Date().toISOString(),
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          url: typeof window !== 'undefined' ? window.location.href : 'unknown'
        }
      });
    } catch (error) {
      console.error('Failed to create audit log entry:', error);
    }
  }

  /**
   * A simple, non-secure hashing function for demonstration purposes.
   * In a real application, use a robust cryptographic library.
   * This is made synchronous as the hashing logic does not involve awaitable operations.
   */
  static hashUserId(str) {
    // This is a placeholder. Use a proper crypto library in production.
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `hashed_${Math.abs(hash).toString(16)}`;
  }
}
