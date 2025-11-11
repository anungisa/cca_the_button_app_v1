import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, TrendingUp, AlertTriangle, CheckCircle2, Clock, Target, 
  Lightbulb, Zap, BarChart3, Users, Calendar
} from 'lucide-react';
import { useXP } from '../XPContext';
import { Task } from '@/api/entities';
import { TimeEntry } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';

const InsightCard = ({ insight, onDismiss, onAccept }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'time_optimization': return Clock;
      case 'task_priority': return Target;
      case 'collaboration': return Users;
      case 'schedule_optimization': return Calendar;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const Icon = getInsightIcon(insight.type);

  return (
    <Card className={`${getInsightColor(insight.priority)} border`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-red" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-brand-text-primary">{insight.title}</h4>
              <Badge variant="outline" className="text-xs">
                {insight.priority} priority
              </Badge>
            </div>
            <p className="text-sm text-brand-text-secondary mb-3">
              {insight.description}
            </p>
            {insight.actionable && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onAccept(insight)}>
                  Apply Suggestion
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDismiss(insight.id)}>
                  Dismiss
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductivityScore = ({ score, trends }) => (
  <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400" />
        Productivity Score
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-brand-text-primary mb-2">
          {score}/100
        </div>
        <p className="text-sm text-brand-text-secondary">
          Based on task completion, time management, and collaboration patterns
        </p>
      </div>
      <div className="space-y-2">
        {trends.map((trend, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-brand-text-secondary">{trend.metric}</span>
            <span className={`flex items-center gap-1 ${
              trend.change > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              <TrendingUp className="w-3 h-3" />
              {trend.change > 0 ? '+' : ''}{trend.change}%
            </span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function ProductivityAssistant() {
  const { user } = useXP();
  const [insights, setInsights] = useState([]);
  const [productivityScore, setProductivityScore] = useState(0);
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateInsights();
    }
  }, [user]);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      // Fetch user's recent productivity data
      const [tasks, timeEntries] = await Promise.all([
        Task.filter({ assigned_to: user.id }, '-created_date', 50),
        TimeEntry.filter({ user_id: user.id }, '-created_date', 30)
      ]);

      // Prepare data for AI analysis
      const productivityData = {
        tasks: tasks.map(t => ({
          status: t.status,
          priority: t.priority,
          estimated_hours: t.estimated_hours,
          actual_hours: t.actual_hours,
          created_date: t.created_date,
          due_date: t.due_date
        })),
        timeEntries: timeEntries.map(t => ({
          duration_minutes: t.duration_minutes,
          created_date: t.created_date,
          description: t.description
        })),
        userProfile: {
          role: user.user_type,
          department: user.department
        }
      };

      // Generate AI insights
      const aiResponse = await InvokeLLM({
        prompt: `Analyze this staff member's productivity data and provide actionable insights:

${JSON.stringify(productivityData, null, 2)}

Please provide:
1. A productivity score (0-100)
2. 3-5 specific, actionable insights for improvement
3. Trends analysis for key metrics

Focus on time management, task prioritization, and work patterns. Be specific and actionable.`,
        response_json_schema: {
          type: "object",
          properties: {
            productivity_score: { type: "number" },
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string" },
                  actionable: { type: "boolean" }
                }
              }
            },
            trends: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  metric: { type: "string" },
                  change: { type: "number" }
                }
              }
            }
          }
        }
      });

      setProductivityScore(aiResponse.productivity_score || 75);
      setInsights(aiResponse.insights || []);
      setTrends(aiResponse.trends || []);

    } catch (error) {
      console.error('Error generating insights:', error);
      // Fallback to static insights
      setInsights([
        {
          id: '1',
          type: 'time_optimization',
          title: 'Optimize Your Schedule',
          description: 'Consider blocking time for focused work - you tend to be most productive in the morning.',
          priority: 'medium',
          actionable: true
        }
      ]);
      setProductivityScore(75);
      setTrends([
        { metric: 'Task Completion', change: 12 },
        { metric: 'Time Efficiency', change: -5 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInsight = async (insight) => {
    // Implement insight acceptance logic
    console.log('Accepting insight:', insight);
    // Could create tasks, calendar events, or update preferences
  };

  const handleDismissInsight = (insightId) => {
    setInsights(insights.filter(i => i.id !== insightId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">AI Productivity Assistant</h2>
          <p className="text-brand-text-secondary">Personalized insights to optimize your work patterns</p>
        </div>
        <Button onClick={generateInsights} disabled={isLoading}>
          <Zap className="w-4 h-4 mr-2" />
          Refresh Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductivityScore score={productivityScore} trends={trends} />
        
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-brand-text-primary">
            Personalized Recommendations
          </h3>
          {insights.length > 0 ? (
            insights.map(insight => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onAccept={handleAcceptInsight}
                onDismiss={handleDismissInsight}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-brand-text-primary">You're doing great!</p>
                <p className="text-sm text-brand-text-secondary">No immediate optimization suggestions at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}