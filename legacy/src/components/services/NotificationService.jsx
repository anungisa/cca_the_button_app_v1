export const NotificationService = {
  async sendNotification({ title, message, recipientId, notificationType, icon }) {
    // This is a mock service. In a real application, this would send a notification.
    console.log('Mock Notification Sent:', { title, message, recipientId });
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  }
};