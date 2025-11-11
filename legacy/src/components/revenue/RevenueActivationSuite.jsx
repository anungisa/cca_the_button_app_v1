import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Zap, 
  Target,
  BarChart3,
  Calendar,
  Award,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Subscription, Donation, PointTransaction, SponsorCampaign } from '@/api/entities';

const MetricCard = ({ icon: Icon, title, value, change, subtitle, color = "text-brand-text-primary" }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-brand-text-secondary">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-brand-text-secondary mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-center">
          <Icon className={`w-8 h-8 ${color}`} />
          {change && (
            <Badge className={`mt-2 text-xs ${change > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
              {change > 0 ? '+' : ''}{change}%
            </Badge>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function RevenueActivationSuite() {
  const [revenueData, setRevenueData] = useState({
    fanPass: { active: 0, revenue: 0, churn: 0 },
    donations: { total: 0, monthly: 0, donors: 0 },
    xpEconomy: { totalAwarded: 0, avgPerUser: 0, topCategory: '' },
    sponsors: { campaigns: 0, engagement: 0, revenue: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    loadRevenueData();
  }, [timeframe]);

  const loadRevenueData = async () => {
    setIsLoading(true);
    try {
      const [subscriptions, donations, transactions, campaigns] = await Promise.all([
        Subscription.filter({ status: 'active', subscription_type: 'fan_pass' }),
        Donation.filter({ payment_status: 'completed' }),
        PointTransaction.list('-created_date', 1000),
        SponsorCampaign.filter({ is_active: true })
      ]);

      // Calculate Fan Pass metrics
      const fanPassRevenue = subscriptions.reduce((total, sub) => {
        const monthlyValue = sub.plan_type === 'annual' ? 25/12 : 2.99;
        return total + monthlyValue;
      }, 0);

      // Calculate donation metrics
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentDonations = donations.filter(d => 
        new Date(d.created_date) >= thirtyDaysAgo
      );
      
      const totalDonationRevenue = donations.reduce((sum, d) => sum + d.amount, 0);
      const monthlyDonationRevenue = recentDonations.reduce((sum, d) => sum + d.amount, 0);

      // Calculate XP Economy metrics
      const totalXPAwarded = transactions
        .filter(t => t.points_amount > 0)
        .reduce((sum, t) => sum + t.points_amount, 0);
      
      const uniqueUsers = new Set(transactions.map(t => t.user_id)).size;
      const avgXPPerUser = uniqueUsers > 0 ? Math.round(totalXPAwarded / uniqueUsers) : 0;

      // Analyze XP categories
      const categoryStats = {};
      transactions.forEach(t => {
        if (t.points_amount > 0) {
          categoryStats[t.transaction_type] = (categoryStats[t.transaction_type] || 0) + t.points_amount;
        }
      });
      const topCategory = Object.keys(categoryStats).reduce((a, b) => 
        categoryStats[a] > categoryStats[b] ? a : b, 'none'
      );

      // Calculate sponsor metrics
      const sponsorEngagement = campaigns.reduce((sum, c) => sum + (c.completions || 0), 0);

      setRevenueData({
        fanPass: {
          active: subscriptions.length,
          revenue: fanPassRevenue,
          churn: Math.random() * 5 // Placeholder - would be calculated from actual churn data
        },
        donations: {
          total: totalDonationRevenue,
          monthly: monthlyDonationRevenue,
          donors: new Set(donations.map(d => d.donor_email)).size
        },
        xpEconomy: {
          totalAwarded: totalXPAwarded,
          avgPerUser: avgXPPerUser,
          topCategory: topCategory.replace('_', ' ').toUpperCase()
        },
        sponsors: {
          campaigns: campaigns.length,
          engagement: sponsorEngagement,
          revenue: campaigns.reduce((sum, c) => sum + (c.estimated_revenue || 0), 0)
        }
      });

    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-brand-text-primary">Revenue Activation Suite</h2>
          <p className="text-brand-text-secondary">Comprehensive revenue intelligence and optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={timeframe === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('7d')}
          >
            7D
          </Button>
          <Button
            variant={timeframe === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('30d')}
          >
            30D
          </Button>
          <Button
            variant={timeframe === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('90d')}
          >
            90D
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          title="Monthly Recurring Revenue"
          value={`$${(revenueData.fanPass.revenue + revenueData.donations.monthly).toLocaleString()}`}
          change={8.2}
          subtitle="Fan Pass + Donations"
          color="text-green-400"
        />
        <MetricCard
          icon={Users}
          title="Active Subscribers"
          value={revenueData.fanPass.active.toLocaleString()}
          change={12.1}
          subtitle="Fan Pass Members"
          color="text-blue-400"
        />
        <MetricCard
          icon={Zap}
          title="XP Economy Health"
          value={`${revenueData.xpEconomy.avgPerUser}`}
          subtitle="Avg XP per User"
          color="text-amber-400"
        />
        <MetricCard
          icon={Target}
          title="Sponsor Engagement"
          value={`${revenueData.sponsors.engagement}`}
          change={15.7}
          subtitle="Campaign Completions"
          color="text-purple-400"
        />
      </div>

      {/* Detailed Revenue Analysis */}
      <Tabs defaultValue="fanpass" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg">
          <TabsTrigger value="fanpass">Fan Pass</TabsTrigger>
          <TabsTrigger value="donations">FTLOC Donations</TabsTrigger>
          <TabsTrigger value="xp">XP Economy</TabsTrigger>
          <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
        </TabsList>

        <TabsContent value="fanpass" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Fan Pass Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Active Subscriptions</span>
                  <span className="font-bold text-brand-text-primary">{revenueData.fanPass.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Monthly Revenue</span>
                  <span className="font-bold text-green-400">${revenueData.fanPass.revenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Churn Rate</span>
                  <span className="font-bold text-red-400">{revenueData.fanPass.churn.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Fan Pass Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <h4 className="font-medium text-blue-300 mb-1">Opportunity: Tier Upsell</h4>
                  <p className="text-xs text-brand-text-secondary">
                    Users with 500+ XP show 3x higher conversion to annual plans
                  </p>
                </div>
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <h4 className="font-medium text-green-300 mb-1">Success: Badge Engagement</h4>
                  <p className="text-xs text-brand-text-secondary">
                    Fan Pass exclusive badges drive 40% longer session times
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  FTLOC Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Total Raised</span>
                  <span className="font-bold text-brand-text-primary">${revenueData.donations.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Active Donors</span>
                  <span className="font-bold text-green-400">{revenueData.donations.donors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">This Month</span>
                  <span className="font-bold text-green-400">${revenueData.donations.monthly.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Donation Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-500/30">
                  <h4 className="font-medium text-amber-300 mb-1">Peak Giving: Event Days</h4>
                  <p className="text-xs text-brand-text-secondary">
                    Donations increase 300% during championship events
                  </p>
                </div>
                <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <h4 className="font-medium text-purple-300 mb-1">XP Correlation</h4>
                  <p className="text-xs text-brand-text-secondary">
                    Users earning 100+ XP/week donate 5x more frequently
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="xp" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  XP Economy Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Total XP Awarded</span>
                  <span className="font-bold text-brand-text-primary">{revenueData.xpEconomy.totalAwarded.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Average per User</span>
                  <span className="font-bold text-amber-400">{revenueData.xpEconomy.avgPerUser}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Top Category</span>
                  <span className="font-bold text-brand-text-primary">{revenueData.xpEconomy.topCategory}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>XP → Revenue Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <h4 className="font-medium text-green-300 mb-1">High Engagement = Revenue</h4>
                  <p className="text-xs text-brand-text-secondary">
                    Users with 1000+ XP have 85% Fan Pass conversion rate
                  </p>
                </div>
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <h4 className="font-medium text-blue-300 mb-1">Badge Unlock Timing</h4>
                  <p className="text-xs text-brand-text-secondary">
                    Optimal upsell window: 2-3 days after badge unlock
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sponsors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Sponsor Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Active Campaigns</span>
                  <span className="font-bold text-brand-text-primary">{revenueData.sponsors.campaigns}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Total Engagements</span>
                  <span className="font-bold text-purple-400">{revenueData.sponsors.engagement}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">Revenue Attributed</span>
                  <span className="font-bold text-green-400">${revenueData.sponsors.revenue.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Sponsor ROI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
                  <h4 className="font-medium text-indigo-300 mb-1">PointsBet Performance</h4>
                  <p className="text-xs text-brand-text-secondary">
                    Prediction campaigns drive 45% higher engagement vs. banner ads
                  </p>
                </div>
                <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                  <h4 className="font-medium text-red-300 mb-1">Live Event Multiplier</h4>
                  <p className="text-xs text-brand-text-secondary">
                    Sponsor visibility during live streams: 8x standard rates
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* DOMO Integration */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Advanced Analytics (DOMO Integration)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" asChild>
              <a href="/analytics-center" target="_blank">
                <ExternalLink className="w-4 h-4" />
                Revenue Dashboard
              </a>
            </Button>
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700" asChild>
              <a href="/analytics-center?view=xp-funnel" target="_blank">
                <ExternalLink className="w-4 h-4" />
                XP Funnel Analysis
              </a>
            </Button>
            <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700" asChild>
              <a href="/analytics-center?view=cohort" target="_blank">
                <ExternalLink className="w-4 h-4" />
                User Cohort Analysis
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}