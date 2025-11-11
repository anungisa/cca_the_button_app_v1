import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle, AlertTriangle, XCircle, TrendingUp, Target,
  Database, BarChart3, Users, DollarSign, Trophy, Building,
  Globe, Shield, Brain, Zap, ArrowRight, Download, 
  ChevronRight, Calendar, Heart, Video, Eye, FileText,
  Layers, GitBranch, Lock, Unlock, Circle
} from 'lucide-react';
import { usePermissions } from '../components/hooks/usePermissions';

export default function DataStrategyAssessment() {
  const { permissions } = usePermissions();
  const [selectedDomain, setSelectedDomain] = useState('overview');

  // Strategic Opportunities by Domain (from BDO slides)
  const strategicDomains = [
    {
      id: 'high_performance',
      name: 'High Performance',
      icon: Trophy,
      color: 'amber',
      opportunities: [
        {
          title: 'Integrated Performance Analytics',
          description: 'Real-time, data-driven performance enhancement for athletes',
          dataNeeds: ['N1', 'N4', 'N5'],
          dataSources: ['Dartfish', 'Smart Broom', 'Shot Tracker', 'Teamworks'],
          readiness: 65,
          status: 'in_progress'
        },
        {
          title: 'Real-Time Tactical Analytics',
          description: 'Improve tactical in-game decision making',
          dataNeeds: ['N1', 'N2', 'N5'],
          dataSources: ['Curling.io', 'CTRS', 'Shot Tracker'],
          readiness: 45,
          status: 'planned'
        },
        {
          title: 'Web & Legacy Media Analytics',
          description: 'Click-through and legacy media data for athletes',
          dataNeeds: ['N1', 'N2', 'N3', 'N5'],
          dataSources: ['YouTube', 'Social Media', 'Google Analytics'],
          readiness: 55,
          status: 'in_progress'
        }
      ]
    },
    {
      id: 'events',
      name: 'Events',
      icon: Calendar,
      color: 'blue',
      opportunities: [
        {
          title: 'Broadcast Viewership Time Series',
          description: 'Viewership, ratings, and demographics analysis',
          dataNeeds: ['N1', 'N2', 'N3', 'N4', 'N5'],
          dataSources: ['TSN', 'YouTube', 'Streaming Analytics'],
          readiness: 40,
          status: 'planned'
        },
        {
          title: 'Event Revenue Monitoring',
          description: 'Measure, report and predict financial performance of events',
          dataNeeds: ['N2', 'N3', 'N4', 'N6'],
          dataSources: ['Ticketmaster', 'QuickBooks', 'Budgyt'],
          readiness: 50,
          status: 'in_progress'
        },
        {
          title: 'Sponsorship Impact Measurement',
          description: 'Measure sponsor, donor & growth initiatives impact',
          dataNeeds: ['N2', 'N3', 'N4', 'N5', 'N6'],
          dataSources: ['Vividata', 'Google Analytics', 'Brandwatch', 'PointsBet'],
          readiness: 35,
          status: 'early'
        }
      ]
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: DollarSign,
      color: 'green',
      opportunities: [
        {
          title: 'Revenue Reporting & Forecasting',
          description: 'Purchase orders, shared services, merchandise, ticket sales',
          dataNeeds: ['N2', 'N3', 'N4', 'N6'],
          dataSources: ['QuickBooks', 'Budgyt', 'Shopify', 'Ticketmaster', 'Stripe', 'Moneris'],
          readiness: 70,
          status: 'in_progress'
        },
        {
          title: 'Cash Flow & Capital Monitoring',
          description: 'Historical budget analysis and Statement of Activities',
          dataNeeds: ['N2', 'N3', 'N4', 'N6'],
          dataSources: ['QuickBooks', 'Budgyt', 'ApprovalMax'],
          readiness: 60,
          status: 'in_progress'
        },
        {
          title: 'Financial Performance Insights',
          description: 'Analysis beyond financial position to predict event/championship performance',
          dataNeeds: ['N2', 'N3', 'N4', 'N6'],
          dataSources: ['QuickBooks', 'Event Data', 'Survey Data'],
          readiness: 30,
          status: 'early'
        }
      ]
    },
    {
      id: 'club_operations',
      name: 'Club Operations',
      icon: Building,
      color: 'indigo',
      opportunities: [
        {
          title: '360-Degree Curler View',
          description: 'Complete view of curler lifecycle and engagement',
          dataNeeds: ['N2', 'N3', 'N4', 'N6'],
          dataSources: ['CurlingReg', 'The Button', 'Club Survey', 'Event Data'],
          readiness: 55,
          status: 'in_progress'
        },
        {
          title: 'Club Growth Impact Analysis',
          description: 'Nationwide growth and development initiatives tracking',
          dataNeeds: ['N1', 'N2', 'N3', 'N4', 'N6'],
          dataSources: ['Club Survey', 'CurlingReg', 'The Button XP'],
          readiness: 50,
          status: 'in_progress'
        },
        {
          title: 'Demographic Insights',
          description: 'Demographics of the curling population for planning',
          dataNeeds: ['N2', 'N3', 'N4', 'N6'],
          dataSources: ['CurlingReg', 'Survey Data', 'The Button'],
          readiness: 45,
          status: 'planned'
        }
      ]
    },
    {
      id: 'fundraising',
      name: 'Fundraising & Philanthropy',
      icon: Heart,
      color: 'pink',
      opportunities: [
        {
          title: 'Donor Lifecycle Tracking',
          description: 'Measure efficacy of donation leading to new potential donors',
          dataNeeds: ['N2', 'N3', 'N4', 'N6'],
          dataSources: ['DonorPerfect', 'GiveCloud', 'The Button'],
          readiness: 40,
          status: 'planned'
        },
        {
          title: 'Donor Trend Analysis',
          description: 'Trend analysis by amount, region, entity',
          dataNeeds: ['N2', 'N3', 'N4', 'N5', 'N6'],
          dataSources: ['DonorPerfect', 'GiveCloud'],
          readiness: 50,
          status: 'in_progress'
        },
        {
          title: 'Donor Engagement & Retention',
          description: 'Increase donor pool and boost popularity',
          dataNeeds: ['N2', 'N3', 'N4', 'N6'],
          dataSources: ['DonorPerfect', 'Event Data', 'The Button XP'],
          readiness: 35,
          status: 'early'
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing & Fan Experience',
      icon: Eye,
      color: 'purple',
      opportunities: [
        {
          title: 'Audience Behavior Analytics',
          description: 'Identify audience behavior patterns for improved decision-making',
          dataNeeds: ['N1', 'N2', 'N3', 'N4', 'N5'],
          dataSources: ['Google Analytics', 'Streaming', 'Social Media', 'Ticketmaster'],
          readiness: 60,
          status: 'in_progress'
        },
        {
          title: 'Viewership Trends Analysis',
          description: 'Demographics and factors for improved sponsor ad spend',
          dataNeeds: ['N1', 'N2', 'N3', 'N4', 'N5'],
          dataSources: ['TSN', 'YouTube', 'Vividata', 'Google Analytics'],
          readiness: 45,
          status: 'planned'
        },
        {
          title: 'Sponsorship ROI Tracking',
          description: 'Web-ad, click-through, viewership metrics for sponsors',
          dataNeeds: ['N1', 'N2', 'N3', 'N4', 'N6'],
          dataSources: ['Vividata', 'PointsBet', 'Brandwatch', 'Google Analytics'],
          readiness: 40,
          status: 'planned'
        }
      ]
    },
    {
      id: 'ist',
      name: 'IST & System Performance',
      icon: Database,
      color: 'teal',
      opportunities: [
        {
          title: 'System Performance Monitoring',
          description: 'Monitor uptime, downtime, performance for all systems',
          dataNeeds: ['N2', 'N3', 'N4'],
          dataSources: ['AWS', 'Heroku', 'MongoDB', 'Supabase Health'],
          readiness: 75,
          status: 'active'
        },
        {
          title: 'Service Ticket Trend Analysis',
          description: 'Enhance system effectiveness and minimize downtime',
          dataNeeds: ['N2', 'N3', 'N4'],
          dataSources: ['Zendesk', 'GitHub', 'System Logs'],
          readiness: 65,
          status: 'in_progress'
        },
        {
          title: 'Cybersecurity Analytics',
          description: 'UX/UI engagement analysis and security monitoring',
          dataNeeds: ['N2', 'N3', 'N4'],
          dataSources: ['AWS', 'System Logs', 'Audit Logs'],
          readiness: 55,
          status: 'in_progress'
        }
      ]
    },
    {
      id: 'leadership',
      name: 'Leadership & Strategy',
      icon: Target,
      color: 'red',
      opportunities: [
        {
          title: 'Executive Dashboards',
          description: 'Plans, budgets, and results for C-level decisions',
          dataNeeds: ['N2', 'N4', 'N6'],
          dataSources: ['DOMO', 'All Integrations'],
          readiness: 70,
          status: 'in_progress'
        },
        {
          title: 'Stakeholder Engagement Metrics',
          description: 'Donor, sponsor, and member engagement tracking',
          dataNeeds: ['N2', 'N3', 'N4', 'N6'],
          dataSources: ['DonorPerfect', 'Sponsorship Data', 'The Button'],
          readiness: 50,
          status: 'in_progress'
        },
        {
          title: 'Organizational Performance',
          description: 'Departmental efficiency and effectiveness metrics',
          dataNeeds: ['N2', 'N3', 'N4'],
          dataSources: ['ADP', 'Task Data', 'Project Data'],
          readiness: 45,
          status: 'planned'
        }
      ]
    }
  ];

  // Consolidated Data Needs (N1-N12)
  const dataNeeds = [
    {
      id: 'N1',
      name: 'Self-Service Analytics',
      description: 'Provide ability for users to ingest, model, save and analyze datasets (market data, research insights, website analytics, etc.)',
      priority: 'high',
      complexity: 'high',
      status: 'partial',
      progress: 40,
      supportingSystems: ['DOMO', 'MongoDB', 'The Button Analytics'],
      estimatedEffort: '6-9 months',
      dependencies: ['N3', 'N7']
    },
    {
      id: 'N2',
      name: 'Elevating Data Literacy',
      description: 'Define data literacy model; measure across organization; implement training, hiring, and performance plans',
      priority: 'critical',
      complexity: 'medium',
      status: 'not_started',
      progress: 10,
      supportingSystems: ['Internal Training', 'HR Systems'],
      estimatedEffort: '3-6 months',
      dependencies: []
    },
    {
      id: 'N3',
      name: 'Business Intuitive Single Source of Truth',
      description: 'Centralized, integrated data store (EDW/Data Warehouse, Data Lake, Lakehouse, Semantic Layers)',
      priority: 'critical',
      complexity: 'high',
      status: 'in_progress',
      progress: 60,
      supportingSystems: ['Supabase', 'DOMO', 'MongoDB'],
      estimatedEffort: '9-12 months',
      dependencies: ['N7', 'N8']
    },
    {
      id: 'N4',
      name: 'Operational Management BI',
      description: 'Future state BI strategy with use-cases, data backbone, and BI platform for departmental decision making',
      priority: 'high',
      complexity: 'high',
      status: 'in_progress',
      progress: 50,
      supportingSystems: ['DOMO', 'The Button Dashboards'],
      estimatedEffort: '6-12 months',
      dependencies: ['N3', 'N5']
    },
    {
      id: 'N5',
      name: 'Advanced Analytics, AI and Data Science',
      description: 'Strategy for prediction, classification, resource needs, AI models and analytics platform',
      priority: 'high',
      complexity: 'very_high',
      status: 'early',
      progress: 25,
      supportingSystems: ['AI Service', 'Python/R Environment'],
      estimatedEffort: '12-18 months',
      dependencies: ['N1', 'N3', 'N4']
    },
    {
      id: 'N6',
      name: 'Secure Data Sharing',
      description: 'Design and implement secure model for cross-department data access',
      priority: 'high',
      complexity: 'medium',
      status: 'partial',
      progress: 55,
      supportingSystems: ['Security Service', 'Permission System'],
      estimatedEffort: '4-6 months',
      dependencies: ['N7', 'N12']
    },
    {
      id: 'N7',
      name: 'Data Management & Governance',
      description: 'Define DG solution; establish business glossary, data profiling & quality management',
      priority: 'critical',
      complexity: 'medium',
      status: 'partial',
      progress: 35,
      supportingSystems: ['Data Governance Office (to be established)'],
      estimatedEffort: '6-9 months',
      dependencies: []
    },
    {
      id: 'N8',
      name: 'Automation & Rationalization',
      description: 'Address limited automation and data asset rationalization',
      priority: 'high',
      complexity: 'high',
      status: 'in_progress',
      progress: 45,
      supportingSystems: ['Zapier', 'Workflows', 'Heroku Scheduler'],
      estimatedEffort: '6-12 months',
      dependencies: ['N3']
    },
    {
      id: 'N9',
      name: 'Master Data Management',
      description: 'Define and implement master data strategy',
      priority: 'medium',
      complexity: 'high',
      status: 'not_started',
      progress: 5,
      supportingSystems: ['To Be Determined'],
      estimatedEffort: '9-12 months',
      dependencies: ['N3', 'N7']
    },
    {
      id: 'N10',
      name: 'Technical Architecture & Governance',
      description: 'Define and manage enterprise architecture for systems, SSoT and analytics',
      priority: 'medium',
      complexity: 'high',
      status: 'partial',
      progress: 40,
      supportingSystems: ['Base44 Platform', 'Integration Hub'],
      estimatedEffort: '6-9 months',
      dependencies: ['N3', 'N11']
    },
    {
      id: 'N11',
      name: 'System Integration & External Integration',
      description: 'Establish integration between source systems',
      priority: 'high',
      complexity: 'very_high',
      status: 'in_progress',
      progress: 70,
      supportingSystems: ['42 Integrations', 'API Gateway'],
      estimatedEffort: 'Ongoing',
      dependencies: ['N8']
    },
    {
      id: 'N12',
      name: 'Data Governance Implementation',
      description: 'Setup Data Governance Office; define processes, policies, procedures, enforcement',
      priority: 'critical',
      complexity: 'high',
      status: 'not_started',
      progress: 15,
      supportingSystems: ['To Be Established'],
      estimatedEffort: '9-12 months',
      dependencies: ['N7']
    }
  ];

  // Data Maturity Pillars (from BDO requirements slide)
  const maturityPillars = [
    {
      pillar: 'Data Management',
      challenges: [
        'Lack of common data definitions, business glossary',
        'Limited data quality management',
        'Limited data lifecycle management'
      ],
      recommendations: ['N7', 'N8'],
      currentScore: 35,
      targetScore: 85
    },
    {
      pillar: 'Insights & Analytics',
      challenges: [
        'Limited core analytics (BI) and self-service strategy',
        'Lack of integrated data repository',
        'Need for advancement of integration technologies',
        'Lack of advanced analytics strategy'
      ],
      recommendations: ['N1', 'N3', 'N4', 'N5'],
      currentScore: 45,
      targetScore: 90
    },
    {
      pillar: 'Data Governance',
      challenges: [
        'Limited data leadership and governance',
        'Lack of operationalization of Data & Analytics Operating Model',
        'Lack of governance monitoring and enforcement'
      ],
      recommendations: ['N12'],
      currentScore: 25,
      targetScore: 85
    },
    {
      pillar: 'Data Driven Culture',
      challenges: [
        'Limited data sharing (democratization)',
        'Limited skillset requirements, training and enablement'
      ],
      recommendations: ['N2'],
      currentScore: 30,
      targetScore: 80
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'planned': return <Circle className="w-5 h-5 text-blue-500" />;
      case 'early': return <Circle className="w-5 h-5 text-gray-500" />;
      default: return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'planned': return 'bg-blue-500/20 text-blue-400';
      case 'early': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-red-500/20 text-red-400';
    }
  };

  const getReadinessColor = (readiness) => {
    if (readiness >= 70) return 'text-green-500';
    if (readiness >= 50) return 'text-yellow-500';
    if (readiness >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Calculate overall readiness
  const calculateOverallReadiness = () => {
    const allOpportunities = strategicDomains.flatMap(d => d.opportunities);
    const avgReadiness = allOpportunities.reduce((sum, opp) => sum + opp.readiness, 0) / allOpportunities.length;
    return Math.round(avgReadiness);
  };

  const overallReadiness = calculateOverallReadiness();

  if (!permissions?.canAccessPlatformSettings) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">
          You don't have permission to view this assessment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Data Strategy Readiness Assessment
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Strategic opportunities, data needs, and implementation roadmap
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overall Readiness Score */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-8">
            <div>
              <div className={`text-6xl font-bold ${getReadinessColor(overallReadiness)}`}>
                {overallReadiness}%
              </div>
              <div className="text-sm text-brand-text-secondary mt-2">
                Overall Data Readiness
              </div>
            </div>
            <div className="flex-1">
              <Progress value={overallReadiness} className="h-3 mb-4" />
              <div className="grid grid-cols-4 gap-4 text-center text-xs">
                <div>
                  <div className="font-bold text-green-400">
                    {strategicDomains.flatMap(d => d.opportunities).filter(o => o.readiness >= 60).length}
                  </div>
                  <div className="text-brand-text-secondary">Ready (60%+)</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-400">
                    {strategicDomains.flatMap(d => d.opportunities).filter(o => o.readiness >= 40 && o.readiness < 60).length}
                  </div>
                  <div className="text-brand-text-secondary">In Progress</div>
                </div>
                <div>
                  <div className="font-bold text-orange-400">
                    {strategicDomains.flatMap(d => d.opportunities).filter(o => o.readiness < 40).length}
                  </div>
                  <div className="text-brand-text-secondary">Early Stage</div>
                </div>
                <div>
                  <div className="font-bold text-blue-400">
                    {dataNeeds.filter(n => n.status === 'not_started').length}
                  </div>
                  <div className="text-brand-text-secondary">Not Started</div>
                </div>
              </div>
            </div>
          </div>

          <Alert className="mt-6 border-purple-500/50 bg-purple-500/10">
            <Brain className="h-4 w-4 text-purple-400" />
            <AlertTitle className="text-purple-400">BDO Assessment Framework</AlertTitle>
            <AlertDescription className="text-brand-text-secondary">
              This assessment is based on the strategic data opportunities identified by BDO in their 
              comprehensive review of Curling Canada's data landscape across 8 business domains.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs value={selectedDomain} onValueChange={setSelectedDomain} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="capabilities">Data Needs</TabsTrigger>
          <TabsTrigger value="maturity">Maturity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Domain Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {strategicDomains.map((domain) => {
              const Icon = domain.icon;
              const avgReadiness = Math.round(
                domain.opportunities.reduce((sum, opp) => sum + opp.readiness, 0) / domain.opportunities.length
              );
              
              return (
                <Card 
                  key={domain.id} 
                  className="bg-brand-card-bg border-brand-border hover:border-brand-red/50 cursor-pointer transition-all"
                  onClick={() => setSelectedDomain('opportunities')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-${domain.color}-500/20 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${domain.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-brand-text-primary text-sm">{domain.name}</p>
                        <p className="text-xs text-brand-text-secondary">{domain.opportunities.length} opportunities</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-brand-text-secondary">Readiness</span>
                        <span className={`font-bold ${getReadinessColor(avgReadiness)}`}>{avgReadiness}%</span>
                      </div>
                      <Progress value={avgReadiness} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Critical Path */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Critical Path to Data Maturity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Phase 1 */}
                <div className="p-4 bg-gradient-to-br from-red-950/20 to-orange-950/20 rounded-lg border border-red-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-red-500">Phase 1: Foundation (0-6 months)</Badge>
                    <Badge variant="outline">Critical Priority</Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                      <p className="font-medium text-brand-text-primary text-sm mb-1">N7: Data Governance</p>
                      <p className="text-xs text-brand-text-secondary">Establish DG office and policies</p>
                      <Progress value={35} className="h-1 mt-2" />
                    </div>
                    <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                      <p className="font-medium text-brand-text-primary text-sm mb-1">N2: Data Literacy</p>
                      <p className="text-xs text-brand-text-secondary">Training and hiring plans</p>
                      <Progress value={10} className="h-1 mt-2" />
                    </div>
                    <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                      <p className="font-medium text-brand-text-primary text-sm mb-1">N11: System Integration</p>
                      <p className="text-xs text-brand-text-secondary">Complete 42 integrations</p>
                      <Progress value={70} className="h-1 mt-2" />
                    </div>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="p-4 bg-gradient-to-br from-yellow-950/20 to-amber-950/20 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-yellow-500">Phase 2: Infrastructure (6-12 months)</Badge>
                    <Badge variant="outline">High Priority</Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                      <p className="font-medium text-brand-text-primary text-sm mb-1">N3: Single Source of Truth</p>
                      <p className="text-xs text-brand-text-secondary">Data warehouse/lakehouse</p>
                      <Progress value={60} className="h-1 mt-2" />
                    </div>
                    <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                      <p className="font-medium text-brand-text-primary text-sm mb-1">N8: Automation</p>
                      <p className="text-xs text-brand-text-secondary">Rationalize data assets</p>
                      <Progress value={45} className="h-1 mt-2" />
                    </div>
                    <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                      <p className="font-medium text-brand-text-primary text-sm mb-1">N6: Data Sharing</p>
                      <p className="text-xs text-brand-text-secondary">Security and access model</p>
                      <Progress value={55} className="h-1 mt-2" />
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="p-4 bg-gradient-to-br from-blue-950/20 to-indigo-950/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-blue-500">Phase 3: Advanced Capabilities (12-18 months)</Badge>
                    <Badge variant="outline">High Priority</Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                      <p className="font-medium text-brand-text-primary text-sm mb-1">N4: Operational BI</p>
                      <p className="text-xs text-brand-text-secondary">Department dashboards</p>
                      <Progress value={50} className="h-1 mt-2" />
                    </div>
                    <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                      <p className="font-medium text-brand-text-primary text-sm mb-1">N1: Self-Service Analytics</p>
                      <p className="text-xs text-brand-text-secondary">User empowerment</p>
                      <Progress value={40} className="h-1 mt-2" />
                    </div>
                    <div className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                      <p className="font-medium text-brand-text-primary text-sm mb-1">N5: AI & Data Science</p>
                      <p className="text-xs text-brand-text-secondary">Predictive analytics</p>
                      <Progress value={25} className="h-1 mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text-secondary">Total Opportunities</p>
                    <p className="text-3xl font-bold text-brand-text-primary">
                      {strategicDomains.flatMap(d => d.opportunities).length}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text-secondary">Data Capabilities</p>
                    <p className="text-3xl font-bold text-brand-text-primary">12</p>
                  </div>
                  <Layers className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text-secondary">Data Sources</p>
                    <p className="text-3xl font-bold text-brand-text-primary">42</p>
                  </div>
                  <Database className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text-secondary">Avg Readiness</p>
                    <p className={`text-3xl font-bold ${getReadinessColor(overallReadiness)}`}>
                      {overallReadiness}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Strategic Opportunities Tab */}
        <TabsContent value="opportunities" className="mt-6 space-y-6">
          {strategicDomains.map((domain) => {
            const Icon = domain.icon;
            
            return (
              <Card key={domain.id} className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className={`w-6 h-6 text-${domain.color}-400`} />
                    {domain.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {domain.opportunities.map((opp, idx) => (
                      <div key={idx} className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(opp.status)}
                              <h4 className="font-medium text-brand-text-primary">{opp.title}</h4>
                            </div>
                            <p className="text-sm text-brand-text-secondary mb-3">{opp.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-2xl font-bold ${getReadinessColor(opp.readiness)}`}>
                              {opp.readiness}%
                            </div>
                            <p className="text-xs text-brand-text-secondary">Ready</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs font-medium text-brand-text-secondary mb-2">Required Data Needs</p>
                            <div className="flex flex-wrap gap-1">
                              {opp.dataNeeds.map(need => (
                                <Badge key={need} variant="outline" className="text-xs">
                                  {need}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-brand-text-secondary mb-2">Data Sources</p>
                            <div className="flex flex-wrap gap-1">
                              {opp.dataSources.map(source => (
                                <Badge key={source} className="bg-blue-500/20 text-blue-400 text-xs">
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(opp.status)}>
                            {opp.status.replace('_', ' ')}
                          </Badge>
                          <Progress value={opp.readiness} className="h-2 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Data Capabilities Tab */}
        <TabsContent value="capabilities" className="mt-6 space-y-4">
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Database className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-400">12 Foundational Data Capabilities</AlertTitle>
            <AlertDescription className="text-brand-text-secondary">
              These capabilities act as a bridge between current state and target state, derived from BDO's data strategy.
            </AlertDescription>
          </Alert>

          {dataNeeds.map((need) => (
            <Card key={need.id} className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getPriorityColor(need.priority)}>
                        {need.priority}
                      </Badge>
                      <h4 className="font-bold text-brand-text-primary text-lg">{need.id}: {need.name}</h4>
                    </div>
                    <p className="text-sm text-brand-text-secondary mb-3">{need.description}</p>
                  </div>
                  <div className="text-right ml-6">
                    <div className={`text-3xl font-bold ${getReadinessColor(need.progress)}`}>
                      {need.progress}%
                    </div>
                    <p className="text-xs text-brand-text-secondary">Complete</p>
                  </div>
                </div>

                <Progress value={need.progress} className="h-2 mb-4" />

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-brand-text-secondary mb-2">Status</p>
                    <Badge className={getStatusColor(need.status)}>
                      {need.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-brand-text-secondary mb-2">Estimated Effort</p>
                    <p className="text-sm text-brand-text-primary">{need.estimatedEffort}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-brand-text-secondary mb-2">Complexity</p>
                    <Badge variant="outline" className="text-xs">
                      {need.complexity.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {need.dependencies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-brand-border">
                    <p className="text-xs font-medium text-brand-text-secondary mb-2">Dependencies</p>
                    <div className="flex flex-wrap gap-2">
                      {need.dependencies.map(dep => (
                        <Badge key={dep} variant="outline" className="text-xs">
                          Requires {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-brand-border">
                  <p className="text-xs font-medium text-brand-text-secondary mb-2">Supporting Systems</p>
                  <div className="flex flex-wrap gap-2">
                    {need.supportingSystems.map((system, idx) => (
                      <span key={idx} className="text-xs text-brand-text-primary bg-brand-charcoal/50 px-2 py-1 rounded">
                        {system}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Data Maturity Tab */}
        <TabsContent value="maturity" className="mt-6 space-y-6">
          <Alert className="border-purple-500/50 bg-purple-500/10">
            <Brain className="h-4 w-4 text-purple-400" />
            <AlertTitle className="text-purple-400">Data Maturity Assessment</AlertTitle>
            <AlertDescription className="text-brand-text-secondary">
              Current state analysis across four key pillars of data maturity, based on BDO's framework.
            </AlertDescription>
          </Alert>

          {maturityPillars.map((pillar, idx) => (
            <Card key={idx} className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pillar.pillar}</CardTitle>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getReadinessColor(pillar.currentScore)}`}>
                      {pillar.currentScore}/100
                    </div>
                    <p className="text-xs text-brand-text-secondary">Target: {pillar.targetScore}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-text-secondary">Current Maturity</span>
                    <span className="text-brand-text-primary">{pillar.currentScore}%</span>
                  </div>
                  <Progress value={pillar.currentScore} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-secondary">Target Maturity</span>
                    <span className="text-green-400">{pillar.targetScore}%</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    Key Challenges
                  </h5>
                  <ul className="space-y-2">
                    {pillar.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-brand-text-secondary">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Recommended Data Needs
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {pillar.recommendations.map(rec => {
                      const need = dataNeeds.find(n => n.id === rec);
                      return (
                        <div key={rec} className="flex items-center gap-2 p-2 bg-brand-charcoal/50 rounded border border-brand-border">
                          <Badge className={getPriorityColor(need?.priority || 'medium')}>
                            {rec}
                          </Badge>
                          <span className="text-xs text-brand-text-primary">{need?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Maturity Progression */}
          <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30">
            <CardHeader>
              <CardTitle>Maturity Progression Path</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Data Management</span>
                      <span className="text-sm text-brand-text-secondary">35% → 85%</span>
                    </div>
                    <div className="relative h-2 bg-brand-border rounded-full overflow-hidden">
                      <div className="absolute h-full bg-red-500/30" style={{width: '35%'}}></div>
                      <div className="absolute h-full bg-green-500/50" style={{width: '85%', opacity: 0.3}}></div>
                    </div>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400">+50 pts needed</Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Insights & Analytics</span>
                      <span className="text-sm text-brand-text-secondary">45% → 90%</span>
                    </div>
                    <div className="relative h-2 bg-brand-border rounded-full overflow-hidden">
                      <div className="absolute h-full bg-yellow-500/30" style={{width: '45%'}}></div>
                      <div className="absolute h-full bg-green-500/50" style={{width: '90%', opacity: 0.3}}></div>
                    </div>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400">+45 pts needed</Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Data Governance</span>
                      <span className="text-sm text-brand-text-secondary">25% → 85%</span>
                    </div>
                    <div className="relative h-2 bg-brand-border rounded-full overflow-hidden">
                      <div className="absolute h-full bg-red-500/30" style={{width: '25%'}}></div>
                      <div className="absolute h-full bg-green-500/50" style={{width: '85%', opacity: 0.3}}></div>
                    </div>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400">+60 pts needed</Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Data Driven Culture</span>
                      <span className="text-sm text-brand-text-secondary">30% → 80%</span>
                    </div>
                    <div className="relative h-2 bg-brand-border rounded-full overflow-hidden">
                      <div className="absolute h-full bg-red-500/30" style={{width: '30%'}}></div>
                      <div className="absolute h-full bg-green-500/50" style={{width: '80%', opacity: 0.3}}></div>
                    </div>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400">+50 pts needed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Next Steps */}
      <Card className="bg-gradient-to-br from-brand-red/20 to-purple-950/20 border-brand-red/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-6 h-6" />
            Immediate Next Steps for SMT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-red-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-red-400">1</span>
                </div>
                <div>
                  <h5 className="font-bold text-brand-text-primary mb-1">Establish Data Governance Office (N7, N12)</h5>
                  <p className="text-sm text-brand-text-secondary mb-2">
                    Critical foundation for all other initiatives. Appoint Chief Data Officer, define policies, create business glossary.
                  </p>
                  <Badge className="bg-red-500">Critical - Start Immediately</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-orange-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-orange-400">2</span>
                </div>
                <div>
                  <h5 className="font-bold text-brand-text-primary mb-1">Complete Integration Buildout (N11)</h5>
                  <p className="text-sm text-brand-text-secondary mb-2">
                    Finish connecting remaining systems (currently 70% complete). Priority: Dartfish, DonorPerfect, Shopify.
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-yellow-500">High Priority</Badge>
                    <Badge variant="outline">3-6 months</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-yellow-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-yellow-400">3</span>
                </div>
                <div>
                  <h5 className="font-bold text-brand-text-primary mb-1">Implement Data Literacy Program (N2)</h5>
                  <p className="text-sm text-brand-text-secondary mb-2">
                    Define data literacy model, implement training across departments, update hiring requirements.
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-red-500">Critical</Badge>
                    <Badge variant="outline">3-4 months</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-blue-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-400">4</span>
                </div>
                <div>
                  <h5 className="font-bold text-brand-text-primary mb-1">Build Single Source of Truth (N3)</h5>
                  <p className="text-sm text-brand-text-secondary mb-2">
                    Implement data warehouse/lakehouse architecture. Currently using Supabase + MongoDB + DOMO - formalize strategy.
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-red-500">Critical</Badge>
                    <Badge variant="outline">9-12 months</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-purple-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-purple-400">5</span>
                </div>
                <div>
                  <h5 className="font-bold text-brand-text-primary mb-1">Develop BI & Analytics Strategy (N4, N5)</h5>
                  <p className="text-sm text-brand-text-secondary mb-2">
                    Define operational BI use-cases for each department. Plan advanced analytics including AI/ML capabilities.
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-yellow-500">High Priority</Badge>
                    <Badge variant="outline">6-12 months</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Summary */}
      <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Estimated Investment Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <p className="text-sm text-brand-text-secondary mb-1">Phase 1 (Foundation)</p>
              <p className="text-3xl font-bold text-brand-text-primary">$150K-$250K</p>
              <p className="text-xs text-brand-text-secondary mt-1">N7, N2, N11 completion</p>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <p className="text-sm text-brand-text-secondary mb-1">Phase 2 (Infrastructure)</p>
              <p className="text-3xl font-bold text-brand-text-primary">$200K-$350K</p>
              <p className="text-xs text-brand-text-secondary mt-1">N3, N8, N6 implementation</p>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <p className="text-sm text-brand-text-secondary mb-1">Phase 3 (Advanced)</p>
              <p className="text-3xl font-bold text-brand-text-primary">$250K-$400K</p>
              <p className="text-xs text-brand-text-secondary mt-1">N4, N1, N5 capabilities</p>
            </div>
          </div>

          <Alert className="mt-4 border-green-500/50 bg-green-500/10">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-brand-text-secondary">
              <strong>Estimated Total Investment:</strong> $600K-$1M over 18-24 months for complete data maturity transformation.
              Expected ROI through monetization, efficiency gains, and strategic decision-making improvement.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}