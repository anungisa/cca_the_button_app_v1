
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  DollarSign, TrendingUp, Target, Zap, Users, Shield,
  Award, Rocket, Calendar, ArrowRight, Star, Gift,
  CreditCard, BarChart3, Globe, Sparkles, Crown,
  Flame, TrendingDown, CheckCircle
} from 'lucide-react';

export default function MonetizationHub() {
  const monetizationAreas = [
    {
      title: 'Fan Engagement Audit',
      description: 'Deep analysis of engagement pillars, gaps, and revenue opportunities',
      icon: Target,
      href: 'MonetizationAudit',
      color: 'from-blue-500 to-cyan-500',
      metric: { label: 'Overall Score', value: '77/100', status: 'good' },
      category: 'Strategy'
    },
    {
      title: 'Journey Mapping',
      description: 'Stakeholder journey analysis, touchpoint alignment, and conversion optimization',
      icon: Users,
      href: 'JourneyMapping',
      color: 'from-purple-500 to-pink-500',
      metric: { label: 'Stakeholders', value: '8 Mapped', status: 'good' },
      category: 'Strategy'
    },
    {
      title: 'Revenue Opportunities',
      description: 'Identified $1.7M annual revenue potential across 6 categories',
      icon: TrendingUp,
      href: 'RevenueOpportunities',
      color: 'from-green-500 to-emerald-500',
      metric: { label: 'Revenue Gap', value: '$1.7M', status: 'opportunity' },
      category: 'Revenue'
    },
    {
      title: 'Subscription Strategy',
      description: 'Fan Pass optimization, churn prevention, and VIP tier development',
      icon: Crown,
      href: 'SubscriptionStrategy',
      color: 'from-purple-500 to-pink-500',
      metric: { label: 'Potential', value: '$450K', status: 'high' },
      category: 'Revenue'
    },
    {
      title: 'Loyalty Architecture',
      description: 'Point economy, reward marketplace, and coalition partnerships',
      icon: Award,
      href: 'LoyaltyArchitecture',
      color: 'from-amber-500 to-orange-500',
      metric: { label: 'Score', value: '72/100', status: 'good' },
      category: 'Strategy'
    },
    {
      title: 'In-Venue Commerce',
      description: 'Ticketing, F&B ordering, seat upgrades, and mobile payments',
      icon: CreditCard,
      href: 'VenueCommerce',
      color: 'from-red-500 to-rose-500',
      metric: { label: 'Opportunity', value: '$350K', status: 'high' },
      category: 'Revenue'
    },
    {
      title: 'Partnership Ecosystem',
      description: 'Coalition loyalty, sponsor activations, and strategic alliances',
      icon: Sparkles,
      href: 'PartnershipEcosystem',
      color: 'from-indigo-500 to-purple-500',
      metric: { label: 'Potential', value: '$600K', status: 'critical' },
      category: 'Partnerships'
    },
    {
      title: 'Data Monetization',
      description: 'Analytics products for sponsors, clubs, and external partners',
      icon: BarChart3,
      href: 'DataMonetization',
      color: 'from-teal-500 to-cyan-500',
      metric: { label: 'New Revenue', value: '$400K', status: 'opportunity' },
      category: 'Revenue'
    },
    {
      title: 'Digital Transformation Roadmap',
      description: 'Phase 2-4 implementation timeline and work packages',
      icon: Calendar,
      href: 'TransformationRoadmap',
      color: 'from-violet-500 to-fuchsia-500',
      metric: { label: 'Timeline', value: 'Q1-Q4 2025', status: 'planning' },
      category: 'Strategy'
    }
  ];

  const quickStats = [
    {
      label: 'Total Revenue Opportunity',
      value: '$1.7M',
      change: '+332%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Current Maturity Score',
      value: '77/100',
      change: 'Top 10%',
      icon: Star,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Critical Initiatives',
      value: '10',
      change: '5 Q1 2025',
      icon: Flame,
      color: 'from-red-500 to-orange-500'
    },
    {
      label: 'Integration Systems',
      value: '50+',
      change: '19 New',
      icon: Globe,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const topPriorities = [
    {
      title: 'Customer Data Platform',
      impact: '$350K',
      effort: 'Large',
      timeline: 'Q2 2025',
      priority: 'Critical'
    },
    {
      title: 'Granite Elite VIP Tier',
      impact: '$200K',
      effort: 'Medium',
      timeline: 'Q1 2025',
      priority: 'Critical'
    },
    {
      title: 'Coalition Partnerships',
      impact: '$300K',
      effort: 'Large',
      timeline: 'Q2 2025',
      priority: 'Critical'
    },
    {
      title: 'Ticketmaster Integration',
      impact: '$180K',
      effort: 'Large',
      timeline: 'Q2 2025',
      priority: 'Critical'
    },
    {
      title: 'Churn Prevention AI',
      impact: '$150K',
      effort: 'Medium',
      timeline: 'Q3 2025',
      priority: 'Critical'
    }
  ];

  const categories = [...new Set(monetizationAreas.map(a => a.category))];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-brand-text-primary mb-3">
          Monetization & Growth Center
        </h1>
        <p className="text-brand-text-secondary text-lg max-w-3xl mx-auto">
          Strategic revenue acceleration through digital fan engagement, loyalty optimization, and partnership expansion
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className={`bg-gradient-to-br ${stat.color} bg-opacity-10 border-opacity-30`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-brand-text-primary mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-brand-text-secondary">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top 5 Strategic Priorities */}
      <Card className="bg-gradient-to-br from-red-950/20 to-orange-950/20 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-400" />
            Top 5 Strategic Priorities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPriorities.map((priority, idx) => (
              <div key={idx} className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border hover:border-red-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-red-400">#{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-text-primary">{priority.title}</h4>
                      <div className="flex gap-3 mt-1">
                        <Badge variant="outline" className="text-xs">{priority.effort}</Badge>
                        <Badge variant="outline" className="text-xs">{priority.timeline}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-500/20 text-red-400 mb-1">
                      {priority.priority}
                    </Badge>
                    <p className="text-xl font-bold text-green-400">{priority.impact}</p>
                    <p className="text-xs text-brand-text-secondary">Annual Impact</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monetization Areas by Category */}
      {categories.map(category => {
        const categoryAreas = monetizationAreas.filter(a => a.category === category);
        
        return (
          <div key={category}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px bg-brand-border flex-1" />
              <h2 className="text-xl font-semibold text-brand-text-primary">{category}</h2>
              <div className="h-px bg-brand-border flex-1" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryAreas.map((area) => {
                const Icon = area.icon;
                const statusColors = {
                  good: 'bg-green-500/20 text-green-400 border-green-500/30',
                  opportunity: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                  high: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
                  planning: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                };

                return (
                  <Link key={area.href} to={createPageUrl(area.href)}>
                    <Card className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/20 h-full group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-brand-red transition-colors">
                          {area.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-brand-text-secondary mb-4 line-clamp-2">
                          {area.description}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                          <span className="text-xs text-brand-text-secondary">{area.metric.label}</span>
                          <Badge className={statusColors[area.metric.status]}>
                            {area.metric.value}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Revenue Opportunity Overview */}
      <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Revenue Acceleration Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-sm text-brand-text-secondary mb-2">Current Annual</div>
              <div className="text-4xl font-bold text-brand-text-primary mb-1">$450K</div>
              <div className="text-xs text-brand-text-secondary">Baseline Revenue</div>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-green-400" />
            </div>

            <div className="text-center">
              <div className="text-sm text-brand-text-secondary mb-2">Potential Annual</div>
              <div className="text-4xl font-bold text-green-400 mb-1">$2.15M</div>
              <div className="text-xs text-green-400 font-semibold">+332% Growth Opportunity</div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-brand-charcoal/50 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-blue-400" />
                Quick Wins (Q1 2025)
              </h4>
              <ul className="space-y-1 text-sm text-brand-text-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  Flash sales engine: $85K
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  Happy hour multipliers: $50K
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  Social sharing: $100K
                </li>
              </ul>
            </div>

            <div className="p-4 bg-brand-charcoal/50 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-400" />
                Transformational (Q2-Q3 2025)
              </h4>
              <ul className="space-y-1 text-sm text-brand-text-secondary">
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-purple-400" />
                  Coalition partnerships: $300K
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-purple-400" />
                  CDP implementation: $350K
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-purple-400" />
                  Ticketing integration: $180K
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maturity Assessment */}
      <div className="grid md:grid-cols-5 gap-4">
        {[
          { pillar: 'Fan Identity', score: 78, status: 'Good', color: 'blue' },
          { pillar: 'Loyalty System', score: 72, status: 'Good', color: 'cyan' },
          { pillar: 'Venue Experience', score: 65, status: 'Needs Work', color: 'amber' },
          { pillar: 'Data & AI', score: 81, status: 'Excellent', color: 'green' },
          { pillar: 'Business Ops', score: 88, status: 'Excellent', color: 'emerald' }
        ].map((pillar) => (
          <Card key={pillar.pillar} className={`bg-${pillar.color}-950/20 border-${pillar.color}-500/30`}>
            <CardContent className="p-6 text-center">
              <div className={`text-4xl font-bold text-${pillar.color}-400 mb-2`}>
                {pillar.score}
              </div>
              <p className="text-sm font-semibold text-brand-text-primary mb-1">
                {pillar.pillar}
              </p>
              <Badge className={`bg-${pillar.color}-500/20 text-${pillar.color}-400 border-${pillar.color}-500/30 text-xs`}>
                {pillar.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategic Context */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-8 h-8 text-brand-red" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-4">
                Digital Fan Engagement Leadership
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">What's Working</h4>
                  <ul className="space-y-2 text-sm text-brand-text-secondary">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>50+ integrated systems with real-time sync</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Sophisticated 6-tier loyalty program</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>AI-powered personalization & insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Enterprise-grade security & compliance</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Growth Opportunities</h4>
                  <ul className="space-y-2 text-sm text-brand-text-secondary">
                    <li className="flex items-start gap-2">
                      <Rocket className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>Unified fan identity across all touchpoints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Rocket className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>Coalition loyalty partnerships (Scene+, Aeroplan)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Rocket className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>In-venue commerce & mobile ticketing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Rocket className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>Premium VIP tier with exclusive access</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-brand-charcoal/50 rounded-lg">
                <p className="text-sm text-brand-text-secondary">
                  <strong className="text-brand-text-primary">Executive Summary:</strong> The Button ranks in the 
                  <strong className="text-green-400"> top 10% of digital sports platforms globally</strong>, 
                  comparable to NBA and UEFA ecosystems. By implementing the top 5 strategic priorities, 
                  Curling Canada can capture <strong className="text-green-400">75% of the $1.7M revenue opportunity</strong> within 6 months.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Positioning */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-gray-950/30 to-slate-950/30 border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-base">Average Sports App</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-gray-400 mb-2">45</div>
            <p className="text-sm text-brand-text-secondary">Basic digital presence</p>
            <div className="mt-4 space-y-1 text-xs text-brand-text-secondary">
              <div>• Simple mobile app</div>
              <div>• Basic ticketing</div>
              <div>• Limited personalization</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-base">Top 25% Sports Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-blue-400 mb-2">68</div>
            <p className="text-sm text-brand-text-secondary">Advanced engagement</p>
            <div className="mt-4 space-y-1 text-xs text-brand-text-secondary">
              <div>• Loyalty programs</div>
              <div>• In-app purchases</div>
              <div>• Some personalization</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              The Button
              <Crown className="w-4 h-4 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-green-400 mb-2">77</div>
            <p className="text-sm text-green-400 font-semibold">Industry Leader</p>
            <div className="mt-4 space-y-1 text-xs text-brand-text-secondary">
              <div>• 50+ integrations</div>
              <div>• AI personalization</div>
              <div>• Comprehensive ecosystem</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer CTA */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8 text-center">
          <Rocket className="w-12 h-12 mx-auto mb-4 text-brand-red" />
          <h3 className="text-xl font-bold text-brand-text-primary mb-2">
            Ready to Accelerate Growth?
          </h3>
          <p className="text-brand-text-secondary mb-6 max-w-2xl mx-auto">
            Explore detailed analysis, revenue projections, and implementation roadmaps for each strategic initiative.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={createPageUrl('MonetizationAudit')}>
              <Button className="bg-brand-red hover:bg-red-700">
                <Target className="w-4 h-4 mr-2" />
                View Full Audit
              </Button>
            </Link>
            <Link to={createPageUrl('RevenueOpportunities')}>
              <Button variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                Revenue Breakdown
              </Button>
            </Link>
            <Link to={createPageUrl('TransformationRoadmap')}>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Implementation Roadmap
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
