import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { AIInsight } from '@/api/entities';
import { User } from '@/api/entities';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Eye,
  Lightbulb,
  Target,
  Users,
  Building
} from 'lucide-react';

export default function ProactiveAIInsights({ contextType = 'system', contextId = null, maxInsights = 3 }) {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadInsights();
    loadUser();
  }, [contextType, contextId]);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      let fetchedInsights = [];
      
      if (contextId) {
        // Get insights for specific context
        fetchedInsights = await AIInsight.filter({ 
          context_id: contextId,
          context_type: contextType,
          status: 'new'
        });
      } else {
        // Get general insights for current user
        fetchedInsights = await AIInsight.filter({ 
          status: 'new'
        });
      }

      // Fallback to sample insights if none found
      if (fetchedInsights.length === 0) {
        fetchedInsights = await generateSampleInsights(contextType);
      }

      setInsights(fetchedInsights.slice(0, maxInsights));
    } catch (error) {
      console.error('Failed to load AI insights:', error);
      setInsights(await generateSampleInsights(contextType));
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleInsights = async (context) => {
    const sampleInsights = [
      {
        id: 'ai_001',
        insight_type: 'club_at_risk',
        observation: '3 clubs in Ontario showing declining membership trends',
        suggestion: 'Consider targeted retention campaigns for clubs with <75 members',
        severity: 'medium',
        context_type: 'system',
        supporting_metrics: { affected_clubs: 3, avg_decline: '12%' }
      },
      {
        id: 'ai_002',
        insight_type: 'volunteer_churn_risk',
        observation: 'Volunteer satisfaction scores trending downward in Alberta',
        suggestion: 'Implement volunteer recognition program before spring events',
        severity: 'high',
        context_type: 'system',
        supporting_metrics: { satisfaction_score: 6.8, events_affected: 4 }
      },
      {
        id: 'ai_003',
        insight_type: 'emerging_talent',
        observation: 'Youth participation increased 23% in Saskatchewan this season',
        suggestion: 'Expand youth programs and coaching resources in SK region',
        severity: 'low',
        context_type: 'system',
        supporting_metrics: { growth_rate: '23%', new_athletes: 47 }
      }
    ];

    return sampleInsights.filter(insight => {
      // Filter insights based on context
      if (context === 'club') return insight.insight_type === 'club_at_risk';
      if (context === 'athlete') return insight.insight_type === 'emerging_talent';
      return true;
    });
  };

  const handleInsightAction = async (insight, action) => {
    try {
      if (action === 'dismiss') {
        await AIInsight.update(insight.id, { status: 'dismissed' });
      } else if (action === 'view') {
        await AIInsight.update(insight.id, { status: 'viewed' });
      }
      
      // Remove from current list
      setInsights(prev => prev.filter(i => i.id !== insight.id));
    } catch (error) {
      console.error('Failed to update insight:', error);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Target className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Lightbulb className="w-4 h-4 text-blue-500" />;
      default: return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  const getInsightTypeIcon = (type) => {
    switch (type) {
      case 'club_at_risk': return <Building className="w-4 h-4" />;
      case 'volunteer_churn_risk': return <Users className="w-4 h-4" />;
      case 'emerging_talent': return <TrendingUp className="w-4 h-4" />;
      case 'performance_correlation': return <Target className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity) => {
    const config = {
      critical: { color: 'bg-red-600', text: 'Critical' },
      high: { color: 'bg-orange-600', text: 'High' },
      medium: { color: 'bg-yellow-600', text: 'Medium' },
      low: { color: 'bg-blue-600', text: 'Low' }
    };
    const { color, text } = config[severity] || config.medium;
    return <Badge className={`${color} text-white text-xs`}>{text}</Badge>;
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="rounded-full bg-brand-border h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-brand-border rounded w-3/4"></div>
              <div className="h-3 bg-brand-border rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-brand-red" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-brand-text-secondary text-sm">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            All caught up! No new insights right now.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="w-4 h-4 text-brand-red" />
          AI Insights
          <Badge variant="outline" className="text-xs">{insights.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="p-3 bg-brand-charcoal/30 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getInsightTypeIcon(insight.insight_type)}
                {getSeverityIcon(insight.severity)}
                {getSeverityBadge(insight.severity)}
              </div>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleInsightAction(insight, 'view')}
                  className="h-6 w-6 p-0"
                >
                  <Eye className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleInsightAction(insight, 'dismiss')}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-brand-text-primary">{insight.observation}</p>
              <p className="text-xs text-brand-text-secondary">{insight.suggestion}</p>
              
              {insight.supporting_metrics && (
                <div className="flex gap-2 mt-2">
                  {Object.entries(insight.supporting_metrics).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}