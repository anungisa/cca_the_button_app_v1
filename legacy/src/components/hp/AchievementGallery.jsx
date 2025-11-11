import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Star, Crown } from 'lucide-react';

const getMedalColor = (medal) => {
  switch (medal) {
    case 'gold': return 'text-yellow-400 bg-yellow-500/10';
    case 'silver': return 'text-gray-400 bg-gray-500/10';
    case 'bronze': return 'text-amber-600 bg-amber-500/10';
    default: return 'text-blue-400 bg-blue-500/10';
  }
};

const getEventIcon = (eventType) => {
  switch (eventType) {
    case 'olympic': return Crown;
    case 'world': return Trophy;
    case 'continental': return Award;
    case 'national': return Star;
    default: return Medal;
  }
};

const AchievementCard = ({ achievement }) => {
  const Icon = getEventIcon(achievement.event_type);
  const medalColor = getMedalColor(achievement.medal);

  return (
    <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${medalColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-brand-text-primary">{achievement.title}</h4>
            <p className="text-sm text-brand-text-secondary mt-1">{achievement.year}</p>
            {achievement.medal && (
              <Badge className={`mt-2 ${medalColor} border-0`}>
                {achievement.medal.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AchievementGallery({ achievements = [] }) {
  if (!achievements || achievements.length === 0) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-8 text-center">
          <Trophy className="w-12 h-12 text-brand-text-secondary mx-auto mb-3" />
          <p className="text-brand-text-secondary">No achievements recorded yet</p>
        </CardContent>
      </Card>
    );
  }

  // Group achievements by event type
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const type = achievement.event_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(achievement);
    return acc;
  }, {});

  const typeLabels = {
    olympic: 'Olympic Games',
    world: 'World Championships',
    continental: 'Continental Championships',
    national: 'National Championships',
    other: 'Other Achievements'
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedAchievements).map(([type, achs]) => (
        <div key={type}>
          <h3 className="text-lg font-bold text-brand-text-primary mb-3 flex items-center gap-2">
            {React.createElement(getEventIcon(type), { className: 'w-5 h-5 text-brand-red' })}
            {typeLabels[type] || type}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achs.map((achievement, index) => (
              <AchievementCard key={index} achievement={achievement} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}