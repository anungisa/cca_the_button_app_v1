import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign, TrendingUp, ArrowLeft, Target, Zap, Crown,
  ShoppingBag, Users, Award, BarChart3, Rocket, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function RevenueOpportunities() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const revenueCategories = [
    {
      category: 'Subscription Optimization',
      current: 120000,
      potential: 450000,
      gap: 330000,
      growth: 275,
      initiatives: [
        { title: 'Granite Elite VIP Tier', impact: 200000, effort: 'Medium', timeline: 'Q1 2025', priority: 'Critical' },
        { title: 'Churn Prevention AI', impact: 150000, effort: 'Medium', timeline: 'Q3 2025', priority: 'Critical' },
        { title: 'Upsell Funnel Optimization', impact: 65000, effort: 'Small', timeline: 'Q1 2025', priority: 'High' },
        { title: 'Family Plan Bundles', impact: 35000, effort: 'Small', timeline: 'Q2 2025', priority: 'Medium' }
      ],
      icon: Crown,
      color: 'from-purple-500 to-pink-500'
    },
    {
      category: 'Coalition Partnerships',
      current: 0,
      potential: 300000,
      gap: 300000,
      growth: Infinity,
      initiatives: [
        { title: 'Scene+ Integration', impact: 150000, effort: 'Large', timeline: 'Q2 2025', priority: 'Critical' },
        { title: 'Aeroplan Partnership', impact: 100000, effort: 'Large', timeline: 'Q2 2025', priority: 'Critical' },
        { title: 'Canadian Tire Money', impact: 30000, effort: 'Medium', timeline: 'Q3 2025', priority: 'Medium' },
        { title: 'Petro-Points Redemption', impact: 20000, effort: 'Medium', timeline: 'Q3 2025', priority: 'Low' }
      ],
      icon: Zap,
      color: 'from-amber-500 to-orange-500'
    },
    {
      category: 'In-Venue Commerce',
      current: 50000,
      potential: 350000,
      gap: 300000,
      growth: 600,
      initiatives: [
        { title: 'Ticketmaster Integration', impact: 180000, effort: 'Large', timeline: 'Q2 2025', priority: 'Critical' },
        { title: 'F&B Mobile Ordering', impact: 120000, effort: 'Large', timeline: 'Q2 2025', priority: 'High' },
        { title: 'VIP Seat Upgrades', impact: 30000, effort: 'Medium', timeline: 'Q3 2025', priority: 'Medium' },
        { title: 'Merchandise Pop-up Sales', impact: 20000, effort: 'Small', timeline: 'Q1 2025', priority: 'Medium' }
      ],
      icon: ShoppingBag,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'Reward Marketplace',
      current: 80000,
      potential: 250000,
      gap: 170000,
      growth: 213,
      initiatives: [
        { title: 'Flash Sales Engine', impact: 85000, effort: 'Small', timeline: 'Q1 2025', priority: 'High' },
        { title: 'Dynamic Pricing Algorithm', impact: 45000, effort: 'Medium', timeline: 'Q2 2025', priority: 'High' },
        { title: 'Auction System', impact: 25000, effort: 'Medium', timeline: 'Q3 2025', priority: 'Medium' },
        { title: 'Partner Rewards Catalog', impact: 15000, effort: 'Small', timeline: 'Q2 2025', priority: 'Medium' }
      ],
      icon: Award,
      color: 'from-green-500 to-emerald-500'
    },
    {
      category: 'Data Products',
      current: 0,
      potential: 400000,
      gap: 400000,
      growth: Infinity,
      initiatives: [
        { title: 'Sponsor Intelligence Reports', impact: 200000, effort: 'Large', timeline: 'Q3 2025', priority: 'High' },
        { title: 'Club Benchmarking Dashboard', impact: 100000, effort: 'Medium', timeline: 'Q2 2025', priority: 'High' },
        { title: 'Athlete Performance Analytics', impact: 60000, effort: 'Medium', timeline: 'Q3 2025', priority: 'Medium' },
        { title: 'Fan Insights API', impact: 40000, effort: 'Large', timeline: 'Q4 2025', priority: 'Low' }
      ],
      icon: BarChart3,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      category: 'Advertising & Sponsorship',
      current: 200000,
      potential: 600000,
      gap: 400000,
      growth: 200,
      initiatives: [
        { title: 'In-App Sponsored Content', impact: 180000, effort: 'Medium', timeline: 'Q1 2025', priority: 'High' },
        { title: 'Brand Activation Quests', impact: 120000, effort: 'Small', timeline: 'Q1 2025', priority: 'High' },
        { title: 'Native Advertising System', impact: 70000, effort: 'Large', timeline: 'Q2 2025', priority: 'Medium' },
        { title: 'Sponsored Leaderboards', impact: 30000, effort: 'Small', timeline: 'Q2 2025', priority: 'Low' }
      ],
      icon: Users,
      color: 'from-red-500 to-pink-500'
    }
  ];

  const totalCurrent = revenueCategories.reduce((sum, cat) => sum + cat.current, 0);
  const totalPotential = revenueCategories.reduce((sum, cat) => sum + cat.potential, 0);
  const totalGap = totalPotential - totalCurrent;

  const filteredCategories = selectedCategory === 'all' 
    ? revenueCategories 
    : revenueCategories.filter(cat => cat.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={createPageUrl('MonetizationHub')}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">
            Revenue Opportunities Analysis
          </h1>
          <p className="text-brand-text-secondary">
            Identified $1.7M annual revenue potential across 6 categories
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <div className="text-4xl font-bold text-green-400 mb-2">
              ${(totalCurrent / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-brand-text-secondary">Current Annual Revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <div className="text-4xl font-bold text-blue-400 mb-2">
              ${(totalPotential / 1000).toFixed(1)}M
            </div>
            <p className="text-sm text-brand-text-secondary">Revenue Potential</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-950/30 to-orange-950/30 border-red-500/30">
          <CardContent className="p-6 text-center">
            <Target className="w-10 h-10 mx-auto mb-3 text-red-400" />
            <div className="text-4xl font-bold text-red-400 mb-2">
              ${(totalGap / 1000).toFixed(1)}M
            </div>
            <p className="text-sm text-brand-text-secondary">Revenue Gap to Close</p>
            <Badge className="mt-2 bg-red-500/20 text-red-400">
              +{Math.round((totalGap / totalCurrent) * 100)}% Growth
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          All Categories
        </Button>
        {revenueCategories.map((cat) => (
          <Button
            key={cat.category}
            variant={selectedCategory === cat.category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.category)}
          >
            {cat.category}
          </Button>
        ))}
      </div>

      {/* Revenue Categories */}
      <div className="space-y-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          const realizationPercent = (category.current / category.potential) * 100;
          
          return (
            <Card key={category.category} className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.category}</CardTitle>
                      <p className="text-sm text-brand-text-secondary">
                        {category.initiatives.length} strategic initiatives identified
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-400">
                      ${(category.gap / 1000).toFixed(0)}K
                    </div>
                    <p className="text-xs text-brand-text-secondary">Revenue Opportunity</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-brand-text-secondary">Revenue Realization</span>
                    <span className="font-semibold text-brand-text-primary">
                      ${(category.current / 1000).toFixed(0)}K / ${(category.potential / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <Progress value={realizationPercent} className="h-3" />
                  <p className="text-xs text-brand-text-secondary mt-1">
                    {realizationPercent.toFixed(1)}% of potential captured
                  </p>
                </div>

                {/* Initiatives */}
                <div className="grid md:grid-cols-2 gap-3">
                  {category.initiatives.map((initiative, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-brand-charcoal/50 rounded-lg border border-brand-border hover:border-brand-red transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-brand-text-primary text-sm">
                          {initiative.title}
                        </h4>
                        <Badge className={
                          initiative.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          initiative.priority === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }>
                          {initiative.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {initiative.effort}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {initiative.timeline}
                          </Badge>
                        </div>
                        <span className="font-bold text-green-400">
                          ${(initiative.impact / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Implementation Timeline */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Implementation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'].map((quarter) => {
              const quarterInitiatives = revenueCategories
                .flatMap(cat => cat.initiatives)
                .filter(init => init.timeline === quarter);
              
              const quarterRevenue = quarterInitiatives.reduce((sum, init) => sum + init.impact, 0);

              return (
                <div key={quarter} className="p-4 bg-brand-charcoal/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-brand-text-primary">{quarter}</h3>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400">
                        ${(quarterRevenue / 1000).toFixed(0)}K Impact
                      </Badge>
                      <Badge variant="outline">
                        {quarterInitiatives.length} Initiatives
                      </Badge>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    {quarterInitiatives.map((init, idx) => (
                      <div key={idx} className="text-sm p-2 bg-brand-card-bg rounded flex items-center justify-between">
                        <span className="text-brand-text-secondary">{init.title}</span>
                        <Badge variant="outline" className="text-xs">
                          ${(init.impact / 1000).toFixed(0)}K
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8 text-center">
          <Rocket className="w-12 h-12 mx-auto mb-4 text-brand-red" />
          <h3 className="text-xl font-bold text-brand-text-primary mb-2">
            Ready to Unlock $1.7M in Revenue?
          </h3>
          <p className="text-brand-text-secondary mb-6 max-w-2xl mx-auto">
            These opportunities are ranked by ROI, implementation complexity, and strategic alignment. 
            Critical initiatives can be delivered in Q1-Q2 2025 with immediate revenue impact.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={createPageUrl('TransformationRoadmap')}>
              <Button className="bg-brand-red hover:bg-red-700">
                <Calendar className="w-4 h-4 mr-2" />
                View Roadmap
              </Button>
            </Link>
            <Link to={createPageUrl('MonetizationAudit')}>
              <Button variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Full Audit Report
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}