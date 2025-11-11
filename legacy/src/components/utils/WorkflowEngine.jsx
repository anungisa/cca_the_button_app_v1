
import React from 'react';
import { Task } from '@/api/entities';
import { FinancialTransaction } from '@/api/entities';
import { NotificationService } from './NotificationService';
import { User } from '@/api/entities';

const workflowRegistry = {
  'SponsorDeal:update': async (deal) => {
    // When a deal is won, create tasks for Finance and Marketing
    if (deal.stage === 'contracted') {
      console.log(`Workflow triggered: SponsorDeal ${deal.id} contracted.`);
      
      const financeTeam = await User.filter({ department: 'finance' });
      const marketingTeam = await User.filter({ department: 'marketing' });

      // 1. Create a task for the finance department to send an invoice
      if (financeTeam.length > 0) {
        await Task.create({
          title: `Send Invoice for ${deal.company_name}`,
          description: `Deal #${deal.id} for $${deal.deal_value.toLocaleString()} has been contracted. Please generate and send the initial invoice.`,
          assigned_to: financeTeam[0].id, // Assign to first person in finance for now
          department: 'finance',
          priority: 'high',
          due_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          project_id: `sponsor-${deal.id}`
        });
        await NotificationService.create(
          financeTeam[0].id,
          'New High-Priority Task',
          `Invoice required for new sponsor: ${deal.company_name}`,
          '/pages/MyWorkspace', // Link to their task list
          'task_assigned'
        );
      }

      // 2. Create a task for marketing to prepare activation
      if (marketingTeam.length > 0) {
        await Task.create({
          title: `Prepare Activation for ${deal.company_name}`,
          description: `New sponsor ${deal.company_name} is now contracted. Begin preparations for sponsor activation.`,
          assigned_to: marketingTeam[0].id,
          department: 'marketing',
          priority: 'medium',
          due_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
          project_id: `sponsor-${deal.id}`
        });
      }
    }
  },
  'HRPolicy:update': async (policy) => {
    // Placeholder for when an HR policy requires re-acknowledgment
  }
};

export const WorkflowEngine = {
  async trigger(eventName, data) {
    if (workflowRegistry[eventName]) {
      try {
        await workflowRegistry[eventName](data);
      } catch (error) {
        console.error(`Workflow for ${eventName} failed:`, error);
      }
    }
  }
};
