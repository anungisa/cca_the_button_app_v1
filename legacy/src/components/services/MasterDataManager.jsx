/**
 * Phase 3: Master Data Management
 * Manages data governance and establishes source of truth for key entities
 */
import { eventBus, EVENTS } from './EventBus';
import { interopService } from './InteroperabilityService';

class MasterDataManager {
  constructor() {
    this.dataMasters = new Map();
    this.dataLineage = new Map();
    this.conflictResolutionRules = new Map();
    this.dataQualityRules = new Map();
    this.setupDataMasters();
    this.setupQualityRules();
  }

  /**
   * Define which system is the master for each data type
   */
  setupDataMasters() {
    // User profile data masters
    this.dataMasters.set('user.basic_profile', {
      master: 'curlingreg',
      fields: ['full_name', 'email', 'phone', 'curling_id'],
      syncFrequency: 'daily',
      lastSync: null
    });

    this.dataMasters.set('user.club_affiliation', {
      master: 'the_button',
      fields: ['home_club_id', 'club_history'],
      syncFrequency: 'realtime',
      lastSync: null
    });

    this.dataMasters.set('user.engagement', {
      master: 'the_button',
      fields: ['loyalty_data', 'xp_points', 'badges'],
      syncFrequency: 'realtime',
      lastSync: null
    });

    // Event data masters
    this.dataMasters.set('event.basic_info', {
      master: 'curlingio',
      fields: ['name', 'start_date', 'end_date', 'venue'],
      syncFrequency: 'hourly',
      lastSync: null
    });

    this.dataMasters.set('event.operational', {
      master: 'the_button',
      fields: ['event_plans', 'volunteer_assignments', 'budget'],
      syncFrequency: 'realtime',
      lastSync: null
    });

    // Club data masters
    this.dataMasters.set('club.registration', {
      master: 'curlingreg',
      fields: ['name', 'location', 'contact_info', 'membership_count'],
      syncFrequency: 'daily',
      lastSync: null
    });

    this.dataMasters.set('club.intelligence', {
      master: 'the_button',
      fields: ['engagement_metrics', 'survey_data', 'compliance_status'],
      syncFrequency: 'realtime',
      lastSync: null
    });

    // Volunteer data masters
    this.dataMasters.set('volunteer.basic_info', {
      master: 'trustevents',
      fields: ['full_name', 'email', 'events_history'],
      syncFrequency: 'daily',
      lastSync: null
    });

    this.dataMasters.set('volunteer.compliance', {
      master: 'the_button',
      fields: ['respect_in_sport', 'background_check', 'policy_signed'],
      syncFrequency: 'realtime',
      lastSync: null
    });
  }

  /**
   * Setup data quality rules
   */
  setupQualityRules() {
    this.dataQualityRules.set('user.email', {
      required: true,
      format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      uniqueness: true
    });

    this.dataQualityRules.set('user.phone', {
      required: false,
      format: /^\+?[\d\s\-\(\)]+$/,
      normalize: this.normalizePhone
    });

    this.dataQualityRules.set('club.location', {
      required: true,
      geocode: true,
      validate: this.validateLocation
    });

    this.dataQualityRules.set('event.dates', {
      required: true,
      validate: this.validateEventDates
    });
  }

  /**
   * Get authoritative data for an entity
   */
  async getAuthoritativeData(entityType, entityId, fields = null) {
    const master = this.dataMasters.get(entityType);
    if (!master) {
      throw new Error(`No master defined for entity type: ${entityType}`);
    }

    try {
      // Check if data needs refresh
      if (this.needsSync(master)) {
        await this.syncFromMaster(entityType, master);
      }

      // Fetch from master system
      const data = await interopService.fetch(master.master, `/entities/${entityType}/${entityId}`);
      
      // Apply data quality rules
      const cleanedData = await this.applyQualityRules(entityType, data);
      
      // Track data lineage
      this.recordDataLineage(entityType, entityId, master.master, new Date());

      // Return requested fields only
      if (fields) {
        return this.filterFields(cleanedData, fields);
      }

      return cleanedData;

    } catch (error) {
      // Fallback to cached data if master is unavailable
      console.warn(`Master system ${master.master} unavailable, using cached data:`, error);
      return this.getCachedData(entityType, entityId);
    }
  }

