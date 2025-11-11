import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target, TrendingUp, Users, BarChart3, Eye, RefreshCw,
  Download, FileText, DollarSign, Zap, Globe, MessageSquare,
  Activity, Calendar, ArrowRight, CheckCircle, AlertTriangle
} from 'lucide-react';
import { usePermissions } from '../components/hooks/usePermissions';
import VividataIntegration from '../components/integrations/VividataIntegration';
import TSNIntegration from '../components/integrations/TSNIntegration';
import BrandwatchIntegration from '../components/integrations/BrandwatchIntegration';
import GoogleAnalyticsIntegration from '../components/integrations/GoogleAnalyticsIntegration';
import PointsBetIntegration from '../components/integrations/PointsBetIntegration';

export default function SponsorIntelligence() {
  const { permissions } = usePermissions();
  const [lastSync, setLastSync] = useState({
    vividata: '2 hours ago',
    tsn: '1 hour ago',
    brandwatch: '30 minutes ago',
    analytics: '15 minutes ago',
    pointsbet: '45 minutes ago'
  });

  const [metrics, setMetrics] = useState({
    totalReach: 4500000,
    avgEngagement: 8.2,
    socialSentiment: 82,
    viewership: 2300000,
    sponsorROI: 3.4
  });

  if (!permissions?.canAccessStaffHQ) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">
          You don't have permission to access Sponsorship Intelligence.
        </p>
      </div>
    );
  }

  const dataSources = [
    {
      name: 'Vividata',
      icon: Users,
      status: 'connected',
      lastSync: lastSync.vividata,
      color: 'blue',
      metrics: { reach: '4.5M', demos: '12 segments' }
    },
    {
      name: 'TSN Viewership',
      icon: Eye,
      status: 'connected',
      lastSync: lastSync.tsn,
      color: 'green',
      metrics: { viewers: '2.3M', avgMinutes: '42' }
    },
    {
      name: 'Brandwatch',
      icon: MessageSquare,
      status: 'connected',
      lastSync: lastSync.brandwatch,
      color: 'purple',
      metrics: { mentions: '45K', sentiment: '82%' }
    },
    {
      name: 'Google Analytics',
      icon: BarChart3,
      status: 'connected',
      lastSync: lastSync.analytics,
      color: 'orange',
      metrics: { sessions: '180K', conversion: '3.2%' }
    },
    {
      name: 'PointsBet',
      icon: Target,
      status: 'connected',
      lastSync: lastSync.pointsbet,
      color: 'amber',
      metrics: { predictions: '12K', accuracy: '67%' }
    }
  ];

  const sponsorReports = [
    {
      sponsor: 'Tim Hortons',
      reach: '3.2M impressions',
      engagement: '145K interactions',
      sentiment: 88,
      roi: 4.2,
      status: 'excellent'
    },
    {
      sponsor: 'Home Hardware',
      reach: '2.8M impressions',
      engagement: '98K interactions',
      sentiment: 85,
      roi: 3.8,
      status: 'excellent'
    },
    {
      sponsor: 'PointsBet',
      reach: '1.5M impressions',
      engagement: '67K interactions',
      sentiment: 79,
      roi: 3.2,
      status: 'good'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-2">
            <Target className="w-8 h-8 text-brand-red" />
            Sponsorship Intelligence Center
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Real-time sponsor performance data from 5 integrated sources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All Reports
          </Button>
          <Button className="bg-brand-red hover:bg-red-700">
            <FileText className="w-4 h-4 mr-2" />
            Generate Sponsor Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
          <CardContent className="p-6">
            <Users className="w-8 h-8 text-blue-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              {(metrics.totalReach / 1000000).toFixed(1)}M
            </div>
            <p className="text-sm text-brand-text-secondary">Total Reach</p>
            <Badge className="mt-2 bg-blue-500/20 text-blue-400 text-xs">
              +12% vs last month
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30">
          <CardContent className="p-6">
            <Activity className="w-8 h-8 text-purple-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              {metrics.avgEngagement}%
            </div>
            <p className="text-sm text-brand-text-secondary">Avg Engagement</p>
            <Badge className="mt-2 bg-purple-500/20 text-purple-400 text-xs">
              +2.1% vs benchmark
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardContent className="p-6">
            <MessageSquare className="w-8 h-8 text-green-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              {metrics.socialSentiment}%
            </div>
            <p className="text-sm text-brand-text-secondary">Social Sentiment</p>
            <Badge className="mt-2 bg-green-500/20 text-green-400 text-xs">
              Positive trend
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-950/30 to-amber-950/30 border-orange-500/30">
          <CardContent className="p-6">
            <Eye className="w-8 h-8 text-orange-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              {(metrics.viewership / 1000000).toFixed(1)}M
            </div>
            <p className="text-sm text-brand-text-secondary">TSN Viewership</p>
            <Badge className="mt-2 bg-orange-500/20 text-orange-400 text-xs">
              Championship avg
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-950/30 to-rose-950/30 border-red-500/30">
          <CardContent className="p-6">
            <DollarSign className="w-8 h-8 text-red-400 mb-3" />
            <div className="text-3xl font-bold text-brand-text-primary mb-1">
              {metrics.sponsorROI}x
            </div>
            <p className="text-sm text-brand-text-secondary">Sponsor ROI</p>
            <Badge className="mt-2 bg-red-500/20 text-red-400 text-xs">
              Above industry avg
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Status */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Connected Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {dataSources.map((source) => {
              const Icon = source.icon;
              return (
                <div
                  key={source.name}
                  className={`p-4 bg-${source.color}-500/10 rounded-lg border border-${source.color}-500/30`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`w-6 h-6 text-${source.color}-400`} />
                    <Badge className={`bg-green-500/20 text-green-400 text-xs`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {source.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-brand-text-primary mb-2">{source.name}</h4>
                  <div className="space-y-1 mb-3">
                    {Object.entries(source.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-brand-text-secondary">{key}:</span>
                        <span className="text-brand-text-primary font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-brand-text-secondary">
                    Last sync: {source.lastSync}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sponsor Performance Leaderboard */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sponsor Performance Overview
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sponsorReports.map((report, idx) => (
              <div key={idx} className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-brand-text-primary mb-1">{report.sponsor}</h4>
                    <div className="flex gap-2">
                      <Badge className={
                        report.status === 'excellent' ? 'bg-green-500/20 text-green-400' :
                        report.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }>
                        {report.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {report.roi}x ROI
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Full Report
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-brand-text-secondary mb-1">Total Reach</p>
                    <p className="text-lg font-bold text-brand-text-primary">{report.reach}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-text-secondary mb-1">Engagement</p>
                    <p className="text-lg font-bold text-brand-text-primary">{report.engagement}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-text-secondary mb-1">Sentiment Score</p>
                    <p className="text-lg font-bold text-brand-text-primary">{report.sentiment}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Details Tabs */}
      <Tabs defaultValue="vividata" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="vividata">
            <Users className="w-4 h-4 mr-2" />
            Vividata
          </TabsTrigger>
          <TabsTrigger value="tsn">
            <Eye className="w-4 h-4 mr-2" />
            TSN
          </TabsTrigger>
          <TabsTrigger value="brandwatch">
            <MessageSquare className="w-4 h-4 mr-2" />
            Brandwatch
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="pointsbet">
            <Target className="w-4 h-4 mr-2" />
            PointsBet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vividata" className="mt-6">
          <VividataIntegration />
        </TabsContent>

        <TabsContent value="tsn" className="mt-6">
          <TSNIntegration />
        </TabsContent>

        <TabsContent value="brandwatch" className="mt-6">
          <BrandwatchIntegration />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <GoogleAnalyticsIntegration />
        </TabsContent>

        <TabsContent value="pointsbet" className="mt-6">
          <PointsBetIntegration />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-8 h-8 text-brand-red" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-brand-text-primary mb-2">
                Sponsorship Intelligence at Your Fingertips
              </h3>
              <p className="text-sm text-brand-text-secondary">
                All sponsor-relevant data from Vividata, TSN, Brandwatch, and more in one unified dashboard. 
                Generate custom reports, track ROI, and prove value to partners.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="bg-brand-red hover:bg-red-700">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync All Sources
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}