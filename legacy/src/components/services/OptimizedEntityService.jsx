/**
 * Optimized Entity Service - Provides granular, efficient data fetching
 */
import { interopService } from './InteroperabilityService';

export class OptimizedEntityService {
  /**
   * Get entity by ID with optional field selection
   */
  static async getById(entityName, id, fields = null) {
    const query = fields ? `?fields=${fields.join(',')}` : '';
    return await interopService.fetch('base44', `/entities/${entityName}/${id}${query}`);
  }

  /**
   * Get filtered entities with pagination and field selection
   */
  static async getFiltered(entityName, options = {}) {
    const {
      filters = {},
      sort = null,
      limit = 50,
      offset = 0,
      fields = null,
      include = null // Related entities to include
    } = options;

    const params = new URLSearchParams();
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params.append(`${key}__in`, value.join(','));
      } else if (typeof value === 'object' && value.operator) {
        params.append(`${key}__${value.operator}`, value.value);
      } else {
        params.append(key, value);
      }
    });

    // Add other options
    if (sort) params.append('sort', sort);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    if (fields) params.append('fields', fields.join(','));
    if (include) params.append('include', include.join(','));

    return await interopService.fetch('base44', `/entities/${entityName}?${params.toString()}`);
  }

  /**
   * Get aggregated data
   */
  static async getAggregated(entityName, aggregations) {
    const body = { aggregations };
    return await interopService.fetch('base44', `/entities/${entityName}/aggregate`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * Batch operations
   */
  static async batchOperation(operations) {
    return await interopService.fetch('base44', '/entities/batch', {
      method: 'POST',
      body: JSON.stringify({ operations })
    });
  }
}

/**
 * Enhanced Entity SDK - Extends existing entities with optimized methods
 */
export const EnhancedEventPlan = {
  /**
   * Get event plan by ID with all related data
   */
  async getById(id) {
    return await OptimizedEntityService.getById('EventPlan', id, [
      'id', 'event_name', 'event_date', 'venue', 'status', 
      'departments', 'completion_stats', 'key_dates'
    ]);
  },

  /**
   * Get event plans with filtering and pagination
   */
  async getFiltered(options = {}) {
    return await OptimizedEntityService.getFiltered('EventPlan', {
      ...options,
      include: ['event', 'template'] // Include related data
    });
  },

  /**
   * Get completion statistics for multiple plans
   */
  async getCompletionStats(planIds = null) {
    const filters = planIds ? { id__in: planIds } : {};
    return await OptimizedEntityService.getAggregated('EventPlan', {
      filters,
      aggregations: [
        { field: 'completion_stats.completed_tasks', operation: 'sum' },
        { field: 'completion_stats.total_tasks', operation: 'sum' },
        { field: 'status', operation: 'group_count' }
      ]
    });
  }
};

export const EnhancedVolunteer = {
  /**
   * Find volunteers with compliance status for specific event
   */
  async findWithComplianceStatus(eventId) {
    return await OptimizedEntityService.getFiltered('Volunteer', {
      filters: {
        'events.event_id': eventId
      },
      fields: [
        'id', 'full_name', 'email', 'compliance', 
        'credentials', 'last_active_date'
      ]
    });
  },

  /**
   * Get compliance analytics
   */
  async getComplianceAnalytics(region = null) {
    const filters = region ? { ma_region: region } : {};
    return await OptimizedEntityService.getAggregated('Volunteer', {
      filters,
      aggregations: [
        { field: 'compliance.respect_in_sport', operation: 'group_count' },
        { field: 'compliance.background_check', operation: 'group_count' },
        { field: 'compliance.policy_signed', operation: 'group_count' }
      ]
    });
  }
};

export const EnhancedIncident = {
  /**
   * Get incidents by category with statistics
   */
  async getStatsByCategory(timeframe = '30d') {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeframe.replace('d', '')));

    return await OptimizedEntityService.getAggregated('Incident', {
      filters: {
        created_date__gte: cutoffDate.toISOString()
      },
      aggregations: [
        { field: 'category', operation: 'group_count' },
        { field: 'status', operation: 'group_count' },
        { field: 'priority', operation: 'group_count' },
        { field: 'escalation_level', operation: 'avg' }
      ]
    });
  },

  /**
   * Get incidents assigned to user
   */
  async getAssignedToUser(userId, status = null) {
    const filters = { assigned_to_id: userId };
    if (status) filters.status = status;

    return await OptimizedEntityService.getFiltered('Incident', {
      filters,
      sort: '-created_date',
      fields: [
        'id', 'title', 'category', 'priority', 'status', 
        'created_date', 'due_date'
      ]
    });
  }
};

export const EnhancedSponsorDeal = {
  /**
   * Get pipeline analytics
   */
  async getPipelineAnalytics() {
    return await OptimizedEntityService.getAggregated('SponsorDeal', {
      aggregations: [
        { field: 'stage', operation: 'group_count' },
        { field: 'deal_value', operation: 'sum', group_by: 'stage' },
        { field: 'probability_percent', operation: 'avg', group_by: 'stage' }
      ]
    });
  },

  /**
   * Get deals by stage with details
   */
  async getDealsByStage(stage) {
    return await OptimizedEntityService.getFiltered('SponsorDeal', {
      filters: { stage },
      fields: [
        'id', 'deal_name', 'company_name', 'deal_value', 
        'probability_percent', 'expected_close_date', 'owner'
      ],
      sort: '-deal_value'
    });
  }
};