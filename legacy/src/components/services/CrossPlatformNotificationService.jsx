import { SendEmail } from '@/api/integrations';
import { eventBus, EVENTS } from './EventBus';

/**
 * Cross-Platform Notification Service
 * Extends real-time updates to email, SMS, and push notifications
 */
export class CrossPlatformNotificationService {
  constructor() {
    this.notificationChannels = new Map();
    this.userPreferences = new Map();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for all notification events
    eventBus.subscribe('notification.*', async (data, metadata) => {
      await this.processNotification(data, metadata);
    });

    // Listen for critical incidents
    eventBus.subscribe(EVENTS.INCIDENT_ESCALATED, async (data) => {
      await this.sendCriticalAlert(data);
    });

    // Listen for deal wins
    eventBus.subscribe(EVENTS.DEAL_WON, async (data) => {
      await this.sendSuccessNotification(data);
    });
  }

  /**
   * Register notification channel
   */
  registerChannel(channelType, config) {
    this.notificationChannels.set(channelType, config);
  }

  /**
   * Set user notification preferences
   */
  setUserPreferences(userId, preferences) {
    this.userPreferences.set(userId, preferences);
  }

  /**
   * Process and route notifications based on urgency and preferences
   */
  async processNotification(data, metadata) {
    const { userId, urgency = 'normal', type, title, message } = data;
    
    if (!userId) return;

    const userPrefs = this.userPreferences.get(userId) || this.getDefaultPreferences();
    const channels = this.determineChannels(urgency, type, userPrefs);

    // Send via all appropriate channels
    for (const channel of channels) {
      try {
        await this.sendViaChannel(channel, {
          userId,
          title,
          message,
          urgency,
          type,
          metadata
        });
      } catch (error) {
        console.error(`Failed to send via ${channel}:`, error);
      }
    }
  }

  /**
   * Determine which channels to use based on urgency and preferences
   */
  determineChannels(urgency, type, userPrefs) {
    const channels = ['in_app']; // Always send in-app

    if (urgency === 'critical') {
      channels.push('email', 'sms', 'push');
    } else if (urgency === 'high') {
      channels.push('email', 'push');
    } else if (urgency === 'normal') {
      if (userPrefs.email_notifications) channels.push('email');
      if (userPrefs.push_notifications) channels.push('push');
    }

    // Type-specific overrides
    if (type === 'incident_assigned' && userPrefs.incident_alerts) {
      channels.push('sms');
    }

    return [...new Set(channels)]; // Remove duplicates
  }

  /**
   * Send notification via specific channel
   */
  async sendViaChannel(channel, notificationData) {
    const { userId, title, message, urgency, type } = notificationData;

    switch (channel) {
      case 'email':
        await this.sendEmailNotification(userId, title, message, urgency);
        break;
        
      case 'sms':
        await this.sendSMSNotification(userId, title, message);
        break;
        
      case 'push':
        await this.sendPushNotification(userId, title, message);
        break;
        
      case 'teams':
        await this.sendTeamsNotification(userId, title, message);
        break;
        
      case 'slack':
        await this.sendSlackNotification(userId, title, message);
        break;
        
      case 'in_app':
        // Already handled by existing notification system
        break;
    }
  }

  async sendEmailNotification(userId, title, message, urgency) {
    const { User } = await import('@/api/entities');
    const user = await User.list();
    const targetUser = user.find(u => u.id === userId);
    
    if (!targetUser?.email) return;

    const priorityText = urgency === 'critical' ? '🚨 URGENT' : urgency === 'high' ? '⚠️ Important' : '';
    
    await SendEmail({
      to: targetUser.email,
      subject: `${priorityText} ${title}`,
      body: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #ED1C24;">${title}</h2>
          <p>${message}</p>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <p><strong>Priority:</strong> ${urgency}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <a href="${window.location.origin}" 
               style="background-color: #ED1C24; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in The Button
            </a>
          </div>
        </div>
      `
    });
  }

  async sendSMSNotification(userId, title, message) {
    // This would integrate with SMS service like Twilio
    // For now, we'll simulate the API call
    console.log(`SMS to ${userId}: ${title} - ${message}`);
    
    // In real implementation:
    // await twilioClient.messages.create({
    //   body: `${title}: ${message}`,
    //   to: userPhoneNumber,
    //   from: process.env.TWILIO_PHONE_NUMBER
    // });
  }

  async sendPushNotification(userId, title, message) {
    // This would use service worker for web push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body: message,
          icon: '/icon-192.png',
          badge: '/badge-72.png',
          data: { userId, timestamp: Date.now() }
        });
      } catch (error) {
        console.error('Push notification failed:', error);
      }
    }
  }

  async sendTeamsNotification(userId, title, message) {
    // This would integrate with Microsoft Teams webhook
    console.log(`Teams notification to ${userId}: ${title}`);
    
    // In real implementation:
    // await fetch(teamsWebhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     title,
    //     text: message,
    //     themeColor: '#ED1C24'
    //   })
    // });
  }

  async sendSlackNotification(userId, title, message) {
    // This would integrate with Slack webhook
    console.log(`Slack notification to ${userId}: ${title}`);
  }

  /**
   * Send critical alert to all channels
   */
  async sendCriticalAlert(data) {
    const { incidentId, title, assignedTo } = data;
    
    await this.processNotification({
      userId: assignedTo,
      urgency: 'critical',
      type: 'incident_critical',
      title: '🚨 Critical Incident Escalated',
      message: `Incident #${incidentId} requires immediate attention: ${title}`
    });

    // Also notify managers/supervisors
    // This would query for users with supervisory roles
    console.log('Notifying supervisors of critical incident');
  }

  /**
   * Send success notification
   */
  async sendSuccessNotification(data) {
    const { sponsorName, value, dealOwner } = data;
    
    await this.processNotification({
      userId: dealOwner,
      urgency: 'normal',
      type: 'deal_won',
      title: '🎉 Deal Won!',
      message: `Congratulations! ${sponsorName} deal worth $${value.toLocaleString()} has been successfully closed.`
    });
  }

  getDefaultPreferences() {
    return {
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      incident_alerts: true,
      deal_notifications: true,
      event_reminders: true
    };
  }
}

export const crossPlatformNotifications = new CrossPlatformNotificationService();