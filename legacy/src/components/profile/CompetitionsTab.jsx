import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CompetitionsTab({ user }) {
  if (!user) return null;

  // Mock data until a live source is available
  const competitions = user.competitions || [];

  return (
    <Card className="bg-brand-card-bg border-brand-border h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Competition History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {competitions.length > 0 ? (
          <ul className="space-y-4">
            {competitions.map((comp) => (
              <li key={comp.id} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-md">
                <div>
                  <p className="font-semibold text-brand-text-primary">{comp.name}</p>
                  <p className="text-sm text-brand-text-secondary">{comp.date}</p>
                </div>
                <Badge className={comp.rank === '1st' ? 'bg-amber-500' : 'bg-gray-500'}>
                  {comp.rank}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-brand-text-secondary py-8">
            <p>No competition history recorded.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}