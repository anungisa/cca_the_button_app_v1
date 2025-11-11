import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserStreak } from '@/api/entities';
import { AdvancedXPEngine } from '../xp/AdvancedXPEngine';
import { useXP } from '../XPContext';
import { Flame, Calendar, Target, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const StreakCard = ({ streak, onExtendStreak }) => {
  const getStreakIcon = (actionType) => {
    switch (actionType) {
      case 'trivia': return '🧠';
      case 'patch_scan': return '🏷️';
      case 'livestream': return '📺';
      case 'conversation': return '💬';
      default: return '⚡';
    }
  };

  const getStreakColor = (current) => {
    if (current >= 30) return 'from-red-500 to-orange-500';
    if (current >= 7) return 'from-orange-500 to-yellow-500';
    if (current >= 3) return 'from-yellow-500 to-green-500';
    return 'from-blue-500 to-indigo-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border/50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getStreakIcon(streak.action_type)}</span>
          <div>
            <h4 className="font-semibold text-brand-text-primary capitalize">
              {streak.action_type.replace('_', ' ')} Streak
            </h4>
            <p className="text-xs text-brand-text-secondary">
              Last action: {new Date(streak.last_action_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${getStreakColor(streak.current_streak)} rounded-full flex items-center justify-center`}>
          <Flame className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-brand-text-secondary">Current</span>
          <Badge className="bg-brand-red text-white">
            {streak.current_streak} days
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-brand-text-secondary">Best</span>
          <Badge variant="outline" className="border-amber-400 text-amber-400">
            {streak.longest_streak} days
          </Badge>
        </div>
      </div>

      {streak.streak_active && (
        <Button
          size="sm"
          className="w-full mt-3"
          onClick={() => onExtendStreak(streak.action_type)}
        >
          Continue Streak
        </Button>
      )}
    </motion.div>
  );
};

export default function StreaksPanel() {
  const { user } = useXP();
  const [streaks, setStreaks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStreaks();
    }
  }, [user]);

  const loadUserStreaks = async () => {
    try {
      const userStreaks = await UserStreak.filter({ user_id: user.id });
      setStreaks(userStreaks);
    } catch (error) {
      console.error('Failed to load user streaks:', error);
      // Create mock streaks for demonstration
      setStreaks([
        {
          id: '1',
          user_id: user.id,
          action_type: 'trivia',
          current_streak: 5,
          longest_streak: 12,
          last_action_date: new Date().toISOString().split('T')[0],
          streak_active: true
        },
        {
          id: '2',
          user_id: user.id,
          action_type: 'patch_scan',
          current_streak: 2,
          longest_streak: 8,
          last_action_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          streak_active: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtendStreak = async (actionType) => {
    try {
      await AdvancedXPEngine.updateUserStreak(user.id, actionType);
      loadUserStreaks(); // Refresh data
    } catch (error) {
      console.error('Failed to extend streak:', error);
    }
  };

  if (!user) return null;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand-red" />
          Your Streaks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-brand-charcoal/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : streaks.length > 0 ? (
          <div className="space-y-4">
            {streaks.map(streak => (
              <StreakCard 
                key={streak.id} 
                streak={streak} 
                onExtendStreak={handleExtendStreak}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            <Flame className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active streaks yet</p>
            <p className="text-sm mt-2">Start engaging to build your streaks!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}