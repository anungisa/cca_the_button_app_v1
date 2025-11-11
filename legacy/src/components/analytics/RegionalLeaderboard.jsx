import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

export default function RegionalLeaderboard({ data }) {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-gold" />
            Regional Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {data.map((item) => (
            <li key={item.rank} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-md">
                <div className="flex items-center gap-3">
                    <Badge className="bg-brand-red text-white w-6 h-6 flex items-center justify-center">{item.rank}</Badge>
                    <span className="font-medium text-brand-text-primary">{item.clubName}</span>
                </div>
                <span className="text-sm text-brand-text-secondary">{item.metric}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}