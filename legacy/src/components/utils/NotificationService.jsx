import { Notification } from '@/api/entities';
import { User } from '@/api/entities';

/**
 * A centralized service for creating notifications.
 * This service will check user preferences before creating a notification.
 */
export class NotificationService {
  /**
   * Creates a notification for a user, but only if they have opted in for that type.
   * @param {object} notificationData - The data for the notification.
   * @param {string} notificationData.user_id - The recipient's user ID.
   * @param {string} notificationData.title - The notification title.
   * @param {string} notificationData.message - The notification message.
   * @param {string} notificationData.notification_type - The category of the notification (e.g., 'task_assigned').
   * @param {string} [notificationData.link_to] - Optional link for the notification.
   * @param {string} [notificationData.icon] - Optional Lucide icon name.
   * @returns {Promise<object|null>} The created notification object, or null if not created.
   */
  static async create(notificationData) {
    const { user_id, notification_type } = notificationData;

    try {
      // 1. Fetch user to check their preferences
      const user = await User.get(user_id);
      if (!user) {
        console.warn(`NotificationService: User not found with ID: ${user_id}`);
        return null;
      }
      
      const prefs = user.notification_preferences || {};

      // 2. Check if the user wants this type of notification
      // Default to true if preference is not explicitly set
      const isEnabled = prefs[notification_type] !== false;

      if (!isEnabled) {
        console.log(`Notification of type '${notification_type}' disabled by user ${user_id}. Skipping.`);
        return null;
      }
      
      // 3. If enabled, create the notification
      console.log(`Creating notification of type '${notification_type}' for user ${user_id}.`);
      const newNotification = await Notification.create({
        is_read: false, // Always start as unread
        ...notificationData
      });
      
      return newNotification;

    } catch (error) {
      console.error('Error in NotificationService:', error);
      // Fallback to creating it anyway if preference check fails, to not lose the notification
      try {
        const fallbackNotification = await Notification.create({
            is_read: false,
            ...notificationData
        });
        return fallbackNotification;
      } catch (innerError) {
        console.error('Fallback notification creation failed:', innerError);
        return null;
      }
    }
  }

  /**
   * Creates notifications for multiple users at once, respecting their individual preferences.
   * Useful for mentions or bulk notifications.
   */
  static async createForMultipleUsers(baseNotificationData, userIds) {
    const notifications = [];
    
    for (const userId of userIds) {
      const notification = await this.create({
        ...baseNotificationData,
        user_id: userId
      });
      
      if (notification) {
        notifications.push(notification);
      }
    }
    
    return notifications;
  }

  /**
   * Creates a mention notification specifically
   */
  static async createMentionNotification({ mentionedUserId, mentionerName, entityType, entityTitle, linkTo }) {
    return await this.create({
      user_id: mentionedUserId,
      title: 'You were mentioned',
      message: `${mentionerName} mentioned you in a comment on ${entityTitle || entityType}`,
      notification_type: 'mention',
      link_to: linkTo,
      icon: 'AtSign'
    });
  }
}