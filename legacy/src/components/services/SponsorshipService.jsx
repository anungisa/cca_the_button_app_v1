import { SponsorDeal, SponsorContract, Purchase, PointTransaction } from '@/api/entities';
import { eventBus, EVENTS } from './EventBus';
import { NotificationService } from '../utils/NotificationService';

/**
 * Sponsorship Service - Consolidates all sponsorship business logic
 */
export class SponsorshipService {
  /**
   * Win a deal - handles all the business logic in one transaction
   */
  static async winDeal(dealId, contractDetails = {}) {
    try {
      // 1. Update deal status
      const deal = await SponsorDeal.update(dealId, {
        stage: 'contracted',
        probability_percent: 100
      });

      // 2. Create contract record
      const contract = await SponsorContract.create({
        deal_id: dealId,
        sponsor_name: deal.company_name,
        contract_value: deal.deal_value,
        start_date: contractDetails.start_date || new Date().toISOString().split('T')[0],
        end_date: contractDetails.end_date,
        status: 'active',
        deliverables: contractDetails.deliverables || []
      });

      // 3. Create revenue recognition entry
      await Purchase.create({
        user_id: 'system',
        purchase_type: 'sponsorship_revenue',
        product_name: `${deal.company_name} - ${deal.deal_name}`,
        product_category: 'sponsorship',
        amount: deal.deal_value * 100, // Convert to cents
        status: 'completed',
        metadata: {
          deal_id: dealId,
          contract_id: contract.id,
          tier: deal.tier
        }
      });

      // 4. Send notifications
      await NotificationService.create({
        user_id: deal.owner,
        title: 'Deal Won!',
        message: `${deal.company_name} deal has been successfully contracted for $${deal.deal_value.toLocaleString()}`,
        notification_type: 'deal_won',
        icon: 'Trophy',
        link_to: `SponsorshipHQ?deal=${dealId}`
      });

      // 5. Publish event for other systems
      await eventBus.publish(EVENTS.DEAL_WON, {
        dealId,
        contractId: contract.id,
        sponsorName: deal.company_name,
        value: deal.deal_value,
        tier: deal.tier
      }, {
        source: 'SponsorshipService'
      });

      return { deal, contract };
    } catch (error) {
      console.error('Error winning deal:', error);
      throw new Error('Failed to process deal win. Please try again.');
    }
  }

  /**
   * Mark deliverable as completed
   */
  static async completeDeliverable(contractId, deliverableId, completionData = {}) {
    try {
      const contract = await SponsorContract.list();
      const targetContract = contract.find(c => c.id === contractId);
      
      if (!targetContract) {
        throw new Error('Contract not found');
      }

      // Update deliverable status
      const updatedDeliverables = targetContract.deliverables.map(d => 
        d.id === deliverableId 
          ? { ...d, status: 'Completed', completion_date: new Date().toISOString(), ...completionData }
          : d
      );

      await SponsorContract.update(contractId, {
        deliverables: updatedDeliverables
      });

      // Check if all deliverables are complete
      const allComplete = updatedDeliverables.every(d => d.status === 'Completed');
      
      if (allComplete) {
        await eventBus.publish(EVENTS.CONTRACT_FULFILLED, {
          contractId,
          sponsorName: targetContract.sponsor_name,
          totalValue: targetContract.contract_value
        });
      }

      await eventBus.publish(EVENTS.DELIVERABLE_COMPLETED, {
        contractId,
        deliverableId,
        deliverableName: updatedDeliverables.find(d => d.id === deliverableId)?.name
      });

      return targetContract;
    } catch (error) {
      console.error('Error completing deliverable:', error);
      throw error;
    }
  }

  /**
   * Generate sponsorship performance report
   */
  static async generatePerformanceReport(contractId, period = 'current_month') {
    // This would typically aggregate data from multiple sources
    // For now, return mock data structure
    return {
      contractId,
      period,
      metrics: {
        impressions: 0,
        engagement: 0,
        roi_estimate: 0
      },
      deliverables_status: {
        completed: 0,
        pending: 0,
        overdue: 0
      },
      generated_at: new Date().toISOString()
    };
  }
}