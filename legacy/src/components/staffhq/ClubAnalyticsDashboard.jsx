import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Building2, 
  DollarSign,
  MapPin,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { Club } from '@/api/entities';
import { ClubMetrics } from '@/api/entities';
import { SurveySubmission } from '@/api/entities';
import { motion } from 'framer-motion';

/**
 * @file ClubAnalyticsDashboard.js
 * @description Comprehensive analytics dashboard for club performance, trends, and insights.
 * Provides detailed analysis of membership, financials, engagement, and regional comparisons.
 */

export default function ClubAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('12months');
  const [clubs, setClubs] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample analytics data
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalClubs: 247,
      totalMembers: 18592,
      avgMembersPerClub: 75.3,
      membershipGrowth: 8.5,
      activeClubs: 234,
      atRiskClubs: 13,
      avgRevenue: 42500,
      revenueGrowth: 12.3
    },
    regionalBreakdown: [
      { region: 'ON', clubs: 89, members: 6720, avgMembers: 75.5, growth: 12.4, revenue: 3.8 },
      { region: 'AB', clubs: 67, members: 5234, avgMembers: 78.1, growth: 8.7, revenue: 2.9 },
      { region: 'BC', clubs: 52, members: 3890, avgMembers: 74.8, growth: 6.2, revenue: 2.1 },
      { region: 'SK', clubs: 23, members: 1890, avgMembers: 82.2, growth: -2.1, revenue: 0.8 },
      { region: 'MB', clubs: 16, members: 858, avgMembers: 53.6, growth: 15.3, revenue: 0.4 }
    ],
    membershipTrends: [
      { month: 'Jan', members: 17200, newMembers: 234, retention: 89.2 },
      { month: 'Feb', members: 17350, newMembers: 189, retention: 90.1 },
      { month: 'Mar', members: 17580, newMembers: 278, retention: 88.9 },
      { month: 'Apr', members: 17890, newMembers: 345, retention: 91.2 },
      { month: 'May', members: 18120, newMembers: 267, retention: 89.8 },
      { month: 'Jun', members: 18290, newMembers: 198, retention: 90.5 },
      { month: 'Jul', members: 18380, newMembers: 156, retention: 92.1 },
      { month: 'Aug', members: 18450, newMembers: 123, retention: 91.8 },
      { month: 'Sep', members: 18520, newMembers: 189, retention: 90.9 },
      { month: 'Oct', members: 18592, newMembers: 234, retention: 89.7 }
    ],
    performanceMetrics: [
      { club: 'Calgary Curling Club', members: 284, growth: 18.2, revenue: 89500, satisfaction: 4.6, risk: 'low' },
      { club: 'Thunder Bay CC', members: 156, growth: 12.4, revenue: 45600, satisfaction: 4.3, risk: 'low' },
      { club: 'Vancouver Curling Club', members: 198, growth: -2.1, revenue: 52300, satisfaction: 3.8, risk: 'medium' },
      { club: 'Halifax Mayflower', members: 89, growth: -8.5, revenue: 28900, satisfaction: 3.2, risk: 'high' },
      { club: 'Winnipeg Granite CC', members: 123, growth: 6.7, revenue: 38400, satisfaction: 4.1, risk: 'low' }
    ],
    engagementMetrics: {
      avgSatisfactionScore: 4.2,
      volunteerParticipation: 67.8,
      eventAttendance: 72.3,
      programDiversity: 8.4,
      digitalEngagement: 45.2
    }
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedRegion, selectedTimeframe]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Load real data
      const clubsData = await Club.list();
      const metricsData = await ClubMetrics.list();
      const surveysData = await SurveySubmission.list();

      setClubs(clubsData);
      setMetrics(metricsData);

      // Process and enhance analytics with real data
      if (clubsData.length > 0) {
        enhanceAnalyticsWithRealData(clubsData, metricsData, surveysData);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceAnalyticsWithRealData = (clubs, metrics, surveys) => {
    // Calculate real totals
    const totalClubs = clubs.length;
    const totalMembers = clubs.reduce((sum, club) => sum + (club.membership_count || 0), 0);
    const avgMembersPerClub = totalMembers / totalClubs;

    // Update analytics with real data
    setAnalyticsData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        totalClubs,
        totalMembers,
        avgMembersPerClub: parseFloat(avgMembersPerClub.toFixed(1))
      }
    }));
  };

  const getMetricTrend = (value, isPositive = true) => {
    if (value === 0) return { icon: Minus, color: 'text-gray-400' };
    if (value > 0 && isPositive) return { icon: TrendingUp, color: 'text-green-500' };
    if (value > 0 && !isPositive) return { icon: TrendingDown, color: 'text-red-500' };
    if (value < 0 && isPositive) return { icon: TrendingDown, color: 'text-red-500' };
    return { icon: TrendingUp, color: 'text-green-500' };
  };

  const getRiskBadge = (risk) => {
    const riskConfig = {
      low: { color: 'bg-green-100 text-green-800', text: 'Low Risk' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium Risk' },
      high: { color: 'bg-red-100 text-red-800', text: 'High Risk' }
    };
    const config = riskConfig[risk] || riskConfig.low;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const filteredClubs = analyticsData.performanceMetrics.filter(club =>
    club.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-brand-card-bg rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-brand-card-bg rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-brand-card-bg rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Club Analytics Dashboard</h2>
          <p className="text-brand-text-secondary">Comprehensive insights into club performance and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="ON">Ontario</SelectItem>
              <SelectItem value="AB">Alberta</SelectItem>
              <SelectItem value="BC">British Columbia</SelectItem>
              <SelectItem value="SK">Saskatchewan</SelectItem>
              <SelectItem value="MB">Manitoba</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="2years">Last 2 Years</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary">Total Clubs</p>
                  <p className="text-2xl font-bold text-brand-text-primary">{analyticsData.overview.totalClubs}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+12 this year</span>
                  </div>
                </div>
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary">Total Members</p>
                  <p className="text-2xl font-bold text-brand-text-primary">{analyticsData.overview.totalMembers.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+{analyticsData.overview.membershipGrowth}%</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary">Avg Revenue</p>
                  <p className="text-2xl font-bold text-brand-text-primary">${analyticsData.overview.avgRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">+{analyticsData.overview.revenueGrowth}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-text-secondary">At Risk Clubs</p>
                  <p className="text-2xl font-bold text-brand-text-primary">{analyticsData.overview.atRiskClubs}</p>
                  <div className="flex items-center mt-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-500">Need attention</span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Membership Growth Chart */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Membership Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="w-full">
                    <div className="flex justify-between items-end h-32 space-x-2">
                      {analyticsData.membershipTrends.slice(-6).map((month, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="bg-brand-red rounded-t w-full"
                            style={{ 
                              height: `${(month.members / Math.max(...analyticsData.membershipTrends.map(m => m.members))) * 100}%`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <span className="text-xs text-brand-text-secondary mt-2">{month.month}</span>
                          <span className="text-xs font-medium text-brand-text-primary">{(month.members / 1000).toFixed(1)}k</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.regionalBreakdown.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-brand-text-primary w-8">{region.region}</span>
                        <div className="flex-1">
                          <Progress 
                            value={(region.clubs / analyticsData.overview.totalClubs) * 100} 
                            className="w-24 h-2"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-brand-text-primary">{region.clubs} clubs</p>
                        <p className="text-xs text-brand-text-secondary">{region.members.toLocaleString()} members</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Clubs */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Top Performing Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performanceMetrics.slice(0, 5).map((club, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                      <div>
                        <p className="font-medium text-brand-text-primary">{club.club}</p>
                        <p className="text-sm text-brand-text-secondary">{club.members} members</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          {club.growth > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${club.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {club.growth > 0 ? '+' : ''}{club.growth}%
                          </span>
                        </div>
                        {getRiskBadge(club.risk)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Score */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Overall Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-text-primary mb-2">8.2/10</div>
                    <p className="text-brand-text-secondary">Excellent Health</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Membership Growth</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Financial Health</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Compliance</span>
                        <span>96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="membership" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Membership Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-brand-text-primary">{analyticsData.overview.avgMembersPerClub}</p>
                      <p className="text-sm text-brand-text-secondary">Avg per Club</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-brand-text-primary">89.2%</p>
                      <p className="text-sm text-brand-text-secondary">Retention Rate</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-brand-text-primary mb-3">New Member Acquisition</h4>
                    <div className="space-y-2">
                      {analyticsData.membershipTrends.slice(-3).map((month, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-brand-text-secondary">{month.month}</span>
                          <span className="font-medium text-brand-text-primary">+{month.newMembers}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { age: '18-30', percentage: 18, color: 'bg-blue-500' },
                    { age: '31-45', percentage: 28, color: 'bg-green-500' },
                    { age: '46-60', percentage: 35, color: 'bg-yellow-500' },
                    { age: '60+', percentage: 19, color: 'bg-purple-500' }
                  ].map((demo, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{demo.age} years</span>
                        <span>{demo.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${demo.color} h-2 rounded-full`}
                          style={{ width: `${demo.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Club Performance Analysis</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <Input
                    placeholder="Search clubs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-border">
                      <th className="text-left py-3 px-4 font-medium text-brand-text-secondary">Club Name</th>
                      <th className="text-left py-3 px-4 font-medium text-brand-text-secondary">Members</th>
                      <th className="text-left py-3 px-4 font-medium text-brand-text-secondary">Growth</th>
                      <th className="text-left py-3 px-4 font-medium text-brand-text-secondary">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-brand-text-secondary">Satisfaction</th>
                      <th className="text-left py-3 px-4 font-medium text-brand-text-secondary">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClubs.map((club, index) => (
                      <tr key={index} className="border-b border-brand-border hover:bg-brand-charcoal/50">
                        <td className="py-3 px-4 font-medium text-brand-text-primary">{club.club}</td>
                        <td className="py-3 px-4 text-brand-text-secondary">{club.members}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {club.growth > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className={club.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                              {club.growth > 0 ? '+' : ''}{club.growth}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-brand-text-secondary">${club.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-brand-text-primary mr-2">{club.satisfaction}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div 
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.floor(club.satisfaction) ? 'bg-yellow-400' : 'bg-gray-300'} rounded-full mr-1`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{getRiskBadge(club.risk)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional tabs would continue with similar detailed content */}
        <TabsContent value="financial" className="mt-6">
          <div className="text-center py-12 text-brand-text-secondary">
            <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Financial Analytics</h3>
            <p>Detailed financial performance metrics coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="regional" className="mt-6">
          <div className="text-center py-12 text-brand-text-secondary">
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Regional Analysis</h3>
            <p>Geographic performance insights coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <div className="text-center py-12 text-brand-text-secondary">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Engagement Metrics</h3>
            <p>Member engagement analysis coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}