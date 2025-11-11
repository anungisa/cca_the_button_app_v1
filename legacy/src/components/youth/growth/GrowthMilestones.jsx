import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Zap } from 'lucide-react';

export default function GrowthMilestones({ benchmarks }) {
  const personalBests = benchmarks.filter(b => b.is_personal_best);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="text-amber-400" /> Milestones & Personal Bests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {personalBests.length > 0 ? (
          <ul className="space-y-3">
            {personalBests.map(pb => (
              <li key={pb.id} className="flex items-center gap-3 p-3 bg-brand-charcoal rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-semibold text-brand-text-primary">New Personal Best!</p>
                  <p className="text-sm text-brand-text-secondary">
                    {pb.test_type.replace(/_/g, ' ')}: {pb.result_value}
                  </p>
                  <p className="text-xs text-brand-text-secondary">{new Date(pb.test_date).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-brand-text-secondary py-4">No personal bests recorded yet. Keep training!</p>
        )}
      </CardContent>
    </Card>
  );
}