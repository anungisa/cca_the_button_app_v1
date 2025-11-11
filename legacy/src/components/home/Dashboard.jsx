import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useXP } from '../XPContext';
import { User } from '@/api/entities';
import UserWelcomeHeader from './UserWelcomeHeader';
import EngagementDeck from './EngagementDeck';
import HighlightSlider from './HighlightSlider';
import QuickActionTiles from './QuickActionTiles';
import CompactAnalyticsView from './CompactAnalyticsView';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loyaltyData, isLoading } = useXP();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Wait for user data to be available
    if (!isLoading) {
      setLocalLoading(false);
    }
  }, [isLoading]);

  if (isLoading || localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  // Guard against null user
  if (!user || !user.id) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserWelcomeHeader user={user} loyaltyData={loyaltyData} />
      <QuickActionTiles user={user} />
      <HighlightSlider />
      <EngagementDeck user={user} />
      {user.role === 'admin' && <CompactAnalyticsView />}
    </div>
  );
}