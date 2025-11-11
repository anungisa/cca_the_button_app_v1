import { Incident } from '@/api/entities';
import { NotificationService } from './NotificationService';

class EmailIngestionService {
  constructor() {
    this.supportEmail = 'support@curling.ca';
    this.routingRules = this.initializeRoutingRules();
  }

  initializeRoutingRules() {
    return [
      {
        keywords: ['safe sport', 'harassment', 'abuse', 'discrimination', 'misconduct'],
        category: 'safe_sport',
        priority: 'high',
        department: 'safe_sport',
        confidential: true
      },
      {
        keywords: ['club', 'membership', 'affiliation', 'governance'],
        category: 'club_support',
        priority: 'medium',
        department: 'club_services',
        confidential: false
      },
      {
        keywords: ['volunteer', 'event', 'registration', 'tournament'],
        category: 'volunteer_issue',
        priority: 'medium',
        department: 'events',
        confidential: false
      },
      {
        keywords: ['login', 'password', 'technical', 'bug', 'error', 'website'],
        category: 'technical_issue',
        priority: 'medium',
        department: 'tech',
        confidential: false
      },
      {
        keywords: ['sponsor', 'partnership', 'marketing', 'brand'],
        category: 'sponsor_outreach',
        priority: 'medium',
        department: 'sponsorship',
        confidential: false
      },
      {
        keywords: ['ma', 'member association', 'provincial', 'regional'],
        category: 'ma_inquiry',
        priority: 'medium',
        department: 'club_services',
        confidential: false
      }
    ];
  }

