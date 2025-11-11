/**
 * Event subscriptions for cross-functional workflows
 * This file sets up the event-driven architecture between hubs
 */
import { eventBus, EVENTS } from './EventBus';
import { Notification, EventPlan, MarketingCampaign, Incident } from '@/api/entities';
import { WorkflowEngine } from '../utils/WorkflowEngine';
import { NotificationService } from '../utils/NotificationService';

class EventSubscriptionManager {
  constructor() {
    this.subscriptions = [];
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    // Sponsorship -> Finance Integration
    this.subscribe(EVENTS.DEAL_WON, async (dealData) => {
      // Create budget forecast entry
      await eventBus.publish('finance.forecast.create', {
        source_type: 'sponsorship',
        source_id: dealData.deal_id,
        amount: dealData.deal_value,
        expected_date: dealData.expected_close_date,
        probability: 95
      });

      // Notify finance team
      await NotificationService.create({
        title: 'New Sponsorship Deal Won',
        message: `${dealData.sponsor_name} deal worth $${dealData.deal_value} needs budget integration`,
        link_to: `SponsorshipHQ?deal=${dealData.deal_id}`,
        notification_type: 'approval_request',
        target_roles: ['finance', 'executive']
      });
    });

    this.subscribe(EVENTS.CONTRACT_SIGNED, async (contractData) => {
      // Create deliverables in event plans
      if (contractData.associated_events?.length > 0) {
        for (const eventId of contractData.associated_events) {
          await this.createSponsorshipDeliverables(eventId, contractData);
        }
      }

      // Trigger marketing campaign creation
      await eventBus.publish(EVENTS.CAMPAIGN_LAUNCHED, {
        type: 'sponsor_activation',
        sponsor_id: contractData.sponsor_id,
        sponsor_name: contractData.sponsor_name,
        contract_value: contractData.contract_value
      });
    });

    // Event Planning -> Multiple Systems Integration
    this.subscribe(EVENTS.EVENT_PLAN_CREATED, async (planData) => {
      // Create volunteer recruitment campaign
      await eventBus.publish('volunteer.campaign.create', {
        event_id: planData.event_id,
        event_name: planData.event_name,
        roles_needed: this.extractVolunteerRoles(planData),
        start_date: planData.event_date
      });

      // Create marketing campaign template
      await MarketingCampaign.create({
        campaign_name: `${planData.event_name} - Marketing Campaign`,
        campaign_type: 'event_promotion',
        status: 'planning',
        target_date: new Date(new Date(planData.event_date).getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days before
        event_id: planData.event_id,
        description: `Auto-generated marketing campaign for ${planData.event_name}`
      });
    });

    this.subscribe(EVENTS.EVENT_TASK_COMPLETED, async (taskData) => {
      // Check if this completes a milestone
      if (taskData.is_milestone) {
        await eventBus.publish(EVENTS.EVENT_MILESTONE_REACHED, {
          event_id: taskData.event_id,
          milestone: taskData.task_name,
          completion_date: new Date().toISOString()
        });
      }

      // Update overall event health score
      await this.updateEventHealthScore(taskData.event_id);
    });

    // Volunteer -> Compliance Integration
    this.subscribe(EVENTS.VOLUNTEER_REGISTERED, async (volunteerData) => {
      // Trigger compliance check workflow
      await WorkflowEngine.trigger('volunteer_compliance_check', {
        volunteer_id: volunteerData.volunteer_id,
        email: volunteerData.email,
        required_certifications: ['respect_in_sport', 'background_check']
      });
    });

    this.subscribe(EVENTS.COMPLIANCE_EXPIRED, async (complianceData) => {
      // Create follow-up incident
      await Incident.create({
        title: `Compliance Expired - ${complianceData.volunteer_name}`,
        description: `${complianceData.certification_type} has expired for volunteer ${complianceData.volunteer_name}`,
        category: 'compliance',
        priority: 'medium',
        assigned_department: 'club_services',
        related_user_id: complianceData.volunteer_id,
        status: 'new'
      });

      // Remove from active volunteer assignments
      await eventBus.publish('volunteer.deactivate', {
        volunteer_id: complianceData.volunteer_id,
        reason: 'compliance_expired',
        certification: complianceData.certification_type
      });
    });

    // Finance -> Multiple Systems Integration
    this.subscribe(EVENTS.BUDGET_APPROVED, async (budgetData) => {
      // Notify relevant departments
      await NotificationService.broadcast({
        title: 'Budget Approved',
        message: `Budget of $${budgetData.amount} approved for ${budgetData.category}`,
        target_departments: budgetData.affected_departments || ['events', 'marketing']
      });

      // Trigger procurement workflows if needed
      if (budgetData.requires_procurement) {
        await eventBus.publish('procurement.workflow.start', budgetData);
      }
    });

    // Incident -> Multiple Systems Integration
    this.subscribe(EVENTS.INCIDENT_CREATED, async (incidentData) => {
      // Auto-assign based on category
      const assignment = this.getAutoAssignment(incidentData.category);
      if (assignment) {
        await eventBus.publish('incident.auto_assigned', {
          incident_id: incidentData.incident_id,
          assigned_to: assignment.user_id,
          department: assignment.department
        });
      }

      // Create immediate notification for critical incidents
      if (incidentData.priority === 'critical') {
        await NotificationService.createUrgent({
          title: 'Critical Incident Created',
          message: incidentData.title,
          incident_id: incidentData.incident_id,
          target_roles: ['executive', 'management']
        });
      }
    });

    this.subscribe(EVENTS.INCIDENT_ESCALATED, async (incidentData) => {
      // Notify higher management
      await NotificationService.escalate({
        incident_id: incidentData.incident_id,
        escalation_level: incidentData.escalation_level,
        reason: incidentData.escalation_reason
      });

      // Create calendar entry for urgent review
      if (incidentData.escalation_level >= 2) {
        await eventBus.publish('calendar.urgent_meeting.create', {
          title: `Incident Review - ${incidentData.title}`,
          incident_id: incidentData.incident_id,
          attendees: this.getEscalationAttendees(incidentData.escalation_level)
        });
      }
    });

    // Marketing -> Analytics Integration
    this.subscribe(EVENTS.CAMPAIGN_LAUNCHED, async (campaignData) => {
      // Set up tracking
      await eventBus.publish('analytics.campaign.track', {
        campaign_id: campaignData.campaign_id,
        campaign_type: campaignData.campaign_type,
        metrics_to_track: ['impressions', 'engagement', 'conversions']
      });
    });

    // System Health Monitoring
    this.subscribe(EVENTS.INTEGRATION_ERROR, async (errorData) => {
      // Create system incident for repeated failures
      if (this.getErrorCount(errorData.api) > 5) {
        await Incident.create({
          title: `Integration Failure - ${errorData.api}`,
          description: `Multiple failures detected for ${errorData.api} integration`,
          category: 'technical_issue',
          priority: 'high',
          assigned_department: 'tech',
          status: 'new'
        });
      }
    });
  }

  subscribe(eventName, handler) {
    const unsubscribe = eventBus.subscribe(eventName, handler, {
      context: 'EventSubscriptionManager'
    });
    this.subscriptions.push({ eventName, handler, unsubscribe });
    return unsubscribe;
  }

  // Helper methods
  async createSponsorshipDeliverables(eventId, contractData) {
    const eventPlans = await EventPlan.filter({ event_id: eventId });
    
    for (const plan of eventPlans) {
      // Find marketing department or create it
      let marketingDept = plan.departments?.find(d => d.name === 'Marketing');
      
      if (!marketingDept) {
        marketingDept = { name: 'Marketing', tasks: [] };
        plan.departments = plan.departments || [];
        plan.departments.push(marketingDept);
      }

      // Add sponsorship deliverable tasks
      contractData.deliverables?.forEach((deliverable, index) => {
        marketingDept.tasks.push({
          task_id: `sponsor_${contractData.sponsor_id}_${index}`,
          task_name: `${deliverable.name} - ${contractData.sponsor_name}`,
          description: deliverable.description || '',
          status: 'not_started',
          priority: 'medium',
          due_date: deliverable.due_date,
          assigned_to: '',
          notes: `Auto-generated from contract ${contractData.contract_id}`
        });
      });

      // Update the event plan
      await EventPlan.update(plan.id, { departments: plan.departments });
    }
  }

  extractVolunteerRoles(planData) {
    const roles = [];
    planData.departments?.forEach(dept => {
      dept.tasks?.forEach(task => {
        if (task.task_name.toLowerCase().includes('volunteer')) {
          roles.push(task.task_name);
        }
      });
    });
    return roles.length > 0 ? roles : ['General Volunteer'];
  }

  async updateEventHealthScore(eventId) {
    // Calculate and update event health metrics
    const eventPlans = await EventPlan.filter({ event_id: eventId });
    let totalTasks = 0;
    let completedTasks = 0;

    eventPlans.forEach(plan => {
      plan.departments?.forEach(dept => {
        dept.tasks?.forEach(task => {
          totalTasks++;
          if (task.status === 'completed') completedTasks++;
        });
      });
    });

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    await eventBus.publish('event.health.updated', {
      event_id: eventId,
      completion_rate: completionRate,
      total_tasks: totalTasks,
      completed_tasks: completedTasks
    });
  }

  getAutoAssignment(category) {
    const assignments = {
      'safe_sport': { department: 'safe_sport', user_id: 'safesport_lead' },
      'club_support': { department: 'club_services', user_id: 'club_services_lead' },
      'sponsor_outreach': { department: 'sponsorship', user_id: 'sponsorship_lead' },
      'technical_issue': { department: 'tech', user_id: 'tech_lead' },
      'volunteer_issue': { department: 'events', user_id: 'volunteer_coordinator' }
    };
    
    return assignments[category] || null;
  }

  getEscalationAttendees(level) {
    const attendees = {
      1: ['manager'],
      2: ['director', 'manager'],
      3: ['executive_director', 'director', 'manager']
    };
    
    return attendees[level] || ['manager'];
  }

  getErrorCount(api) {
    // In real implementation, would check error log
    return Math.floor(Math.random() * 10); // Placeholder
  }

  cleanup() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}

// Create singleton and initialize
export const eventSubscriptionManager = new EventSubscriptionManager();
export default eventSubscriptionManager;