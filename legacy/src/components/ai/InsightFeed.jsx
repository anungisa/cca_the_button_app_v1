import React from 'react';
import { AIInsight } from '@/api/entities';
import { useOptimizedData } from '../hooks/useOptimizedData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const InsightCard = ({ insight }) => {
    const severityMap = {
        low: { icon: Lightbulb, color: 'text-blue-400', bg: 'bg-blue-900/20' },
        medium: { icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
        high: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-900/20' },
        critical: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/20' },
    };
    
    const { icon: Icon, color, bg } = severityMap[insight.severity] || severityMap.medium;

    return (
        <div className={`p-4 rounded-lg border border-brand-border/50 ${bg}`}>
            <div className="flex items-start gap-4">
                <Icon className={`w-6 h-6 mt-1 ${color}`} />
                <div>
                    <h4 className="font-semibold text-brand-text-primary">{insight.observation}</h4>
                    <p className="text-sm text-brand-text-secondary mt-1">{insight.suggestion}</p>
                    <div className="mt-2">
                        <span className="text-xs font-mono uppercase text-brand-text-secondary/70">{insight.insight_type.replace(/_/g, ' ')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function InsightFeed({ contextType, contextId }) {
    const { data: insights, isLoading } = useOptimizedData('AIInsight', {
        filters: { context_type: contextType, context_id: contextId, status: 'new' },
        sort: '-severity',
        realTime: true
    });

    if (isLoading) {
        return <Loader2 className="w-6 h-6 animate-spin" />;
    }

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Proactive Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights && insights.length > 0 ? (
                    insights.map(insight => <InsightCard key={insight.id} insight={insight} />)
                ) : (
                    <div className="text-center py-8 text-brand-text-secondary">
                        <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-500" />
                        <p>No new insights at the moment. Everything looks good!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}