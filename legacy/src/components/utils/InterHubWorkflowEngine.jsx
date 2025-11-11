import { Task } from '@/api/entities';
import { Notification } from '@/api/entities';
import { AIInsight } from '@/api/entities';
import { User } from '@/api/entities';
import { NotificationService } from './NotificationService';

/**
 * Inter-Hub Workflow Engine
 * Automatically creates tasks, notifications, and workflows between different hubs
 * based on entity state changes and business rules
 */
export class InterHubWorkflowEngine {
  
  static async processEntityChange(entityType, entityData, changeType = 'update') {
    console.log(`Processing ${changeType} for ${entityType}:`, entityData);
    
    try {
      // Route to appropriate workflow handler
      switch (entityType) {
        case 'ComplianceItem':
          await this.handleComplianceWorkflow(entityData, changeType);
          break;
        case 'Club':
          await this.handleClubWorkflow(entityData, changeType);
          break;
        case 'SponsorDeal':
          await this.handleSponsorshipWorkflow(entityData, changeType);
          break;
        case 'Incident':
          await this.handleIncidentWorkflow(entityData, changeType);
          break;
        case 'OnboardingChecklist':
          await this.handleOnboardingWorkflow(entityData, changeType);
          break;
        case 'LegalCase':
          await this.handleLegalWorkflow(entityData, changeType);
          break;
        case 'EventPlan':
          await this.handleEventPlanWorkflow(entityData, changeType);
          break;
        case 'FinancialTransaction':
          await this.handleFinanceWorkflow(entityData, changeType);
          break;
        case 'ResearchPartnership':
          await this.handleResearchWorkflow(entityData, changeType);
          break;
        case 'Comment':
          await this.handleCommentWorkflow(entityData, changeType);
          break;
        default:
          console.log(`No workflow handler for ${entityType}`);
      }
    } catch (error) {
      console.error('Workflow processing error:', error);
    }
  }

  // NEW: Handle comment workflows including mentions
  static async handleCommentWorkflow(comment, changeType) {
    if (changeType === 'create' && comment.mentions && comment.mentions.length > 0) {
      // Send mention notifications
      for (const mention of comment.mentions) {
        await NotificationService.createMentionNotification({
          mentionedUserId: mention.user_id,
          mentionerName: comment.author_name,
          entityType: comment.entity_type,
          entityTitle: `${comment.entity_type} #${comment.entity_id}`,
          linkTo: window.location.pathname
        });
      }
    }
  }

