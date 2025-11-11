/**
 * Graceful Degradation Service
 * Manages feature toggling based on system health
 */

import { healthCheckService } from './HealthCheckService';

class GracefulDegradationService {
  constructor() {
    this.degradedFeatures = new Set();
    this.featurePriority = this.defineFeaturePriority();
  }

  defineFeaturePriority() {
    return {
      // P0 - Core features (always available)
      core: [
        'home',
        'events',
        'clubs',
        'profile',
        'logout'
      ],
      
      // P1 - High priority (degrade last)
      high: [
        'live_scoring',
        'streaming',
        'community_hub',
        'loyalty_program'
      ],
      
      // P2 - Medium priority
      medium: [
        'social_hub',
        'trivia',
        'rewards',
        'leaderboards'
      ],
      
      // P3 - Low priority (degrade first)
      low: [
        'mystery_box',
        'geo_challenges',
        'patch_scanner',
        'analytics_dashboards'
      ]
    };
  }

  async evaluateAndDegrade() {
    const health = await healthCheckService.checkHealth(true);
    
    if (health.overall === 'healthy') {
      this.restoreAllFeatures();
      return { degraded: [], available: this.getAllFeatures() };
    }

    if (health.overall === 'degraded') {
      // Degrade low priority features
      this.degradeFeatures(this.featurePriority.low);
      return { 
        degraded: this.featurePriority.low, 
        available: [...this.featurePriority.core, ...this.featurePriority.high, ...this.featurePriority.medium]
      };
    }

    if (health.overall === 'unhealthy') {
      // Degrade low and medium priority features
      this.degradeFeatures([...this.featurePriority.low, ...this.featurePriority.medium]);
      return { 
        degraded: [...this.featurePriority.low, ...this.featurePriority.medium],
        available: [...this.featurePriority.core, ...this.featurePriority.high]
      };
    }
  }

  degradeFeatures(features) {
    features.forEach(feature => this.degradedFeatures.add(feature));
    console.warn('Degraded features:', Array.from(this.degradedFeatures));
  }

  restoreAllFeatures() {
    if (this.degradedFeatures.size > 0) {
      console.log('✅ Restoring all features');
      this.degradedFeatures.clear();
    }
  }

  isFeatureAvailable(featureName) {
    return !this.degradedFeatures.has(featureName);
  }

  getAllFeatures() {
    return Object.values(this.featurePriority).flat();
  }

  getDegradedFeatures() {
    return Array.from(this.degradedFeatures);
  }
}

export const gracefulDegradationService = new GracefulDegradationService();
export default gracefulDegradationService;