import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function UserWelcomeHeader({ user, loyaltyData }) {
  // Guard against null user
  if (!user) {
    return null;
  }

  const userName = user.full_name || user.email || 'Curler';
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Card className="bg-gradient-to-r from-brand-red/10 to-amber-500/10 border-brand-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              {greeting()}, {userName}!
            </h1>
            <p className="text-brand-text-secondary mt-2">
              Welcome back to The Button
            </p>
          </div>
          {loyaltyData && (
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-brand-text-primary">
                  {loyaltyData.curl_points || 0} XP
                </span>
              </div>
              <Badge className="mt-2 bg-amber-500">
                {loyaltyData.tier ? loyaltyData.tier.replace(/_/g, ' ').toUpperCase() : 'GRANITE ROOKIE'}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}