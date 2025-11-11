import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';

export default function BenchmarkInsightCard({ insight }) {
  const { area, clubValue, regionalAverage, insight: insightText } = insight;
  const isAboveAverage = clubValue >= regionalAverage;

  return (
    <Card className="bg-gradient-to-br from-brand-card-bg to-brand-charcoal border-brand-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="text-amber-400" />
          Benchmark Insight
        </CardTitle>
        <p className="text-brand-text-secondary text-sm pt-1">{area}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-xs text-brand-text-secondary">Your Club</p>
            <p className="text-2xl font-bold text-brand-text-primary">{clubValue}</p>
          </div>
          <div>
            <p className="text-xs text-brand-text-secondary">Regional Avg.</p>
            <p className="text-2xl font-bold text-brand-text-secondary">{regionalAverage}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-md ${
          isAboveAverage ? 'bg-green-600/10 text-green-300' : 'bg-red-600/10 text-red-300'
        }`}>
          {isAboveAverage ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <p className="text-sm font-medium">
            {isAboveAverage ? 'Above' : 'Below'} regional average
          </p>
        </div>

        <p className="text-sm text-brand-text-secondary pt-2">
          {insightText}
        </p>
      </CardContent>
    </Card>
  );
}