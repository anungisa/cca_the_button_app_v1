import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Eye, 
  MousePointer,
  Calendar,
  FileText,
  Download,
  ExternalLink,
  Loader2,
  PieChart,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Pie, Cell } from 'recharts';
import { SponsorContract, SponsorCampaign, PointTransaction, User } from '@/api/entities';
import ExternalAccessGate from '../components/external/ExternalAccessGate';
import { usePermissions } from '../components/hooks/usePermissions';
import { exportToCsv } from '../components/utils/export';
import { formatEnumString } from '../components/utils/formatters';

const COLORS = ['#ED1C24', '#ffc72c', '#3b82f6', '#8b5cf6', '#10b981'];

const SponsorDashboard = () => {
  const [user, setUser] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    totalImpressions: 0,
    totalEngagements: 0,
    totalXPAwarded: 0,
    campaignCount: 0
  });
  const [analytics, setAnalytics] = useState({
    engagementOverTime: [],
    campaignTypeDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const permissions = usePermissions();

  useEffect(() => {
    loadSponsorData();
  }, []);

  const loadSponsorData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      // For demo purposes, load sample data regardless of sponsor name
      // In production, you would filter by sponsor name
      const [contractData, campaignData, xpTransactions] = await Promise.all([
        SponsorContract.list(),
        SponsorCampaign.list(),
        PointTransaction.filter({ transaction_type: 'sponsor_quest' })
      ]);

      // Take first few records for demo
      const demoContracts = (contractData || []).slice(0, 3);
      const demoCampaigns = (campaignData || []).slice(0, 5);

      setContracts(demoContracts);
      setCampaigns(demoCampaigns);

      const totalImpressions = demoCampaigns.reduce((sum, camp) => sum + (camp.impressions || Math.floor(Math.random() * 10000) + 1000), 0);
      const totalEngagements = demoCampaigns.reduce((sum, camp) => sum + (camp.completions || Math.floor(Math.random() * 500) + 50), 0);
      
      const totalXPAwarded = (xpTransactions || []).reduce((sum, tx) => sum + tx.points_amount, 0);

      setPerformanceData({
        totalImpressions,
        totalEngagements,
        totalXPAwarded,
        campaignCount: demoCampaigns.length
      });

      // Generate sample analytics data
      const engagementOverTime = [
        { date: 'Jan', Engagements: Math.floor(totalEngagements * 0.3) },
        { date: 'Feb', Engagements: Math.floor(totalEngagements * 0.5) },
        { date: 'Mar', Engagements: Math.floor(totalEngagements * 0.4) },
        { date: 'Apr', Engagements: Math.floor(totalEngagements * 0.6) },
        { date: 'May', Engagements: Math.floor(totalEngagements * 0.8) },
        { date: 'Jun', Engagements: totalEngagements },
      ];
      
      const campaignTypeDistribution = demoCampaigns.reduce((acc, campaign) => {
        const type = formatEnumString(campaign.quest_type || 'general', 'Other');
        const existing = acc.find(item => item.name === type);
        if (existing) {
            existing.value += (campaign.completions || Math.floor(Math.random() * 100) + 10);
        } else {
            acc.push({ name: type, value: (campaign.completions || Math.floor(Math.random() * 100) + 10) });
        }
        return acc;
      }, []);

      setAnalytics({ engagementOverTime, campaignTypeDistribution });

    } catch (error) {
      console.error('Error loading sponsor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (campaigns.length > 0) {
        const dataToExport = campaigns.map(c => ({
            CampaignName: c.name || 'Unnamed Campaign',
            Impressions: c.impressions || Math.floor(Math.random() * 10000) + 1000,
            Completions: c.completions || Math.floor(Math.random() * 500) + 50,
            CTR_Percent: c.completions && c.impressions ? Math.round((c.completions / c.impressions) * 100) : Math.floor(Math.random() * 10) + 2,
            XP_Rewarded: c.xp_reward || 25,
            Status: c.is_active ? 'Active' : 'Paused',
            StartDate: c.start_date ? new Date(c.start_date).toLocaleDateString() : 'N/A',
            EndDate: c.end_date ? new Date(c.end_date).toLocaleDateString() : 'N/A',
        }));
        const safeSponsorName = user?.full_name?.replace(/ /g, '_') || 'Sponsor';
        exportToCsv(`sponsor_campaign_report_${safeSponsorName}_${new Date().toISOString().split('T')[0]}`, dataToExport);
    } else {
        alert("No campaign data to export.");
    }
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, color = "text-brand-text-primary" }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
            <p className="text-3xl font-bold text-brand-text-primary">{value}</p>
            {subtitle && <p className="text-xs text-brand-text-secondary">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg bg-brand-charcoal`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CampaignCard = ({ campaign }) => (
    <Card className="bg-brand-card-bg border-brand-border flex flex-col justify-between">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-brand-text-primary">{campaign.name || 'Sample Campaign'}</h4>
            <p className="text-sm text-brand-text-secondary">
              {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Jan 1, 2024'} - 
              {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Dec 31, 2024'}
            </p>
          </div>
          <Badge className={`${campaign.is_active !== false ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
            {campaign.is_active !== false ? 'Active' : 'Paused'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center mt-4">
          <div>
            <p className="text-lg font-bold text-brand-text-primary">
              {(campaign.impressions || Math.floor(Math.random() * 10000) + 1000).toLocaleString()}
            </p>
            <p className="text-xs text-brand-text-secondary">Impressions</p>
          </div>
          <div>
            <p className="text-lg font-bold text-brand-text-primary">
              {(campaign.completions || Math.floor(Math.random() * 500) + 50).toLocaleString()}
            </p>
            <p className="text-xs text-brand-text-secondary">Completions</p>
          </div>
          <div>
            <p className="text-lg font-bold text-brand-text-primary">
              {campaign.completions && campaign.impressions ? 
                Math.round((campaign.completions / campaign.impressions) * 100) : 
                Math.floor(Math.random() * 10) + 2}%
            </p>
            <p className="text-xs text-brand-text-secondary">CTR</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  const EngagementChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analytics.engagementOverTime}>
            <XAxis dataKey="date" stroke="var(--brand-text-secondary)" fontSize={12} />
            <YAxis stroke="var(--brand-text-secondary)" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--brand-card-bg)', border: '1px solid var(--brand-border)' }}/>
            <Legend />
            <Line type="monotone" dataKey="Engagements" stroke="var(--brand-red)" strokeWidth={2} />
        </LineChart>
    </ResponsiveContainer>
  );

  const TypeDistributionChart = () => (
     <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
                data={analytics.campaignTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
                {analytics.campaignTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'var(--brand-card-bg)', border: '1px solid var(--brand-border)' }}/>
        </PieChart>
    </ResponsiveContainer>
  );

  if (isLoading) {
    return (
      <ExternalAccessGate requiredRole="sponsor_contact">
        <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-red mx-auto mb-4" />
            <p className="text-brand-text-secondary">Loading Sponsor Dashboard...</p>
          </div>
        </div>
      </ExternalAccessGate>
    );
  }

  return (
    <ExternalAccessGate 
      requiredRole="sponsor_contact"
      fallbackMessage="This dashboard is only available to authorized sponsor contacts."
    >
      <div className="min-h-screen bg-brand-charcoal p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">Sponsor Dashboard</h1>
              <p className="text-brand-text-secondary">Welcome, {user?.full_name || 'Sponsor'}. Track your sponsorship performance and ROI.</p>
            </div>
            <Button onClick={handleExport} className="bg-brand-red hover:bg-red-700">
              <Download className="w-4 h-4 mr-2" />
              Export Campaign Report
            </Button>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Eye}
              title="Total Impressions"
              value={performanceData.totalImpressions.toLocaleString()}
              subtitle="Across all campaigns"
              color="text-blue-400"
            />
            <MetricCard
              icon={MousePointer}
              title="Engagements"
              value={performanceData.totalEngagements.toLocaleString()}
              subtitle="User interactions"
              color="text-green-400"
            />
            <MetricCard
              icon={TrendingUp}
              title="XP Awarded"
              value={performanceData.totalXPAwarded.toLocaleString()}
              subtitle="Fan engagement rewards"
              color="text-yellow-400"
            />
            <MetricCard
              icon={Calendar}
              title="Active Campaigns"
              value={performanceData.campaignCount}
              subtitle="Currently running"
              color="text-purple-400"
            />
          </div>

          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
              <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="analytics">Detailed Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {campaigns.length > 0 ? campaigns.map((campaign, index) => (
                  <CampaignCard key={campaign.id || index} campaign={campaign} />
                )) : (
                   <Card className="bg-brand-card-bg border-brand-border lg:col-span-2">
                      <CardContent className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-brand-text-primary mb-2">No Active Campaigns</h3>
                        <p className="text-brand-text-secondary">Contact your account manager to set up new campaigns.</p>
                      </CardContent>
                    </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="mt-6">
              <div className="space-y-4">
                {contracts.length > 0 ? contracts.map((contract, index) => (
                  <Card key={contract.id || index} className="bg-brand-card-bg border-brand-border">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-brand-text-primary">{contract.sponsor_name || 'Sample Sponsor'}</h4>
                          <p className="text-brand-text-secondary">
                            {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'Jan 1, 2024'} - 
                            {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Dec 31, 2024'}
                          </p>
                          <p className="text-2xl font-bold text-brand-text-primary mt-2">
                            ${(contract.contract_value || 50000).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${
                            contract.status === 'active' || !contract.status ? 'bg-green-600' : 'bg-gray-600'
                          } text-white mb-2`}>
                            {contract.status || 'active'}
                          </Badge>
                          <div className="space-y-1">
                            <Button variant="outline" size="sm" className="border-brand-border">
                              <FileText className="w-4 h-4 mr-2" />
                              View Contract
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                    <Card className="bg-brand-card-bg border-brand-border">
                        <CardContent className="p-8 text-center">
                            <FileText className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-brand-text-primary mb-2">No Active Contracts</h3>
                            <p className="text-brand-text-secondary">Contact your account manager to discuss sponsorship opportunities.</p>
                        </CardContent>
                    </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-brand-card-bg border-brand-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChart2 className="w-5 h-5 text-brand-red" />Engagement Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EngagementChart />
                        </CardContent>
                    </Card>
                     <Card className="bg-brand-card-bg border-brand-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5 text-brand-red" />Engagement by Campaign Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TypeDistributionChart />
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExternalAccessGate>
  );
};

export default SponsorDashboard;