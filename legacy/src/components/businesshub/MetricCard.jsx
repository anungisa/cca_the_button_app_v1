import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MetricCard({ title, value, icon: Icon, trend, trendColor = 'bg-green-600/20 text-green-300' }) {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <Icon className="w-8 h-8 text-brand-red mb-4" />
        <p className="text-3xl font-bold text-brand-text-primary">{value}</p>
        <p className="text-sm text-brand-text-secondary mt-1">{title}</p>
        {trend && (
          <Badge className={`mt-3 px-2 py-1 text-xs ${trendColor}`}>
            {trend}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}