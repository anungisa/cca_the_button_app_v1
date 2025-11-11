import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Award, ArrowLeft, Sparkles, Zap, Gift, Target, Users,
  TrendingUp, Star, Flame, ShoppingBag, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Progress } from '@/components/ui/progress';

export default function LoyaltyArchitecture() {
  const loyaltyTiers = [
    { name: 'Granite Rookie', xp_required: 0, members: 4200, color: 'gray', perks: ['Basic rewards', 'Club access'] },
    { name: 'Sheet Star', xp_required: 500, members: 3100, color: 'blue', perks: ['Priority support', '10% merch discount'] },
    { name: 'House Hero', xp_required: 2000, members: 2800, color: 'purple', perks: ['Exclusive events', 'Free shipping'] },
    { name: 'Button Boss', xp_required: 5000, members: 1400, color: 'red', perks: ['VIP access', '20% discount'] },
    { name: 'Hack Master', xp_required: 10000, members: 750, color: 'green', perks: ['Player meet & greets', 'Early access'] },
    { name: 'Granite Legacy', xp_required: 25000, members: 250, color: 'amber', perks: ['Lifetime benefits', 'Hall of Fame'] }
  ];

  const xpEarnMethods = [
    { action: 'Attend event in-person', xp: 200, frequency: 'Per event', volume: 'High' },
    { action: 'Watch livestream', xp: 50, frequency: 'Per game', volume: 'High' },
    { action: 'Complete trivia challenge', xp: 25, frequency: 'Daily', volume: 'High' },
    { action: 'Scan event patch', xp: 100, frequency: 'Per patch', volume: 'Medium' },
    { action: 'Volunteer shift', xp: 300, frequency: 'Per shift', volume: 'Medium' },
    { action: 'Donate to FTLOC', xp: 100, frequency: 'Per $10 donated', volume: 'Medium' },
    { action: 'Share social post', xp: 10, frequency: 'Per share', volume: 'Low' },
    { action: 'Refer a friend', xp: 500, frequency: 'Per referral', volume: 'Low' },
    { action: 'Complete knowledge article', xp: 50, frequency: 'Per article', volume: 'Medium' },
    { action: 'Log drill (athletes)', xp: 75, frequency: 'Per drill', volume: 'Medium' },
    { action: 'Make correct prediction', xp: 30, frequency: 'Per prediction', volume: 'High' },
    { action: 'Achieve milestone', xp: 250, frequency: 'Variable', volume: 'Low' },
    { action: 'Complete sponsor quest', xp: 150, frequency: 'Per quest', volume: 'Medium' },
    { action: 'Maintain streak (7 days)', xp: 100, frequency: 'Weekly', volume: 'Low' },
    { action: 'Give kudos', xp: 5, frequency: 'Per kudos', volume: 'Medium' }
  ];

  const rewardCategories = [
    {
      category: 'Merchandise',
      items: 42,
      redemptions: 1200,
      avg_cost: 350,
      revenue_potential: 25000,
      icon: ShoppingBag,
      examples: ['Team Canada jersey', 'Curling stone replica', 'Branded broom']
    },
    {
      category: 'Experiences',
      items: 18,
      redemptions: 320,
      avg_cost: 800,
      revenue_potential: 60000,
      icon: Star,
      examples: ['Player meet & greet', 'VIP lounge access', 'Ice-side seats']
    },
    {
      category: 'Discounts',
      items: 65,
      redemptions: 2800,
      avg_cost: 150,
      revenue_potential: 15000,
      icon: Gift,
      examples: ['Event ticket 20% off', 'Pro shop coupon', 'Free shipping']
    },
    {
      category: 'Exclusive Access',
      items: 12,
      redemptions: 580,
      avg_cost: 500,
      revenue_potential: 45000,
      icon: Sparkles,
      examples: ['Early event registration', 'Exclusive content', 'Beta features']
    }
  ];

  const gapsAndOpportunities = [
    {
      gap: 'No time-limited flash sales',
      opportunity: 'Flash Sales Engine',
      impact: '$85K annual',
      effort: 'Small',
      description: '24-hour limited rewards with countdown timers and scarcity messaging'
    },
    {
      gap: 'Missing VIP-only categories',
      opportunity: 'Granite Elite Tier',
      impact: '$200K annual',
      effort: 'Medium',
      description: 'Premium tier above Legacy with exclusive high-value rewards'
    },
    {
      gap: 'No dynamic point multipliers',
      opportunity: 'Happy Hour Events',
      impact: '$50K annual',
      effort: 'Small',
      description: '2x-3x XP during championship games and special events'
    },
    {
      gap: 'Limited partner rewards',
      opportunity: 'Coalition Partnerships',
      impact: '$300K annual',
      effort: 'Large',
      description: 'Scene+, Aeroplan point conversion and cross-brand redemption'
    },
    {
      gap: 'No reward tier previews',
      opportunity: 'Aspiration Engine',
      impact: '$30K annual',
      effort: 'Small',
      description: 'Show locked rewards with "Unlock at Sheet Star" teasers'
    },
    {
      gap: 'Missing points gifting',
      opportunity: 'Social Currency',
      impact: '$20K annual',
      effort: 'Medium',
      description: 'Allow fans to gift points to friends and family'
    }
  ];

  const totalMembers = loyaltyTiers.reduce((sum, tier) => sum + tier.members, 0);

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
            Loyalty Architecture & Point Economy
          </h1>
          <p className="text-brand-text-secondary">
            6-tier system powering {totalMembers.toLocaleString()} engaged members
          </p>
        </div>
      </div>

      {/* Tier Distribution */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6" />
            Loyalty Tier Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loyaltyTiers.map((tier) => {
              const percentage = (tier.members / totalMembers) * 100;
              
              return (
                <div key={tier.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${tier.color}-500/20 rounded-lg flex items-center justify-center`}>
                        <Award className={`w-5 h-5 text-${tier.color}-400`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-text-primary">{tier.name}</h4>
                        <p className="text-xs text-brand-text-secondary">
                          {tier.xp_required.toLocaleString()} XP required
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-text-primary">
                        {tier.members.toLocaleString()}
                      </p>
                      <p className="text-xs text-brand-text-secondary">
                        {percentage.toFixed(1)}% of members
                      </p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex gap-2">
                    {tier.perks.map((perk, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {perk}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* XP Earn Methods */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6" />
            XP Earn Methods (15 Actions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {xpEarnMethods.map((method, idx) => (
              <div key={idx} className="p-3 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-brand-text-primary flex-1">
                    {method.action}
                  </p>
                  <Badge className={
                    method.volume === 'High' ? 'bg-green-500/20 text-green-400' :
                    method.volume === 'Medium' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }>
                    {method.volume}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-text-secondary">{method.frequency}</span>
                  <span className="font-bold text-brand-red">+{method.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reward Marketplace */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-6 h-6" />
            Reward Marketplace Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {rewardCategories.map((category) => {
              const Icon = category.icon;
              
              return (
                <Card key={category.category} className="bg-brand-charcoal/50 border-brand-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-brand-red" />
                        <CardTitle className="text-base">{category.category}</CardTitle>
                      </div>
                      <Badge variant="outline">{category.items} items</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-brand-text-secondary">Redemptions</p>
                        <p className="font-bold text-brand-text-primary">
                          {category.redemptions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-brand-text-secondary">Avg Cost</p>
                        <p className="font-bold text-brand-text-primary">
                          {category.avg_cost} pts
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                      <p className="text-xs text-brand-text-secondary mb-1">Revenue Potential</p>
                      <p className="text-xl font-bold text-green-400">
                        ${(category.revenue_potential / 1000).toFixed(0)}K
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-brand-text-secondary font-semibold">Examples:</p>
                      {category.examples.map((example, idx) => (
                        <p key={idx} className="text-xs text-brand-text-secondary flex items-center gap-1">
                          <span className="text-brand-red">•</span>
                          {example}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Gaps & Opportunities */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            Strategic Enhancement Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gapsAndOpportunities.map((item, idx) => (
              <div key={idx} className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border hover:border-brand-red transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400">
                        Gap: {item.gap}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-brand-text-primary text-lg">{item.opportunity}</h4>
                    <p className="text-sm text-brand-text-secondary mt-1">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-400 mb-1">
                      {item.impact}
                    </Badge>
                    <p className="text-xs text-brand-text-secondary">{item.effort} effort</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-3xl font-bold text-blue-400 mb-1">65%</div>
            <p className="text-xs text-brand-text-secondary">Active Engagement</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <Gift className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-3xl font-bold text-purple-400 mb-1">3,200</div>
            <p className="text-xs text-brand-text-secondary">Monthly Redemptions</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-3xl font-bold text-green-400 mb-1">$85K</div>
            <p className="text-xs text-brand-text-secondary">Reward Value Issued</p>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-3xl font-bold text-amber-400 mb-1">8.5</div>
            <p className="text-xs text-brand-text-secondary">Avg Session (min)</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Flame className="w-8 h-8 text-brand-red" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                Loyalty System Scoring: 72/100
              </h3>
              <p className="text-brand-text-secondary mb-4">
                The Button's loyalty architecture is <strong className="text-green-400">industry-leading</strong> with 
                sophisticated multi-tier progression, 15 XP earn methods, and anti-fraud safeguards. 
                By addressing 6 identified gaps, the program can drive an additional <strong className="text-green-400">$685K in annual revenue</strong>.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                  <p className="text-green-400 font-semibold mb-1">Strengths</p>
                  <ul className="space-y-1 text-brand-text-secondary">
                    <li>• 6 progression tiers</li>
                    <li>• 15 earn methods</li>
                    <li>• 137 unique rewards</li>
                    <li>• Anti-fraud controls</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-500/10 rounded border border-amber-500/30">
                  <p className="text-amber-400 font-semibold mb-1">Opportunities</p>
                  <ul className="space-y-1 text-brand-text-secondary">
                    <li>• Flash sales urgency</li>
                    <li>• Coalition partners</li>
                    <li>• Dynamic pricing</li>
                    <li>• VIP exclusivity</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <p className="text-blue-400 font-semibold mb-1">Next Steps</p>
                  <ul className="space-y-1 text-brand-text-secondary">
                    <li>• Granite Elite tier</li>
                    <li>• Happy hour 2x XP</li>
                    <li>• Scene+ integration</li>
                    <li>• Reward previews</li>
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