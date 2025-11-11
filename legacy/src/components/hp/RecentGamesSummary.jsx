import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

const recentGames = [
  { event: '2024 Brier', team: 'Team Gushue', accuracy: '88%' },
  { event: '2024 Scotties', team: 'Team Homan', accuracy: '91%' },
  { event: 'U21 Nationals', team: 'Team Alberta', accuracy: '85%' },
];

const RecentGamesSummary = () => {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Recent Game Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentGames.map((game, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium text-brand-text-primary">{game.team}</p>
              <p className="text-xs text-brand-text-secondary">{game.event}</p>
            </div>
            <span className="font-semibold text-brand-text-primary">{game.accuracy}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentGamesSummary;