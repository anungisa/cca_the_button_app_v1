import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Zap, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';

const SponsorCampaignDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedSponsor, setSelectedSponsor] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const mockCampaigns = [
    {
      id: 1,
      name: 'BalancePlus Winter Equipment Quest',
      sponsor: 'BalancePlus',
      type: 'Equipment Showcase',
      status: 'active',
      start_date: '2024-01-01',
      end_date: '2024-02-28',
      impressions: 15420,
      clicks: 1892,
      completions: 1156,
      xp_distributed: 11560,
      engagement_rate: 12.3,
      completion_rate: 61.1
    },
    {
      id: 2,
      name: 'Goldline Stone Technology Challenge',
      sponsor: 'Goldline',
      type: 'Educational Quest',
      status: 'active',
      start_date: '2024-01-15',
      end_date: '2024-03-15',
      impressions: 8750,
      clicks: 1225,
      completions: 892,
      xp_distributed: 8920,
      engagement_rate: 14.0,
      completion_rate: 72.8
    },
    {
      id: 3,
      name: 'Asham Shoe Innovation Series',
      sponsor: 'Asham',
      type: 'Product Demo',
      status: 'completed',
      start_date: '2023-12-01',
      end_date: '2024-01-31',
      impressions: 4200,
      clicks: 567,
      completions: 389,
      xp_distributed: 3890,
      engagement_rate: 13.5,
      completion_rate: 68.6
    }
  ];

  // Mock performance data for charts
  const performanceData = [
    { date: '2024-01-01', impressions: 450, completions: 89, xp: 890 },
    { date: '2024-01-02', impressions: 520, completions: 102, xp: 1020 },
    { date: '2024-01-03', impressions: 380, completions: 78, xp: 780 },
    { date: '2024-01-04', impressions: 640, completions: 125, xp: 1250 },
    { date: '2024-01-05', impressions: 590, completions: 143, xp: 1430 },
    { date: '2024-01-06', impressions: 480, completions: 98, xp: 980 },
    { date: '2024-01-07', impressions: 720, completions: 156, xp: 1560 }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setIsLoading(false);
    }, 1000);
  }, [selectedTimeframe, selectedSponsor]);

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedSponsor === 'all' || campaign.sponsor === selectedSponsor
  );

  const totalMetrics = filteredCampaigns.reduce((acc, campaign) => ({
    impressions: acc.impressions + campaign.impressions,
    clicks: acc.clicks + campaign.clicks,
    completions: acc.completions + campaign.completions,
    xp_distributed: acc.xp_distributed + campaign.xp_distributed
  }), { impressions: 0, clicks: 0, completions: 0, xp_distributed: 0 });

  const avgEngagementRate = filteredCampaigns.length > 0 
    ? (filteredCampaigns.reduce((acc, c) => acc + c.engagement_rate, 0) / filteredCampaigns.length).toFixed(1)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-brand-card-bg rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-brand-card-bg rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-brand-card-bg rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Campaign Performance</h2>
          <p className="text-brand-text-secondary">Monitor sponsor campaign engagement and XP distribution</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedSponsor} onValueChange={setSelectedSponsor}>
            <SelectTrigger className="w-40 bg-brand-card-bg border-brand-border">
              <SelectValue placeholder="All Sponsors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sponsors</SelectItem>
              <SelectItem value="BalancePlus">BalancePlus</SelectItem>
              <SelectItem value="Goldline">Goldline</SelectItem>
              <SelectItem value="Asham">Asham</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32 bg-brand-card-bg border-brand-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Impressions</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {totalMetrics.impressions.toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Campaign Clicks</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {totalMetrics.clicks.toLocaleString()}
                </p>
              </div>
              <MousePointer className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Completions</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {totalMetrics.completions.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">XP Distributed</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {totalMetrics.xp_distributed.toLocaleString()}
                </p>
              </div>
              <Zap className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Campaign Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="xp" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign List */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 border border-brand-border rounded-lg bg-brand-charcoal/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-brand-text-primary">{campaign.name}</h4>
                      <Badge className={campaign.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                        {campaign.status}
                      </Badge>
                      <Badge variant="outline" className="border-brand-border text-brand-text-secondary">
                        {campaign.sponsor}
                      </Badge>
                    </div>
                    <p className="text-sm text-brand-text-secondary mb-2">{campaign.type}</p>
                    <p className="text-xs text-brand-text-secondary">
                      {campaign.start_date} - {campaign.end_date}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">
                        {campaign.impressions.toLocaleString()}
                      </p>
                      <p className="text-xs text-brand-text-secondary">Impressions</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">
                        {campaign.completions.toLocaleString()}
                      </p>
                      <p className="text-xs text-brand-text-secondary">Completions</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">
                        {campaign.engagement_rate}%
                      </p>
                      <p className="text-xs text-brand-text-secondary">Engagement</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-text-primary">
                        {campaign.xp_distributed.toLocaleString()}
                      </p>
                      <p className="text-xs text-brand-text-secondary">XP Given</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorCampaignDashboard;