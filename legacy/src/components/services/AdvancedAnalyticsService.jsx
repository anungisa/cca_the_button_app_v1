import { InvokeLLM } from '@/api/integrations';
import { eventBus, EVENTS } from './EventBus';

/**
 * Advanced Analytics Integration Service
 * Real-time business intelligence dashboards with drill-down capabilities
 */
export class AdvancedAnalyticsService {
  constructor() {
    this.realTimeMetrics = new Map();
    this.alertThresholds = new Map();
    this.drillDownCache = new Map();
    this.setupEventListeners();
    this.initializeRealTimeTracking();
  }

  setupEventListeners() {
    // Track all events for analytics
    eventBus.subscribe('*', (data, metadata) => {
      this.trackEvent(metadata.eventName, data, metadata);
    });

    // Real-time metric updates
    eventBus.subscribe('analytics.metric_update', (data) => {
      this.updateRealTimeMetric(data);
    });
  }

  initializeRealTimeTracking() {
    // Set up key metrics to track in real-time
    this.setupMetricTracking('user_engagement', {
      pageViews: 0,
      activeUsers: new Set(),
      sessionDuration: [],
      bounceRate: 0
    });

    this.setupMetricTracking('operational_efficiency', {
      incidentsCreated: 0,
      incidentsResolved: 0,
      avgResolutionTime: 0,
      escalationRate: 0
    });

    this.setupMetricTracking('revenue_performance', {
      dealsWon: 0,
      totalRevenue: 0,
      pipelineValue: 0,
      conversionRate: 0
    });

    this.setupMetricTracking('event_success', {
      eventsPlanned: 0,
      tasksCompleted: 0,
      onTimeCompletion: 0,
      volunteerSatisfaction: 0
    });
  }

  setupMetricTracking(metricName, initialValues) {
    this.realTimeMetrics.set(metricName, {
      current: initialValues,
      history: [],
      lastUpdated: Date.now()
    });

    // Set up alerts for critical thresholds
    this.alertThresholds.set(metricName, this.getDefaultThresholds(metricName));
  }

  getDefaultThresholds(metricName) {
    const thresholds = {
      user_engagement: {
        bounceRate: { warning: 70, critical: 85 },
        avgSessionDuration: { warning: 120, critical: 60 } // seconds
      },
      operational_efficiency: {
        escalationRate: { warning: 15, critical: 25 }, // percentage
        avgResolutionTime: { warning: 48, critical: 72 } // hours
      },
      revenue_performance: {
        conversionRate: { warning: 10, critical: 5 }, // percentage
        pipelineValue: { warning: 100000, critical: 50000 } // dollars
      },
      event_success: {
        onTimeCompletion: { warning: 80, critical: 60 }, // percentage
        volunteerSatisfaction: { warning: 7, critical: 5 } // out of 10
      }
    };

    return thresholds[metricName] || {};
  }

  /**
   * Track events for analytics
   */
  trackEvent(eventName, data, metadata) {
    const timestamp = Date.now();
    
    // Update relevant metrics based on event type
    switch (eventName) {
      case 'user.login':
        this.updateUserEngagement('login', data);
        break;
        
      case 'incident.created':
        this.updateOperationalMetrics('incident_created', data);
        break;
        
      case 'incident.resolved':
        this.updateOperationalMetrics('incident_resolved', data);
        break;
        
      case 'deal.won':
        this.updateRevenueMetrics('deal_won', data);
        break;
        
      case 'eventops.task.completed':
        this.updateEventMetrics('task_completed', data);
        break;
    }

    // Store for historical analysis
    this.storeEventForAnalysis(eventName, data, metadata, timestamp);
  }

  updateUserEngagement(type, data) {
    const metrics = this.realTimeMetrics.get('user_engagement');
    
    switch (type) {
      case 'login':
        metrics.current.activeUsers.add(data.userId);
        break;
        
      case 'page_view':
        metrics.current.pageViews++;
        break;
        
      case 'session_end':
        if (data.duration) {
          metrics.current.sessionDuration.push(data.duration);
        }
        break;
    }

    this.updateMetricAndCheckAlerts('user_engagement', metrics.current);
  }

  updateOperationalMetrics(type, data) {
    const metrics = this.realTimeMetrics.get('operational_efficiency');
    
    switch (type) {
      case 'incident_created':
        metrics.current.incidentsCreated++;
        break;
        
      case 'incident_resolved':
        metrics.current.incidentsResolved++;
        if (data.resolutionTimeHours) {
          // Update average resolution time
          const total = metrics.current.avgResolutionTime * (metrics.current.incidentsResolved - 1);
          metrics.current.avgResolutionTime = (total + data.resolutionTimeHours) / metrics.current.incidentsResolved;
        }
        break;
        
      case 'incident_escalated':
        // Calculate escalation rate
        const escalationRate = (data.escalatedCount / metrics.current.incidentsCreated) * 100;
        metrics.current.escalationRate = escalationRate;
        break;
    }

    this.updateMetricAndCheckAlerts('operational_efficiency', metrics.current);
  }

  updateRevenueMetrics(type, data) {
    const metrics = this.realTimeMetrics.get('revenue_performance');
    
    switch (type) {
      case 'deal_won':
        metrics.current.dealsWon++;
        metrics.current.totalRevenue += data.value || 0;
        break;
        
      case 'deal_created':
        metrics.current.pipelineValue += data.value || 0;
        break;
        
      case 'deal_lost':
        metrics.current.pipelineValue -= data.value || 0;
        break;
    }

    this.updateMetricAndCheckAlerts('revenue_performance', metrics.current);
  }

