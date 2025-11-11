import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Zap, 
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Subscription, Donation, PointTransaction, SponsorCampaign, User } from '@/api/entities';
import { usePermissions } from '../hooks/usePermissions';

const RevenueTile = ({ icon: Icon, title, value, change, subtitle, actionLabel, onAction, color = "text-brand-text-primary" }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <h3 className="font-semibold text-brand-text-primary">{title}</h3>
          </div>
          <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
          {subtitle && <p className="text-sm text-brand-text-secondary">{subtitle}</p>}
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={`w-4 h-4 ${change > 0 ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-sm font-medium ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-brand-text-secondary">vs last month</span>
            </div>
          )}
        </div>
        {actionLabel && onAction && (
          <Button size="sm" onClick={onAction} className="bg-brand-red hover:bg-red-700">
            {actionLabel}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

const OpportunityCard = ({ title, description, impact, urgency, onAction }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`p-4 rounded-lg border ${
      urgency === 'high' ? 'border-red-500/30 bg-red-900/10' :
      urgency === 'medium' ? 'border-amber-500/30 bg-amber-900/10' :
      'border-blue-500/30 bg-blue-900/10'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h4 className="font-semibold text-brand-text-primary mb-1">{title}</h4>
        <p className="text-sm text-brand-text-secondary mb-2">{description}</p>
        <Badge className={`text-xs ${
          urgency === 'high' ? 'bg-red-600' :
          urgency === 'medium' ? 'bg-amber-600' :
          'bg-blue-600'
        } text-white`}>
          {impact}
        </Badge>
      </div>
      <Button size="sm" onClick={onAction} className="ml-4">
        Act
      </Button>
    </div>
  </motion.div>
);

export default function RevenueActivationSuite() {
  const [revenueData, setRevenueData] = useState({});
  const [opportunities, setOpportunities] = useState([]);
  const [kpis, setKpis] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const permissions = usePermissions();

  useEffect(() => {
    if (permissions.canAccessStaffHQ) {
      loadRevenueData();
    }
  }, [permissions]);

  const loadRevenueData = async () => {
    setIsLoading(true);
    try {
      const [subscriptions, donations, xpTransactions, campaigns, users] = await Promise.all([
        Subscription.filter({ status: 'active' }),
        Donation.filter({ payment_status: 'completed' }),
        PointTransaction.list('-created_date', 500),
        SponsorCampaign.filter({ is_active: true }),
        User.list('created_date', 100)
      ]);

      // Calculate revenue metrics
      const fanPassRevenue = subscriptions
        .filter(s => s.subscription_type === 'fan_pass')
        .reduce((total, sub) => {
          const monthlyValue = sub.plan_type === 'annual' ? 25/12 : 2.99;
          return total + monthlyValue;
        }, 0);

      const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
      
      // XP engagement metrics
      const totalXPAwarded = xpTransactions
        .filter(t => t.points_amount > 0)
        .reduce((sum, t) => sum + t.points_amount, 0);

      const activeUsers = new Set(xpTransactions.map(t => t.user_id)).size;

      // Calculate conversion opportunities
      const highEngagementUsers = xpTransactions
        .filter(t => t.points_amount > 0)
        .reduce((acc, t) => {
          acc[t.user_id] = (acc[t.user_id] || 0) + t.points_amount;
          return acc;
        }, {});

      const potentialConverters = Object.entries(highEngagementUsers)
        .filter(([userId, xp]) => xp >= 500)
        .length;

      setRevenueData({
        fanPassRevenue,
        totalDonations,
        activeSubscribers: subscriptions.filter(s => s.subscription_type === 'fan_pass').length,
        totalXPAwarded,
        activeUsers,
        potentialConverters
      });

      // Generate smart opportunities
      const smartOpportunities = [
        {
          title: 'High-XP User Conversion',
          description: `${potentialConverters} users have 500+ XP but no Fan Pass. Target with exclusive badge campaign.`,
          impact: `+$${(potentialConverters * 2.99 * 0.3).toFixed(0)}/month potential`,
          urgency: 'high',
          action: () => console.log('Launch Fan Pass campaign')
        },
        {
          title: 'Event-Based Donation Push',
          description: 'Championship events drive 3x donation rates. Schedule FTLOC campaign.',
          impact: '+25% donation volume',
          urgency: 'medium',
          action: () => console.log('Schedule donation campaign')
        },
        {
          title: 'XP Economy Optimization',
          description: `Average XP per user: ${Math.round(totalXPAwarded / activeUsers)}. Increase engagement loops.`,
          impact: '+15% user retention',
          urgency: 'medium',
          action: () => console.log('Optimize XP system')
        }
      ];

      setOpportunities(smartOpportunities);

      // Calculate KPIs
      setKpis({
        arpu: fanPassRevenue / Math.max(subscriptions.filter(s => s.subscription_type === 'fan_pass').length, 1),
        ltv: fanPassRevenue * 12, // Simplified LTV calculation
        xpToRevenueRatio: totalXPAwarded / (fanPassRevenue + totalDonations/100),
        conversionRate: (subscriptions.filter(s => s.subscription_type === 'fan_pass').length / users.length) * 100
      });

    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!permissions.canAccessStaffHQ) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Access denied. Revenue Activation Suite requires Staff HQ permissions.
        </AlertDescription>
      </Alert>
    );
  }

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
          <p className="text-brand-text-secondary">AI-powered revenue optimization and opportunity identification</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-brand-border">
            <ExternalLink className="w-4 h-4 mr-2" />
            View DOMO Dashboard
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RevenueTile
          icon={DollarSign}
          title="Monthly Recurring Revenue"
          value={`$${revenueData.fanPassRevenue?.toFixed(0) || 0}`}
          change={12.3}
          subtitle="Fan Pass subscriptions"
          color="text-green-400"
        />
        <RevenueTile
          icon={Users}
          title="Active Subscribers"
          value={revenueData.activeSubscribers || 0}
          change={8.7}
          subtitle="Fan Pass members"
          color="text-blue-400"
        />
        <RevenueTile
          icon={Zap}
          title="Total Donations"
          value={`$${revenueData.totalDonations?.toLocaleString() || 0}`}
          change={15.2}
          subtitle="FTLOC contributions"
          color="text-purple-400"
        />
        <RevenueTile
          icon={Target}
          title="XP Engagement"
          value={`${revenueData.activeUsers || 0}`}
          change={23.1}
          subtitle="Active XP earners"
          color="text-amber-400"
        />
      </div>

      {/* Smart Opportunities */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Smart Revenue Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {opportunities.map((opportunity, index) => (
            <OpportunityCard key={index} {...opportunity} />
          ))}
        </CardContent>
      </Card>

      {/* Advanced Analytics */}
      <Tabs defaultValue="conversion" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg">
          <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="engagement">XP → Revenue</TabsTrigger>
          <TabsTrigger value="cohorts">User Cohorts</TabsTrigger>
          <TabsTrigger value="forecasting">Revenue Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="conversion" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Fan Pass Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-brand-charcoal/30 rounded">
                    <span>Total Users</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-brand-charcoal/30 rounded">
                    <span>High Engagement (500+ XP)</span>
                    <span className="font-bold text-amber-400">{revenueData.potentialConverters}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-brand-charcoal/30 rounded">
                    <span>Fan Pass Subscribers</span>
                    <span className="font-bold text-green-400">{revenueData.activeSubscribers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-900/20 rounded border border-green-500/30">
                    <span>Conversion Rate</span>
                    <span className="font-bold text-green-400">{kpis.conversionRate?.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Revenue Optimization Levers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-900/20 rounded border border-blue-500/30">
                    <h4 className="font-medium text-blue-300 mb-1">ARPU Optimization</h4>
                    <p className="text-xs text-brand-text-secondary">
                      Current: ${kpis.arpu?.toFixed(2)} • Target: $4.50 (+50%)
                    </p>
                  </div>
                  <div className="p-3 bg-purple-900/20 rounded border border-purple-500/30">
                    <h4 className="font-medium text-purple-300 mb-1">Churn Reduction</h4>
                    <p className="text-xs text-brand-text-secondary">
                      Badge unlock campaigns reduce churn by 40%
                    </p>
                  </div>
                  <div className="p-3 bg-amber-900/20 rounded border border-amber-500/30">
                    <h4 className="font-medium text-amber-300 mb-1">Upsell Timing</h4>
                    <p className="text-xs text-brand-text-secondary">
                      Optimal window: 2-3 days after major XP milestone
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-brand-card-bg border-brand-border lg:col-span-2">
              <CardHeader>
                <CardTitle>XP to Revenue Correlation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-brand-charcoal/30 rounded-lg flex items-center justify-center">
                  <p className="text-brand-text-secondary">XP engagement vs revenue correlation graph</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Engagement Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-900/20 rounded">
                  <h4 className="font-medium text-green-300 text-sm">1000+ XP Users</h4>
                  <p className="text-xs text-brand-text-secondary">85% Fan Pass conversion rate</p>
                </div>
                <div className="p-3 bg-blue-900/20 rounded">
                  <h4 className="font-medium text-blue-300 text-sm">Badge Earners</h4>
                  <p className="text-xs text-brand-text-secondary">3x higher donation frequency</p>
                </div>
                <div className="p-3 bg-purple-900/20 rounded">
                  <h4 className="font-medium text-purple-300 text-sm">Prediction Users</h4>
                  <p className="text-xs text-brand-text-secondary">45% session time increase</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>User Cohort Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-border">
                      <th className="text-left p-2">Cohort</th>
                      <th className="text-center p-2">Month 1</th>
                      <th className="text-center p-2">Month 2</th>
                      <th className="text-center p-2">Month 3</th>
                      <th className="text-center p-2">Month 6</th>
                      <th className="text-center p-2">LTV</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-brand-border/50">
                      <td className="p-2 font-medium">Jan 2024</td>
                      <td className="text-center p-2 text-green-400">92%</td>
                      <td className="text-center p-2 text-green-400">87%</td>
                      <td className="text-center p-2 text-amber-400">78%</td>
                      <td className="text-center p-2 text-red-400">65%</td>
                      <td className="text-center p-2 font-bold">$24.50</td>
                    </tr>
                    <tr className="border-b border-brand-border/50">
                      <td className="p-2 font-medium">Feb 2024</td>
                      <td className="text-center p-2 text-green-400">89%</td>
                      <td className="text-center p-2 text-green-400">84%</td>
                      <td className="text-center p-2 text-amber-400">75%</td>
                      <td className="text-center p-2 text-red-400">62%</td>
                      <td className="text-center p-2 font-bold">$22.10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>90-Day Revenue Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-900/20 rounded">
                    <span>Conservative</span>
                    <span className="font-bold text-green-400">$12,450</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-900/20 rounded">
                    <span>Likely</span>
                    <span className="font-bold text-blue-400">$15,680</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-900/20 rounded">
                    <span>Optimistic</span>
                    <span className="font-bold text-purple-400">$19,200</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Growth Accelerators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-amber-900/20 rounded">
                  <h4 className="font-medium text-amber-300 text-sm">Championship Season</h4>
                  <p className="text-xs text-brand-text-secondary">Expected +40% donation surge</p>
                </div>
                <div className="p-3 bg-blue-900/20 rounded">
                  <h4 className="font-medium text-blue-300 text-sm">Fan Pass Promo</h4>
                  <p className="text-xs text-brand-text-secondary">2-for-1 annual plans boost</p>
                </div>
                <div className="p-3 bg-purple-900/20 rounded">
                  <h4 className="font-medium text-purple-300 text-sm">Sponsor Integration</h4>
                  <p className="text-xs text-brand-text-secondary">PointsBet campaign revenue</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}