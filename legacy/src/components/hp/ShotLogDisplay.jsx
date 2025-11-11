import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks } from 'lucide-react';

export default function ShotLogDisplay({ shots, athletes }) {
  const getAthleteName = (id) => athletes.find(a => a.id === id)?.full_name || 'Unknown';

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="w-5 h-5" /> Current Session Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          {shots.length === 0 ? (
            <p className="text-center text-brand-text-secondary py-8">No shots logged for this session yet.</p>
          ) : (
            <div className="space-y-2">
              {shots.map((shot, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-brand-charcoal rounded-md">
                  <div className="flex-1">
                    <p className="font-medium text-brand-text-primary">
                      End {shot.end_number}, Shot {shot.shot_number} ({getAthleteName(shot.athlete_id)})
                    </p>
                    <p className="text-sm text-brand-text-secondary">{shot.notes || 'No notes'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{shot.execution}</Badge>
                    {shot.deficiency !== 'None' && <Badge variant="secondary">{shot.deficiency}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}