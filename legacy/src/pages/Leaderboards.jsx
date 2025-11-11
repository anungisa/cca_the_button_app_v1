import React, { useState, useEffect } from 'react';
import { User, LoyaltyProgram, PointTransaction } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Trophy, 
  Crown, 
  Star, 
  TrendingUp,
  Heart,
  Users,
  MapPin,
  Zap,
  Medal,
  Target
} from 'lucide-react';

export default function Leaderboards() {
  const [user, setUser] = useState(null);
  const [leaderboards, setLeaderboards] = useState({
    points: [],
    volunteers: [],
    donors: [],
    regional: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        // Load all loyalty profiles
        const loyaltyProfiles = await LoyaltyProgram.list('-curl_points', 50);
        
        // Load all users to get names and regions
        const allUsers = await User.list();
        const userMap = {};
        allUsers.forEach(u => {
          userMap[u.id] = u;
        });
        
        // Create points leaderboard
        const pointsLeaderboard = loyaltyProfiles.map(profile => ({
          ...profile,
          user: userMap[profile.user_id]
        })).filter(p => p.user);
        
        // Create volunteer leaderboard (simulated data)
        const volunteerLeaderboard = pointsLeaderboard.map(p => ({
          ...p,
          volunteer_hours: Math.floor(Math.random() * 50) + 5,
          events_volunteered: Math.floor(Math.random() * 10) + 1
        })).sort((a, b) => b.volunteer_hours - a.volunteer_hours);
        
        // Create donor leaderboard (simulated data)
        const donorLeaderboard = pointsLeaderboard.map(p => ({
          ...p,
          total_donated: Math.floor(Math.random() * 1000) + 50,
          donations_count: Math.floor(Math.random() * 5) + 1
        })).sort((a, b) => b.total_donated - a.total_donated);
        
        // Create regional leaderboard
        const regionalLeaderboard = userData ? 
          pointsLeaderboard.filter(p => p.user.ma_region === userData.ma_region) : [];
        
        setLeaderboards({
          points: pointsLeaderboard,
          volunteers: volunteerLeaderboard,
          donors: donorLeaderboard,
          regional: regionalLeaderboard
        });
        
      } catch (error) {
        console.error('Error loading leaderboards:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getTierBadge = (tier) => {
    const tierConfig = {
      granite_rookie: { name: "Granite Rookie", color: "bg-gray-100 text-gray-800" },
      sheet_champion: { name: "Sheet Champion", color: "bg-blue-100 text-blue-800" },
      house_hero: { name: "House Hero", color: "bg-amber-100 text-amber-800" }
    };
    
    const config = tierConfig[tier] || tierConfig.granite_rookie;
    return <Badge className={config.color}>{config.name}</Badge>;
  };

  const LeaderboardTable = ({ data, type }) => (
    <div className="space-y-4">
      {data.slice(0, 10).map((entry, index) => {
        const rank = index + 1;
        const isCurrentUser = user && entry.user_id === user.id;
        
        return (
          <Card key={entry.id} className={`${isCurrentUser ? 'border-brand-red bg-red-50' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getRankIcon(rank)}
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-brand-red text-white">
                      {entry.user?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-brand-charcoal">
                        {entry.user?.full_name || 'Anonymous'}
                      </span>
                      {isCurrentUser && (
                        <Badge className="bg-brand-red text-white text-xs">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getTierBadge(entry.tier)}
                      {entry.user?.ma_region && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          {entry.user.ma_region}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {type === 'points' && (
                    <div>
                      <div className="flex items-center gap-1 text-lg font-bold text-brand-charcoal">
                        <Zap className="w-4 h-4 text-amber-500" />
                        {entry.curl_points?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-gray-500">CurlPoints</div>
                    </div>
                  )}
                  
                  {type === 'volunteers' && (
                    <div>
                      <div className="flex items-center gap-1 text-lg font-bold text-brand-charcoal">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        {entry.volunteer_hours}
                      </div>
                      <div className="text-sm text-gray-500">Hours Volunteered</div>
                    </div>
                  )}
                  
                  {type === 'donors' && (
                    <div>
                      <div className="flex items-center gap-1 text-lg font-bold text-brand-charcoal">
                        <Heart className="w-4 h-4 text-red-500" />
                        ${entry.total_donated}
                      </div>
                      <div className="text-sm text-gray-500">Total Donated</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-charcoal uppercase">Leaderboards</h1>
          <p className="text-gray-600 mt-1">
            See how you stack up against the curling community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-2xl font-bold text-brand-charcoal">{leaderboards.points.length}</p>
              <p className="text-sm text-gray-600">Active Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-brand-charcoal">
                {leaderboards.points.reduce((sum, p) => sum + (p.curl_points || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Points Earned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-brand-charcoal">
                {leaderboards.volunteers.reduce((sum, v) => sum + (v.volunteer_hours || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Hours Volunteered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-brand-charcoal">
                ${leaderboards.donors.reduce((sum, d) => sum + (d.total_donated || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Donated</p>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="points" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              CurlPoints
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Volunteers
            </TabsTrigger>
            <TabsTrigger value="donors" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Donors
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Regional
            </TabsTrigger>
          </TabsList>

          <TabsContent value="points" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Top CurlPoints Earners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeaderboardTable data={leaderboards.points} type="points" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Top Volunteers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeaderboardTable data={leaderboards.volunteers} type="volunteers" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Top Donors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeaderboardTable data={leaderboards.donors} type="donors" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  {user?.ma_region || 'Regional'} Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <LeaderboardTable data={leaderboards.regional} type="points" />
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-brand-charcoal mb-2">Sign In Required</h3>
                    <p className="text-gray-500">Sign in to view your regional leaderboard</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}