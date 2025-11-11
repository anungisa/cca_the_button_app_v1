import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Crown, TrendingUp, ArrowLeft, Users, DollarSign, Star,
  TrendingDown, AlertTriangle, Zap, Target, Calendar, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function SubscriptionStrategy() {
  const subscriptionTiers = [
    {
      name: 'Fan Pass',
      current_subscribers: 1850,
      mrr: 9500,
      churn_rate: 8.2,
      avg_ltv: 165,
      features: ['2x XP multiplier', 'Exclusive badges', 'Early event access', 'Fan community'],
      price: 5.99,
      potential_subscribers: 3500,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Curling+ Basic',
      current_subscribers: 1200,
      mrr: 7200,
      churn_rate: 12.5,
      avg_ltv: 145,
      features: ['Live streaming', 'Event replays', 'Basic stats'],
      price: 6.99,
      potential_subscribers: 4000,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Curling+ Premium',
      current_subscribers: 850,
      mrr: 10200,
      churn_rate: 6.8,
      avg_ltv: 220,
      features: ['All Basic features', '4K quality', 'Multi-device', 'Exclusive content'],
      price: 12.99,
      potential_subscribers: 2500,
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'Granite Elite (NEW)',
      current_subscribers: 0,
      mrr: 0,
      churn_rate: 0,
      avg_ltv: 450,
      features: ['VIP lounge access', 'Player meet & greets', 'Priority ticketing', 'Concierge service', 'Exclusive merchandise'],
      price: 49.99,
      potential_subscribers: 400,
      color: 'from-amber-500 to-yellow-500',
      isNew: true
    }
  ];

  const churnData = [
    { month: 'Jan', fanPass: 7.2, curlingBasic: 11.5, curlingPremium: 5.8 },
    { month: 'Feb', fanPass: 8.1, curlingBasic: 12.8, curlingPremium: 6.2 },
    { month: 'Mar', fanPass: 7.8, curlingBasic: 13.2, curlingPremium: 6.5 },
    { month: 'Apr', fanPass: 8.5, curlingBasic: 12.1, curlingPremium: 7.1 },
    { month: 'May', fanPass: 8.2, curlingBasic: 12.5, curlingPremium: 6.8 },
    { month: 'Jun', fanPass: 8.0, curlingBasic: 11.9, curlingPremium: 6.4 }
  ];

  const growthProjections = [
    { quarter: 'Q1 2025', current: 450, projected: 520, elite: 50 },
    { quarter: 'Q2 2025', current: 450, projected: 680, elite: 150 },
    { quarter: 'Q3 2025', current: 450, projected: 850, elite: 250 },
    { quarter: 'Q4 2025', current: 450, projected: 1050, elite: 400 }
  ];

  const strategicInitiatives = [
    {
      title: 'Launch Granite Elite VIP Tier',
      description: 'Premium tier with exclusive access to player events, priority ticketing, VIP lounge access, and concierge service',
      impact: '$200K annual',
      timeline: 'Q1 2025',
      priority: 'Critical',
      requirements: [
        'Partner with venues for VIP lounge access',
        'Negotiate exclusive player availability',
        'Build concierge ticket system',
        'Create exclusive content pipeline'
      ],
      kpis: [
        '400 Granite Elite subscribers by end of year',
        'Average LTV of $450 per subscriber',
        'Churn rate under 5%',
        'Net Promoter Score above 70'
      ]
    },
    {
      title: 'AI-Powered Churn Prevention',
      description: 'Machine learning model to predict cancellations 7-14 days before they happen, triggering personalized retention offers',
      impact: '$150K annual',
      timeline: 'Q3 2025',
      priority: 'Critical',
      requirements: [
        'Train ML model on historical churn data',
        'Build automated email campaign system',
        'A/B test 3-5 retention offer variants',
        'Implement win-back workflow'
      ],
      kpis: [
        'Reduce churn by 30% (8.2% → 5.7%)',
        'Retention offer conversion rate above 25%',
        'Model prediction accuracy above 80%',
        'Save $150K in annual subscription revenue'
      ]
    },
    {
      title: 'Subscription Upsell Funnel',
      description: 'In-app prompts to upgrade from Fan Pass → Curling+ or Basic → Premium based on viewing behavior',
      impact: '$65K annual',
      timeline: 'Q1 2025',
      priority: 'High',
      requirements: [
        'Implement behavioral triggers (e.g., watched 3+ events)',
        'Design upsell modals with clear value props',
        'Offer limited-time upgrade discounts',
        'Track conversion metrics by trigger type'
      ],
      kpis: [
        '8% conversion rate on upsell prompts',
        '250 upgrades per quarter',
        'Average upsell value: $7/month',
        'Minimal impact on user satisfaction'
      ]
    },
    {
      title: 'Family Plan Bundles',
      description: 'Discounted family subscriptions (2-5 family members) to increase household penetration',
      impact: '$35K annual',
      timeline: 'Q2 2025',
      priority: 'Medium',
      requirements: [
        'Build family account management system',
        'Design family plan pricing (20% discount)',
        'Create family-shared achievements',
        'Enable parental controls for youth accounts'
      ],
      kpis: [
        '200 family plan subscriptions',
        'Average 3.2 members per family plan',
        'Lower churn than individual plans (family stickiness)',
        'Expand total addressable market by 15%'
      ]
    },
    {
      title: 'Annual Plan Incentives',
      description: 'Offer 2 months free for annual subscriptions (better cash flow + lower churn)',
      impact: '$45K annual',
      timeline: 'Q1 2025',
      priority: 'High',
      requirements: [
        'Update pricing page with annual comparison',
        'Email campaign promoting annual savings',
        'Offer exclusive annual subscriber perks',
        'Track annual vs monthly conversion'
      ],
      kpis: [
        '30% of new subscribers choose annual',
        'Annual churn rate 40% lower than monthly',
        'Improved cash flow with upfront payment',
        '$45K additional annual revenue'
      ]
    }
  ];

  const totalCurrentMRR = subscriptionTiers.reduce((sum, tier) => sum + tier.mrr, 0);
  const totalPotentialMRR = subscriptionTiers.reduce((sum, tier) => 
    sum + (tier.potential_subscribers * tier.price), 0
  );

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
            Subscription Growth Strategy
          </h1>
          <p className="text-brand-text-secondary">
            Path to $450K annual recurring revenue through optimization and new tiers
          </p>
        </div>
      </div>

      {/* MRR Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-3xl font-bold text-blue-400 mb-1">
              ${(totalCurrentMRR / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-brand-text-secondary">Current MRR</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-3xl font-bold text-green-400 mb-1">
              ${(totalPotentialMRR / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-brand-text-secondary">Potential MRR</p>
            <Badge className="mt-1 bg-green-500/20 text-green-400 text-xs">
              +{Math.round(((totalPotentialMRR - totalCurrentMRR) / totalCurrentMRR) * 100)}%
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {subscriptionTiers.reduce((sum, tier) => sum + tier.current_subscribers, 0).toLocaleString()}
            </div>
            <p className="text-xs text-brand-text-secondary">Active Subscribers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-950/30 to-orange-950/30 border-amber-500/30">
          <CardContent className="p-6 text-center">
            <TrendingDown className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-3xl font-bold text-amber-400 mb-1">8.2%</div>
            <p className="text-xs text-brand-text-secondary">Avg Churn Rate</p>
            <Badge className="mt-1 bg-amber-500/20 text-amber-400 text-xs">
              Target: 5.5%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Tiers */}
      <div className="grid md:grid-cols-2 gap-6">
        {subscriptionTiers.map((tier) => {
          const realizationPercent = (tier.current_subscribers / tier.potential_subscribers) * 100;
          
          return (
            <Card key={tier.name} className={`bg-gradient-to-br ${tier.color} bg-opacity-10 border-opacity-30`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {tier.name}
                      {tier.isNew && <Badge className="bg-brand-red text-white">NEW</Badge>}
                    </CardTitle>
                    <p className="text-2xl font-bold text-brand-text-primary mt-2">
                      ${tier.price}/mo
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-brand-text-secondary">MRR</div>
                    <div className="text-2xl font-bold text-green-400">
                      ${(tier.mrr / 1000).toFixed(1)}K
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                      <Star className="w-4 h-4 text-brand-red flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-brand-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-secondary">Subscribers</span>
                    <span className="font-semibold text-brand-text-primary">
                      {tier.current_subscribers.toLocaleString()} / {tier.potential_subscribers.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={realizationPercent} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-brand-text-secondary">Churn Rate</span>
                      <p className="font-bold text-brand-text-primary">{tier.churn_rate}%</p>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary">Avg LTV</span>
                      <p className="font-bold text-green-400">${tier.avg_ltv}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Churn Analysis */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6" />
            Churn Rate Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={churnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Legend />
              <Line type="monotone" dataKey="fanPass" stroke="#3b82f6" name="Fan Pass" strokeWidth={2} />
              <Line type="monotone" dataKey="curlingBasic" stroke="#a855f7" name="Curling+ Basic" strokeWidth={2} />
              <Line type="monotone" dataKey="curlingPremium" stroke="#ef4444" name="Curling+ Premium" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-400 mb-1">Churn Alert</p>
                <p className="text-sm text-brand-text-secondary">
                  Curling+ Basic has highest churn (12.5%). Implementing AI churn prevention could save 
                  <strong className="text-green-400"> $150K annually</strong> by reducing churn to 8%.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Projections */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            Revenue Growth Projections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthProjections}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="quarter" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Legend />
              <Bar dataKey="current" name="Current Baseline" fill="#6b7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projected" name="With Optimization" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="elite" name="Granite Elite" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Strategic Initiatives */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
          <Zap className="w-6 h-6 text-brand-red" />
          Strategic Initiatives
        </h2>
        
        {strategicInitiatives.map((initiative, idx) => (
          <Card key={idx} className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{initiative.title}</CardTitle>
                  <p className="text-sm text-brand-text-secondary mt-1">
                    {initiative.description}
                  </p>
                </div>
                <Badge className={
                  initiative.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  initiative.priority === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }>
                  {initiative.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-brand-text-primary mb-2 text-sm">Requirements</h4>
                  <ul className="space-y-1">
                    {initiative.requirements.map((req, i) => (
                      <li key={i} className="text-sm text-brand-text-secondary flex items-start gap-2">
                        <span className="text-brand-red">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-brand-text-primary mb-2 text-sm">Success Metrics</h4>
                  <ul className="space-y-1">
                    {initiative.kpis.map((kpi, i) => (
                      <li key={i} className="text-sm text-brand-text-secondary flex items-start gap-2">
                        <Target className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                        <span>{kpi}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                <div className="flex gap-3">
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {initiative.timeline}
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {initiative.impact}
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Summary */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-8 h-8 text-brand-red" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                Subscription Revenue Opportunity: $450K Annual
              </h3>
              <p className="text-brand-text-secondary mb-4">
                By implementing these 5 strategic initiatives, Curling Canada can grow subscription revenue from 
                <strong className="text-blue-400"> $120K → $450K annually</strong> (275% growth). 
                The Granite Elite tier alone represents <strong className="text-green-400">$200K in new revenue</strong>.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-brand-charcoal/50 rounded">
                  <p className="text-brand-text-secondary mb-1">Q1 2025 Quick Wins</p>
                  <p className="font-bold text-brand-text-primary">$110K</p>
                  <p className="text-xs text-brand-text-secondary">Elite tier + Annual plans</p>
                </div>
                <div className="p-3 bg-brand-charcoal/50 rounded">
                  <p className="text-brand-text-secondary mb-1">Q2-Q3 Optimization</p>
                  <p className="font-bold text-brand-text-primary">$150K</p>
                  <p className="text-xs text-brand-text-secondary">Churn AI + Family plans</p>
                </div>
                <div className="p-3 bg-brand-charcoal/50 rounded">
                  <p className="text-brand-text-secondary mb-1">Total Impact</p>
                  <p className="font-bold text-green-400">$330K</p>
                  <p className="text-xs text-green-400">Additional ARR by EOY</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}