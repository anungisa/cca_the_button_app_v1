import { eventBus, EVENTS } from './EventBus';
import { InvokeLLM } from '@/api/integrations';
import { User } from '@/api/entities';

/**
 * Predictive Interoperability Service
 * Uses AI to anticipate user needs and pre-load relevant data
 */
export class PredictiveInteroperabilityService {
  constructor() {
    this.userBehaviorCache = new Map();
    this.predictionCache = new Map();
    this.isLearning = true;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Track user navigation patterns
    eventBus.subscribe('navigation.page_view', (data) => {
      this.recordUserBehavior(data);
    });

    // Track user interactions
    eventBus.subscribe('user.interaction', (data) => {
      this.recordInteraction(data);
    });

    // Preload data based on predictions
    eventBus.subscribe('prediction.data_needed', async (data) => {
      await this.preloadPredictedData(data);
    });
  }

  /**
   * Record user behavior for ML training
   */
  recordUserBehavior(behaviorData) {
    const userId = behaviorData.userId;
    if (!this.userBehaviorCache.has(userId)) {
      this.userBehaviorCache.set(userId, []);
    }

    const behaviors = this.userBehaviorCache.get(userId);
    behaviors.push({
      ...behaviorData,
      timestamp: Date.now()
    });

    // Keep only last 100 behaviors per user
    if (behaviors.length > 100) {
      behaviors.shift();
    }

    // Trigger prediction update
    this.updatePredictions(userId);
  }

  /**
   * Generate predictions for next user actions
   */
  async updatePredictions(userId) {
    try {
      const behaviors = this.userBehaviorCache.get(userId) || [];
      if (behaviors.length < 5) return; // Need minimum data

      const user = await User.me();
      const recentBehaviors = behaviors.slice(-20);

      const predictionPrompt = `
        Analyze this user's behavior pattern and predict their next likely actions:
        
        User Role: ${user.user_type}
        Recent Actions: ${JSON.stringify(recentBehaviors.map(b => ({
          page: b.page,
          action: b.action,
          timeSpent: b.timeSpent,
          context: b.context
        })))}
        
        Current Time: ${new Date().toISOString()}
        Day of Week: ${new Date().toLocaleDateString('en', { weekday: 'long' })}
        
        Predict the top 3 most likely next actions with confidence scores.
        Consider:
        - Time patterns (morning vs afternoon behavior)
        - Day of week patterns  
        - Role-based workflows
        - Sequential task dependencies
        
        Return predictions in this format:
        {
          "predictions": [
            {
              "action": "view_incident_list",
              "confidence": 0.85,
              "reasoning": "User typically checks incidents after viewing dashboard",
              "preload_data": ["incidents", "assignments"],
              "estimated_time": "2024-12-15T14:30:00Z"
            }
          ]
        }
      `;

      const response = await InvokeLLM({
        prompt: predictionPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            predictions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  confidence: { type: "number" },
                  reasoning: { type: "string" },
                  preload_data: { type: "array", items: { type: "string" } },
                  estimated_time: { type: "string" }
                }
              }
            }
          }
        }
      });

      this.predictionCache.set(userId, {
        predictions: response.predictions,
        generated_at: Date.now(),
        expires_at: Date.now() + (30 * 60 * 1000) // 30 minutes
      });

      // Trigger preloading for high-confidence predictions
      response.predictions
        .filter(p => p.confidence > 0.7)
        .forEach(prediction => {
          eventBus.publish('prediction.data_needed', {
            userId,
            prediction,
            priority: prediction.confidence
          });
        });

    } catch (error) {
      console.error('Prediction generation failed:', error);
    }
  }

  /**
   * Preload data based on predictions
   */
  async preloadPredictedData(data) {
    const { prediction, userId } = data;
    
    try {
      // Route to appropriate preloader based on prediction
      switch (prediction.action) {
        case 'view_incident_list':
          await this.preloadIncidents(userId);
          break;
        case 'view_event_plans':
          await this.preloadEventPlans(userId);
          break;
        case 'check_compliance':
          await this.preloadComplianceData(userId);
          break;
        case 'review_sponsorship':
          await this.preloadSponsorshipData(userId);
          break;
      }
    } catch (error) {
      console.error('Preloading failed:', error);
    }
  }

  async preloadIncidents(userId) {
    // Import dynamically to avoid circular dependencies
    const { Incident } = await import('@/api/entities');
    const incidents = await Incident.filter({ 
      assigned_to_id: userId,
      status: ['new', 'open', 'in_progress']
    }, '-created_date', 10);
    
    // Store in browser cache for instant access
    sessionStorage.setItem('preloaded_incidents', JSON.stringify(incidents));
  }

  async preloadEventPlans(userId) {
    const { EventPlan } = await import('@/api/entities');
    const plans = await EventPlan.filter({
      created_by: userId,
      status: ['planning', 'in_progress']
    }, '-event_date', 10);
    
    sessionStorage.setItem('preloaded_event_plans', JSON.stringify(plans));
  }

  async preloadComplianceData(userId) {
    const { Volunteer } = await import('@/api/entities');
    const volunteers = await Volunteer.filter({}, '-last_active_date', 20);
    
    sessionStorage.setItem('preloaded_volunteers', JSON.stringify(volunteers));
  }

  async preloadSponsorshipData(userId) {
    const { SponsorDeal } = await import('@/api/entities');
    const deals = await SponsorDeal.filter({
      owner: userId,
      stage: ['prospect', 'proposal_sent', 'negotiation']
    }, '-updated_date', 15);
    
    sessionStorage.setItem('preloaded_sponsor_deals', JSON.stringify(deals));
  }

  /**
   * Get predictions for a user
   */
  getPredictions(userId) {
    const cached = this.predictionCache.get(userId);
    if (!cached || Date.now() > cached.expires_at) {
      return [];
    }
    return cached.predictions;
  }

  /**
   * Check if data is preloaded
   */
  getPreloadedData(key) {
    try {
      const data = sessionStorage.getItem(`preloaded_${key}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

export const predictiveService = new PredictiveInteroperabilityService();