  updateEventMetrics(type, data) {
    const metrics = this.realTimeMetrics.get('event_success');
    
    switch (type) {
      case 'task_completed':
        metrics.current.tasksCompleted++;
        if (data.completedOnTime) {
          metrics.current.onTimeCompletion++;
        }
        break;
        
      case 'event_planned':
        metrics.current.eventsPlanned++;
        break;
        
      case 'volunteer_feedback':
        if (data.satisfaction) {
          // Update volunteer satisfaction average
          const currentAvg = metrics.current.volunteerSatisfaction;
          const count = metrics.current.feedbackCount || 1;
          metrics.current.volunteerSatisfaction = ((currentAvg * count) + data.satisfaction) / (count + 1);
          metrics.current.feedbackCount = count + 1;
        }
        break;
    }

    this.updateMetricAndCheckAlerts('event_success', metrics.current);
  }

  updateMetricAndCheckAlerts(metricName, currentValues) {
    const metric = this.realTimeMetrics.get(metricName);
    metric.current = currentValues;
    metric.lastUpdated = Date.now();

    // Add to history
    metric.history.push({
      timestamp: Date.now(),
      values: { ...currentValues }
    });

    // Keep only last 1000 history points
    if (metric.history.length > 1000) {
      metric.history.shift();
    }

    // Check for alerts
    this.checkMetricAlerts(metricName, currentValues);

    // Publish real-time update
    eventBus.publish('analytics.real_time_update', {
      metric: metricName,
      values: currentValues,
      timestamp: Date.now()
    });
  }

  checkMetricAlerts(metricName, values) {
    const thresholds = this.alertThresholds.get(metricName);
    if (!thresholds) return;

    for (const [valueKey, threshold] of Object.entries(thresholds)) {
      const currentValue = values[valueKey];
      if (currentValue === undefined) continue;

      if (currentValue >= threshold.critical) {
        this.triggerAlert('critical', metricName, valueKey, currentValue, threshold.critical);
      } else if (currentValue >= threshold.warning) {
        this.triggerAlert('warning', metricName, valueKey, currentValue, threshold.warning);
      }
    }
  }

  triggerAlert(severity, metricName, valueKey, currentValue, thresholdValue) {
    eventBus.publish('analytics.alert', {
      severity,
      metric: metricName,
      field: valueKey,
      currentValue,
      thresholdValue,
      timestamp: Date.now()
    });

    // Send notification to relevant team
    eventBus.publish('notification.create', {
      userId: 'analytics_team', // Would be actual user IDs
      urgency: severity === 'critical' ? 'high' : 'normal',
      type: 'analytics_alert',
      title: `${severity.toUpperCase()}: ${metricName} Alert`,
      message: `${valueKey} has reached ${currentValue}, exceeding ${severity} threshold of ${thresholdValue}`
    });
  }

  /**
   * Generate AI-powered insights
   */
  async generateInsights(metricName, timeframe = '24h') {
    const metric = this.realTimeMetrics.get(metricName);
    if (!metric) return null;

    const historicalData = this.getHistoricalData(metricName, timeframe);
    
    try {
      const insights = await InvokeLLM({
        prompt: `
          Analyze this ${metricName} data and provide actionable insights:
          
          Current Values: ${JSON.stringify(metric.current)}
          Historical Trend (${timeframe}): ${JSON.stringify(historicalData)}
          
          Provide:
          1. Key trends and patterns
          2. Anomalies or concerning changes
          3. Specific actionable recommendations
          4. Predicted outcomes if current trends continue
          
          Focus on business impact and operational improvements.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            trends: { type: "array", items: { type: "string" } },
            anomalies: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            predictions: { type: "array", items: { type: "string" } }
          }
        }
      });

      return insights;
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return null;
    }
  }

  getHistoricalData(metricName, timeframe) {
    const metric = this.realTimeMetrics.get(metricName);
    if (!metric) return [];

    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - (timeRanges[timeframe] || timeRanges['24h']);
    
    return metric.history.filter(point => point.timestamp >= cutoff);
  }

  /**
   * Get real-time dashboard data
   */
  getRealTimeDashboard() {
    const dashboard = {};
    
    for (const [metricName, metric] of this.realTimeMetrics) {
      dashboard[metricName] = {
        current: metric.current,
        lastUpdated: metric.lastUpdated,
        trend: this.calculateTrend(metric.history.slice(-10)), // Last 10 data points
        alerts: this.getActiveAlerts(metricName)
      };
    }

    return dashboard;
  }

  calculateTrend(historyPoints) {
    if (historyPoints.length < 2) return 'stable';
    
    const recent = historyPoints.slice(-3);
    const older = historyPoints.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    // Simple trend calculation - could be more sophisticated
    const recentAvg = recent.reduce((sum, point) => sum + Object.keys(point.values).length, 0) / recent.length;
    const olderAvg = older.reduce((sum, point) => sum + Object.keys(point.values).length, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'increasing';
    if (recentAvg < olderAvg * 0.9) return 'decreasing';
    return 'stable';
  }

  getActiveAlerts(metricName) {
    // Return active alerts for this metric
    // This would typically query an alerts storage system
    return [];
  }

  /**
   * Export analytics data
   */
  exportAnalyticsData(metricName, format = 'json', timeframe = '24h') {
    const historicalData = this.getHistoricalData(metricName, timeframe);
    
    if (format === 'csv') {
      return this.convertToCSV(historicalData);
    }
    
    return JSON.stringify(historicalData, null, 2);
  }

  convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = ['timestamp', ...Object.keys(data[0].values)];
    const rows = data.map(point => [
      new Date(point.timestamp).toISOString(),
      ...Object.values(point.values)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const advancedAnalytics = new AdvancedAnalyticsService();