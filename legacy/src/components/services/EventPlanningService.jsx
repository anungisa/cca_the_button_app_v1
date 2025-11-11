import { EventPlan, EventPlanActivity, Notification } from '@/api/entities';
import { eventBus, EVENTS } from './EventBus';
import { NotificationService } from '../utils/NotificationService';

/**
 * Event Planning Service - Consolidates event planning business logic
 */
export class EventPlanningService {
  /**
   * Complete a task and handle all side effects
   */
  static async completeTask(planId, taskId, completedBy, notes = '') {
    try {
      const plans = await EventPlan.list();
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error('Event plan not found');
      }

      // Find and update the task
      let taskFound = false;
      const updatedDepartments = plan.departments.map(dept => ({
        ...dept,
        tasks: dept.tasks.map(task => {
          if (task.task_id === taskId) {
            taskFound = true;
            return {
              ...task,
              status: 'completed',
              completed_date: new Date().toISOString(),
              completed_by: completedBy,
              notes: notes || task.notes
            };
          }
          return task;
        })
      }));

      if (!taskFound) {
        throw new Error('Task not found');
      }

      // Calculate new completion stats
      const totalTasks = updatedDepartments.reduce((acc, dept) => acc + dept.tasks.length, 0);
      const completedTasks = updatedDepartments.reduce((acc, dept) => 
        acc + dept.tasks.filter(t => t.status === 'completed').length, 0);
      const inProgressTasks = updatedDepartments.reduce((acc, dept) => 
        acc + dept.tasks.filter(t => t.status === 'in_progress').length, 0);

      const newStats = {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        in_progress_tasks: inProgressTasks,
        overdue_tasks: 0 // Would calculate based on due dates
      };

      // Update plan
      await EventPlan.update(planId, {
        departments: updatedDepartments,
        completion_stats: newStats
      });

      // Log activity
      await EventPlanActivity.create({
        event_plan_id: planId,
        task_id: taskId,
        activity_type: 'task_completed',
        user_id: completedBy,
        user_name: completedBy, // In real system, would get actual name
        details: { note: notes },
        timestamp: new Date().toISOString()
      });

      // Check for milestones
      const completionPercentage = (completedTasks / totalTasks) * 100;
      if (completionPercentage >= 50 && completionPercentage < 55) {
        await this.triggerMilestone(planId, 'halfway_complete', completedBy);
      } else if (completionPercentage >= 100) {
        await this.triggerMilestone(planId, 'fully_complete', completedBy);
      }

      // Publish event
      await eventBus.publish(EVENTS.EVENT_TASK_COMPLETED, {
        planId,
        taskId,
        completedBy,
        completionPercentage: Math.round(completionPercentage)
      });

      return { plan, newStats };
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  /**
   * Create a new event plan from template
   */
  static async createPlanFromTemplate(templateId, eventData, createdBy) {
    try {
      // In a real system, would fetch template and populate with event data
      const plan = await EventPlan.create({
        event_id: eventData.event_id,
        event_name: eventData.event_name,
        event_date: eventData.event_date,
        venue: eventData.venue,
        event_type: eventData.event_type || 'tournament',
        status: 'planning',
        template_id: templateId,
        created_by: createdBy,
        departments: [], // Would populate from template
        completion_stats: {
          total_tasks: 0,
          completed_tasks: 0,
          in_progress_tasks: 0,
          overdue_tasks: 0
        },
        key_dates: {
          planning_start: new Date().toISOString().split('T')[0],
          final_review: eventData.final_review_date,
          load_in: eventData.load_in_date,
          load_out: eventData.load_out_date
        }
      });

      // Create initial activity log
      await EventPlanActivity.create({
        event_plan_id: plan.id,
        activity_type: 'plan_created',
        user_id: createdBy,
        user_name: createdBy,
        details: { template_id: templateId },
        timestamp: new Date().toISOString()
      });

      // Publish event
      await eventBus.publish(EVENTS.EVENT_PLAN_CREATED, {
        planId: plan.id,
        eventName: eventData.event_name,
        createdBy,
        templateId
      });

      return plan;
    } catch (error) {
      console.error('Error creating event plan:', error);
      throw error;
    }
  }

  /**
   * Trigger milestone achievement
   */
  static async triggerMilestone(planId, milestoneType, userId) {
    const milestoneMessages = {
      'halfway_complete': 'Event planning is 50% complete!',
      'fully_complete': 'All event planning tasks completed!',
      'final_review': 'Event plan ready for final review',
      'event_go_live': 'Event is now live!'
    };

    // Create notification
    await NotificationService.create({
      user_id: userId,
      title: 'Milestone Reached',
      message: milestoneMessages[milestoneType] || 'Event milestone achieved',
      notification_type: 'milestone_reached',
      icon: 'Target',
      link_to: `EventPlanDetail?id=${planId}`
    });

    // Publish event
    await eventBus.publish(EVENTS.EVENT_MILESTONE_REACHED, {
      planId,
      milestoneType,
      userId
    });
  }

  /**
   * Get planning analytics
   */
  static async getPlanningAnalytics(timeframe = '30d') {
    const plans = await EventPlan.list();
    
    return {
      total_plans: plans.length,
      active_plans: plans.filter(p => p.status === 'planning' || p.status === 'in_progress').length,
      completed_plans: plans.filter(p => p.status === 'completed').length,
      avg_completion_rate: plans.reduce((acc, plan) => {
        const stats = plan.completion_stats || {};
        const rate = stats.total_tasks > 0 ? (stats.completed_tasks / stats.total_tasks) * 100 : 0;
        return acc + rate;
      }, 0) / plans.length
    };
  }
}