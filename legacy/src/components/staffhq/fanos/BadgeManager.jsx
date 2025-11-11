import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Award, Star, Zap } from 'lucide-react';

export default function BadgeManager() {
  const [badges, setBadges] = useState([
    { id: 1, name: "Welcome to The Button", description: "Awarded for first login.", icon: Star, rarity: "common", earned: "18,432" },
    { id: 2, name: "Trivia Rookie", description: "Answer your first trivia question correctly.", icon: Award, rarity: "common", earned: "12,109" },
    { id: 3, name: "Event Explorer", description: "Check into your first live event.", icon: Zap, rarity: "uncommon", earned: "7,543" },
    { id: 4, name: "Brier Champion Fan", description: "Engaged during every day of the Brier.", icon: Award, rarity: "rare", earned: "1,203" },
  ]);

  const handleCreate = () => alert('Modal to create/edit badge would open here.');

  return (
    <Card className="bg-brand-charcoal border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Achievement Badge System</CardTitle>
        <Button size="sm" onClick={handleCreate}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Badge
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map(badge => (
            <Card key={badge.id} className="bg-brand-card-bg border-brand-border/50">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="bg-brand-red/10 p-3 rounded-lg">
                  <badge.icon className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-text-primary">{badge.name}</h4>
                  <p className="text-sm text-brand-text-secondary">{badge.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge>{badge.rarity}</Badge>
                    <span className="text-xs text-brand-text-secondary">{badge.earned} earned</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}