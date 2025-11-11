import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  Eye, 
  Users, 
  TrendingUp, 
  Download, 
  Share2,
  Heart,
  Zap,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDomoEmbed } from './useDomoEmbed';
import { useXP } from '../XPContext';

export default function SponsorAnalyticsDashboard({ user, dashboardConfig }) {
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  
  const [campaignMetrics, setCampaignMetrics] = useState({
    totalImpressions: 125420,
    questCompletions: 3847,
    conversionRate: 3.2,
    audienceReach: 89250,
    engagementRate: 12.5,
    ftlocDonations: 2840
  });

  const { 
    embedUrl, 
    isLoading, 
    error, 
    handleEmbedEvent 
  } = useDomoEmbed(dashboardConfig, user);
  
  const { awardPoints } = useXP();

  const handleExportCampaignReport = async () => {
    try {
      await awardPoints(25, 'analytics', 'Exported sponsor campaign report');
      alert('Campaign report exported! Check your downloads.');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const mockCampaigns = [
    { id: 'winter_gear_2024', name: 'Winter Gear Collection 2024', status: 'active', budget: '$5,000' },
    { id: 'ftloc_partnership', name: 'FTLOC Partnership Campaign', status: 'active', budget: '$3,000' },
    { id: 'smart_broom_promo', name: 'Smart Broom Promotion', status: 'completed', budget: '$2,500' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-brand-card-bg rounded-lg mb-6"></div>
          <div className="h-64 bg-brand-card-bg rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-brand-card-bg rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-brand-text-primary mb-2">
                Sponsor Campaign Analytics
              </h2>
              <div className="flex items-center gap-4">
                <Badge className="bg-green-600 text-white">3 Active Campaigns</Badge>
                <Badge variant="outline" className="border-brand-border text-brand-text-secondary">
                  Total Budget: $10,500
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportCampaignReport}
                className="border-brand-border text-brand-text-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button 
                variant="outline"
                className="border-brand-border text-brand-text-secondary"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Insights
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-64 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Select Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {mockCampaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32 bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/20 to-brand-card-bg border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-brand-text-primary">
              {campaignMetrics.totalImpressions.toLocaleString()}
            </div>
            <div className="text-xs text-brand-text-secondary">Total Impressions</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-brand-card-bg border-green-500/30">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-brand-text-primary">
              {campaignMetrics.questCompletions.toLocaleString()}
            </div>
            <div className="text-xs text-brand-text-secondary">Quest Completions</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-brand-card-bg border-purple-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-brand-text-primary">
              {campaignMetrics.conversionRate}%
            </div>
            <div className="text-xs text-brand-text-secondary">Conversion Rate</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/20 to-brand-card-bg border-amber-500/30">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-brand-text-primary">
              {campaignMetrics.audienceReach.toLocaleString()}
            </div>
            <div className="text-xs text-brand-text-secondary">Audience Reach</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/20 to-brand-card-bg border-red-500/30">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-brand-text-primary">
              {campaignMetrics.engagementRate}%
            </div>
            <div className="text-xs text-brand-text-secondary">Engagement Rate</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-900/20 to-brand-card-bg border-pink-500/30">
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-brand-text-primary">
              ${campaignMetrics.ftlocDonations.toLocaleString()}
            </div>
            <div className="text-xs text-brand-text-secondary">FTLOC Impact</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Dashboard */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-red" />
            Campaign Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="600"
              frameBorder="0"
              className="rounded-lg"
              onLoad={() => handleEmbedEvent({ type: 'sponsor_dashboard_load' })}
            />
          ) : (
            <div className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
              <p className="text-brand-text-secondary">Loading sponsor analytics dashboard...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCampaigns.filter(c => c.status === 'active').map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-brand-text-primary">{campaign.name}</h4>
                    <p className="text-sm text-brand-text-secondary">Budget: {campaign.budget}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 text-white">Active</Badge>
                    <Button size="sm" variant="outline" className="border-brand-border text-brand-text-secondary">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ROI Analysis */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              ROI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-brand-text-primary">Total Investment</p>
                  <p className="text-2xl font-bold text-green-400">$10,500</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-brand-text-primary">Estimated Value</p>
                  <p className="text-2xl font-bold text-blue-400">$18,250</p>
                </div>
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-brand-text-primary">ROI</p>
                  <p className="text-2xl font-bold text-purple-400">+74%</p>
                </div>
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-brand-card-bg border-brand-red/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-brand-red rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-brand-text-primary">
              📊 AI-Powered Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-brand-text-primary mb-2">Top Performing Content</h4>
              <ul className="text-sm space-y-1">
                <li className="text-brand-text-secondary">• FTLOC athlete stories (+45% engagement)</li>
                <li className="text-brand-text-secondary">• Smart Broom demo videos (+38% completion)</li>
                <li className="text-brand-text-secondary">• Winter gear collection (+32% click-through)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-brand-text-primary mb-2">Optimization Opportunities</h4>
              <ul className="text-sm space-y-1">
                <li className="text-brand-text-secondary">• Target youth segment (18-25) for +12% reach</li>
                <li className="text-brand-text-secondary">• Increase mobile optimization (+25% engagement)</li>
                <li className="text-brand-text-secondary">• Cross-promote with club events (+18% conversion)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}