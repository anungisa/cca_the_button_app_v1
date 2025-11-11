import { SafeSportCompletion } from '@/api/entities';
import { SafeSportCommunication } from '@/api/entities';
import { User } from '@/api/entities';
import NotificationService from '../utils/NotificationService';
import WorkflowEngine from '../utils/WorkflowEngine';
import { addDays, isBefore, differenceInDays } from 'date-fns';

class SafeSportAutomationEngine {
  /**
   * Check for expiring certifications and send reminders
   */
  static async processExpirationReminders() {
    try {
      const completions = await SafeSportCompletion.filter({ 
        status: 'completed',
        expiry_date: { $exists: true }
      });

      const today = new Date();
      const reminderThresholds = [30, 14, 7, 1]; // Days before expiration

      for (const completion of completions) {
        const expiryDate = new Date(completion.expiry_date);
        const daysUntilExpiry = differenceInDays(expiryDate, today);

        if (reminderThresholds.includes(daysUntilExpiry) && daysUntilExpiry > 0) {
          await this.sendExpirationReminder(completion, daysUntilExpiry);
        } else if (daysUntilExpiry <= 0) {
          await this.markAsExpired(completion);
        }
      }
    } catch (error) {
      console.error('Failed to process expiration reminders:', error);
    }
  }

  /**
   * Send expiration reminder to user
   */
  static async sendExpirationReminder(completion, daysUntilExpiry) {
    try {
      const user = await User.filter({ id: completion.user_id });
      if (!user.length) return;

      const training = await this.getTrainingDetails(completion.training_id);
      
      await NotificationService.createNotification(
        completion.user_id,
        'Safe Sport Training Expiring',
        `Your ${training?.module_name || 'Safe Sport training'} certification expires in ${daysUntilExpiry} days. Please renew to maintain compliance.`,
        'compliance_due',
        'SafeSportHub',
        'Shield'
      );

      // Log the communication
      await SafeSportCommunication.create({
        title: 'Certification Expiry Reminder',
        message_type: 'training_reminder',
        content: `Automatic reminder sent for ${training?.module_name} certification expiring in ${daysUntilExpiry} days`,
        target_audience: ['individual'],
        delivery_method: ['app_notification'],
        sent_date: new Date().toISOString(),
        status: 'sent'
      });
    } catch (error) {
      console.error('Failed to send expiration reminder:', error);
    }
  }

  /**
   * Mark certification as expired and trigger workflows
   */
  static async markAsExpired(completion) {
    try {
      await SafeSportCompletion.update(completion.id, { status: 'expired' });
      
      // Update user's safe sport status
      await User.update(completion.user_id, { safe_sport_status: 'expired' });

      // Trigger workflow for expired certification
      await WorkflowEngine.triggerWorkflow('safe_sport_expired', {
        user_id: completion.user_id,
        training_id: completion.training_id,
        ma_region: completion.ma_region,
        user_role: completion.user_role
      });

      // Notify relevant staff based on user role
      if (['coach', 'official', 'volunteer'].includes(completion.user_role)) {
        await NotificationService.notifyByRole(
          ['safe_sport', 'staff'],
          'Safe Sport Certification Expired',
          `A ${completion.user_role}'s Safe Sport certification has expired and requires attention.`,
          'compliance_due',
          'SafeSportHub'
        );
      }
    } catch (error) {
      console.error('Failed to mark certification as expired:', error);
    }
  }

  /**
   * Process new incident and check if it requires policy review
   */
  static async processIncidentForPolicyReview(incident) {
    try {
      // High severity incidents trigger automatic policy reviews
      if (incident.severity === 'level_4' || incident.category === 'safe_sport') {
        await WorkflowEngine.triggerWorkflow('incident_policy_review', {
          incident_id: incident.id,
          severity: incident.severity,
          category: incident.category
        });

        // Notify Safe Sport team immediately
        await NotificationService.notifyByRole(
          ['safe_sport', 'executive'],
          'Critical Safe Sport Incident',
          `A ${incident.severity} Safe Sport incident requires immediate attention and potential policy review.`,
          'case_assigned',
          `IncidentManagementHub?id=${incident.id}`,
          'AlertTriangle'
        );
      }
    } catch (error) {
      console.error('Failed to process incident for policy review:', error);
    }
  }

  /**
   * Auto-assign mandatory training based on user role changes
   */
  static async assignMandatoryTraining(userId, newRole, maRegion) {
    try {
      const mandatoryTraining = {
        'coach': ['respect_in_sport', 'concussion'],
        'official': ['respect_in_sport'],
        'volunteer': ['respect_in_sport'],
        'staff': ['respect_in_sport', 'mental_health'],
        'board': ['governance', 'respect_in_sport']
      };

      const requiredTraining = mandatoryTraining[newRole] || [];
      
      for (const trainingType of requiredTraining) {
        // Check if user already has current certification
        const existingCompletion = await SafeSportCompletion.filter({
          user_id: userId,
          training_type: trainingType,
          status: 'completed',
          expiry_date: { $gte: new Date().toISOString() }
        });

        if (existingCompletion.length === 0) {
          await NotificationService.createNotification(
            userId,
            'Mandatory Training Required',
            `Your new role as ${newRole} requires completion of ${trainingType.replace('_', ' ')} training.`,
            'compliance_due',
            'SafeSportHub',
            'Shield'
          );
        }
      }
    } catch (error) {
      console.error('Failed to assign mandatory training:', error);
    }
  }

  /**
   * Generate compliance reports for MAs
   */
  static async generateMAComplianceReport(maRegion) {
    try {
      const users = await User.filter({ ma_region: maRegion });
      const completions = await SafeSportCompletion.filter({ ma_region: maRegion });

      const report = {
        total_users: users.length,
        compliant_users: users.filter(u => u.safe_sport_status === 'current').length,
        expired_users: users.filter(u => u.safe_sport_status === 'expired').length,
        pending_users: users.filter(u => u.safe_sport_status === 'pending').length,
        completion_rate: 0
      };

      report.completion_rate = users.length > 0 ? 
        (report.compliant_users / users.length * 100).toFixed(1) : 0;

      return report;
    } catch (error) {
      console.error('Failed to generate MA compliance report:', error);
      return null;
    }
  }

  /**
   * Get training details (would normally fetch from SafeSportTraining entity)
   */
  static async getTrainingDetails(trainingId) {
    // Placeholder - in real implementation, would fetch from SafeSportTraining entity
    return {
      module_name: 'Safe Sport Training',
      training_type: 'respect_in_sport'
    };
  }

  /**
   * Initialize automated checks (to be called by a scheduled job)
   */
  static async runAutomatedChecks() {
    console.log('Running Safe Sport automation checks...');
    await this.processExpirationReminders();
    console.log('Safe Sport automation checks completed.');
  }
}

export default SafeSportAutomationEngine;