import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp, Database, DollarSign, Users, Target, Zap,
  BarChart3, PieChart, LineChart, Activity, Brain,
  Globe, Eye, TrendingDown, CheckCircle, AlertTriangle,
  Sparkles, Award, ShoppingCart, Video, Heart,
  Building, Trophy, Calendar, Mail, MessageSquare,
  ArrowRight, ExternalLink, Layers, GitBranch
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DOMOCapabilities() {
  const [selectedUseCase, setSelectedUseCase] = useState('executive');

  // All 40 integrated systems organized by capability
  const dataSourceCategories = [
    {
      category: "Curling Operations",
      systems: ["Curling.io", "CurlingZone", "CTRS"],
      capabilities: ["Live scoring", "Event schedules", "Team rankings"],
      icon: Trophy,
      color: "blue"
    },
    {
      category: "Member & Club Data",
      systems: ["CurlingReg", "TrustEvent", "Accredit", "Club Survey Data"],
      capabilities: ["Membership trends", "Registration analytics", "Volunteer engagement"],
      icon: Users,
      color: "indigo"
    },
    {
      category: "Financial Intelligence",
      systems: ["GiveCloud", "QuickBooks", "Budgyt", "Moneris", "Stripe", "ApprovalMax"],
      capabilities: ["Revenue forecasting", "Donation tracking", "Budget variance analysis"],
      icon: DollarSign,
      color: "green"
    },
    {
      category: "Fan Engagement",
      systems: ["The Button XP Data", "YouTube", "Streaming Analytics", "Social Media", "Ticketmaster"],
      capabilities: ["User engagement metrics", "Content performance", "Ticket sales"],
      icon: Heart,
      color: "pink"
    },
    {
      category: "Sponsorship ROI",
      systems: ["Vividata", "TSN", "PointsBet", "Google Analytics", "Brandwatch"],
      capabilities: ["Audience measurement", "Viewership data", "Social sentiment", "Activation tracking"],
      icon: Target,
      color: "purple"
    },
    {
      category: "High Performance",
      systems: ["Teamworks", "Smart Broom Data", "Shot Tracker", "Moodle", "Sideline Learning"],
      capabilities: ["Athlete performance", "Training analytics", "Certification tracking"],
      icon: Award,
      color: "amber"
    },
    {
      category: "Marketing & Content",
      systems: ["Mailchimp", "WordPress", "Canto", "HubSpot", "Formstack"],
      capabilities: ["Campaign performance", "Content engagement", "Lead generation"],
      icon: MessageSquare,
      color: "orange"
    },
    {
      category: "Operations & HR",
      systems: ["ADP", "DocuSign", "Microsoft 365", "Zoom", "Zapier", "GitHub", "Zendesk"],
      capabilities: ["Workforce analytics", "Contract status", "Productivity metrics"],
      icon: Building,
      color: "teal"
    }
  ];

  const monetizationOpportunities = [
    {
      title: "Sponsorship Intelligence Reports",
      description: "Premium data packages for sponsors showing reach, engagement, and ROI",
      revenue: "$50K-$150K annually",
      dataInputs: ["Vividata", "TSN", "Google Analytics", "The Button", "Social Media"],
      icon: Target,
      color: "purple"
    },
    {
      title: "Club Benchmarking Service",
      description: "Subscription service for clubs to compare their performance to regional/national averages",
      revenue: "$25K-$75K annually",
      dataInputs: ["Club Survey", "CurlingReg", "The Button", "QuickBooks"],
      icon: Building,
      color: "blue"
    },
    {
      title: "Athlete Performance Analytics",
      description: "Premium analytics packages for athletes, coaches, and teams",
      revenue: "$30K-$100K annually",
      dataInputs: ["Smart Broom", "Shot Tracker", "Teamworks", "CTRS"],
      icon: Trophy,
      color: "amber"
    },
    {
      title: "Market Research Reports",
      description: "Industry reports and trend analysis for sponsors, media, and federations",
      revenue: "$40K-$120K annually",
      dataInputs: ["Survey Data", "Vividata", "Brandwatch", "YouTube", "Ticketmaster"],
      icon: BarChart3,
      color: "green"
    },
    {
      title: "Event Intelligence Packages",
      description: "Data-driven event planning tools and post-event analysis reports",
      revenue: "$20K-$60K annually",
      dataInputs: ["Curling.io", "CurlingZone", "Ticketmaster", "Streaming", "Social Media"],
      icon: Calendar,
      color: "pink"
    },
    {
      title: "Custom Dashboard Licensing",
      description: "White-label DOMO dashboards for MAs, clubs, and partners",
      revenue: "$35K-$90K annually",
      dataInputs: ["All 40 Systems"],
      icon: TrendingUp,
      color: "red"
    }
  ];

  const useCases = {
    executive: {
      title: "Executive Intelligence",
      description: "Strategic insights for leadership decision-making",
      dashboards: [
        {
          name: "Strategic KPI Dashboard",
          metrics: ["MAU Growth", "Revenue YoY", "Member Retention", "Sponsor Satisfaction"],
          refresh: "Real-time",
          users: "CEO, COO, CMO, CFO"
        },
        {
          name: "Financial Performance",
          metrics: ["Revenue Streams", "Cost Centers", "Budget vs. Actual", "Cash Flow Forecast"],
          refresh: "Daily",
          users: "CFO, Finance Team"
        },
        {
          name: "Fan Engagement Overview",
          metrics: ["Active Users", "Content Views", "XP Distribution", "Churn Risk"],
          refresh: "Hourly",
          users: "CMO, Product Team"
        },
        {
          name: "Sponsorship ROI",
          metrics: ["Impressions Delivered", "Activation Performance", "Brand Sentiment", "Revenue per Sponsor"],
          refresh: "Daily",
          users: "VP Sponsorship, Sales Team"
        }
      ]
    },
    operational: {
      title: "Operational Excellence",
      description: "Real-time monitoring and optimization across departments",
      dashboards: [
        {
          name: "Club Health Monitor",
          metrics: ["Club Adoption Rate", "Survey Completion", "Member Growth", "At-Risk Clubs"],
          refresh: "Daily",
          users: "Club Services Team"
        },
        {
          name: "Event Operations Command",
          metrics: ["Volunteer Fill Rate", "Registration Status", "Budget Tracking", "Logistics Health"],
          refresh: "Real-time",
          users: "Event Operations Team"
        },
        {
          name: "HP Athlete Pipeline",
          metrics: ["Pathway Progression", "Performance Benchmarks", "Coach Activity", "NextGen Funnel"],
          refresh: "Daily",
          users: "HP Director, Coaches"
        },
        {
          name: "Marketing Campaign Performance",
          metrics: ["Email Open Rates", "Social Engagement", "Content Reach", "Lead Generation"],
          refresh: "Hourly",
          users: "Marketing Team"
        }
      ]
    },
    monetization: {
      title: "Revenue Intelligence",
      description: "Data products and insights that generate new revenue",
      dashboards: [
        {
          name: "Sponsor Value Report",
          metrics: ["Audience Demographics", "Viewership Patterns", "Social Amplification", "Conversion Tracking"],
          refresh: "Daily",
          users: "External Clients (Sponsors)"
        },
        {
          name: "Club Benchmarking Portal",
          metrics: ["Financial Health Ranking", "Membership Trends", "Program Effectiveness", "Regional Comparison"],
          refresh: "Monthly",
          users: "External Clients (Clubs)"
        },
        {
          name: "Athlete Performance Analytics",
          metrics: ["Shot Accuracy Trends", "Training Load Analysis", "Peer Comparison", "Improvement Trajectory"],
          refresh: "Weekly",
          users: "External Clients (Athletes/Coaches)"
        },
        {
          name: "Market Intelligence Report",
          metrics: ["Fan Demographics", "Regional Growth", "Trend Forecasting", "Competitive Landscape"],
          refresh: "Quarterly",
          users: "External Clients (Industry)"
        }
      ]
    },
    predictive: {
      title: "Predictive Analytics",
      description: "AI-powered forecasting and recommendations",
      dashboards: [
        {
          name: "Churn Prediction Engine",
          metrics: ["At-Risk Users", "Retention Probability", "Engagement Patterns", "Intervention Recommendations"],
          refresh: "Daily",
          users: "Product Team, Marketing"
        },
        {
          name: "Revenue Forecasting",
          metrics: ["Subscription Projections", "Donation Trends", "Sponsorship Pipeline", "Event Revenue Forecast"],
          refresh: "Weekly",
          users: "CFO, Finance Team"
        },
        {
          name: "Talent Identification",
          metrics: ["Emerging Athletes", "Performance Trajectories", "Pathway Success Rate", "Investment ROI"],
          refresh: "Monthly",
          users: "HP Director"
        },
        {
          name: "Market Opportunity Scoring",
          metrics: ["Geographic Expansion", "Program Viability", "Partnership Potential", "Resource Allocation"],
          refresh: "Monthly",
          users: "Strategic Planning Team"
        }
      ]
    }
  };

  const dataFlowExample = [
    { 
      source: "40 External Systems", 
      arrow: "→", 
      step: "Real-time Webhooks & Scheduled Syncs",
      systems: 5
    },
    { 
      source: "Supabase (Primary DB)", 
      arrow: "→", 
      step: "Automated ETL Pipelines",
      systems: 1
    },
    { 
      source: "DOMO Data Warehouse", 
      arrow: "→", 
      step: "AI/ML Processing & Visualization",
      systems: 1
    },
    { 
      source: "150+ Dashboards", 
      arrow: "→", 
      step: "Role-Based Access",
      systems: 150
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-950/30 to-blue-950/30 rounded-xl p-8 border border-purple-500/30">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-brand-text-primary">DOMO Intelligence Platform</h1>
                <p className="text-brand-text-secondary">Transforming 40 Data Sources into Strategic Insights</p>
              </div>
            </div>
            <p className="text-lg text-brand-text-secondary mb-6 max-w-3xl">
              DOMO serves as Curling Canada's central business intelligence hub, aggregating data from 
              40 integrated systems to deliver real-time insights, predictive analytics, and revenue-generating 
              data products for executives, staff, and external clients.
            </p>
            <div className="flex gap-4">
              <Link to={createPageUrl('APIManager')}>
                <Button className="bg-brand-red hover:bg-red-700">
                  <Database className="w-4 h-4 mr-2" />
                  View Integrations
                </Button>
              </Link>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                <a href="https://www.domo.com" target="_blank" rel="noopener noreferrer">
                  Learn About DOMO
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-8 h-8 text-purple-400" />
              <Badge className="bg-purple-500/20 text-purple-400">Connected</Badge>
            </div>
            <p className="text-3xl font-bold text-brand-text-primary">40</p>
            <p className="text-sm text-brand-text-secondary">Integrated Data Sources</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <Badge className="bg-blue-500/20 text-blue-400">150+</Badge>
            </div>
            <p className="text-3xl font-bold text-brand-text-primary">150+</p>
            <p className="text-sm text-brand-text-secondary">Active Dashboards</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-400" />
              <Badge className="bg-green-500/20 text-green-400">Live</Badge>
            </div>
            <p className="text-3xl font-bold text-brand-text-primary">200+</p>
            <p className="text-sm text-brand-text-secondary">Daily Active Users</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-amber-400" />
              <Badge className="bg-amber-500/20 text-amber-400">Projected</Badge>
            </div>
            <p className="text-3xl font-bold text-brand-text-primary">$400K+</p>
            <p className="text-sm text-brand-text-secondary">Annual Monetization Potential</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Flow Architecture */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Data Flow Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataFlowExample.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1 p-4 bg-gradient-to-r from-purple-950/30 to-blue-950/30 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-text-primary">{step.source}</p>
                      <p className="text-sm text-brand-text-secondary">{step.step}</p>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400">{step.systems}</Badge>
                  </div>
                </div>
                {index < dataFlowExample.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-brand-text-secondary flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Source Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Integrated Data Sources by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {dataSourceCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.category}
                  className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border hover:border-brand-red/50 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 bg-${category.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${category.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-brand-text-primary mb-1">{category.category}</h4>
                      <Badge variant="outline" className="text-xs">
                        {category.systems.length} Systems
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <p className="text-xs font-medium text-brand-text-secondary">Connected Systems:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.systems.map((system) => (
                        <Badge key={system} variant="secondary" className="text-xs">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-brand-text-secondary">Key Capabilities:</p>
                    {category.capabilities.map((capability) => (
                      <div key={capability} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-brand-text-secondary">{capability}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Use Cases Tabs */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            DOMO Use Cases & Dashboards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedUseCase} onValueChange={setSelectedUseCase}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="executive">
                <TrendingUp className="w-4 h-4 mr-2" />
                Executive
              </TabsTrigger>
              <TabsTrigger value="operational">
                <Activity className="w-4 h-4 mr-2" />
                Operational
              </TabsTrigger>
              <TabsTrigger value="monetization">
                <DollarSign className="w-4 h-4 mr-2" />
                Monetization
              </TabsTrigger>
              <TabsTrigger value="predictive">
                <Sparkles className="w-4 h-4 mr-2" />
                Predictive AI
              </TabsTrigger>
            </TabsList>

            {Object.entries(useCases).map(([key, useCase]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-950/20 to-blue-950/20 rounded-lg border border-purple-500/30">
                  <h3 className="text-xl font-bold text-brand-text-primary mb-2">{useCase.title}</h3>
                  <p className="text-brand-text-secondary">{useCase.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {useCase.dashboards.map((dashboard) => (
                    <Card key={dashboard.name} className="bg-brand-charcoal/30 border-brand-border">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>{dashboard.name}</span>
                          <Badge className="bg-blue-500/20 text-blue-400">{dashboard.refresh}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-brand-text-secondary mb-2">Key Metrics:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {dashboard.metrics.map((metric) => (
                              <div key={metric} className="p-2 bg-brand-card-bg rounded text-xs text-brand-text-primary">
                                {metric}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-brand-text-secondary mb-1">Primary Users:</p>
                          <p className="text-xs text-brand-text-primary">{dashboard.users}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Monetization Opportunities */}
      <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            Revenue-Generating Data Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-text-secondary mb-6">
            DOMO enables Curling Canada to package and monetize insights from The Button's 40 integrated 
            data sources, creating new revenue streams while providing value to sponsors, clubs, and athletes.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {monetizationOpportunities.map((opportunity) => {
              const Icon = opportunity.icon;
              return (
                <div 
                  key={opportunity.title}
                  className="p-5 bg-brand-charcoal/50 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 bg-${opportunity.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 text-${opportunity.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-brand-text-primary mb-1">{opportunity.title}</h4>
                      <p className="text-sm text-brand-text-secondary mb-2">{opportunity.description}</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold text-green-400">{opportunity.revenue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-brand-text-secondary">Data Sources Used:</p>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.dataInputs.map((input) => (
                        <Badge key={input} variant="outline" className="text-xs">
                          {input}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-brand-text-primary mb-1">Total Annual Revenue Potential</p>
                <p className="text-sm text-brand-text-secondary">From data monetization products alone</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-green-400">$400K+</p>
                <p className="text-xs text-brand-text-secondary">Conservative estimate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Capabilities */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Advanced DOMO Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* AI & Machine Learning */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-6 h-6 text-purple-400" />
                <h4 className="font-bold text-brand-text-primary">AI & Machine Learning</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Automated Insights</p>
                    <p className="text-xs text-brand-text-secondary">AI detects trends and anomalies automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Predictive Forecasting</p>
                    <p className="text-xs text-brand-text-secondary">Revenue, churn, and growth predictions</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Sentiment Analysis</p>
                    <p className="text-xs text-brand-text-secondary">NLP on fan feedback and social data</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Recommendation Engine</p>
                    <p className="text-xs text-brand-text-secondary">Personalized content and product suggestions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Monitoring */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-6 h-6 text-blue-400" />
                <h4 className="font-bold text-brand-text-primary">Real-Time Monitoring</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Live Event Dashboards</p>
                    <p className="text-xs text-brand-text-secondary">Real-time scoring and viewership during championships</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Alert Management</p>
                    <p className="text-xs text-brand-text-secondary">Automated alerts for KPI thresholds and anomalies</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Mobile Access</p>
                    <p className="text-xs text-brand-text-secondary">Dashboards accessible on any device, anywhere</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Scheduled Reports</p>
                    <p className="text-xs text-brand-text-secondary">Automated email reports to stakeholders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Collaboration & Sharing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-6 h-6 text-orange-400" />
                <h4 className="font-bold text-brand-text-primary">Collaboration & Sharing</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Role-Based Access</p>
                    <p className="text-xs text-brand-text-secondary">Secure dashboards for different user types</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Embedded Dashboards</p>
                    <p className="text-xs text-brand-text-secondary">Integrate DOMO visualizations into The Button</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">White-Label Reports</p>
                    <p className="text-xs text-brand-text-secondary">Branded reports for sponsors and partners</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">Public Sharing</p>
                    <p className="text-xs text-brand-text-secondary">Share insights with media and stakeholders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Dashboard Visualizations */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Sample Dashboard Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Time Series */}
            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <div className="flex items-center gap-2 mb-3">
                <LineChart className="w-5 h-5 text-blue-400" />
                <h5 className="font-medium text-brand-text-primary">Time Series Analysis</h5>
              </div>
              <ul className="space-y-1 text-xs text-brand-text-secondary">
                <li>• Member growth over time</li>
                <li>• Revenue trends by source</li>
                <li>• Engagement patterns</li>
                <li>• Seasonal comparisons</li>
              </ul>
            </div>

            {/* Distribution */}
            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-5 h-5 text-purple-400" />
                <h5 className="font-medium text-brand-text-primary">Distribution Analysis</h5>
              </div>
              <ul className="space-y-1 text-xs text-brand-text-secondary">
                <li>• Revenue by product line</li>
                <li>• User demographics</li>
                <li>• Club type breakdown</li>
                <li>• Regional distribution</li>
              </ul>
            </div>

            {/* Geospatial */}
            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-green-400" />
                <h5 className="font-medium text-brand-text-primary">Geospatial Mapping</h5>
              </div>
              <ul className="space-y-1 text-xs text-brand-text-secondary">
                <li>• Club density heat maps</li>
                <li>• Regional performance</li>
                <li>• Event attendance zones</li>
                <li>• Growth opportunities</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-purple-400" />
              <h4 className="font-bold text-brand-text-primary">Interactive Features</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-brand-text-primary">Drill-Down Capabilities</p>
                  <p className="text-xs text-brand-text-secondary">Click any metric to see underlying details</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-brand-text-primary">Custom Filters</p>
                  <p className="text-xs text-brand-text-secondary">Filter by date, region, club, event, etc.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-brand-text-primary">Export Options</p>
                  <p className="text-xs text-brand-text-secondary">PDF, Excel, PowerPoint, CSV formats</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-brand-text-primary">Collaborative Annotations</p>
                  <p className="text-xs text-brand-text-secondary">Add comments and share insights with team</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Benefits */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Strategic Benefits for Curling Canada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-brand-text-primary flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Operational Excellence
              </h4>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Single Source of Truth:</strong> Eliminate data silos across 40 systems</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Real-Time Decision Making:</strong> Access live data during critical events</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Automated Reporting:</strong> Save 40+ hours/month on manual reports</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Proactive Alerts:</strong> Get notified of issues before they become problems</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-brand-text-primary flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Revenue Growth
              </h4>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Data Products:</strong> $200K-$400K+ in new annual revenue</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Sponsor Value:</strong> Demonstrate ROI with concrete metrics</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Retention Optimization:</strong> Reduce churn through predictive insights</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Upsell Opportunities:</strong> Identify cross-sell and upgrade candidates</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-brand-text-primary flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" />
                Strategic Insights
              </h4>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Market Trends:</strong> Identify emerging opportunities and threats</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Performance Benchmarking:</strong> Compare against industry standards</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Resource Optimization:</strong> Allocate budget and staff more effectively</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Goal Tracking:</strong> Monitor strategic plan execution in real-time</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-brand-text-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Competitive Advantage
              </h4>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Data-Driven Culture:</strong> Empower all staff with insights</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Faster Decisions:</strong> Reduce decision-making time by 60%</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Industry Leadership:</strong> Most advanced analytics in sport governance</span>
                </p>
                <p className="text-sm text-brand-text-secondary flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong>Stakeholder Confidence:</strong> Transparent reporting builds trust</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Roadmap */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            DOMO Expansion Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Phase 1 */}
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-bold text-brand-text-primary">Phase 1: Foundation (Completed)</h5>
                    <Badge className="bg-green-500/20 text-green-400">Live</Badge>
                  </div>
                  <ul className="space-y-1 text-sm text-brand-text-secondary">
                    <li>✓ Core data sources connected (CurlingReg, The Button, GiveCloud)</li>
                    <li>✓ Executive dashboards deployed</li>
                    <li>✓ Automated sync pipelines established</li>
                    <li>✓ Basic reporting infrastructure</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-bold text-brand-text-primary">Phase 2: Expansion (In Progress)</h5>
                    <Badge className="bg-blue-500/20 text-blue-400">Q1 2025</Badge>
                  </div>
                  <ul className="space-y-1 text-sm text-brand-text-secondary">
                    <li>⏳ Complete 40-system integration (35/40 connected)</li>
                    <li>⏳ Department-specific dashboards (Events, HP, Marketing, Finance)</li>
                    <li>⏳ Predictive analytics models (churn, revenue, talent)</li>
                    <li>⏳ Mobile dashboard optimization</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-bold text-brand-text-primary">Phase 3: Monetization (Planned)</h5>
                    <Badge className="bg-purple-500/20 text-purple-400">Q2 2025</Badge>
                  </div>
                  <ul className="space-y-1 text-sm text-brand-text-secondary">
                    <li>📋 Launch sponsor intelligence reports ($50K+ revenue)</li>
                    <li>📋 Club benchmarking subscription service</li>
                    <li>📋 Athlete performance analytics packages</li>
                    <li>📋 White-label dashboard licensing for MAs</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 4 */}
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-bold text-brand-text-primary">Phase 4: AI Enhancement (Planned)</h5>
                    <Badge className="bg-amber-500/20 text-amber-400">Q3 2025</Badge>
                  </div>
                  <ul className="space-y-1 text-sm text-brand-text-secondary">
                    <li>📋 AI-powered insight generation</li>
                    <li>📋 Natural language query interface</li>
                    <li>📋 Automated anomaly detection</li>
                    <li>📋 Prescriptive recommendations engine</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            DOMO Investment ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Costs */}
            <div>
              <h4 className="font-bold text-brand-text-primary mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                Investment
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                  <span className="text-sm text-brand-text-secondary">DOMO License (Annual)</span>
                  <span className="font-bold text-brand-text-primary">$75K</span>
                </div>
                <div className="flex justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                  <span className="text-sm text-brand-text-secondary">Implementation & Training</span>
                  <span className="font-bold text-brand-text-primary">$25K</span>
                </div>
                <div className="flex justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                  <span className="text-sm text-brand-text-secondary">Ongoing Maintenance</span>
                  <span className="font-bold text-brand-text-primary">$20K</span>
                </div>
                <div className="flex justify-between p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                  <span className="text-sm font-bold text-brand-text-primary">Total Annual Cost</span>
                  <span className="font-bold text-red-400">$120K</span>
                </div>
              </div>
            </div>

            {/* Returns */}
            <div>
              <h4 className="font-bold text-brand-text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Returns
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                  <span className="text-sm text-brand-text-secondary">New Revenue (Data Products)</span>
                  <span className="font-bold text-green-400">$400K</span>
                </div>
                <div className="flex justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                  <span className="text-sm text-brand-text-secondary">Operational Efficiency Gains</span>
                  <span className="font-bold text-green-400">$150K</span>
                </div>
                <div className="flex justify-between p-3 bg-brand-charcoal/30 rounded-lg">
                  <span className="text-sm text-brand-text-secondary">Improved Retention (2% lift)</span>
                  <span className="font-bold text-green-400">$100K</span>
                </div>
                <div className="flex justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                  <span className="text-sm font-bold text-brand-text-primary">Total Annual Value</span>
                  <span className="font-bold text-green-400">$650K</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary mb-1">Net Annual Benefit</p>
                <p className="text-4xl font-bold text-green-400">$530K</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-text-secondary mb-1">ROI</p>
                <p className="text-4xl font-bold text-green-400">442%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-text-secondary mb-1">Payback Period</p>
                <p className="text-4xl font-bold text-green-400">2.7 mo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Next Steps for SMT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to={createPageUrl('APIManager')}>
              <Button className="w-full h-full flex-col items-start p-4 bg-brand-charcoal/30 hover:bg-brand-charcoal/50 border border-brand-border">
                <Database className="w-8 h-8 text-purple-400 mb-2" />
                <span className="font-bold text-brand-text-primary mb-1">Review Integrations</span>
                <span className="text-xs text-brand-text-secondary text-left">Explore all 40 connected systems</span>
              </Button>
            </Link>

            <Link to={createPageUrl('ExecutiveHub')}>
              <Button className="w-full h-full flex-col items-start p-4 bg-brand-charcoal/30 hover:bg-brand-charcoal/50 border border-brand-border">
                <BarChart3 className="w-8 h-8 text-blue-400 mb-2" />
                <span className="font-bold text-brand-text-primary mb-1">View Live Dashboards</span>
                <span className="text-xs text-brand-text-secondary text-left">Access executive intelligence reports</span>
              </Button>
            </Link>

            <Link to={createPageUrl('StrategicPlanningHub')}>
              <Button className="w-full h-full flex-col items-start p-4 bg-brand-charcoal/30 hover:bg-brand-charcoal/50 border border-brand-border">
                <Target className="w-8 h-8 text-green-400 mb-2" />
                <span className="font-bold text-brand-text-primary mb-1">Strategic Planning</span>
                <span className="text-xs text-brand-text-secondary text-left">Align DOMO insights with goals</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-950/30 to-blue-950/30 rounded-xl p-8 border border-purple-500/30 text-center">
        <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
          Ready to Unlock the Full Power of Your Data?
        </h3>
        <p className="text-brand-text-secondary mb-6 max-w-2xl mx-auto">
          DOMO transforms Curling Canada's 40 integrated systems into actionable intelligence, 
          driving better decisions, operational efficiency, and new revenue streams.
        </p>
        <div className="flex gap-4 justify-center">
          <Button className="bg-brand-red hover:bg-red-700" size="lg">
            <Mail className="w-4 h-4 mr-2" />
            Contact DOMO Team
          </Button>
          <Button variant="outline" size="lg">
            <ExternalLink className="w-4 h-4 mr-2" />
            <a href="https://www.domo.com/business-intelligence" target="_blank" rel="noopener noreferrer">
              Learn More About DOMO
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}