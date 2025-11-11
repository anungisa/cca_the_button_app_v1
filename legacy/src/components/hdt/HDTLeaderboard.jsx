import React, { useState, useEffect } from 'react';
import { HitDrawTap, User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Trophy, 
  Medal, 
  Crown,
  TrendingUp,
  MapPin,
  Target
} from 'lucide-react';

export default function HDTLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filters, setFilters] = useState({
    scope: 'national',
    ageDivision: 'all',
    timeFrame: 'all-time'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        // Get all HDT scores
        let scores = await HitDrawTap.list('-totals.grand_total', 100);
        
        // Apply age division filter
        if (filters.ageDivision !== 'all') {
          scores = scores.filter(score => score.age_division === filters.ageDivision);
        }
        
        // Apply time frame filter
        if (filters.timeFrame === 'this-week') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          scores = scores.filter(score => new Date(score.submission_date) >= oneWeekAgo);
        } else if (filters.timeFrame === 'this-month') {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          scores = scores.filter(score => new Date(score.submission_date) >= oneMonthAgo);
        }
        
        // Get user data for each score
        const userIds = [...new Set(scores.map(s => s.user_id))];
        const users = await User.filter({ id: userIds });
        const userMap = {};
        users.forEach(user => {
          userMap[user.id] = user;
        });
        
        // Combine scores with user data and get best score per user
        const userBestScores = {};
        scores.forEach(score => {
          const user = userMap[score.user_id];
          if (user && (!userBestScores[user.id] || score.totals.grand_total > userBestScores[user.id].totals.grand_total)) {
            userBestScores[user.id] = {
              ...score,
              user: user
            };
          }
        });
        
        // Convert to array and sort
        const leaderboard = Object.values(userBestScores)
          .filter(entry => {
            if (filters.scope === 'provincial' && entry.user.ma_region) {
              // In real app, would filter by current user's province
              return true;
            }
            return true;
          })
          .sort((a, b) => b.totals.grand_total - a.totals.grand_total)
          .slice(0, 50);
        
        setLeaderboardData(leaderboard);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLeaderboard();
  }, [filters]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getDisplayName = (user, ageDivision) => {
    // For privacy, show initials for under 13
    const age = ageDivision ? parseInt(ageDivision.split('-')[1]) : 13;
    if (age < 13) {
      const names = user.full_name?.split(' ') || ['Anonymous'];
      return names.map(name => name.charAt(0)).join('.') + '.';
    }
    return user.full_name || 'Anonymous';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
              <Select value={filters.scope} onValueChange={(value) => setFilters(prev => ({ ...prev, scope: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">🇨🇦 National</SelectItem>
                  <SelectItem value="provincial">🏛️ Provincial</SelectItem>
                  <SelectItem value="club">🏒 Club</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Division</label>
              <Select value={filters.ageDivision} onValueChange={(value) => setFilters(prev => ({ ...prev, ageDivision: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="6-7">6-7 Years</SelectItem>
                  <SelectItem value="8-9">8-9 Years</SelectItem>
                  <SelectItem value="10-12">10-12 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Frame</label>
              <Select value={filters.timeFrame} onValueChange={(value) => setFilters(prev => ({ ...prev, timeFrame: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Hit Draw Tap Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : leaderboardData.length > 0 ? (
            <div className="space-y-2">
              {leaderboardData.map((entry, index) => {
                const rank = index + 1;
                return (
                  <div 
                    key={entry.user.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      rank <= 3 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(rank)}
                      </div>
                      <Avatar>
                        <AvatarFallback className="bg-brand-red text-white">
                          {getDisplayName(entry.user, entry.age_division).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-brand-charcoal">
                          {getDisplayName(entry.user, entry.age_division)}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {entry.age_division} years
                          </Badge>
                          {entry.user.ma_region && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {entry.user.ma_region}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-charcoal">
                        {entry.totals.grand_total}
                      </div>
                      <div className="text-sm text-gray-600">
                        H:{entry.totals.hit_total} D:{entry.totals.draw_total} T:{entry.totals.tap_total}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-brand-charcoal mb-2">No Scores Yet</h3>
              <p className="text-gray-500">Be the first to submit a score in this category!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Climber */}
      {leaderboardData.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Climber of the Week</h3>
            <div className="text-lg">
              {getDisplayName(leaderboardData[0]?.user, leaderboardData[0]?.age_division)}
            </div>
            <p className="text-purple-100 text-sm mt-2">
              Most improved performance this week • Bonus CurlPoints awarded!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}