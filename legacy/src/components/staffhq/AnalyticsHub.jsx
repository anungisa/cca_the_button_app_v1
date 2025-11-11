import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  MapPin,
  Megaphone,
  Activity,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsHub() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const kpiCards = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+18.2%',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Revenue',
      value: '$156K',
      change: '+23.1%',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Engagement',
      value: '74%',
      change: '+5.3%',
      icon: Activity,
      color: 'text-purple-400'
    },
    {
      title: 'Conversion',
      value: '4.2%',
      change: '+0.8%',
      icon: TrendingUp,
      color: 'text-orange-400'
    }
  ];

  const regionalData = [
    { region: 'Alberta', users: 3420, growth: '+12%' },
    { region: 'Ontario', users: 2890, growth: '+8%' },
    { region: 'British Columbia', users: 2156, growth: '+15%' },
    { region: 'Manitoba', users: 1678, growth: '+6%' }
  ];

  const campaignPerformance = [
    { name: 'Youth Recruitment', impressions: '45K', clicks: '2.1K', conversion: '8.2%' },
    { name: 'Season Pass Promo', impressions: '32K', clicks: '1.8K', conversion: '12.1%' },
    { name: 'Club Partnership', impressions: '28K', clicks: '950', conversion: '6.4%' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'regional', label: 'Regional', icon: MapPin },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'realtime', label: 'Real-time', icon: Activity }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-text-primary">Analytics Dashboard</h2>
          <p className="text-sm md:text-base text-brand-text-secondary">Comprehensive performance insights across all operations</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto">
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Filter className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Download className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="flex-shrink-0">
            <RefreshCw className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Overview - Mobile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-2 md:mb-0">
                  <p className="text-xs md:text-sm text-brand-text-secondary">{kpi.title}</p>
                  <p className="text-lg md:text-2xl font-bold text-brand-text-primary">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1 md:hidden">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">{kpi.change}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between md:block">
                  <kpi.icon className={`w-6 h-6 md:w-8 md:h-8 ${kpi.color}`} />
                  <div className="hidden md:flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">{kpi.change}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics - Mobile Select or Desktop Tabs */}
      {isMobile ? (
        <div className="space-y-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full bg-brand-card-bg border-brand-border text-brand-text-primary">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {activeTabData && <activeTabData.icon className="w-4 h-4" />}
                  {activeTabData?.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-brand-card-bg border-brand-border">
              {tabs.map((tab) => (
                <SelectItem key={tab.id} value={tab.id}>
                  <div className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Mobile Content */}
          <div className="space-y-4">
            {activeTab === 'overview' && (
              <>
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="text-lg">User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-brand-charcoal/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-8 h-8 text-brand-text-secondary mx-auto mb-2" />
                        <p className="text-sm text-brand-text-secondary">Chart placeholder</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brand-text-secondary">Subscriptions</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-brand-border rounded-full">
                            <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm text-brand-text-primary">$89K</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brand-text-secondary">Events</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-brand-border rounded-full">
                            <div className="w-1/2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm text-brand-text-primary">$42K</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brand-text-secondary">Merchandise</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-brand-border rounded-full">
                            <div className="w-1/4 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-sm text-brand-text-primary">$25K</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'regional' && (
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="text-lg">Regional Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {regionalData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                        <div>
                          <p className="font-medium text-brand-text-primary text-sm">{region.region}</p>
                          <p className="text-xs text-brand-text-secondary">{region.users.toLocaleString()} users</p>
                        </div>
                        <Badge className="bg-green-600 text-white text-xs">{region.growth}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'campaigns' && (
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="text-lg">Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {campaignPerformance.map((campaign, index) => (
                      <div key={index} className="p-3 bg-brand-charcoal/50 rounded-lg">
                        <h4 className="font-medium text-brand-text-primary text-sm mb-2">{campaign.name}</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-brand-text-secondary">Impressions</p>
                            <p className="text-brand-text-primary font-medium">{campaign.impressions}</p>
                          </div>
                          <div>
                            <p className="text-brand-text-secondary">Clicks</p>
                            <p className="text-brand-text-primary font-medium">{campaign.clicks}</p>
                          </div>
                          <div>
                            <p className="text-brand-text-secondary">Conv. Rate</p>
                            <p className="text-brand-text-primary font-medium">{campaign.conversion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'realtime' && (
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="text-lg">Real-time Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-text-secondary">Active Users</span>
                      <span className="text-lg font-bold text-green-400">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-text-secondary">Page Views/min</span>
                      <span className="text-lg font-bold text-blue-400">892</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-text-secondary">Bounce Rate</span>
                      <span className="text-lg font-bold text-orange-400">34%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* Desktop Tabs */
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>User Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-brand-charcoal/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                      <p className="text-brand-text-secondary">User growth chart would display here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text-secondary">Subscriptions</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-brand-border rounded-full">
                          <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-brand-text-primary font-medium">$89K</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text-secondary">Events</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-brand-border rounded-full">
                          <div className="w-1/2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-brand-text-primary font-medium">$42K</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text-secondary">Merchandise</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-brand-border rounded-full">
                          <div className="w-1/4 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="text-brand-text-primary font-medium">$25K</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {regionalData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg">
                      <div>
                        <p className="font-medium text-brand-text-primary">{region.region}</p>
                        <p className="text-sm text-brand-text-secondary">{region.users.toLocaleString()} users</p>
                      </div>
                      <Badge className="bg-green-600 text-white">{region.growth}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignPerformance.map((campaign, index) => (
                    <div key={index} className="p-4 bg-brand-charcoal/50 rounded-lg">
                      <h4 className="font-medium text-brand-text-primary mb-3">{campaign.name}</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-brand-text-secondary">Impressions</p>
                          <p className="text-lg font-bold text-brand-text-primary">{campaign.impressions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-brand-text-secondary">Clicks</p>
                          <p className="text-lg font-bold text-brand-text-primary">{campaign.clicks}</p>
                        </div>
                        <div>
                          <p className="text-sm text-brand-text-secondary">Conversion Rate</p>
                          <p className="text-lg font-bold text-brand-text-primary">{campaign.conversion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="text-lg">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">1,247</p>
                    <p className="text-sm text-brand-text-secondary">Currently online</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="text-lg">Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">892</p>
                    <p className="text-sm text-brand-text-secondary">Per minute</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="text-lg">Bounce Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-400">34%</p>
                    <p className="text-sm text-brand-text-secondary">Last 24 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}