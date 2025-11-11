
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  PieChart,
  Activity,
  Star,
  Trophy
} from 'lucide-react';
import { User } from '@/api/entities';
import { Club } = from '@/api/entities';
import { usePermissions } from '../hooks/usePermissions';

const MetricCard = ({ title, value, change, icon: Icon, trend = 'neutral' }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-brand-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
          {change && (
            <p className={`text-sm ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-brand-text-secondary'}`}>
              {change}
            </p>
          )}
        </div>
        <Icon className="w-8 h-8 text-brand-red" />
      </div>
    </CardContent>
  </Card>
);

const ChartPlaceholder = ({ title, type = 'bar' }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {type === 'pie' ? <PieChart className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-brand-charcoal/30 rounded-lg flex items-center justify-center">
        <p className="text-brand-text-secondary">Chart visualization would appear here</p>
      </div>
    </CardContent>
  </Card>
);

export default function SelfServeAnalytics() {
  const [user, setUser] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const { permissions } = usePermissions();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      // Simulate analytics data based on user role
      const mockData = generateMockAnalytics(userData, timeRange);
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = (user, period) => {
    // Generate different analytics based on user type and permissions
    if (user?.user_type === 'ma_admin' || permissions.canViewMADashboard) {
      return {
        type: 'ma_analytics',
        overview: {
          totalClubs: 45,
          totalMembers: 1250,
          activeClubs: 42,
          growthRate: '+5.2%'
        },
        clubs: [
          { name: 'Calgary Curling Club', members: 156, growth: '+12%', status: 'active' },
          { name: 'Edmonton Granite Club', members: 134, growth: '+8%', status: 'active' },
          { name: 'Red Deer Curling Centre', members: 89, growth: '-2%', status: 'active' }
        ],
        events: {
          upcoming: 12,
          thisMonth: 8,
          participation: 85
        }
      };
    } else if (user?.home_club_id || permissions.canAccessBusinessHub) {
      return {
        type: 'club_analytics',
        overview: {
          totalMembers: 156,
          activeMembers: 142,
          newMembers: 8,
          retention: '91%'
        },
        membership: {
          adult: 89,
          youth: 34,
          senior: 33,
          growth: '+12%'
        },
        programs: [
          { name: 'Learn to Curl', participants: 24, satisfaction: 4.8 },
          { name: 'Competitive League', participants: 45, satisfaction: 4.6 },
          { name: 'Youth Program', participants: 34, satisfaction: 4.9 }
        ]
      };
    } else {
      return {
        type: 'personal_analytics',
        overview: {
          eventsAttended: 12,
          xpEarned: 450,
          badgesEarned: 6,
          streak: 5
        },
        activity: {
          volunteering: 8,
          competitions: 4,
          social: 15,
          learning: 7
        }
      };
    }
  };

  const exportData = () => {
    // Implementation would export current analytics data
    console.log('Exporting analytics data...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No Analytics Available</h3>
          <p className="text-brand-text-secondary">Analytics data will appear here once you have sufficient activity.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Analytics Dashboard</h2>
          <p className="text-brand-text-secondary">
            {analyticsData.type === 'ma_analytics' && 'Member Association Overview'}
            {analyticsData.type === 'club_analytics' && 'Club Performance Metrics'}
            {analyticsData.type === 'personal_analytics' && 'Your Activity Summary'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* MA Admin Analytics */}
      {analyticsData.type === 'ma_analytics' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Total Clubs" 
              value={analyticsData.overview.totalClubs}
              icon={Users}
            />
            <MetricCard 
              title="Total Members" 
              value={analyticsData.overview.totalMembers.toLocaleString()}
              change={analyticsData.overview.growthRate}
              trend="up"
              icon={Users}
            />
            <MetricCard 
              title="Active Clubs" 
              value={analyticsData.overview.activeClubs}
              icon={Activity}
            />
            <MetricCard 
              title="Growth Rate" 
              value={analyticsData.overview.growthRate}
              trend="up"
              icon={TrendingUp}
            />
          </div>

          <Tabs defaultValue="clubs" className="w-full">
            <TabsList className="bg-brand-card-bg border-brand-border">
              <TabsTrigger value="clubs">Club Performance</TabsTrigger>
              <TabsTrigger value="events">Event Analytics</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="clubs" className="space-y-4">
              <ChartPlaceholder title="Membership Growth by Club" />
              
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Top Performing Clubs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.clubs.map((club, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                        <div>
                          <h4 className="font-medium text-brand-text-primary">{club.name}</h4>
                          <p className="text-sm text-brand-text-secondary">{club.members} members</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={club.growth.startsWith('+') ? 'default' : 'secondary'}>
                            {club.growth}
                          </Badge>
                          <Badge variant="outline">{club.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <MetricCard 
                  title="Upcoming Events" 
                  value={analyticsData.events.upcoming}
                  icon={Calendar}
                />
                <MetricCard 
                  title="Events This Month" 
                  value={analyticsData.events.thisMonth}
                  icon={Calendar}
                />
                <MetricCard 
                  title="Avg Participation" 
                  value={`${analyticsData.events.participation}%`}
                  icon={Users}
                />
              </div>
              <ChartPlaceholder title="Event Participation Trends" />
            </TabsContent>

            <TabsContent value="trends">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartPlaceholder title="Membership Trends" />
                <ChartPlaceholder title="Regional Distribution" type="pie" />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Club Analytics */}
      {analyticsData.type === 'club_analytics' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Total Members" 
              value={analyticsData.overview.totalMembers}
              icon={Users}
            />
            <MetricCard 
              title="Active Members" 
              value={analyticsData.overview.activeMembers}
              icon={Activity}
            />
            <MetricCard 
              title="New Members" 
              value={analyticsData.overview.newMembers}
              change={analyticsData.membership.growth}
              trend="up"
              icon={TrendingUp}
            />
            <MetricCard 
              title="Retention Rate" 
              value={analyticsData.overview.retention}
              icon={Users}
            />
          </div>

          <Tabs defaultValue="membership" className="w-full">
            <TabsList className="bg-brand-card-bg border-brand-border">
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            <TabsContent value="membership" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartPlaceholder title="Membership Demographics" type="pie" />
                <ChartPlaceholder title="Monthly Growth" />
              </div>
            </TabsContent>

            <TabsContent value="programs" className="space-y-4">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Program Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.programs.map((program, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                        <div>
                          <h4 className="font-medium text-brand-text-primary">{program.name}</h4>
                          <p className="text-sm text-brand-text-secondary">{program.participants} participants</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-brand-text-primary">{program.satisfaction}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <ChartPlaceholder title="Revenue Trends" />
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Personal Analytics */}
      {analyticsData.type === 'personal_analytics' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Events Attended" 
              value={analyticsData.overview.eventsAttended}
              icon={Calendar}
            />
            <MetricCard 
              title="XP Earned" 
              value={analyticsData.overview.xpEarned}
              icon={TrendingUp}
            />
            <MetricCard 
              title="Badges Earned" 
              value={analyticsData.overview.badgesEarned}
              icon={Trophy}
            />
            <MetricCard 
              title="Current Streak" 
              value={`${analyticsData.overview.streak} days`}
              icon={Activity}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="Activity Breakdown" type="pie" />
            <ChartPlaceholder title="XP Progress Over Time" />
          </div>
        </>
      )}
    </div>
  );
}
