import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Users,
  Calendar,
  BarChart3,
  Truck
} from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { getFiscalYearInfo } from '../utils/season';

export default function DeliveryPulseBoard() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedQuarter, setSelectedQuarter] = useState('q3');
  const [deliveryData, setDeliveryData] = useState({});
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentFY = getFiscalYearInfo();

  // Generate comprehensive delivery tracking data
  const generateDeliveryData = () => {
    const strategicInitiatives = [
      {
        id: 'platform_rollout',
        name: 'National Platform Rollout',
        description: 'CurlingOS deployment across all regions',
        owner: 'Technology Team',
        priority: 'critical',
        status: 'in_progress',
        overall_progress: 72,
        target_completion: '2024-12-31',
        budget_allocated: 2500000,
        budget_spent: 1800000,
        regional_progress: canadianProvincesAndTerritories.map(province => ({
          region: province.abbreviation,
          region_name: province.name,
          progress: Math.floor(Math.random() * 40) + 60,
          status: Math.random() > 0.7 ? 'delayed' : Math.random() > 0.3 ? 'on_track' : 'completed',
          key_milestones_complete: Math.floor(Math.random() * 8) + 2,
          total_milestones: 10,
          blockers: Math.random() > 0.8 ? ['Resource constraints', 'Technical challenges'] : [],
          next_milestone: `${province.abbreviation} Training Completion`,
          milestone_date: '2024-08-15'
        }))
      },
      {
        id: 'fan_engagement',
        name: 'Fan Engagement Strategy',
        description: 'The Button platform enhancement and expansion',
        owner: 'Marketing & Engagement Team',
        priority: 'high',
        status: 'on_track',
        overall_progress: 85,
        target_completion: '2024-09-30',
        budget_allocated: 1200000,
        budget_spent: 900000,
        regional_progress: canadianProvincesAndTerritories.map(province => ({
          region: province.abbreviation,
          region_name: province.name,
          progress: Math.floor(Math.random() * 30) + 70,
          status: Math.random() > 0.8 ? 'delayed' : 'on_track',
          key_milestones_complete: Math.floor(Math.random() * 6) + 6,
          total_milestones: 8,
          blockers: Math.random() > 0.9 ? ['Content localization'] : [],
          next_milestone: `${province.abbreviation} Content Launch`,
          milestone_date: '2024-07-01'
        }))
      },
      {
        id: 'governance_compliance',
        name: 'Governance & Compliance Framework',
        description: 'Safe Sport and governance modernization',
        owner: 'Governance Team',
        priority: 'critical',
        status: 'completed',
        overall_progress: 100,
        target_completion: '2024-03-31',
        budget_allocated: 800000,
        budget_spent: 750000,
        regional_progress: canadianProvincesAndTerritories.map(province => ({
          region: province.abbreviation,
          region_name: province.name,
          progress: 100,
          status: 'completed',
          key_milestones_complete: 8,
          total_milestones: 8,
          blockers: [],
          next_milestone: 'Ongoing Compliance Monitoring',
          milestone_date: 'Ongoing'
        }))
      },
      {
        id: 'youth_development',
        name: 'Youth Development Program',
        description: 'Expanded youth programming and FTLOC initiatives',
        owner: 'Community Development Team',
        priority: 'high',
        status: 'in_progress',
        overall_progress: 58,
        target_completion: '2025-03-31',
        budget_allocated: 1800000,
        budget_spent: 980000,
        regional_progress: canadianProvincesAndTerritories.map(province => ({
          region: province.abbreviation,
          region_name: province.name,
          progress: Math.floor(Math.random() * 50) + 30,
          status: Math.random() > 0.6 ? 'on_track' : Math.random() > 0.3 ? 'at_risk' : 'delayed',
          key_milestones_complete: Math.floor(Math.random() * 5) + 2,
          total_milestones: 12,
          blockers: Math.random() > 0.7 ? ['Volunteer recruitment', 'Venue availability'] : [],
          next_milestone: `${province.abbreviation} Program Launch`,
          milestone_date: '2024-09-01'
        }))
      }
    ];

    return {
      strategic_initiatives: strategicInitiatives,
      quarterly_metrics: {
        q3: {
          projects_delivered: 12,
          projects_on_track: 8,
          projects_at_risk: 3,
          projects_delayed: 1,
          budget_utilization: 78,
          milestone_completion_rate: 85,
          regional_satisfaction: 87
        }
      },
      delivery_health: {
        velocity_trend: 'improving',
        quality_score: 92,
        stakeholder_satisfaction: 88,
        resource_utilization: 82
      }
    };
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: { color: 'bg-green-600', text: 'Completed', icon: CheckCircle },
      on_track: { color: 'bg-blue-600', text: 'On Track', icon: TrendingUp },
      at_risk: { color: 'bg-yellow-600', text: 'At Risk', icon: AlertTriangle },
      delayed: { color: 'bg-red-600', text: 'Delayed', icon: Clock },
      in_progress: { color: 'bg-purple-600', text: 'In Progress', icon: Zap }
    };

    const { color, text, icon: IconComponent } = config[status] || config.in_progress;
    return (
      <Badge className={`${color} text-white flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = {
      critical: { color: 'bg-red-600', text: 'Critical' },
      high: { color: 'bg-orange-600', text: 'High' },
      medium: { color: 'bg-yellow-600', text: 'Medium' },
      low: { color: 'bg-green-600', text: 'Low' }
    };

    const { color, text } = config[priority] || config.medium;
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const DeliveryOverview = () => {
    const data = deliveryData;
    const metrics = data.quarterly_metrics?.[selectedQuarter];

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{metrics?.projects_delivered || 0}</div>
              <div className="text-sm text-brand-text-secondary">Projects Delivered</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{metrics?.projects_on_track || 0}</div>
              <div className="text-sm text-brand-text-secondary">On Track</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{metrics?.projects_at_risk || 0}</div>
              <div className="text-sm text-brand-text-secondary">At Risk</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{metrics?.projects_delayed || 0}</div>
              <div className="text-sm text-brand-text-secondary">Delayed</div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Initiatives */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Strategic Initiative Progress</CardTitle>
            <p className="text-sm text-brand-text-secondary">
              Key organizational initiatives and their delivery status
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.strategic_initiatives?.map((initiative) => (
                <div key={initiative.id} className="border border-brand-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-brand-text-primary">{initiative.name}</h3>
                      <p className="text-sm text-brand-text-secondary">{initiative.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {getStatusBadge(initiative.status)}
                        {getPriorityBadge(initiative.priority)}
                        <Badge variant="outline">{initiative.owner}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-text-primary">
                        {initiative.overall_progress}%
                      </div>
                      <div className="text-sm text-brand-text-secondary">Complete</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Progress value={initiative.overall_progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-brand-text-secondary">Target Completion</div>
                      <div className="text-brand-text-primary font-medium">
                        {new Date(initiative.target_completion).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-brand-text-secondary">Budget Utilization</div>
                      <div className="text-brand-text-primary font-medium">
                        ${(initiative.budget_spent / 1000000).toFixed(1)}M / ${(initiative.budget_allocated / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div>
                      <div className="text-brand-text-secondary">Regions Complete</div>
                      <div className="text-brand-text-primary font-medium">
                        {initiative.regional_progress.filter(r => r.status === 'completed').length}/{initiative.regional_progress.length}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-brand-text-secondary">Delivery Velocity</div>
                  <div className="text-lg font-bold text-brand-text-primary">
                    {data.delivery_health?.velocity_trend === 'improving' ? '📈' : '📉'} Improving
                  </div>
                </div>
                <Truck className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-brand-text-secondary">Quality Score</div>
                  <div className="text-lg font-bold text-brand-text-primary">
                    {data.delivery_health?.quality_score || 0}%
                  </div>
                </div>
                <Target className="w-6 h-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-brand-text-secondary">Stakeholder Satisfaction</div>
                  <div className="text-lg font-bold text-brand-text-primary">
                    {data.delivery_health?.stakeholder_satisfaction || 0}%
                  </div>
                </div>
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-brand-text-secondary">Resource Utilization</div>
                  <div className="text-lg font-bold text-brand-text-primary">
                    {data.delivery_health?.resource_utilization || 0}%
                  </div>
                </div>
                <BarChart3 className="w-6 h-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const RegionalDeliveryView = () => {
    const initiative = deliveryData.strategic_initiatives?.find(i => i.id === 'platform_rollout');
    if (!initiative) return null;

    const filteredRegions = selectedRegion === 'all' 
      ? initiative.regional_progress 
      : initiative.regional_progress.filter(r => r.region === selectedRegion);

    return (
      <div className="space-y-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Regional Delivery Status - {initiative.name}</CardTitle>
            <p className="text-sm text-brand-text-secondary">
              Track progress across all provinces and territories
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRegions.map((region) => (
            <Card key={region.region} className="bg-brand-card-bg border-brand-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{region.region}</CardTitle>
                    <p className="text-sm text-brand-text-secondary">{region.region_name}</p>
                  </div>
                  {getStatusBadge(region.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-text-secondary">Progress</span>
                    <span className="text-sm font-bold text-brand-text-primary">
                      {region.progress}%
                    </span>
                  </div>
                  <Progress value={region.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-brand-text-secondary">Milestones</div>
                    <div className="font-bold text-brand-text-primary">
                      {region.key_milestones_complete}/{region.total_milestones}
                    </div>
                  </div>
                  <div>
                    <div className="text-brand-text-secondary">Completion</div>
                    <div className="font-bold text-brand-text-primary">
                      {Math.round((region.key_milestones_complete / region.total_milestones) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="text-brand-text-secondary mb-1">Next Milestone</div>
                  <div className="text-brand-text-primary font-medium">{region.next_milestone}</div>
                  <div className="text-brand-text-secondary text-xs">
                    Due: {region.milestone_date}
                  </div>
                </div>

                {region.blockers.length > 0 && (
                  <div className="text-sm">
                    <div className="text-brand-text-secondary mb-1">Current Blockers</div>
                    <div className="space-y-1">
                      {region.blockers.map((blocker, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          ⚠️ {blocker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const ResourceAllocationView = () => (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Resource Allocation & Utilization</CardTitle>
          <p className="text-sm text-brand-text-secondary">
            Budget and resource tracking across strategic initiatives
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {deliveryData.strategic_initiatives?.map((initiative) => {
              const budgetUtilization = (initiative.budget_spent / initiative.budget_allocated) * 100;
              
              return (
                <div key={initiative.id} className="border border-brand-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-brand-text-primary">{initiative.name}</h3>
                      <p className="text-sm text-brand-text-secondary">{initiative.owner}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-brand-text-primary">
                        ${(initiative.budget_allocated / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-brand-text-secondary">Allocated</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-brand-text-secondary">Budget Utilization</span>
                        <span className="text-brand-text-primary font-medium">
                          {budgetUtilization.toFixed(1)}% (${(initiative.budget_spent / 1000000).toFixed(1)}M)
                        </span>
                      </div>
                      <Progress value={budgetUtilization} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-brand-text-secondary">Remaining</div>
                        <div className="text-brand-text-primary font-medium">
                          ${((initiative.budget_allocated - initiative.budget_spent) / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-brand-text-secondary">Progress vs Budget</div>
                        <div className="text-brand-text-primary font-medium">
                          {initiative.overall_progress > budgetUtilization ? '🟢' : '🟡'} 
                          {initiative.overall_progress > budgetUtilization ? ' On Track' : ' Monitor'}
                        </div>
                      </div>
                      <div>
                        <div className="text-brand-text-secondary">Efficiency</div>
                        <div className="text-brand-text-primary font-medium">
                          {(initiative.overall_progress / budgetUtilization).toFixed(2)}x
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeliveryData(generateDeliveryData());
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-brand-red" />
          <div>
            <h3 className="text-xl font-bold text-brand-text-primary">Delivery Pulse Board</h3>
            <p className="text-sm text-brand-text-secondary">
              Real-time delivery tracking across all strategic initiatives
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {canadianProvincesAndTerritories.map((province) => (
                <SelectItem key={province.abbreviation} value={province.abbreviation}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1">Q1 {currentFY.fiscalYear.split('-')[1]}</SelectItem>
              <SelectItem value="q2">Q2 {currentFY.fiscalYear.split('-')[1]}</SelectItem>
              <SelectItem value="q3">Q3 {currentFY.fiscalYear.split('-')[1]}</SelectItem>
              <SelectItem value="q4">Q4 {currentFY.fiscalYear.split('-')[1]}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="overview">Delivery Overview</TabsTrigger>
          <TabsTrigger value="regional">Regional Progress</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <DeliveryOverview />
        </TabsContent>

        <TabsContent value="regional" className="mt-6">
          <RegionalDeliveryView />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <ResourceAllocationView />
        </TabsContent>
      </Tabs>
    </div>
  );
}