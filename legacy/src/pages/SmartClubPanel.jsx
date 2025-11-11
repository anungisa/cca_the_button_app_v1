
import React, { useState, useEffect } from 'react';
import { User, ClubMetrics, Club } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Users, 
  Award, 
  AlertCircle,
  Download,
  Calendar,
  Target,
  Shield,
  Building,
  Zap,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useClubMetrics } from '../components/hooks/useKnowledgeStats'; // Updated import path
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const COLORS = ['#ED1C24', '#82ca9d', '#8884d8', '#ffc658', '#ff7300'];

export default function SmartClubPanel() {
  const [user, setUser] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('12months');
  const [regionalComparison, setRegionalComparison] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { metrics, comparison, isLoading: metricsLoading } = useClubMetrics(user?.club_id, selectedTimeframe);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);

        if (userData.user_type === 'club_admin' || userData.user_type === 'ma_admin') {
          // Load regional comparison data
          const regionalMetrics = await ClubMetrics.filter({ ma_region: userData.ma_region }, '-engagement_metrics.curl_points_earned', 10);
          setRegionalComparison(regionalMetrics);
        }

      } catch (error) {
        console.error('Error loading club panel data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const generateMockHistoricalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      members: 180 + Math.floor(Math.random() * 40) + (index * 2),
      volunteerHours: 50 + Math.floor(Math.random() * 30),
      curlPoints: 1200 + Math.floor(Math.random() * 500),
      knowledgeCompleted: 5 + Math.floor(Math.random() * 10)
    }));
  };

  const generateComplianceData = () => [
    { name: 'Safe Sport Current', value: 85, color: '#10B981' },
    { name: 'Safe Sport Expired', value: 12, color: '#F59E0B' },
    { name: 'Not Required', value: 3, color: '#6B7280' }
  ];

  const getPerformanceIndicator = (current, comparison, label) => {
    if (!comparison) return null;
    
    const isHigher = current > comparison;
    const difference = Math.abs(current - comparison);
    const percentage = ((difference / comparison) * 100).toFixed(1);
    
    return (
      <div className={`flex items-center gap-1 text-sm ${isHigher ? 'text-green-600' : 'text-red-600'}`}>
        {isHigher ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        <span>{percentage}% vs regional avg</span>
      </div>
    );
  };

  if (isLoading || metricsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Club Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.user_type !== 'club_admin' && user.user_type !== 'ma_admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-charcoal mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              This dashboard is only available to Club Administrators and MA Administrators.
            </p>
            <Button asChild>
              <Link to={createPageUrl("Home")}>Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const historicalData = generateMockHistoricalData();
  const complianceData = generateComplianceData();
  const currentMetrics = metrics || {
    membership_stats: { total_members: 220, new_members: 25, youth_members: 45 },
    engagement_metrics: { volunteer_hours: 680, curl_points_earned: 15400, knowledge_articles_completed: 89 },
    compliance_status: { safe_sport_current: 85, safe_sport_expired: 12 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-brand-charcoal uppercase">Smart Club Panel</h1>
              <p className="text-gray-600 mt-1">Business intelligence for club sustainability and growth</p>
            </div>
            <div className="flex gap-4">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <div className="text-2xl font-bold text-brand-charcoal">
                    {currentMetrics.membership_stats.total_members}
                  </div>
                  {getPerformanceIndicator(
                    currentMetrics.membership_stats.total_members, 
                    comparison?.avgMembers, 
                    'members'
                  )}
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Volunteer Hours</p>
                  <div className="text-2xl font-bold text-brand-charcoal">
                    {currentMetrics.engagement_metrics.volunteer_hours}
                  </div>
                  {getPerformanceIndicator(
                    currentMetrics.engagement_metrics.volunteer_hours, 
                    comparison?.avgVolunteerHours, 
                    'hours'
                  )}
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CurlPoints Earned</p>
                  <div className="text-2xl font-bold text-brand-charcoal">
                    {currentMetrics.engagement_metrics.curl_points_earned.toLocaleString()}
                  </div>
                  {getPerformanceIndicator(
                    currentMetrics.engagement_metrics.curl_points_earned, 
                    comparison?.avgCurlPoints, 
                    'points'
                  )}
                </div>
                <Zap className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Knowledge Actions</p>
                  <div className="text-2xl font-bold text-brand-charcoal">
                    {currentMetrics.engagement_metrics.knowledge_articles_completed}
                  </div>
                  {getPerformanceIndicator(
                    currentMetrics.engagement_metrics.knowledge_articles_completed, 
                    comparison?.avgKnowledgeCompleted, 
                    'completed'
                  )}
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Historical Trends */}
          <Card>
            <CardHeader>
              <CardTitle>12-Month Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }} 
                      labelStyle={{ color: '#fff' }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="members" stroke="#ED1C24" strokeWidth={2} name="Members" />
                    <Line type="monotone" dataKey="curlPoints" stroke="#82ca9d" strokeWidth={2} name="CurlPoints" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Safe Sport Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>Safe Sport Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Regional Club Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={regionalComparison.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="club_name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }} 
                    labelStyle={{ color: '#fff' }} 
                  />
                  <Legend />
                  <Bar dataKey="engagement_metrics.curl_points_earned" fill="#ED1C24" name="CurlPoints" />
                  <Bar dataKey="membership_stats.total_members" fill="#82ca9d" name="Members" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Compliance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Compliance & Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-900">Safe Sport Renewals Due</h4>
                    <p className="text-sm text-red-700">{currentMetrics.compliance_status.safe_sport_expired} members need renewal</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    View List
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-amber-900">Annual Report Due</h4>
                    <p className="text-sm text-amber-700">Submit your club's annual report to maintain standing</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Start Report
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">Board Training Available</h4>
                    <p className="text-sm text-blue-700">New governance training modules now available</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={createPageUrl("KnowledgeCentreHub")}>
                      Access Training
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-green-900">Youth Program Expansion</h4>
                    <p className="text-sm text-green-700">45 youth members - consider adding programs</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    +15% vs last year
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-purple-900">Volunteer Recognition</h4>
                    <p className="text-sm text-purple-700">680 hours logged - celebrate your volunteers!</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Plan Event
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-indigo-900">Grant Opportunities</h4>
                    <p className="text-sm text-indigo-700">Your club qualifies for facility improvement grants</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