  // Compliance Hub -> Executive/Manager Tasks
  static async handleComplianceWorkflow(compliance, changeType) {
    if (compliance.status === 'overdue' && compliance.risk_level === 'critical') {
      // Auto-escalate to executive team
      await this.createCrossHubTask({
        title: `URGENT: Critical Compliance Overdue - ${compliance.title}`,
        description: `Critical compliance item "${compliance.title}" is overdue. Immediate action required.`,
        priority: 'urgent',
        assigned_to: compliance.assigned_to,
        department: 'executive',
        reference_entity: 'ComplianceItem',
        reference_id: compliance.id,
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

      // Notify executive team
      await NotificationService.create({
        user_id: compliance.assigned_to,
        title: 'Critical Compliance Escalation',
        message: `${compliance.title} requires immediate executive attention`,
        notification_type: 'compliance_due',
        link_to: `StaffHQ?tab=governance`,
        icon: 'AlertTriangle'
      });
    }
  }

  // Club Services -> Executive/Marketing Tasks
  static async handleClubWorkflow(club, changeType) {
    if (club.status === 'at_risk' || (club.membership_count && club.membership_count < 50)) {
      // Create intervention task for club services
      await this.createCrossHubTask({
        title: `Club Support Required: ${club.name}`,
        description: `${club.name} showing risk indicators. Membership: ${club.membership_count || 'Unknown'}`,
        priority: 'high',
        assigned_to: await this.findDepartmentLead('club_services'),
        department: 'operations',
        reference_entity: 'Club',
        reference_id: club.id,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      // Trigger AI insight generation
      await this.generateAIInsight({
        context_id: club.id,
        context_type: 'club',
        insight_type: 'club_at_risk',
        observation: `${club.name} showing declining membership (${club.membership_count} members)`,
        suggestion: 'Consider targeted retention program and member outreach initiatives',
        severity: 'high',
        supporting_metrics: {
          membership_count: club.membership_count,
          youth_percentage: club.youth_member_percentage,
          engagement_level: club.engagement_level
        }
      });
    }
  }

  // Sponsorship -> Finance/Marketing Tasks
  static async handleSponsorshipWorkflow(deal, changeType) {
    if (deal.stage === 'contracted' && deal.deal_value > 50000) {
      // Create finance tracking task
      await this.createCrossHubTask({
        title: `High-Value Sponsor Contract: ${deal.company_name}`,
        description: `New sponsor contract worth $${deal.deal_value.toLocaleString()} requires finance setup and tracking.`,
        priority: 'high',
        assigned_to: await this.findDepartmentLead('finance'),
        department: 'finance',
        reference_entity: 'SponsorDeal',
        reference_id: deal.id,
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
      });

      // Create marketing activation task
      await this.createCrossHubTask({
        title: `Sponsor Activation Plan: ${deal.company_name}`,
        description: `Develop activation plan for new sponsor ${deal.company_name}. Contract value: $${deal.deal_value.toLocaleString()}`,
        priority: 'medium',
        assigned_to: await this.findDepartmentLead('marketing'),
        department: 'marketing',
        reference_entity: 'SponsorDeal',
        reference_id: deal.id,
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
      });
    }
  }

  // Incident -> HR/Legal/Executive
  static async handleIncidentWorkflow(incident, changeType) {
    if (incident.severity === 'level_4' || incident.category === 'safe_sport') {
      // Auto-escalate to HR and legal
      const hrLead = await this.findDepartmentLead('hr');
      const legalLead = await this.findDepartmentLead('legal');

      if (hrLead !== incident.assigned_to_id) {
        await this.createCrossHubTask({
          title: `Critical Incident Review: ${incident.title}`,
          description: `Level 4 incident requires HR review and potential policy response.`,
          priority: 'urgent',
          assigned_to: hrLead,
          department: 'hr',
          reference_entity: 'Incident',
          reference_id: incident.id,
          due_date: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
        });
      }

      if (legalLead !== incident.assigned_to_id) {
        await this.createCrossHubTask({
          title: `Legal Assessment Required: ${incident.title}`,
          description: `Critical incident may require legal review and risk assessment.`,
          priority: 'urgent',
          assigned_to: legalLead,
          department: 'governance',
          reference_entity: 'Incident',
          reference_id: incident.id,
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });
      }
    }
  }

  // Onboarding -> HR/IT Tasks
  static async handleOnboardingWorkflow(checklist, changeType) {
    const overdueTasks = checklist.tasks?.filter(task => 
      task.status !== 'completed' && 
      new Date(task.due_date) < new Date()
    ) || [];

    if (overdueTasks.length > 0) {
      await this.createCrossHubTask({
        title: `Onboarding Delays: ${checklist.user_id}`,
        description: `${overdueTasks.length} onboarding tasks are overdue. Employee experience at risk.`,
        priority: 'high',
        assigned_to: await this.findDepartmentLead('hr'),
        department: 'hr',
        reference_entity: 'OnboardingChecklist',
        reference_id: checklist.id,
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
    }
  }

  static async handleLegalWorkflow(legalCase, changeType) {
    if (legalCase.priority === 'critical') {
      await this.generateAIInsight({
        context_id: legalCase.id,
        context_type: 'legal_case',
        insight_type: 'legal_risk_assessment',
        observation: `Critical legal case requiring immediate attention: ${legalCase.case_title}`,
        suggestion: 'Consider engaging external counsel and implementing risk mitigation strategies',
        severity: 'critical'
      });
    }
  }

  static async handleEventPlanWorkflow(eventPlan, changeType) {
    const overdueTasks = eventPlan.departments?.flatMap(dept => 
      dept.tasks?.filter(task => 
        task.status !== 'completed' && new Date(task.due_date) < new Date()
      ) || []
    ) || [];

    if (overdueTasks.length > 3) {
      await this.createCrossHubTask({
        title: `Event Planning Behind Schedule: ${eventPlan.event_name}`,
        description: `${overdueTasks.length} tasks overdue for ${eventPlan.event_name}. Event success at risk.`,
        priority: 'urgent',
        assigned_to: eventPlan.created_by,
        department: 'events',
        reference_entity: 'EventPlan',
        reference_id: eventPlan.id,
        due_date: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
      });
    }
  }

  static async handleFinanceWorkflow(transaction, changeType) {
    if (transaction.amount > 10000 && transaction.approval_status === 'pending_approval') {
      await this.createCrossHubTask({
        title: `High-Value Transaction Approval: $${transaction.amount.toLocaleString()}`,
        description: `Transaction requires executive approval: ${transaction.description}`,
        priority: 'high',
        assigned_to: await this.findDepartmentLead('executive'),
        department: 'executive',
        reference_entity: 'FinancialTransaction',
        reference_id: transaction.id,
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
      });
    }
  }

  static async handleResearchWorkflow(partnership, changeType) {
    if (partnership.stage === 'published') {
      await this.generateAIInsight({
        context_id: partnership.id,
        context_type: 'research',
        insight_type: 'research_publication',
        observation: `Research partnership with ${partnership.partner_institution} has published results`,
        suggestion: 'Consider leveraging findings for strategic planning and policy development',
        severity: 'medium'
      });
    }
  }

  // Helper Methods
  static async createCrossHubTask(taskData) {
    try {
      const task = await Task.create(taskData);
      
      // Send notification to assignee
      if (taskData.assigned_to) {
        await NotificationService.create({
          user_id: taskData.assigned_to,
          title: 'New Task Assigned',
          message: `You have been assigned: ${taskData.title}`,
          notification_type: 'task_assigned',
          link_to: 'StaffHQ?tab=workspace',
          icon: 'Briefcase'
        });
      }
      
      return task;
    } catch (error) {
      console.error('Failed to create cross-hub task:', error);
      return null;
    }
  }

  static async findDepartmentLead(department) {
    // In a real app, this would query for users with specific roles
    // For now, return a mock user ID
    const departmentLeads = {
      'hr': 'hr-lead-id',
      'legal': 'legal-lead-id',
      'finance': 'finance-lead-id',
      'marketing': 'marketing-lead-id',
      'executive': 'executive-lead-id',
      'club_services': 'club-services-lead-id',
      'events': 'events-lead-id'
    };
    
    return departmentLeads[department] || 'default-admin-id';
  }

  static async generateAIInsight(insightData) {
    try {
      const insight = await AIInsight.create(insightData);
      console.log('Generated AI insight:', insight);
      return insight;
    } catch (error) {
      console.error('Failed to generate AI insight:', error);
      return null;
    }
  }
}