  /**
   * Process incoming email and create incident
   * This would typically be called by Microsoft 365 webhook or email processing service
   */
  async processIncomingEmail(emailData) {
    try {
      // Extract email metadata
      const { subject, body, from, to, receivedDate, messageId } = emailData;
      
      // Analyze email content for routing
      const routing = this.analyzeEmailContent(subject, body);
      
      // Create incident from email
      const incidentData = {
        title: this.cleanSubject(subject),
        description: this.extractEmailBody(body),
        category: routing.category,
        priority: routing.priority,
        assigned_department: routing.department,
        is_confidential: routing.confidential,
        source: 'email_in',
        communications_log: [{
          date: receivedDate || new Date().toISOString(),
          author_name: this.extractSenderName(from),
          note: `Original email received from ${from}`,
          channel: 'email'
        }],
        metadata: {
          original_message_id: messageId,
          sender_email: from,
          received_date: receivedDate
        }
      };

      // Create the incident
      const incident = await Incident.create(incidentData);
      
      // Send notifications based on routing
      await this.sendRoutingNotifications(incident, routing);
      
      // Send acknowledgment email to sender
      await this.sendAcknowledgmentEmail(from, incident);
      
      return {
        success: true,
        incident_id: incident.id,
        routing: routing
      };
      
    } catch (error) {
      console.error('Error processing incoming email:', error);
      
      // Send error notification to IT team
      await NotificationService.sendSystemAlert({
        type: 'email_processing_error',
        message: `Failed to process email from ${emailData.from}`,
        error: error.message
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  analyzeEmailContent(subject, body) {
    const fullText = `${subject} ${body}`.toLowerCase();
    
    // Find matching routing rule
    for (const rule of this.routingRules) {
      const keywordMatch = rule.keywords.some(keyword => 
        fullText.includes(keyword.toLowerCase())
      );
      
      if (keywordMatch) {
        return rule;
      }
    }
    
    // Default routing for unmatched emails
    return {
      category: 'general_inquiry',
      priority: 'medium',
      department: 'club_services',
      confidential: false
    };
  }

  cleanSubject(subject) {
    // Remove common email prefixes and clean up
    return subject
      .replace(/^(RE:|FW:|FWD:)\s*/i, '')
      .replace(/^\[.*?\]\s*/, '')
      .trim();
  }

  extractEmailBody(body) {
    // Extract meaningful content from email body
    // Remove email signatures, footers, and formatting
    let cleanBody = body;
    
    // Remove HTML tags
    cleanBody = cleanBody.replace(/<[^>]*>/g, '');
    
    // Remove email signatures (common patterns)
    cleanBody = cleanBody.replace(/--\s*[\s\S]*$/, '');
    cleanBody = cleanBody.replace(/Best regards[\s\S]*$/, '');
    cleanBody = cleanBody.replace(/Sent from my[\s\S]*$/, '');
    
    // Remove excessive whitespace
    cleanBody = cleanBody.replace(/\n{3,}/g, '\n\n');
    
    return cleanBody.trim();
  }

  extractSenderName(fromEmail) {
    // Extract name from email address like "John Doe <john@example.com>"
    const match = fromEmail.match(/^([^<]+)<.*>$/);
    if (match) {
      return match[1].trim();
    }
    
    // If no name, use email address
    return fromEmail.split('@')[0];
  }

  async sendRoutingNotifications(incident, routing) {
    // Notify assigned department
    await NotificationService.sendDepartmentNotification({
      department: routing.department,
      incident_id: incident.id,
      title: incident.title,
      priority: routing.priority,
      source: 'email'
    });

    // Special handling for high-priority or confidential incidents
    if (routing.priority === 'high' || routing.confidential) {
      await NotificationService.sendEscalationNotification({
        incident_id: incident.id,
        title: incident.title,
        priority: routing.priority,
        confidential: routing.confidential,
        department: routing.department
      });
    }
  }

  async sendAcknowledgmentEmail(senderEmail, incident) {
    const acknowledgmentBody = `
Dear Curling Canada Community Member,

Thank you for contacting Curling Canada support. We have received your inquiry and created a support ticket for you.

**Ticket Details:**
- Ticket ID: ${incident.id}
- Subject: ${incident.title}
- Priority: ${incident.priority.toUpperCase()}
- Department: ${incident.assigned_department.replace('_', ' ').toUpperCase()}

Your inquiry has been routed to the appropriate department and you can expect a response within:
- Critical Priority: 1 hour
- High Priority: 4 hours  
- Medium Priority: 24 hours
- Low Priority: 72 hours

If this is an urgent matter related to Safe Sport, please call our SafeSport hotline immediately at 1-800-XXX-XXXX.

You will receive updates as we work on your request. Please reference your Ticket ID in any future correspondence.

Thank you for your patience.

Best regards,
Curling Canada Support Team

---
This is an automated response. Please do not reply directly to this email.
For urgent matters, please call 1-833-CURLING (1-833-287-5464).
    `;

    // In a real implementation, this would integrate with Microsoft 365 or email service
    try {
      await NotificationService.sendEmail({
        to: senderEmail,
        subject: `[Ticket #${incident.id}] Your inquiry has been received - ${incident.title}`,
        body: acknowledgmentBody,
        priority: 'normal'
      });
    } catch (error) {
      console.error('Failed to send acknowledgment email:', error);
    }
  }

  /**
   * Configure Microsoft 365 webhook endpoint
   * This would be called during system setup
   */
  async configureMicrosoft365Integration() {
    // Get base URL from window location instead of process.env
    const baseUrl = window.location.origin;
    
    const webhookConfig = {
      endpoint: `${baseUrl}/api/webhooks/email-ingestion`,
      email_address: this.supportEmail,
      filters: {
        // Only process emails sent to support address
        to: this.supportEmail
      },
      authentication: {
        type: 'bearer',
        token: 'webhook_secret_token' // In real implementation, this would be from secure config
      }
    };

    // In real implementation, this would call Microsoft Graph API
    console.log('M365 Webhook Configuration:', webhookConfig);
    
    return webhookConfig;
  }

  /**
   * Test the email ingestion with sample data
   */
  async testEmailIngestion() {
    const sampleEmail = {
      subject: 'Club membership issue - Rocky Mountain Curling Club',
      body: `Hi there,
      
      We're having trouble with our club's membership registration system. Several members can't log in and our president is getting frustrated.
      
      Can someone help us resolve this ASAP?
      
      Thanks,
      Sarah Johnson
      Rocky Mountain CC Secretary`,
      from: 'Sarah Johnson <sarah.j@rockymountaincc.com>',
      to: 'support@curling.ca',
      receivedDate: new Date().toISOString(),
      messageId: 'test-message-123'
    };

    return await this.processIncomingEmail(sampleEmail);
  }
}

export default new EmailIngestionService();