import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Target,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Plus,
  Edit,
  Eye,
  Flag,
  Lightbulb,
  Award,
  Zap
} from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function StrategicPlanningHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [initiatives, setInitiatives] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Strategic Planning Stats
  const planningStats = [
    { title: 'Active Initiatives', value: '18', change: '3 new this quarter', icon: Target, color: 'text-blue-400' },
    { title: 'On Track KPIs', value: '24/32', change: '75% completion rate', icon: TrendingUp, color: 'text-green-400' },
    { title: 'Strategic Goals', value: '8', change: '2 achieved this year', icon: Award, color: 'text-purple-400' },
    { title: 'Innovation Projects', value: '12', change: '4 in pilot phase', icon: Lightbulb, color: 'text-orange-400' }
  ];

  // Sample Strategic Initiatives
  const strategicInitiatives = [
    {
      id: 'si_001',
      title: 'Digital Transformation Initiative',
      description: 'Modernize all digital touchpoints and enhance fan engagement through technology',
      priority: 'high',
      status: 'in_progress',
      progress: 65,
      owner: 'Technology Team',
      startDate: '2024-01-15',
      targetDate: '2024-12-31',
      budget: 2500000,
      spent: 1625000,
      kpis: ['Platform Adoption Rate', 'User Engagement Score', 'Digital Revenue Growth'],
      milestones: [
        { name: 'Phase 1: Platform Architecture', completed: true, date: '2024-03-01' },
        { name: 'Phase 2: User Experience Redesign', completed: true, date: '2024-06-15' },
        { name: 'Phase 3: Integration & Testing', completed: false, date: '2024-09-30' },
        { name: 'Phase 4: Full Rollout', completed: false, date: '2024-12-31' }
      ]
    },
    {
      id: 'si_002',
      title: 'Grassroots Growth Strategy',
      description: 'Expand curling participation at the club level through targeted programs',
      priority: 'high',
      status: 'in_progress',
      progress: 40,
      owner: 'Community Development Team',
      startDate: '2024-02-01',
      targetDate: '2025-05-31',
      budget: 1800000,
      spent: 720000,
      kpis: ['New Club Memberships', 'Youth Participation Rate', 'Retention Rate'],
      milestones: [
        { name: 'Club Assessment & Strategy', completed: true, date: '2024-04-01' },
        { name: 'Pilot Program Launch', completed: false, date: '2024-07-01' },
        { name: 'National Rollout', completed: false, date: '2024-10-01' },
        { name: 'Impact Assessment', completed: false, date: '2025-05-31' }
      ]
    },
    {
      id: 'si_003',
      title: 'Sustainability & ESG Framework',
      description: 'Implement comprehensive environmental and social governance practices',
      priority: 'medium',
      status: 'planning',
      progress: 15,
      owner: 'Executive Team',
      startDate: '2024-03-01',
      targetDate: '2025-03-01',
      budget: 500000,
      spent: 75000,
      kpis: ['Carbon Footprint Reduction', 'Diversity Index', 'Community Impact Score'],
      milestones: [
        { name: 'ESG Framework Development', completed: false, date: '2024-06-01' },
        { name: 'Baseline Assessment', completed: false, date: '2024-08-01' },
        { name: 'Implementation Plan', completed: false, date: '2024-12-01' },
        { name: 'First Year Review', completed: false, date: '2025-03-01' }
      ]
    }
  ];

  // Sample KPIs
  const keyPerformanceIndicators = [
    {
      id: 'kpi_001',
      name: 'Platform Adoption Rate',
      category: 'Digital',
      current: 68,
      target: 85,
      unit: '%',
      trend: 'up',
      lastUpdated: '2024-01-20',
      status: 'on_track',
      description: 'Percentage of clubs actively using CurlingOS platform'
    },
    {
      id: 'kpi_002', 
      name: 'Youth Participation Growth',
      category: 'Community',
      current: 12.4,
      target: 15.0,
      unit: '%',
      trend: 'up',
      lastUpdated: '2024-01-18',
      status: 'on_track',
      description: 'Year-over-year growth in youth membership'
    },
    {
      id: 'kpi_003',
      name: 'Volunteer Retention Rate',
      category: 'Human Resources',
      current: 73,
      target: 80,
      unit: '%',
      trend: 'stable',
      lastUpdated: '2024-01-15',
      status: 'needs_attention',
      description: 'Percentage of volunteers returning for multiple events'
    },
    {
      id: 'kpi_004',
      name: 'Revenue Diversification',
      category: 'Financial',
      current: 42,
      target: 50,
      unit: '%',
      trend: 'up',
      lastUpdated: '2024-01-22',
      status: 'on_track',
      description: 'Percentage of revenue from non-traditional sources'
    }
  ];

  useEffect(() => {
    loadPlanningData();
  }, []);

  const loadPlanningData = async () => {
    try {
      // In a real implementation, these would be API calls
      setInitiatives(strategicInitiatives);
      setKpis(keyPerformanceIndicators);
    } catch (error) {
      console.error('Error loading planning data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { color: 'bg-blue-600', text: 'Planning', icon: Clock },
      in_progress: { color: 'bg-orange-600', text: 'In Progress', icon: Zap },
      completed: { color: 'bg-green-600', text: 'Completed', icon: CheckCircle },
      on_hold: { color: 'bg-gray-600', text: 'On Hold', icon: AlertTriangle },
      cancelled: { color: 'bg-red-600', text: 'Cancelled', icon: AlertTriangle }
    };

    const config = statusConfig[status] || statusConfig.planning;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-red-600', text: 'High Priority' },
      medium: { color: 'bg-yellow-600', text: 'Medium Priority' },
      low: { color: 'bg-green-600', text: 'Low Priority' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  const getKPIStatusBadge = (status) => {
    const statusConfig = {
      on_track: { color: 'bg-green-600', text: 'On Track', icon: CheckCircle },
      needs_attention: { color: 'bg-yellow-600', text: 'Needs Attention', icon: AlertTriangle },
      at_risk: { color: 'bg-red-600', text: 'At Risk', icon: AlertTriangle }
    };

    const config = statusConfig[status] || statusConfig.on_track;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const InitiativeCard = ({ initiative }) => (
    <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-brand-text-primary mb-2">{initiative.title}</CardTitle>
            <p className="text-sm text-brand-text-secondary mb-3">{initiative.description}</p>
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(initiative.status)}
              {getPriorityBadge(initiative.priority)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-brand-text-secondary">Progress</span>
              <span className="text-sm font-medium text-brand-text-primary">{initiative.progress}%</span>
            </div>
            <Progress value={initiative.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-brand-text-secondary">Owner</div>
              <div className="font-medium text-brand-text-primary">{initiative.owner}</div>
            </div>
            <div>
              <div className="text-brand-text-secondary">Target Date</div>
              <div className="font-medium text-brand-text-primary">{new Date(initiative.targetDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-brand-text-secondary">Budget</div>
              <div className="font-medium text-brand-text-primary">${(initiative.budget / 1000000).toFixed(1)}M</div>
            </div>
            <div>
              <div className="text-brand-text-secondary">Spent</div>
              <div className="font-medium text-brand-text-primary">${(initiative.spent / 1000000).toFixed(1)}M</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-brand-text-secondary mb-2">Key Milestones</div>
            <div className="space-y-1">
              {initiative.milestones.slice(0, 2).map((milestone, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {milestone.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-brand-text-secondary" />
                  )}
                  <span className={milestone.completed ? 'text-brand-text-primary' : 'text-brand-text-secondary'}>
                    {milestone.name}
                  </span>
                </div>
              ))}
              {initiative.milestones.length > 2 && (
                <div className="text-xs text-brand-text-secondary">
                  +{initiative.milestones.length - 2} more milestones
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-brand-border">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const KPICard = ({ kpi }) => {
    const progressPercentage = (kpi.current / kpi.target) * 100;
    
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base text-brand-text-primary">{kpi.name}</CardTitle>
              <p className="text-sm text-brand-text-secondary mt-1">{kpi.category}</p>
            </div>
            {getKPIStatusBadge(kpi.status)}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-text-primary">
                {kpi.current}{kpi.unit}
              </div>
              <div className="text-sm text-brand-text-secondary">
                Target: {kpi.target}{kpi.unit}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-brand-text-secondary">Progress to Target</span>
                <span className="text-xs font-medium text-brand-text-primary">
                  {Math.min(progressPercentage, 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className={`w-4 h-4 ${kpi.trend === 'up' ? 'text-green-500' : kpi.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
                <span className="text-brand-text-secondary">
                  {kpi.trend === 'up' ? 'Trending Up' : kpi.trend === 'down' ? 'Trending Down' : 'Stable'}
                </span>
              </div>
              <span className="text-brand-text-secondary">
                Updated {new Date(kpi.lastUpdated).toLocaleDateString()}
              </span>
            </div>

            <p className="text-xs text-brand-text-secondary">{kpi.description}</p>
          </div>
        </CardContent>
      </Card>
    );
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
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Strategic Planning Hub</h2>
            <p className="text-brand-text-secondary">Manage organizational strategy, initiatives, and key performance indicators</p>
          </div>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          New Initiative
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {planningStats.map((stat, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">{stat.title}</p>
                  <p className="text-2xl font-bold text-brand-text-primary">{stat.value}</p>
                  <p className="text-xs text-brand-text-secondary">{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="initiatives">Strategic Initiatives</TabsTrigger>
          <TabsTrigger value="kpis">Key Performance Indicators</TabsTrigger>
          <TabsTrigger value="roadmap">Strategic Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Strategic Initiatives Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {initiatives.slice(0, 3).map((initiative) => (
                    <div key={initiative.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-brand-text-primary">{initiative.title}</span>
                        <span className="text-sm text-brand-text-secondary">{initiative.progress}%</span>
                      </div>
                      <Progress value={initiative.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>KPI Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kpis.slice(0, 4).map((kpi) => (
                    <div key={kpi.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-brand-text-primary">{kpi.name}</p>
                        <p className="text-xs text-brand-text-secondary">{kpi.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brand-text-primary">{kpi.current}{kpi.unit}</p>
                        {getKPIStatusBadge(kpi.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="initiatives" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {initiatives.map((initiative) => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kpis" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {kpis.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Strategic Roadmap Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-brand-text-secondary">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Interactive roadmap visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}