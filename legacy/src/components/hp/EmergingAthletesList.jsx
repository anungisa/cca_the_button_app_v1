import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp } from 'lucide-react';

const emergingAthletes = [
  { name: 'Sarah Thompson', accuracyChange: '+5.2%', avatar: '' },
  { name: 'Mike Johnson', accuracyChange: '+4.8%', avatar: '' },
  { name: 'Emily Chen', accuracyChange: '+4.5%', avatar: '' },
];

const EmergingAthletesList = () => {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Emerging Athletes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {emergingAthletes.map((athlete, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={athlete.avatar} />
                <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-brand-text-primary">{athlete.name}</span>
            </div>
            <span className="text-sm font-semibold text-green-400">{athlete.accuracyChange}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmergingAthletesList;