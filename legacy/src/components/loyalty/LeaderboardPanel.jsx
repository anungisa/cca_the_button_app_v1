import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/api/entities';
import { LoyaltyProgram } from '@/api/entities';
import { useXP } from '../XPContext';
import { Trophy, Medal, Award, Crown, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const LeaderboardEntry = ({ entry, rank, isCurrentUser }) => {
  const getRankIcon = (position) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-brand-text-secondary font-bold">{position}</span>;
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      'granite_rookie': 'bg-gray-600',
      'sheet_star': 'bg-blue-600',
      'house_hero': 'bg-purple-600',
      'button_boss': 'bg-red-600',
      'hack_master': 'bg-green-600',
      'granite_legacy': 'bg-amber-500'
    };
    return colors[tier] || 'bg-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
        isCurrentUser ? 'bg-brand-red/20 border border-brand-red/30' : 'bg-brand-charcoal/50'
      }`}
    >
      <div className="flex items-center justify-center w-8">
        {getRankIcon(rank)}
      </div>
      
      <div className="w-10 h-10 bg-brand-card-bg rounded-full flex items-center justify-center text-white font-bold">
        {entry.user_name?.charAt(0) || 'U'}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${isCurrentUser ? 'text-brand-text-primary' : 'text-brand-text-primary'}`}>
            {entry.user_name || 'Unknown User'}
          </span>
          {isCurrentUser && (
            <Badge className="bg-brand-red text-white text-xs">You</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={`${getTierColor(entry.tier)} text-white text-xs`}>
            {entry.tier?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Rookie'}
          </Badge>
          {entry.club_name && (
            <span className="text-xs text-brand-text-secondary">{entry.club_name}</span>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-bold text-brand-text-primary">{entry.total_xp || 0}</div>
        <div className="text-xs text-brand-text-secondary">XP</div>
      </div>
    </motion.div>
  );
};

export default function LeaderboardPanel() {
  const { user, loyaltyData } = useXP();
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('all_time');
  const [scope, setScope] = useState('global');
  const [isLoading, setIsLoading] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      // ✅ SAFE: Only load real data if we have a valid user
      if (!user || !user.id || typeof user.id !== 'string' || user.id.includes('sample')) {
        // Use mock data for demo/sample users
        setLeaderboard([
          { id: '1', user_name: 'Sarah Mitchell', club_name: 'Toronto CC', tier: 'house_hero', total_xp: 2547, rank: 1 },
          { id: '2', user_name: 'Mike Johnson', club_name: 'Calgary CC', tier: 'sheet_star', total_xp: 1823, rank: 2 },
          { id: '3', user_name: 'Emma Wilson', club_name: 'Vancouver CC', tier: 'sheet_star', total_xp: 1456, rank: 3 }
        ]);
        setIsLoading(false);
        return;
      }

      const loyaltyPrograms = await LoyaltyProgram.list('-total_earned_points', 10);
      
      // Get user details for each entry
      const leaderboardWithUsers = await Promise.all(
        loyaltyPrograms.map(async (program, index) => {
          try {
            const users = await User.filter({ id: program.user_id });
            const userData = users[0];
            return {
              ...program,
              user_name: userData?.full_name || 'Unknown User',
              club_name: userData?.home_club_name,
              total_xp: program.total_earned_points || 0,
              rank: index + 1
            };
          } catch (error) {
            console.warn('Failed to load user for leaderboard:', error);
            return {
              ...program,
              user_name: 'Unknown User',
              total_xp: program.total_earned_points || 0,
              rank: index + 1
            };
          }
        })
      );

      setLeaderboard(leaderboardWithUsers);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      // Fallback to mock data
      setLeaderboard([
        { id: '1', user_name: 'Sarah Mitchell', club_name: 'Toronto CC', tier: 'house_hero', total_xp: 2547, rank: 1 },
        { id: '2', user_name: 'Mike Johnson', club_name: 'Calgary CC', tier: 'sheet_star', total_xp: 1823, rank: 2 },
        { id: '3', user_name: 'Emma Wilson', club_name: 'Vancouver CC', tier: 'sheet_star', total_xp: 1456, rank: 3 }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe, scope, loadLeaderboard]);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-brand-red" />
          Leaderboard
        </CardTitle>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_time">All Time</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="club">My Club</SelectItem>
              <SelectItem value="region">My Region</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-brand-charcoal/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <LeaderboardEntry
                key={entry.id}
                entry={entry}
                rank={entry.rank}
                isCurrentUser={user && (entry.user_name === user.full_name || entry.user_id === user.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No leaderboard data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}