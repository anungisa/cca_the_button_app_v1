import { Incident, Notification } from '@/api/entities';
import { eventBus, EVENTS } from './EventBus';
import { NotificationService } from '../utils/NotificationService';
import { WorkflowEngine } from '../utils/WorkflowEngine';

/**
 * Incident Service - Consolidates all incident management business logic
 */
export class IncidentService {
  /**
   * Create a new incident with automatic routing and notifications
   */
  static async createIncident(incidentData, createdBy) {
    try {
      // 1. Create the incident
      const incident = await Incident.create({
        ...incidentData,
        created_by: createdBy,
        status: 'new'
      });

      // 2. Auto-assign based on category
      const assignment = await this.autoAssignIncident(incident);
      if (assignment.assigned_to_id) {
        await Incident.update(incident.id, {
          assigned_to_id: assignment.assigned_to_id,
          assigned_to_name: assignment.assigned_to_name,
          assigned_department: assignment.department,
          status: 'open'
        });
      }

      // 3. Create notifications
      if (assignment.assigned_to_id) {
        await NotificationService.create({
          user_id: assignment.assigned_to_id,
          title: 'New Incident Assigned',
          message: `${incident.category}: ${incident.title}`,
          notification_type: 'case_assigned',
          icon: 'AlertCircle',
          link_to: `IncidentManagementHub?incident=${incident.id}`
        });
      }

      // 4. Trigger workflows
      await WorkflowEngine.trigger('incident_created', incident);

      // 5. Publish event
      await eventBus.publish(EVENTS.INCIDENT_CREATED, {
        incidentId: incident.id,
        category: incident.category,
        priority: incident.priority,
        assignedTo: assignment.assigned_to_id
      });

      return incident;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw new Error('Failed to create incident. Please try again.');
    }
  }

  /**
   * Escalate an incident
   */
  static async escalateIncident(incidentId, escalationReason, escalatedBy) {
    try {
      const incidents = await Incident.list();
      const incident = incidents.find(i => i.id === incidentId);
      
      if (!incident) {
        throw new Error('Incident not found');
      }

      const newEscalationLevel = (incident.escalation_level || 0) + 1;
      const newAssignment = await this.getEscalationAssignment(incident, newEscalationLevel);

      // Update incident
      await Incident.update(incidentId, {
        status: 'escalated',
        escalation_level: newEscalationLevel,
        assigned_to_id: newAssignment.assigned_to_id,
        assigned_to_name: newAssignment.assigned_to_name,
        communications_log: [
          ...(incident.communications_log || []),
          {
            date: new Date().toISOString(),
            author_name: escalatedBy,
            note: `Escalated to Level ${newEscalationLevel}: ${escalationReason}`,
            channel: 'system_note'
          }
        ]
      });

      // Notify new assignee
      await NotificationService.create({
        user_id: newAssignment.assigned_to_id,
        title: 'Escalated Incident Assigned',
        message: `Level ${newEscalationLevel} escalation: ${incident.title}`,
        notification_type: 'case_assigned',
        icon: 'AlertTriangle',
        link_to: `IncidentManagementHub?incident=${incidentId}`
      });

      // Publish event
      await eventBus.publish(EVENTS.INCIDENT_ESCALATED, {
        incidentId,
        escalationLevel: newEscalationLevel,
        reason: escalationReason,
        newAssignee: newAssignment.assigned_to_id
      });

      return incident;
    } catch (error) {
      console.error('Error escalating incident:', error);
      throw error;
    }
  }

  /**
   * Auto-assign incident based on category
   */
  static async autoAssignIncident(incident) {
    const assignmentRules = {
      'safe_sport': { department: 'safe_sport', role: 'safe_sport_officer' },
      'club_support': { department: 'club_services', role: 'club_services_manager' },
      'sponsor_outreach': { department: 'sponsorship', role: 'sponsorship_manager' },
      'technical_issue': { department: 'tech', role: 'technical_support' },
      'compliance': { department: 'governance', role: 'compliance_officer' }
    };

    const rule = assignmentRules[incident.category];
    if (!rule) {
      return { assigned_to_id: null, assigned_to_name: null, department: 'none' };
    }

    // In a real system, this would query user database for available staff
    // For now, return mock assignment
    return {
      assigned_to_id: `${rule.role}_user_id`,
      assigned_to_name: `${rule.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      department: rule.department
    };
  }

  /**
   * Get escalation assignment
   */
  static async getEscalationAssignment(incident, escalationLevel) {
    const escalationMatrix = {
      1: { role: 'manager', suffix: '_manager' },
      2: { role: 'director', suffix: '_director' },
      3: { role: 'executive', suffix: '_executive' }
    };

    const escalation = escalationMatrix[escalationLevel] || escalationMatrix[3];
    
    return {
      assigned_to_id: `${incident.assigned_department}${escalation.suffix}`,
      assigned_to_name: `${incident.assigned_department} ${escalation.role}`.replace(/_/g, ' ')
    };
  }

  /**
   * Get incident analytics
   */
  static async getAnalytics(timeframe = '30d') {
    const incidents = await Incident.list();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeframe.replace('d', '')));

    const recentIncidents = incidents.filter(i => 
      new Date(i.created_date) >= cutoffDate
    );

    return {
      total_incidents: recentIncidents.length,
      by_category: recentIncidents.reduce((acc, inc) => {
        acc[inc.category] = (acc[inc.category] || 0) + 1;
        return acc;
      }, {}),
      by_status: recentIncidents.reduce((acc, inc) => {
        acc[inc.status] = (acc[inc.status] || 0) + 1;
        return acc;
      }, {}),
      avg_resolution_time: 0, // Would calculate from resolution timestamps
      escalation_rate: recentIncidents.filter(i => i.escalation_level > 0).length / recentIncidents.length * 100
    };
  }
}