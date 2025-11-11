import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Database, BarChart3, Shield, BookOpen, Activity, TrendingUp,
  Layers, GitBranch, Target, PieChart, Zap,
  Globe, Brain, Lock, Settings
} from 'lucide-react';
import { usePermissions } from '../components/hooks/usePermissions';

export default function DataNavigationHub() {
  const { permissions } = usePermissions();

  const dataPages = [
    {
      title: 'System Architecture',
      description: 'Complete view of all 50+ integrated systems and data flows',
      icon: Layers,
      href: 'SystemArchitecture',
      color: 'from-blue-500 to-cyan-500',
      category: 'Infrastructure',
      permission: 'canAccessPlatformSettings'
    },
    {
      title: 'DOMO Capabilities',
      description: 'Analytics dashboards, data visualization, and reporting capabilities',
      icon: BarChart3,
      href: 'DOMOCapabilities',
      color: 'from-purple-500 to-pink-500',
      category: 'Analytics',
      permission: 'canAccessStaffHQ'
    },
    {
      title: 'BDO Strategy Comparison',
      description: 'Comparison of BDO and The Button strategic approaches',
      icon: TrendingUp,
      href: 'BDOStrategyComparison',
      color: 'from-orange-500 to-red-500',
      category: 'Strategy',
      permission: 'canAccessStaffHQ'
    },
    {
      title: 'Data Strategy Assessment',
      description: 'Current state analysis and strategic recommendations',
      icon: Target,
      href: 'DataStrategyAssessment',
      color: 'from-green-500 to-emerald-500',
      category: 'Strategy',
      permission: 'canAccessStaffHQ'
    },
    {
      title: 'Data Quality Dashboard',
      description: 'Enterprise data quality monitoring, rules, and governance (N7)',
      icon: Shield,
      href: 'DataQualityDashboard',
      color: 'from-indigo-500 to-purple-500',
      category: 'Governance',
      permission: 'canAccessPlatformSettings'
    },
    {
      title: 'Business Glossary',
      description: 'Standardized business terms, definitions, and data dictionary',
      icon: BookOpen,
      href: 'BusinessGlossary',
      color: 'from-violet-500 to-purple-500',
      category: 'Governance',
      permission: 'canAccessStaffHQ'
    },
    {
      title: 'API Manager',
      description: 'Manage all external API connections, webhooks, and integrations',
      icon: Globe,
      href: 'APIManager',
      color: 'from-cyan-500 to-blue-500',
      category: 'Infrastructure',
      permission: 'canAccessAPIManager'
    },
    {
      title: 'System Health',
      description: 'Real-time monitoring of system performance and uptime',
      icon: Activity,
      href: 'SystemHealth',
      color: 'from-red-500 to-orange-500',
      category: 'Infrastructure',
      permission: 'canAccessPlatformSettings'
    },
    {
      title: 'Curling Data Hub',
      description: 'Centralized access to all curling-specific data sources',
      icon: Database,
      href: 'CurlingDataHub',
      color: 'from-teal-500 to-green-500',
      category: 'Analytics',
      permission: 'canAccessStaffHQ'
    },
    {
      title: 'Curler Data Hub',
      description: 'Member data, participation analytics, and user insights',
      icon: Database,
      href: 'CurlerDataHub',
      color: 'from-pink-500 to-rose-500',
      category: 'Analytics',
      permission: 'canAccessStaffHQ'
    },
    {
      title: 'Research Hub',
      description: 'Research partnerships, AI models, and data privacy management',
      icon: Brain,
      href: 'ResearchHub',
      color: 'from-amber-500 to-yellow-500',
      category: 'Analytics',
      permission: 'canAccessStaffHQ'
    },
    {
      title: 'Platform Settings',
      description: 'System configuration, workflows, and automation settings',
      icon: Settings,
      href: 'PlatformSettings',
      color: 'from-gray-500 to-slate-500',
      category: 'Infrastructure',
      permission: 'canAccessPlatformSettings'
    }
  ];

  const categories = [...new Set(dataPages.map(p => p.category))];

  const hasAnyPermission = dataPages.some(page => 
    !page.permission || permissions[page.permission]
  );

  if (!hasAnyPermission) {
    return (
      <div className="text-center py-12">
        <Lock className="w-12 h-12 mx-auto mb-4 text-brand-text-secondary opacity-50" />
        <p className="text-brand-text-secondary">
          You don't have permission to access Data & Analytics tools.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
          <Database className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-brand-text-primary mb-3">
          Data & Analytics Navigation
        </h1>
        <p className="text-brand-text-secondary text-lg max-w-2xl mx-auto">
          Comprehensive access to all data infrastructure, analytics, governance, and strategic planning tools
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-950/30 to-indigo-950/30 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Layers className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-3xl font-bold text-blue-400 mb-1">50+</div>
            <p className="text-xs text-brand-text-secondary">Integrated Systems</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-3xl font-bold text-purple-400 mb-1">30+</div>
            <p className="text-xs text-brand-text-secondary">DOMO Dashboards</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-3xl font-bold text-green-400 mb-1">92%</div>
            <p className="text-xs text-brand-text-secondary">Data Quality Score</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-950/30 to-red-950/30 border-orange-500/30">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-orange-400" />
            <div className="text-3xl font-bold text-orange-400 mb-1">250+</div>
            <p className="text-xs text-brand-text-secondary">Business Terms</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards by Category */}
      {categories.map(category => {
        const categoryPages = dataPages.filter(p => 
          p.category === category && (!p.permission || permissions[p.permission])
        );
        
        if (categoryPages.length === 0) return null;

        return (
          <div key={category}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px bg-brand-border flex-1" />
              <h2 className="text-xl font-semibold text-brand-text-primary">{category}</h2>
              <div className="h-px bg-brand-border flex-1" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link key={page.href} to={createPageUrl(page.href)}>
                    <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/20 h-full group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${page.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-brand-red transition-colors">
                          {page.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-brand-text-secondary line-clamp-3">
                          {page.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Data Ecosystem Overview */}
      <Card className="bg-gradient-to-br from-brand-charcoal to-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-brand-red" />
            Integrated Data Ecosystem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Data Sources
              </h4>
              <ul className="space-y-2 text-sm text-brand-text-secondary">
                <li>• 15+ Curling-specific platforms</li>
                <li>• 10+ Business operations systems</li>
                <li>• 8+ Marketing & analytics tools</li>
                <li>• 12+ Finance & fundraising platforms</li>
                <li>• 5+ Development & collaboration tools</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Real-Time Processing
              </h4>
              <ul className="space-y-2 text-sm text-brand-text-secondary">
                <li>• Live scoring from Curling.io</li>
                <li>• Real-time donations via GiveCloud</li>
                <li>• Instant membership updates</li>
                <li>• Live broadcast metrics</li>
                <li>• Automated quality checks</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Data Governance
              </h4>
              <ul className="space-y-2 text-sm text-brand-text-secondary">
                <li>• 250+ standardized business terms</li>
                <li>• Automated quality rules</li>
                <li>• Full data lineage tracking</li>
                <li>• Compliance monitoring</li>
                <li>• PII encryption & protection</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <p className="text-sm text-brand-text-secondary">
              <strong className="text-brand-text-primary">Enterprise-Grade Data Infrastructure:</strong> The Button 
              serves as the central data hub for Curling Canada, integrating data from all operational systems into 
              a unified platform with real-time synchronization, automated quality monitoring, and comprehensive 
              governance controls. Our architecture supports both operational efficiency and strategic decision-making 
              through advanced analytics and AI-powered insights.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Flow Visualization */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-6 h-6" />
            Data Flow Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4 items-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-brand-text-primary">External Sources</p>
              <p className="text-xs text-brand-text-secondary">50+ Systems</p>
            </div>

            <div className="text-center">
              <div className="text-3xl text-brand-text-secondary">→</div>
              <p className="text-xs text-brand-text-secondary mt-1">Scheduled Sync</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-brand-red/20 rounded-full flex items-center justify-center">
                <Layers className="w-8 h-8 text-brand-red" />
              </div>
              <p className="text-sm font-medium text-brand-text-primary">The Button</p>
              <p className="text-xs text-brand-text-secondary">Central Hub</p>
            </div>

            <div className="text-center">
              <div className="text-3xl text-brand-text-secondary">→</div>
              <p className="text-xs text-brand-text-secondary mt-1">Transform & Enrich</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-purple-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-brand-text-primary">Analytics</p>
              <p className="text-xs text-brand-text-secondary">DOMO & Insights</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Capabilities */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-950/20 to-cyan-950/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Real-Time Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-brand-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Live system health tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>API performance metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Data quality monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Error detection & alerts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              AI & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-brand-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Predictive analytics models</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Automated insights generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Performance trend analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>AI-powered recommendations</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Governance & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-brand-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Enterprise data quality rules</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Business glossary standards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Data lineage tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Compliance & audit logs</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer CTA */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8 text-center">
          <PieChart className="w-12 h-12 mx-auto mb-4 text-brand-red" />
          <h3 className="text-xl font-bold text-brand-text-primary mb-2">
            Enterprise Data Platform
          </h3>
          <p className="text-brand-text-secondary mb-6 max-w-2xl mx-auto">
            The Button represents a world-class data infrastructure combining real-time integration, 
            advanced analytics, and comprehensive governance—setting a new standard for sports organizations globally.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={createPageUrl('SystemArchitecture')}>
              <Button className="bg-brand-red hover:bg-red-700">
                <Layers className="w-4 h-4 mr-2" />
                View Full Architecture
              </Button>
            </Link>
            <Link to={createPageUrl('DataQualityDashboard')}>
              <Button variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Data Quality Dashboard
              </Button>
            </Link>
            <Link to={createPageUrl('APIManager')}>
              <Button variant="outline">
                <Globe className="w-4 h-4 mr-2" />
                API Manager
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const CheckCircle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);