  /**
   * Sync data from master system
   */
  async syncFromMaster(entityType, master) {
    try {
      const syncStartTime = new Date();
      
      // Fetch incremental changes if supported
      const lastSync = master.lastSync || new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to 24h ago
      const changes = await interopService.fetch(master.master, `/sync/${entityType}`, {
        params: { since: lastSync.toISOString() }
      });

      // Process changes
      let processedCount = 0;
      for (const change of changes.data || []) {
        await this.processDataChange(entityType, change);
        processedCount++;
      }

      // Update sync timestamp
      master.lastSync = syncStartTime;
      this.dataMasters.set(entityType, master);

      // Publish sync completion event
      eventBus.publish(EVENTS.DATA_SYNC_COMPLETED, {
        entityType,
        master: master.master,
        recordsProcessed: processedCount,
        syncTime: new Date() - syncStartTime
      });

    } catch (error) {
      eventBus.publish(EVENTS.INTEGRATION_ERROR, {
        operation: 'sync',
        entityType,
        master: master.master,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Resolve data conflicts between systems
   */
  async resolveConflict(entityType, entityId, conflictingData) {
    const rules = this.conflictResolutionRules.get(entityType) || this.getDefaultConflictRules();
    
    const resolved = {};
    
    for (const field in conflictingData) {
      const values = conflictingData[field];
      const rule = rules[field] || rules.default;
      
      switch (rule.strategy) {
        case 'master_wins':
          resolved[field] = values.find(v => v.source === rule.master)?.value || values[0]?.value;
          break;
          
        case 'most_recent':
          resolved[field] = values.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.value;
          break;
          
        case 'highest_quality':
          resolved[field] = this.selectHighestQuality(values, field);
          break;
          
        case 'manual_review':
          // Flag for manual review
          await this.flagForManualReview(entityType, entityId, field, values);
          resolved[field] = values[0]?.value; // Use first value temporarily
          break;
          
        default:
          resolved[field] = values[0]?.value;
      }
    }

    // Record resolution
    this.recordConflictResolution(entityType, entityId, conflictingData, resolved);
    
    return resolved;
  }

  /**
   * Apply data quality rules
   */
  async applyQualityRules(entityType, data) {
    const cleanedData = { ...data };
    
    for (const [fieldPath, rules] of this.dataQualityRules) {
      if (!fieldPath.startsWith(entityType)) continue;
      
      const field = fieldPath.split('.').pop();
      if (!(field in cleanedData)) continue;
      
      let value = cleanedData[field];
      
      // Required field check
      if (rules.required && (!value || value === '')) {
        throw new Error(`Required field missing: ${field}`);
      }
      
      // Format validation
      if (value && rules.format && !rules.format.test(value)) {
        throw new Error(`Invalid format for field: ${field}`);
      }
      
      // Normalization
      if (value && rules.normalize) {
        value = rules.normalize(value);
        cleanedData[field] = value;
      }
      
      // Custom validation
      if (value && rules.validate) {
        const isValid = await rules.validate(value, cleanedData);
        if (!isValid) {
          throw new Error(`Validation failed for field: ${field}`);
        }
      }
      
      // Geocoding
      if (value && rules.geocode) {
        try {
          const geocoded = await this.geocodeLocation(value);
          cleanedData[`${field}_coordinates`] = geocoded;
        } catch (error) {
          console.warn(`Geocoding failed for ${field}:`, error);
        }
      }
    }
    
    return cleanedData;
  }

  /**
   * Get data quality metrics
   */
  async getDataQualityMetrics(entityType = null) {
    const metrics = {
      completeness: {},
      accuracy: {},
      consistency: {},
      timeliness: {}
    };

    // Would implement actual quality calculations
    // This is a simplified example
    
    return {
      overall_score: 85,
      completeness_score: 92,
      accuracy_score: 88,
      consistency_score: 80,
      timeliness_score: 82,
      issues_flagged: 12,
      last_assessment: new Date().toISOString(),
      metrics
    };
  }

  /**
   * Get data lineage for an entity
   */
  getDataLineage(entityType, entityId) {
    const key = `${entityType}:${entityId}`;
    return this.dataLineage.get(key) || [];
  }

  // Helper methods
  needsSync(master) {
    if (!master.lastSync) return true;
    
    const syncIntervals = {
      'realtime': 0,
      'hourly': 60 * 60 * 1000,
      'daily': 24 * 60 * 60 * 1000,
      'weekly': 7 * 24 * 60 * 60 * 1000
    };
    
    const interval = syncIntervals[master.syncFrequency] || syncIntervals.daily;
    return Date.now() - new Date(master.lastSync).getTime() > interval;
  }

  async processDataChange(entityType, change) {
    // Process individual data change
    // Would implement actual change processing logic
    console.log(`Processing change for ${entityType}:`, change);
  }

  filterFields(data, fields) {
    const filtered = {};
    fields.forEach(field => {
      if (field in data) {
        filtered[field] = data[field];
      }
    });
    return filtered;
  }

  getCachedData(entityType, entityId) {
    // Would implement actual cache lookup
    return null;
  }

  getDefaultConflictRules() {
    return {
      default: { strategy: 'most_recent' },
      email: { strategy: 'master_wins', master: 'curlingreg' },
      name: { strategy: 'highest_quality' },
      location: { strategy: 'master_wins', master: 'curlingreg' }
    };
  }

  selectHighestQuality(values, field) {
    // Implement quality scoring logic
    return values.sort((a, b) => (b.quality_score || 0) - (a.quality_score || 0))[0]?.value;
  }

  async flagForManualReview(entityType, entityId, field, values) {
    // Create a review task
    eventBus.publish('data.conflict.manual_review_required', {
      entityType,
      entityId,
      field,
      conflictingValues: values,
      flaggedAt: new Date().toISOString()
    });
  }

  recordDataLineage(entityType, entityId, source, timestamp) {
    const key = `${entityType}:${entityId}`;
    const lineage = this.dataLineage.get(key) || [];
    
    lineage.unshift({
      source,
      timestamp,
      operation: 'read'
    });
    
    // Keep only last 100 entries
    if (lineage.length > 100) {
      lineage.splice(100);
    }
    
    this.dataLineage.set(key, lineage);
  }

  recordConflictResolution(entityType, entityId, conflicts, resolution) {
    eventBus.publish('data.conflict.resolved', {
      entityType,
      entityId,
      conflicts,
      resolution,
      resolvedAt: new Date().toISOString()
    });
  }

  // Validation functions
  normalizePhone(phone) {
    return phone.replace(/[^\d+]/g, '');
  }

  async validateLocation(location) {
    return location && location.trim().length > 0;
  }

  async validateEventDates(dates, data) {
    if (!data.start_date || !data.end_date) return false;
    return new Date(data.start_date) <= new Date(data.end_date);
  }

  async geocodeLocation(address) {
    // Would integrate with actual geocoding service
    return {
      latitude: 45.0,
      longitude: -75.0,
      formatted_address: address
    };
  }
}

export const masterDataManager = new MasterDataManager();
export default masterDataManager;