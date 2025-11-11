
import React, { useState, useEffect } from 'react';
import { User, Club, LoyaltyProgram } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Users,
  Building,
  MapPin,
  TrendingUp,
  Star,
  Download,
  Filter,
  Eye,
  Award,
  Target,
  BarChart3,
  X, // Added for removing selected clubs
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import ClubIntelligenceDashboard from '../components/clubs/ClubIntelligenceDashboard'; // New import

export default function MAInsights() {
  const [user, setUser] = useState(null);
  const [clubStats, setClubStats] = useState([]);
  const [regionalData, setRegionalData] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');
  const [selectedMetric, setSelectedMetric] = useState('affiliations');
  const [isLoading, setIsLoading] = useState(true);
  const [topPerformers, setTopPerformers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview'); // New state for tabs
  const [selectedClubs, setSelectedClubs] = useState([]); // New state for selected clubs in dashboard
  const [clubSelectionForDashboard, setClubSelectionForDashboard] = useState(''); // New state for single club selection dropdown

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (currentUser.user_type !== 'ma_admin') {
          setIsLoading(false);
          return;
        }

        // Load clubs in MA region
        const regionalClubs = await Club.filter({ ma_region: currentUser.ma_region });

        // Load users affiliated with clubs in this region
        const regionalUsers = await User.filter({ ma_region: currentUser.ma_region });

        // Calculate club affiliation stats
        const clubAffiliationStats = await Promise.all(
          regionalClubs.map(async (club) => {
            const affiliatedUsers = regionalUsers.filter(u => u.home_club_id === club.id);

            // Get XP data for affiliated users
            const loyaltyData = await Promise.all(
              affiliatedUsers.map(async (user) => {
                try {
                  const loyalty = await LoyaltyProgram.filter({ user_id: user.id });
                  return loyalty.length > 0 ? loyalty[0] : null;
                } catch {
                  return null;
                }
              })
            );

            const totalXP = loyaltyData
              .filter(l => l !== null)
              .reduce((sum, l) => sum + (l.total_earned_points || 0), 0);

            return {
              ...club,
              affiliated_count: affiliatedUsers.length,
              total_xp: totalXP,
              avg_xp: affiliatedUsers.length > 0 ? Math.round(totalXP / affiliatedUsers.length) : 0,
              growth_rate: calculateGrowthRate(affiliatedUsers),
              engagement_level: calculateEngagementLevel(loyaltyData.filter(l => l !== null))
            };
          })
        );

        setClubStats(clubAffiliationStats.sort((a, b) => b.affiliated_count - a.affiliated_count));

        // Calculate regional summary
        const totalAffiliations = clubAffiliationStats.reduce((sum, club) => sum + club.affiliated_count, 0);
        const totalUsers = regionalUsers.length;
        const affiliationRate = totalUsers > 0 ? (totalAffiliations / totalUsers) * 100 : 0;

        setRegionalData({
          total_clubs: regionalClubs.length,
          total_users: totalUsers,
          total_affiliations: totalAffiliations,
          affiliation_rate: affiliationRate,
          avg_affiliations_per_club: regionalClubs.length > 0 ? totalAffiliations / regionalClubs.length : 0
        });

        // Get top XP performers by club
        const topClubPerformers = clubAffiliationStats
          .filter(club => club.total_xp > 0)
          .sort((a, b) => b.total_xp - a.total_xp)
          .slice(0, 10);

        setTopPerformers(topClubPerformers);

      } catch (error) {
        console.error('Error loading MA insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedTimeframe]);

  const calculateGrowthRate = (users) => {
    // Simplified growth calculation - in real implementation would use historical data
    const recentAffiliations = users.filter(u => {
      const updateDate = new Date(u.updated_date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return updateDate > threeMonthsAgo;
    });

    return users.length > 0 ? Math.round((recentAffiliations.length / users.length) * 100) : 0;
  };

  const calculateEngagementLevel = (loyaltyProfiles) => {
    if (loyaltyProfiles.length === 0) return 'Low';

    const avgXP = loyaltyProfiles.reduce((sum, p) => sum + (p.total_earned_points || 0), 0) / loyaltyProfiles.length;

    if (avgXP >= 1000) return 'High';
    if (avgXP >= 500) return 'Medium';
    return 'Low';
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Club Name,City,Affiliated Users,Total XP,Average XP,Growth Rate\n" +
      clubStats.map(club =>
        `"${club.name}","${club.location?.city}",${club.affiliated_count},${club.total_xp},${club.avg_xp},${club.growth_rate}%`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${user?.ma_region}_club_affiliations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEngagementColor = (level) => {
    switch(level) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addClubToDashboard = () => {
    if (clubSelectionForDashboard && !selectedClubs.some(club => club.id === clubSelectionForDashboard)) {
      const clubToAdd = clubStats.find(club => club.id === clubSelectionForDashboard);
      if (clubToAdd) {
        setSelectedClubs(prev => [...prev, clubToAdd]);
      }
      setClubSelectionForDashboard(''); // Clear selection after adding
    }
  };

  const removeClubFromDashboard = (clubId) => {
    setSelectedClubs(prev => prev.filter(club => club.id !== clubId));
  };


  const chartData = clubStats.slice(0, 10).map(club => ({
    name: club.name.length > 15 ? club.name.substring(0, 15) + '...' : club.name,
    affiliations: club.affiliated_count,
    xp: club.total_xp
  }));

  const pieData = [
    { name: 'Affiliated', value: regionalData?.total_affiliations || 0, color: '#ED1C24' },
    { name: 'Unaffiliated', value: (regionalData?.total_users || 0) - (regionalData?.total_affiliations || 0), color: '#9CA3AF' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MA insights...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'ma_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-red-600">
              <Eye className="w-8 h-8" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This dashboard is only available to Member Association administrators.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal"> {/* Changed background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white uppercase">MA Club Insights</h1> {/* Changed text color */}
              <p className="text-gray-300 mt-1"> {/* Changed text color */}
                Club affiliation analytics for <span className="font-semibold text-brand-red">{user.ma_region}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32 bg-brand-card-bg text-brand-text-primary border-brand-border"> {/* Added styles */}
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-brand-card-bg text-brand-text-primary border-brand-border"> {/* Added styles */}
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportData} variant="outline" className="bg-brand-button-secondary text-brand-text-primary border-brand-border hover:bg-brand-button-secondary-hover"> {/* Added styles */}
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-brand-card-bg text-brand-text-primary border-b border-brand-border"> {/* Added styles */}
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-sm text-brand-text-primary hover:bg-brand-card-bg-hover" // Added styles
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="clubs"
              className="data-[state=active]:bg-brand-red data-[state=active]:text-white data-[state=active]:shadow-sm text-brand-text-primary hover:bg-brand-card-bg-hover" // Added styles
            >
              Club Intelligence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-brand-card-bg border-brand-border text-brand-text-primary"> {/* Added styles */}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-brand-text-secondary">Total Clubs</p> {/* Changed text color */}
                      <p className="text-3xl font-bold text-brand-text-primary"> {/* Changed text color */}
                        {regionalData?.total_clubs || 0}
                      </p>
                    </div>
                    <Building className="w-8 h-8 text-brand-red" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border text-brand-text-primary"> {/* Added styles */}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-brand-text-secondary">Total Users</p> {/* Changed text color */}
                      <p className="text-3xl font-bold text-brand-text-primary"> {/* Changed text color */}
                        {regionalData?.total_users || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border text-brand-text-primary"> {/* Added styles */}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-brand-text-secondary">Club Affiliations</p> {/* Changed text color */}
                      <p className="text-3xl font-bold text-brand-text-primary"> {/* Changed text color */}
                        {regionalData?.total_affiliations || 0}
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border text-brand-text-primary"> {/* Added styles */}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-brand-text-secondary">Affiliation Rate</p> {/* Changed text color */}
                      <p className="text-3xl font-bold text-brand-text-primary"> {/* Changed text color */}
                        {regionalData?.affiliation_rate?.toFixed(1) || 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-brand-card-bg border-brand-border text-brand-text-primary"> {/* Added styles */}
                <CardHeader>
                  <CardTitle>Top 10 Clubs by Affiliations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" /> {/* Changed stroke color */}
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#9CA3AF" /> {/* Changed stroke color */}
                        <YAxis stroke="#9CA3AF" /> {/* Changed stroke color */}
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#E5E7EB' }} /> {/* Added styles */}
                        <Bar dataKey="affiliations" fill="#ED1C24" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border text-brand-text-primary"> {/* Added styles */}
                <CardHeader>
                  <CardTitle>Regional Affiliation Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#E5E7EB' }} /> {/* Added styles */}
                        <Legend wrapperStyle={{ color: '#E5E7EB' }} /> {/* Added styles */}
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card className="mb-8 bg-brand-card-bg border-brand-border text-brand-text-primary"> {/* Added styles */}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Top Performing Clubs by XP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topPerformers.slice(0, 6).map((club, index) => (
                    <div key={club.id} className="flex items-center gap-3 p-4 bg-brand-background-shade rounded-lg border border-brand-border"> {/* Added styles */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-brand-red'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-brand-text-primary">{club.name}</h4> {/* Changed text color */}
                        <p className="text-sm text-brand-text-secondary">{club.location?.city}</p> {/* Changed text color */}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-text-primary">{club.total_xp.toLocaleString()}</p> {/* Changed text color */}
                        <p className="text-xs text-brand-text-secondary">Total XP</p> {/* Changed text color */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Table */}
            <Card className="bg-brand-card-bg border-brand-border text-brand-text-primary"> {/* Added styles */}
              <CardHeader>
                <CardTitle>Detailed Club Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-brand-border"> {/* Added styles */}
                      <TableHead className="text-brand-text-secondary">Club Name</TableHead> {/* Changed text color */}
                      <TableHead className="text-brand-text-secondary">Location</TableHead> {/* Changed text color */}
                      <TableHead className="text-center text-brand-text-secondary">Affiliated Users</TableHead> {/* Changed text color */}
                      <TableHead className="text-center text-brand-text-secondary">Total XP</TableHead> {/* Changed text color */}
                      <TableHead className="text-center text-brand-text-secondary">Avg XP</TableHead> {/* Changed text color */}
                      <TableHead className="text-center text-brand-text-secondary">Growth Rate</TableHead> {/* Changed text color */}
                      <TableHead className="text-center text-brand-text-secondary">Engagement</TableHead> {/* Changed text color */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clubStats.map((club) => (
                      <TableRow key={club.id} className="border-brand-border hover:bg-brand-background-shade"> {/* Added styles */}
                        <TableCell className="font-medium text-brand-text-primary">{club.name}</TableCell> {/* Changed text color */}
                        <TableCell>
                          <div className="flex items-center gap-1 text-brand-text-secondary"> {/* Changed text color */}
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {club.location?.city}, {club.location?.province}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-brand-background-shade text-brand-text-primary border-brand-border"> {/* Added styles */}
                            {club.affiliated_count}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono text-brand-text-primary"> {/* Changed text color */}
                          {club.total_xp.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center font-mono text-brand-text-primary"> {/* Changed text color */}
                          {club.avg_xp}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={club.growth_rate > 20 ? 'bg-green-100 text-green-800' :
                                         club.growth_rate > 10 ? 'bg-yellow-100 text-yellow-800' :
                                         'bg-gray-100 text-gray-800'}>
                            {club.growth_rate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={getEngagementColor(club.engagement_level)}>
                            {club.engagement_level}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clubs" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-brand-card-bg border-brand-border text-brand-text-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Club Intelligence Hub</CardTitle>
                    <p className="text-brand-text-secondary text-sm mt-1">
                      AI-powered insights and benchmarking for clubs in your region
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-6 items-center">
                    <Select value={clubSelectionForDashboard} onValueChange={setClubSelectionForDashboard}>
                      <SelectTrigger className="w-[300px] bg-brand-background-shade text-brand-text-primary border-brand-border">
                        <SelectValue placeholder="Select a club to view..." />
                      </SelectTrigger>
                      <SelectContent className="bg-brand-card-bg text-brand-text-primary border-brand-border">
                        {clubStats.map((club) => (
                          <SelectItem key={club.id} value={club.id} disabled={selectedClubs.some(sc => sc.id === club.id)}>
                            {club.name} ({club.location?.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addClubToDashboard} disabled={!clubSelectionForDashboard}>Add Club</Button>
                  </div>

                  {selectedClubs.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {selectedClubs.map(club => (
                        <Badge key={club.id} variant="outline" className="text-brand-text-primary bg-brand-background-shade border-brand-border px-3 py-1 flex items-center gap-1">
                          {club.name}
                          <Button variant="ghost" size="icon" className="h-4 w-4 text-brand-text-secondary hover:text-brand-red" onClick={() => removeClubFromDashboard(club.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    {selectedClubs.length > 0 ? (
                      selectedClubs.map(club => (
                        <div key={club.id} className="border border-brand-border rounded-lg p-4 bg-brand-background-shade">
                          <h3 className="font-semibold text-brand-text-primary mb-4">{club.name}</h3>
                          <ClubIntelligenceDashboard clubId={club.id} userRole="ma_admin" />
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-brand-text-secondary py-8">
                        Select clubs above to view their intelligence reports
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
