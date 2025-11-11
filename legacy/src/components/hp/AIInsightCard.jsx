import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, AlertTriangle, ThumbsUp } from 'lucide-react';

const InsightTypeIcons = {
  performance_correlation: TrendingUp,
  technique_suggestion: Lightbulb,
  fatigue_warning: AlertTriangle,
  positive_reinforcement: ThumbsUp
};

const InsightTypeColors = {
  performance_correlation: 'text-blue-400',
  technique_suggestion: 'text-amber-400',
  fatigue_warning: 'text-red-400',
  positive_reinforcement: 'text-green-400'
};

export default function AIInsightCard({ insight }) {
  if (!insight) return null;

  const IconComponent = InsightTypeIcons[insight.type] || Lightbulb;
  const iconColor = InsightTypeColors[insight.type] || 'text-gray-400';

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-brand-text-primary">
            <IconComponent className={`w-5 h-5 ${iconColor}`} />
            AI Insight
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {insight.type?.replace('_', ' ') || 'General'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-semibold text-brand-text-primary mb-1">Observation</h4>
          <p className="text-sm text-brand-text-secondary">{insight.observation}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-brand-text-primary mb-1">Recommendation</h4>
          <p className="text-sm text-brand-text-secondary">{insight.suggestion}</p>
        </div>
        
        {insight.supporting_metrics && Object.keys(insight.supporting_metrics).length > 0 && (
          <div>
            <h4 className="font-semibold text-brand-text-primary mb-2">Supporting Data</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(insight.supporting_metrics).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="text-brand-text-secondary">{key.replace('_', ' ')}:</span>
                  <span className="text-brand-text-primary ml-1">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}