
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle, XCircle, AlertTriangle, TrendingUp, Target,
  Database, BarChart3, Shield, DollarSign, Calendar,
  GitBranch, Layers, Zap, Brain, Users, ArrowRight,
  Download, ExternalLink, ChevronRight, Circle, Award
} from 'lucide-react';
import { usePermissions } from '../components/hooks/usePermissions';

export default function BDOStrategyComparison() {
  const { permissions } = usePermissions();
  const [selectedView, setSelectedView] = useState('overview');

  // BDO's Detailed Recommendations (from slides)
  const bdoRecommendations = [
    {
      id: 'N1',
      name: 'Self Service Analytics',
      subTasks: [
        { id: 'N1.1', task: 'Define requirements, architecture and design for self-service analytics', status: 'in_progress', progress: 60 },
        { id: 'N1.2', task: 'Implement self-service analytics', status: 'planned', progress: 20 }
      ],
      phase: 'Phase 3: Optimize',
      timeline: 'Q1-Q2 2025',
      cost: { mvp: 0, recommended: 120000, full: 160000 },
      duration: '4-6 months'
    },
    {
      id: 'N2',
      name: 'Elevating Data Literacy',
      subTasks: [
        { id: 'N2.1', task: 'Define data literacy model and evaluate organization', status: 'not_started', progress: 10 },
        { id: 'N2.2', task: 'Implement training, hiring and performance plan for data', status: 'not_started', progress: 5 }
      ],
      phase: 'Phase 1: Establish',
      timeline: 'Q3-Q4 2023',
      cost: { mvp: 80000, recommended: 80000, full: 120000 },
      duration: '6-9 months'
    },
    {
      id: 'N3',
      name: 'Business Intuitive Single Source of Truth',
      subTasks: [
        { id: 'N3.1', task: 'Define SSoT Requirements, Design, Architecture & Data Model for in-scope/critical data', status: 'completed', progress: 100 },
        { id: 'N3.2', task: 'Establish SSoT and Security Model (critical operational data prioritized)', status: 'in_progress', progress: 70 },
        { id: 'N3.3', task: 'Enhance SSoT with the integration of priority domains & external data sources', status: 'in_progress', progress: 50 }
      ],
      phase: 'Phase 1-2: Establish & Scale',
      timeline: 'Q4 2022 - Q3 2024',
      cost: { mvp: 470000, recommended: 470000, full: 690000 },
      duration: '10-15 months'
    },
    {
      id: 'N4',
      name: 'Operations & Management Business Intelligence',
      subTasks: [
        { id: 'N4.1', task: 'BI Strategy & Pilot', status: 'completed', progress: 100 },
        { id: 'N4.2', task: 'BI Implementation - Critical Use cases', status: 'in_progress', progress: 65 },
        { id: 'N4.3', task: 'BI Implementation - Remaining Must-Have Use cases', status: 'planned', progress: 30 }
      ],
      phase: 'Phase 1-2: Establish & Scale',
      timeline: 'Q1 2023 - Q4 2024',
      cost: { mvp: 280000, recommended: 280000, full: 370000 },
      duration: '8-11 months'
    },
    {
      id: 'N5',
      name: 'Advanced Analytics, AI & Data Science',
      subTasks: [
        { id: 'N5.1', task: 'AI Strategy & Pilot', status: 'in_progress', progress: 40 },
        { id: 'N5.2', task: 'AI Implementation - Critical Use cases', status: 'early', progress: 15 }
      ],
      phase: 'Phase 2-3: Scale & Optimize',
      timeline: 'Q3 2024 - Q2 2025',
      cost: { mvp: 0, recommended: 250000, full: 340000 },
      duration: '9-12 months'
    },
    {
      id: 'N7',
      name: 'Data Management & Governance Solutions',
      subTasks: [
        { id: 'N7.1', task: 'Define DG Solution', status: 'not_started', progress: 5 },
        { id: 'N7.2', task: 'Establish a business glossary', status: 'not_started', progress: 0 },
        { id: 'N7.3', task: 'Establish Data Profiling & Quality Management', status: 'not_started', progress: 10 }
      ],
      phase: 'Phase 1-2: Establish & Scale',
      timeline: 'Q4 2022 - Q2 2024',
      cost: { mvp: 50000, recommended: 130000, full: 190000 },
      duration: '10-15 months'
    },
    {
      id: 'N8',
      name: 'Automation & Rationalization of Sources',
      subTasks: [
        { id: 'N8.1', task: 'Application Rationalization Planning', status: 'in_progress', progress: 45 }
      ],
      phase: 'Phase 1: Establish',
      timeline: 'Q1-Q2 2023',
      cost: { mvp: 0, recommended: 30000, full: 50000 },
      duration: '2-3 months'
    },
    {
      id: 'N12',
      name: 'Data Governance Implementation',
      subTasks: [
        { id: 'N12.1', task: 'Define DG & OM', status: 'not_started', progress: 0 },
        { id: 'N12.2', task: 'Setup Data Governance Office and Operationalize Roles', status: 'not_started', progress: 5 },
        { id: 'N12.3', task: 'Define data processes, policies & procedures', status: 'not_started', progress: 10 },
        { id: 'N12.4', task: 'Implement data processes, policies & procedures', status: 'not_started', progress: 0 }
      ],
      phase: 'Phase 1-3: All Phases',
      timeline: 'Q4 2022 - Q3 2025',
      cost: { mvp: 80000, recommended: 260000, full: 380000 },
      duration: '14-21 months'
    }
  ];

  // What we've actually built
  const currentStateImplementation = {
    'N1': {
      built: ['DOMO dashboards', 'The Button analytics', 'Self-serve reports in Platform'],
      gap: ['User-friendly analytics builder', 'Data modeling tools for non-technical users'],
      progress: 60
    },
    'N2': {
      built: ['Staff access to data tools', 'Basic training documentation'],
      gap: ['Formal data literacy model', 'Training curriculum', 'Hiring frameworks'],
      progress: 10
    },
    'N3': {
      built: ['Supabase database', 'MongoDB data lake', 'DOMO as semantic layer', '42 system integrations', 'The Button as master data hub'],
      gap: ['Formal data warehouse architecture', 'ETL/ELT processes', 'Data quality rules'],
      progress: 70
    },
    'N4': {
      built: ['Executive dashboards in DOMO', 'Department-specific analytics in The Button', 'StaffHQ operational views'],
      gap: ['Standardized BI platform strategy', 'Department-wide adoption', 'Self-service BI training'],
      progress: 65
    },
    'N5': {
      built: ['AI coaching companion', 'Predictive analytics engine', 'Sentiment analysis', 'XP recommendation engine'],
      gap: ['Formal AI strategy', 'ML model governance', 'Production-grade ML infrastructure'],
      progress: 40
    },
    'N6': {
      built: ['Role-based permissions in The Button', 'Secure API access', 'Data encryption'],
      gap: ['Formal data sharing agreements', 'Cross-department data catalog', 'Data access audit trail'],
      progress: 55
    },
    'N7': {
      built: ['Basic data dictionaries', 'System integration documentation'],
      gap: ['Business glossary', 'Data quality framework', 'Metadata management', 'Data lineage tracking'],
      progress: 15
    },
    'N8': {
      built: ['42 integrations', 'Automated workflows', 'Zapier automations', 'Scheduled jobs'],
      gap: ['Application consolidation plan', 'Legacy system sunset roadmap'],
      progress: 45
    },
    'N12': {
      built: ['Audit logging', 'Basic data policies'],
      gap: ['Data Governance Office', 'Chief Data Officer', 'DG operating model', 'Policy enforcement'],
      progress: 5
    }
  };

  // BDO's proposed architecture vs. our implementation
  const architectureComparison = {
    'Landing Zone': {
      bdo: 'Transient zone for uploaded data, can be wiped on user file drop-off',
      built: 'File uploads to Supabase Storage, temporary processing in functions',
      status: 'partial',
      progress: 70
    },
    'Curated Zone (Data Warehouse)': {
      bdo: 'Ready for consumption, data has been cleansed, validated, structured for optimal delivery',
      built: 'Supabase PostgreSQL + MongoDB for structured/semi-structured data',
      status: 'partial',
      progress: 60
    },
    'Consumption Zone (Semantic Layer)': {
      bdo: 'Data is ready to be queried using increased readability',
      built: 'DOMO semantic layer + The Button entity abstractions',
      status: 'good',
      progress: 75
    },
    'Experimentation Zone': {
      bdo: 'Data Science & Advanced Analytics sandbox',
      built: 'AI Service, predictive analytics in development',
      status: 'early',
      progress: 30
    },
    'Data Discovery & Enrichment': {
      bdo: 'Glossary, Policies & Procedures, Data Quality Management, Security Model',
      built: 'Basic audit logging, role-based security',
      status: 'gap',
      progress: 20
    },
    'Self-Service Portal': {
      bdo: 'Reports, Dashboards, Self-service Analytics, Data Storytelling, Shared Datasets',
      built: 'DOMO dashboards, The Button analytics, StaffHQ reporting',
      status: 'good',
      progress: 70
    }
  };

  // Application Rationalization - BDO Recommendations
  const rationalizationPlan = {
    recommended_to_consolidate: [
      { name: 'KIT', rationale: 'Integrate event volunteers, expense claims into unified CRM/Finance' },
      { name: 'Curling.io + Tickets + ActiveXchange', rationale: 'Consolidate into single event management platform' }
    ],
    recommended_to_integrate_with_crm: [
      { name: 'KIT', integration: 'Finance module into CRM (e.g., Dynamics 365 Finance)' },
      { name: 'Curling.io', integration: 'Event data into CRM opportunities' },
      { name: 'Tickets', integration: 'Ticketing into CRM contacts' },
      { name: 'ActiveXchange', integration: 'Demographics into CRM analytics' }
    ],
    our_approach: {
      built: 'The Button as unified platform with 42 integrations',
      strategy: 'Platform consolidation via The Button + selective best-of-breed integrations',
      savings: 'Eliminated need for multiple point solutions'
    }
  };

  // Cost comparison
  const costSummary = {
    bdo_total: {
      mvp: 960000,
      recommended: 1620000,
      full: 2300000
    },
    our_investment: {
      platform_dev: 850000, // Estimated for The Button development
      integrations: 200000, // 42 integrations
      ongoing_annual: 120000 // Maintenance
    },
    savings: {
      avoided_licenses: 300000, // By consolidating into The Button
      efficiency_gains: 150000 // Annual operational savings
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'partial': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'planned': return <Circle className="w-5 h-5 text-blue-500" />;
      case 'early': return <Circle className="w-5 h-5 text-orange-500" />;
      case 'not_started': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'gap': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    if (progress >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  if (!permissions?.canAccessPlatformSettings) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">
          You don't have permission to view this comparison.
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
            <GitBranch className="w-8 h-8" />
            BDO Strategy vs. Current Implementation
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Comparing BDO's 2022 data strategy recommendations with what we've built in The Button
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Analysis
        </Button>
      </div>

      {/* Executive Summary */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-blue-500/30">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">65%</div>
              <p className="text-sm text-brand-text-secondary">Overall Progress vs. BDO Plan</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">$1.05M</div>
              <p className="text-sm text-brand-text-secondary">Invested vs. $1.62M Recommended</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">5/8</div>
              <p className="text-sm text-brand-text-secondary">Data Needs Substantially Complete</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">42</div>
              <p className="text-sm text-brand-text-secondary">System Integrations (N11)</p>
            </div>
          </div>

          <Alert className="mt-6 border-purple-500/50 bg-purple-500/10">
            <Brain className="h-4 w-4 text-purple-400" />
            <AlertTitle className="text-purple-400">Key Finding</AlertTitle>
            <AlertDescription className="text-brand-text-secondary">
              <strong>The Button has successfully accelerated several Phase 2-3 capabilities</strong> (N4, N5, N11)
              while critical Phase 1 foundations (N2, N7, N12) remain incomplete. This represents a strategic
              opportunity to solidify the base for sustainable scale.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="rationalization">Rationalization</TabsTrigger>
          <TabsTrigger value="costs">Investment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Phase Progress */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge className="bg-red-500">Phase 1</Badge>
                  <span className="text-base">Establish</span>
                </CardTitle>
                <p className="text-xs text-brand-text-secondary">Foundation (2022-2023)</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-brand-text-secondary">Progress</span>
                      <span className="text-yellow-400 font-bold">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-3 h-3 text-red-500" />
                      <span className="text-brand-text-secondary">N7: Data Governance - Not Started</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-3 h-3 text-red-500" />
                      <span className="text-brand-text-secondary">N2: Data Literacy - Not Started</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      <span className="text-brand-text-secondary">N8: Automation - In Progress</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge className="bg-yellow-500">Phase 2</Badge>
                  <span className="text-base">Scale</span>
                </CardTitle>
                <p className="text-xs text-brand-text-secondary">Infrastructure (2023-2024)</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-brand-text-secondary">Progress</span>
                      <span className="text-yellow-400 font-bold">70%</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-brand-text-secondary">N3: SSoT - Substantially Complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      <span className="text-brand-text-secondary">N4: Operational BI - In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-brand-text-secondary">N11: Integrations - 70% Complete</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge className="bg-blue-500">Phase 3</Badge>
                  <span className="text-base">Optimize</span>
                </CardTitle>
                <p className="text-xs text-brand-text-secondary">Advanced (2024-2025)</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-brand-text-secondary">Progress</span>
                      <span className="text-orange-400 font-bold">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      <span className="text-brand-text-secondary">N5: AI & Data Science - Early Stage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="w-3 h-3 text-blue-500" />
                      <span className="text-brand-text-secondary">N1: Self-Service - Planned</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-brand-text-secondary">Advanced Features - Piloting</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Achievements */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-400" />
                What We've Built Beyond BDO's Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-950/20 rounded-lg border border-green-500/30">
                  <h4 className="font-bold text-brand-text-primary mb-2">The Button Platform</h4>
                  <p className="text-sm text-brand-text-secondary mb-3">
                    Built a comprehensive engagement platform that wasn't in original scope - acts as master data hub and user interface.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-500/20 text-green-400">XP & Loyalty System</Badge>
                    <Badge className="bg-green-500/20 text-green-400">42 Integrations</Badge>
                    <Badge className="bg-green-500/20 text-green-400">StaffHQ Ops Center</Badge>
                  </div>
                </div>

                <div className="p-4 bg-green-950/20 rounded-lg border border-green-500/30">
                  <h4 className="font-bold text-brand-text-primary mb-2">Advanced AI Capabilities</h4>
                  <p className="text-sm text-brand-text-secondary mb-3">
                    Accelerated AI implementation (N5) ahead of schedule with production features.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-500/20 text-green-400">Coaching Companion</Badge>
                    <Badge className="bg-green-500/20 text-green-400">Predictive Analytics</Badge>
                    <Badge className="bg-green-500/20 text-green-400">Smart Insights</Badge>
                  </div>
                </div>

                <div className="p-4 bg-green-950/20 rounded-lg border border-green-500/30">
                  <h4 className="font-bold text-brand-text-primary mb-2">Real-Time Data Flows</h4>
                  <p className="text-sm text-brand-text-secondary mb-3">
                    Implemented real-time data synchronization and webhooks beyond batch processing.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-500/20 text-green-400">Live Scoring</Badge>
                    <Badge className="bg-green-500/20 text-green-400">Event Webhooks</Badge>
                    <Badge className="bg-green-500/20 text-green-400">Instant Updates</Badge>
                  </div>
                </div>

                <div className="p-4 bg-green-950/20 rounded-lg border border-green-500/30">
                  <h4 className="font-bold text-brand-text-primary mb-2">Unified User Experience</h4>
                  <p className="text-sm text-brand-text-secondary mb-3">
                    Created single sign-on and unified interface across all data touchpoints.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-500/20 text-green-400">Single Login</Badge>
                    <Badge className="bg-green-500/20 text-green-400">Role-Based Access</Badge>
                    <Badge className="bg-green-500/20 text-green-400">Mobile Optimized</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-6 space-y-4">
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Database className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-400">BDO's Detailed Implementation Roadmap</AlertTitle>
            <AlertDescription className="text-brand-text-secondary">
              Each data need broken down into specific implementation tasks with timeline and cost estimates.
            </AlertDescription>
          </Alert>

          {bdoRecommendations.map((rec) => (
            <Card key={rec.id} className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-brand-red">{rec.id}</Badge>
                      <h3 className="font-bold text-brand-text-primary text-lg">{rec.name}</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-xs">{rec.phase}</Badge>
                      <Badge variant="outline" className="text-xs">{rec.timeline}</Badge>
                      <Badge variant="outline" className="text-xs">{rec.duration}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getProgressColor(currentStateImplementation[rec.id]?.progress || 0)}`}>
                      {currentStateImplementation[rec.id]?.progress || 0}%
                    </div>
                    <p className="text-xs text-brand-text-secondary">Our Progress</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* BDO Sub-tasks */}
                <div>
                  <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    BDO's Implementation Steps
                  </h4>
                  <div className="space-y-2">
                    {rec.subTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-brand-text-primary">{task.id}: {task.task}</p>
                            <span className={`text-sm font-bold ${getProgressColor(task.progress)}`}>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What We Built */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-950/20 rounded-lg border border-green-500/30">
                    <h5 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      What We've Built
                    </h5>
                    <ul className="space-y-1">
                      {currentStateImplementation[rec.id]?.built.map((item, idx) => (
                        <li key={idx} className="text-sm text-brand-text-secondary flex items-start gap-2">
                          <ChevronRight className="w-3 h-3 mt-0.5 text-green-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-red-950/20 rounded-lg border border-red-500/30">
                    <h5 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400" />
                      Remaining Gaps
                    </h5>
                    <ul className="space-y-1">
                      {currentStateImplementation[rec.id]?.gap.map((item, idx) => (
                        <li key={idx} className="text-sm text-brand-text-secondary flex items-start gap-2">
                          <ChevronRight className="w-3 h-3 mt-0.5 text-red-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Cost Comparison */}
                <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-brand-text-secondary mb-1">BDO Recommended Budget</p>
                      <p className="text-2xl font-bold text-brand-text-primary">
                        ${(rec.cost.recommended / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-brand-text-secondary" />
                    <div>
                      <p className="text-xs text-brand-text-secondary mb-1">Full Implementation</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        ${(rec.cost.full / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Architecture Comparison Tab */}
        <TabsContent value="architecture" className="mt-6 space-y-6">
          <Alert className="border-purple-500/50 bg-purple-500/10">
            <Layers className="h-4 w-4 text-purple-400" />
            <AlertTitle className="text-purple-400">Target Architecture: Data Lake with Zones</AlertTitle>
            <AlertDescription className="text-brand-text-secondary">
              BDO proposed a layered data lake architecture (Landing → Curated → Consumption) with
              governance, security, and self-service capabilities.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            {/* BDO Proposed */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg">BDO Proposed Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/686ddd789691a323a1380fee/18a88df89_image.png"
                  alt="BDO Target Architecture"
                  className="w-full rounded-lg border border-brand-border"
                />
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-brand-text-primary">Key Components:</p>
                  <ul className="space-y-1 text-brand-text-secondary">
                    <li>• Landing Zone (raw data ingestion)</li>
                    <li>• Curated Zone / Data Warehouse (cleaned, validated)</li>
                    <li>• Consumption Zone / Semantic Layer (business-ready)</li>
                    <li>• Experimentation Zone (AI/ML sandbox)</li>
                    <li>• Data Discovery & Enrichment (glossary, quality, security)</li>
                    <li>• Self-Service Portal (dashboards, reports, analytics)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Our Implementation */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg">Our Current Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                  <h4 className="font-bold text-brand-text-primary mb-3">The Button + DOMO Hybrid</h4>
                  <div className="space-y-3">
                    {Object.entries(architectureComparison).map(([zone, details]) => (
                      <div key={zone} className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(details.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-brand-text-primary text-sm">{zone}</h5>
                              <span className={`text-sm font-bold ${getProgressColor(details.progress)}`}>
                                {details.progress}%
                              </span>
                            </div>
                            <p className="text-xs text-brand-text-secondary mb-2"><strong>BDO:</strong> {details.bdo}</p>
                            <p className="text-xs text-green-400"><strong>Built:</strong> {details.built}</p>
                            <Progress value={details.progress} className="h-1 mt-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-brand-text-secondary text-sm">
                    <strong>Architecture Gap:</strong> We have functional equivalents for most zones, but lack
                    formal data governance layer and experimentation sandbox infrastructure.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Data Sources Mapping */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Sources: BDO Plan vs. Our Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-brand-text-primary mb-3">BDO Identified (2022)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">Curling.io</Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-brand-text-secondary">Integrated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">QuickBooks</Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-brand-text-secondary">Integrated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">Tickets</Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-brand-text-secondary">Integrated (Ticketmaster)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">ActiveXchange</Badge>
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-brand-text-secondary">Under Review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">DonorPerfect</Badge>
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-brand-text-secondary">In Development</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">Dartfish</Badge>
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-brand-text-secondary">In Development</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-brand-text-primary mb-3">Additional Systems We Integrated</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      'CurlingReg', 'GiveCloud', 'DOMO', 'MongoDB', 'Supabase',
                      'Stripe', 'Shopify', 'YouTube', 'TSN', 'Vividata',
                      'PointsBet', 'Teamworks', 'Smart Broom', 'Moodle', 'Sideline',
                      'Mailchimp', 'WordPress', 'HubSpot', 'DocuSign', 'M365',
                      'ADP', 'TrustEvent', 'Accredit', 'Brandwatch', 'Canto',
                      'Budgyt', 'Moneris', 'ApprovalMax', 'Zoom', 'Zapier',
                      'GitHub', 'Zendesk', 'Google Analytics', 'Formstack'
                    ].map(system => (
                      <Badge key={system} className="bg-green-500/20 text-green-400 text-xs">
                        {system}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-brand-text-secondary mt-3">
                    <strong className="text-green-400">42 total integrations</strong> - significantly exceeding BDO's initial scope
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Rationalization Tab */}
        <TabsContent value="rationalization" className="mt-6 space-y-6">
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <Zap className="h-4 w-4 text-orange-400" />
            <AlertTitle className="text-orange-400">BDO Recommendation: Application Rationalization</AlertTitle>
            <AlertDescription className="text-brand-text-secondary">
              BDO recommended consolidating KIT, Curling.io, Tickets, and ActiveXchange into a single CRM platform
              to reduce costs and improve data unification.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            {/* BDO's Consolidation Plan */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg">BDO's Consolidation Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-950/20 rounded-lg border border-red-500/30">
                  <h4 className="font-bold text-brand-text-primary mb-3">Systems to Consolidate</h4>
                  <div className="space-y-3">
                    {rationalizationPlan.recommended_to_consolidate.map((app, idx) => (
                      <div key={idx} className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                        <p className="font-medium text-brand-text-primary text-sm mb-1">{app.name}</p>
                        <p className="text-xs text-brand-text-secondary">{app.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-950/20 rounded-lg border border-blue-500/30">
                  <h4 className="font-bold text-brand-text-primary mb-3">Recommended CRM Integration</h4>
                  <p className="text-sm text-brand-text-secondary mb-3">
                    Integrate finance function with chosen CRM platform (e.g., Microsoft Dynamics 365)
                  </p>
                  <div className="space-y-2">
                    {rationalizationPlan.recommended_to_integrate_with_crm.map((app, idx) => (
                      <div key={idx} className="text-xs text-brand-text-secondary flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />
                        <span><strong>{app.name}:</strong> {app.integration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                  <h4 className="font-bold text-brand-text-primary mb-2">Expected Benefits</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-brand-text-secondary">Lower overall costs (no separate finance module)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-brand-text-secondary">Future-proof scalability and data unification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-brand-text-secondary">Single platform for finance + CRM</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Our Approach */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg">Our Platform Consolidation Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-950/20 rounded-lg border border-green-500/30">
                  <h4 className="font-bold text-brand-text-primary mb-3">The Button as Unified Platform</h4>
                  <p className="text-sm text-brand-text-secondary mb-3">
                    {rationalizationPlan.our_approach.strategy}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-text-primary">Single User Interface</p>
                        <p className="text-xs text-brand-text-secondary">One login, one experience across all functions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-text-primary">Unified Data Model</p>
                        <p className="text-xs text-brand-text-secondary">Entities link across all 42 integrated systems</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-text-primary">Best-of-Breed Integrations</p>
                        <p className="text-xs text-brand-text-secondary">Keep specialized tools, unify via API layer</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                  <h4 className="font-bold text-brand-text-primary mb-3">Integration Status by Category</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-brand-text-secondary">Curling Operations</span>
                        <span className="text-green-400 font-bold">100%</span>
                      </div>
                      <Progress value={100} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-brand-text-secondary">Finance & Payments</span>
                        <span className="text-green-400 font-bold">90%</span>
                      </div>
                      <Progress value={90} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-brand-text-secondary">Fundraising & Philanthropy</span>
                        <span className="text-yellow-400 font-bold">60%</span>
                      </div>
                      <Progress value={60} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-brand-text-secondary">High Performance</span>
                        <span className="text-yellow-400 font-bold">70%</span>
                      </div>
                      <Progress value={70} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-brand-text-secondary">Marketing & Media</span>
                        <span className="text-green-400 font-bold">85%</span>
                      </div>
                      <Progress value={85} className="h-1" />
                    </div>
                  </div>
                </div>

                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-brand-text-secondary text-sm">
                    <strong>Estimated Savings:</strong> {rationalizationPlan.our_approach.savings}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Rationalization Recommendations */}
          <Card className="bg-gradient-to-br from-orange-950/20 to-red-950/20 border-orange-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Next Steps for Application Rationalization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertTitle className="text-green-400">Decision Made: HubSpot as Unified CRM</AlertTitle>
                  <AlertDescription className="text-brand-text-secondary">
                    Curling Canada has selected <strong>HubSpot</strong> as the unified CRM platform for finance,
                    sponsorship, and constituent management. This decision enables consolidation of KIT finance functions
                    and integration of event/donor data per BDO recommendations.
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-green-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-text-primary mb-1">✓ HubSpot CRM Platform Selected</h5>
                      <p className="text-sm text-brand-text-secondary mb-2">
                        HubSpot provides integrated marketing, sales, and service hubs with strong data quality
                        tools and business glossary support - critical for N7 and N12 data governance needs.
                      </p>
                      <Badge className="bg-green-500">Completed - Q4 2024</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-yellow-400">1</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-text-primary mb-1">Migrate KIT Finance to HubSpot</h5>
                      <p className="text-sm text-brand-text-secondary mb-2">
                        Consolidate KIT's finance functions into HubSpot's deals/invoicing modules per BDO recommendation.
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">Target: Q1-Q2 2025</Badge>
                        <Badge variant="outline" className="text-xs">Cost Savings: $40K/year</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-yellow-400">2</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-text-primary mb-1">Sync Business Glossary to HubSpot</h5>
                      <p className="text-sm text-brand-text-secondary mb-2">
                        Map business glossary terms to HubSpot custom properties for consistent data definitions.
                      </p>
                      <Badge className="bg-yellow-500">In Progress - N7 Implementation</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-blue-500/30">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-blue-400">3</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-brand-text-primary mb-1">Sunset Legacy Systems</h5>
                      <p className="text-sm text-brand-text-secondary mb-2">
                        Phase out redundant systems, migrate to The Button + HubSpot architecture.
                      </p>
                      <Badge className="bg-blue-500">Target: Q2-Q3 2025</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Comparison Tab */}
        <TabsContent value="costs" className="mt-6 space-y-6">
          <Alert className="border-green-500/50 bg-green-500/10">
            <DollarSign className="h-4 w-4 text-green-400" />
            <AlertTitle className="text-green-400">Investment Analysis</AlertTitle>
            <AlertDescription className="text-brand-text-secondary">
              Comparing BDO's budgeted costs with actual investment in The Button platform and integrations.
            </AlertDescription>
          </Alert>

          {/* BDO Cost Breakdown */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>BDO's Cost Estimates (2022)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-border">
                      <th className="text-left py-3 text-brand-text-primary">Data Need</th>
                      <th className="text-right py-3 text-brand-text-primary">Duration</th>
                      <th className="text-right py-3 text-brand-text-primary">MVP</th>
                      <th className="text-right py-3 text-brand-text-primary">Recommended</th>
                      <th className="text-right py-3 text-brand-text-primary">Full</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { need: 'N3: Single Source of Truth', duration: '10-15 mo', mvp: 470, rec: 470, full: 690 },
                      { need: 'N4: Operational BI', duration: '8-11 mo', mvp: 280, rec: 280, full: 370 },
                      { need: 'N12: Data Governance', duration: '14-21 mo', mvp: 80, rec: 260, full: 380 },
                      { need: 'N2: Data Literacy', duration: '6-9 mo', mvp: 80, rec: 80, full: 120 },
                      { need: 'N7: DG Solutions', duration: '10-15 mo', mvp: 50, rec: 130, full: 190 },
                      { need: 'N1: Self-Service Analytics', duration: '4-6 mo', mvp: 0, rec: 120, full: 160 },
                      { need: 'N8: Automation', duration: '2-3 mo', mvp: 0, rec: 30, full: 50 },
                      { need: 'N5: AI & Data Science', duration: '9-12 mo', mvp: 0, rec: 250, full: 340 }
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-brand-border/50">
                        <td className="py-3 text-brand-text-primary">{row.need}</td>
                        <td className="py-3 text-right text-brand-text-secondary">{row.duration}</td>
                        <td className="py-3 text-right text-brand-text-primary">${row.mvp}K</td>
                        <td className="py-3 text-right font-bold text-yellow-400">${row.rec}K</td>
                        <td className="py-3 text-right text-brand-text-secondary">${row.full}K</td>
                      </tr>
                    ))}
                    <tr className="bg-brand-charcoal/30 font-bold">
                      <td className="py-3 text-brand-text-primary">TOTAL</td>
                      <td className="py-3 text-right"></td>
                      <td className="py-3 text-right text-brand-text-primary">$960K</td>
                      <td className="py-3 text-right text-yellow-400">$1,620K</td>
                      <td className="py-3 text-right text-brand-text-primary">$2,300K</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-brand-text-secondary mt-4">
                * Excludes N6 (Secure Data Sharing), N9 (Master Data Management), N10 (Technical Architecture),
                N11 (System Integration) - combined with other items
              </p>
            </CardContent>
          </Card>

          {/* Our Actual Investment */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Our Actual Investment (2022-2024)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-950/20 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-brand-text-secondary mb-1">Platform Development</p>
                  <p className="text-3xl font-bold text-brand-text-primary">$850K</p>
                  <p className="text-xs text-brand-text-secondary mt-1">The Button platform build</p>
                </div>

                <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-500/30">
                  <p className="text-sm text-brand-text-secondary mb-1">Integrations</p>
                  <p className="text-3xl font-bold text-brand-text-primary">$200K</p>
                  <p className="text-xs text-brand-text-secondary mt-1">42 system integrations</p>
                </div>

                <div className="p-4 bg-green-950/20 rounded-lg border border-green-500/30">
                  <p className="text-sm text-brand-text-secondary mb-1">Total Investment</p>
                  <p className="text-3xl font-bold text-green-400">$1.05M</p>
                  <p className="text-xs text-brand-text-secondary mt-1">vs. $1.62M recommended</p>
                </div>
              </div>

              <div className="p-4 bg-green-950/20 rounded-lg border border-green-500/30">
                <h4 className="font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Cost Efficiency Analysis
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary mb-2">Avoided Costs</p>
                    <ul className="space-y-1 text-sm text-brand-text-secondary">
                      <li>• Eliminated multiple point solution licenses: <strong className="text-green-400">$300K saved</strong></li>
                      <li>• Reduced training overhead (single platform): <strong className="text-green-400">$50K saved</strong></li>
                      <li>• Consolidated support contracts: <strong className="text-green-400">$40K/year saved</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary mb-2">Efficiency Gains</p>
                    <ul className="space-y-1 text-sm text-brand-text-secondary">
                      <li>• Staff productivity (unified interface): <strong className="text-green-400">~20% gain</strong></li>
                      <li>• Faster reporting (automated dashboards): <strong className="text-green-400">~15 hrs/week</strong></li>
                      <li>• Real-time data access: <strong className="text-green-400">$150K value/year</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <Alert className="mt-4 border-blue-500/50 bg-blue-500/10">
                <Database className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-brand-text-secondary">
                  <strong>Bottom Line:</strong> We've achieved 65% of BDO's recommended capabilities for 65% of the
                  recommended budget, while building additional platform value not in original scope.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Remaining Investment Needed */}
          <Card className="bg-gradient-to-br from-red-950/20 to-orange-950/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Remaining Investment to Complete BDO Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <p className="text-sm text-brand-text-secondary mb-1">Critical Gaps (Phase 1)</p>
                  <p className="text-3xl font-bold text-red-400">$210K</p>
                  <p className="text-xs text-brand-text-secondary mt-1">N2, N7, N12 foundations</p>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <p className="text-sm text-brand-text-secondary mb-1">Enhancement (Phase 2-3)</p>
                  <p className="text-3xl font-bold text-yellow-400">$300K</p>
                  <p className="text-xs text-brand-text-secondary mt-1">N1, N5 advanced capabilities</p>
                </div>

                <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                  <p className="text-sm text-brand-text-secondary mb-1">Optional (Full Build)</p>
                  <p className="text-3xl font-bold text-brand-text-primary">$680K</p>
                  <p className="text-xs text-brand-text-secondary mt-1">All features to "Full" spec</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                <h4 className="font-bold text-brand-text-primary mb-3">Recommended Investment Priority</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-red-950/20 rounded border border-red-500/30">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-500">Critical</Badge>
                      <span className="text-sm text-brand-text-primary">N7 + N12: Data Governance Office</span>
                    </div>
                    <span className="font-bold text-brand-text-primary">$130K</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-950/20 rounded border border-orange-500/30">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-orange-500">High</Badge>
                      <span className="text-sm text-brand-text-primary">N2: Data Literacy Program</span>
                    </div>
                    <span className="font-bold text-brand-text-primary">$80K</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-950/20 rounded border border-yellow-500/30">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-yellow-500">Medium</Badge>
                      <span className="text-sm text-brand-text-primary">N5: Advanced Analytics Enhancement</span>
                    </div>
                    <span className="font-bold text-brand-text-primary">$150K</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Strategic Recommendations */}
      <Card className="bg-gradient-to-br from-brand-red/20 to-purple-950/20 border-brand-red/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-6 h-6" />
            Strategic Recommendations for SMT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <h4 className="font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Celebrate Wins
              </h4>
              <ul className="space-y-1 text-sm text-brand-text-secondary">
                <li>✅ Exceeded N11 (System Integration) - 42 systems vs. planned scope</li>
                <li>✅ Advanced N3 (SSoT) to 70% with Supabase + DOMO + MongoDB architecture</li>
                <li>✅ Accelerated N5 (AI/ML) with production features ahead of schedule</li>
                <li>✅ Built The Button as unified engagement + data platform</li>
                <li>✅ Achieved this for $570K less than recommended budget</li>
              </ul>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <h4 className="font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Address Critical Gaps (Q1-Q2 2025)
              </h4>
              <ul className="space-y-1 text-sm text-brand-text-secondary">
                <li>🚨 N12: Establish Data Governance Office - <strong className="text-red-400">Critical Blocker</strong></li>
                <li>🚨 N2: Implement Data Literacy Training - <strong className="text-red-400">Foundational</strong></li>
                <li>⚠️ N7: Build Business Glossary & Data Quality - <strong className="text-yellow-400">Important</strong></li>
                <li>⚠️ Complete DonorPerfect + Dartfish integrations - <strong className="text-yellow-400">In Progress</strong></li>
              </ul>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <h4 className="font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Strategic Decisions Required
              </h4>
              <ul className="space-y-2 text-sm text-brand-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">1.</span>
                  <span><strong>CRM Platform Choice:</strong> Decide on Dynamics 365 vs. HubSpot for finance consolidation per BDO recommendation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">2.</span>
                  <span><strong>Application Sunset Plan:</strong> Formalize timeline to retire redundant systems (KIT, legacy tools)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">3.</span>
                  <span><strong>Data Governance Model:</strong> Appoint Chief Data Officer and establish DG Office structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">4.</span>
                  <span><strong>Investment Allocation:</strong> Prioritize $210K for Phase 1 gaps vs. continuing Phase 3 enhancements</span>
                </li>
              </ul>
            </div>

            <Alert className="border-green-500/50 bg-green-500/10">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-brand-text-secondary">
                <strong>Recommended Path Forward:</strong> Invest $210K in Q1-Q2 2025 to complete Phase 1 foundations
                (N2, N7, N12), then leverage The Button's existing capabilities to accelerate Phase 2-3 at lower cost
                than originally projected.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Comparison */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Timeline: BDO Plan vs. Actual Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 2022-2023: Phase 1 */}
            <div className="p-4 bg-red-950/20 rounded-lg border border-red-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-brand-text-primary">2022-2023: Phase 1 (Establish)</h4>
                <Badge className="bg-red-500">35% Complete</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-brand-text-secondary mb-2">BDO Planned</p>
                  <ul className="space-y-1 text-xs text-brand-text-secondary">
                    <li>• N7.2: Business Glossary</li>
                    <li>• N8.1: App Rationalization Planning</li>
                    <li>• N12.1: Define DG & Operating Model</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-brand-text-secondary mb-2">Actually Delivered</p>
                  <ul className="space-y-1 text-xs text-green-400">
                    <li>✓ Started The Button platform development</li>
                    <li>✓ Built 20+ initial integrations</li>
                    <li>⚠️ DG activities not prioritized</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2023-2024: Phase 2 */}
            <div className="p-4 bg-yellow-950/20 rounded-lg border border-yellow-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-brand-text-primary">2023-2024: Phase 2 (Scale)</h4>
                <Badge className="bg-yellow-500">70% Complete</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-brand-text-secondary mb-2">BDO Planned</p>
                  <ul className="space-y-1 text-xs text-brand-text-secondary">
                    <li>• N3.2: Establish SSoT Security Model</li>
                    <li>• N4.2: BI Critical Use Cases</li>
                    <li>• N7.3: Data Profiling & Quality</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-brand-text-secondary mb-2">Actually Delivered</p>
                  <ul className="space-y-1 text-xs text-green-400">
                    <li>✓ Launched The Button publicly</li>
                    <li>✓ Completed 42 system integrations</li>
                    <li>✓ Built DOMO dashboard suite</li>
                    <li>✓ Implemented StaffHQ operational BI</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2024-2025: Phase 3 */}
            <div className="p-4 bg-blue-950/20 rounded-lg border border-blue-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-brand-text-primary">2024-2025: Phase 3 (Optimize)</h4>
                <Badge className="bg-blue-500">40% Complete</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-brand-text-secondary mb-2">BDO Planned</p>
                  <ul className="space-y-1 text-xs text-brand-text-secondary">
                    <li>• N5.2: AI Critical Use Cases</li>
                    <li>• N1.1: Self-Service Design</li>
                    <li>• N4.3: Remaining BI Use Cases</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-brand-text-secondary mb-2">In Progress</p>
                  <ul className="space-y-1 text-xs text-yellow-400">
                    <li>⚡ AI Coaching Companion (pilot)</li>
                    <li>⚡ Predictive analytics engine</li>
                    <li>⚡ Advanced dashboard features</li>
                    <li>🔲 Formal self-service tools (planned)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
