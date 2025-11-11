import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, ArrowLeft, Rocket, Target, CheckCircle, Clock,
  TrendingUp, DollarSign, Users, Zap, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TransformationRoadmap() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q1_2025');

  const roadmap = {
    'Q1_2025': {
      quarter: 'Q1 2025',
      theme: 'Quick Wins & Foundation',
      revenue_impact: '$270K',
      initiatives: [
        {
          title: 'Wallet Pass Completion',
          description: 'Complete Uplifter integration for Apple/Google Wallet passes',
          status: 'in_progress',
          revenue: '$50K',
          effort: 'Medium',
          team: 'Platform',
          deliverables: ['Uplifter API integration', 'Pass template design', 'QA testing']
        },
        {
          title: 'Flash Sales Engine',
          description: '24-hour limited rewards with countdown timers',
          status: 'not_started',
          revenue: '$85K',
          effort: 'Small',
          team: 'Product',
          deliverables: ['Flash sale admin UI', 'Countdown timer component', 'Email automation']
        },
        {
          title: 'Social Sharing Rewards',
          description: 'Bonus XP for sharing achievements on Instagram/Facebook',
          status: 'not_started',
          revenue: '$35K',
          effort: 'Small',
          team: 'Engagement',
          deliverables: ['Share button integration', 'XP tracking', 'Share templates']
        },
        {
          title: 'Annual Plan Incentives',
          description: 'Promote annual subscriptions with 2 months free offer',
          status: 'not_started',
          revenue: '$45K',
          effort: 'Small',
          team: 'Revenue',
          deliverables: ['Pricing page updates', 'Email campaign', 'Payment processing']
        },
        {
          title: 'Subscription Upsell Funnel',
          description: 'In-app prompts to upgrade based on viewing behavior',
          status: 'not_started',
          revenue: '$65K',
          effort: 'Medium',
          team: 'Product',
          deliverables: ['Behavioral triggers', 'Modal design', 'A/B testing']
        }
      ]
    },
    'Q2_2025': {
      quarter: 'Q2 2025',
      theme: 'Strategic Partnerships & Integration',
      revenue_impact: '$830K',
      initiatives: [
        {
          title: 'Scene+ Coalition Partnership',
          description: '1:1 point conversion with Scene+ loyalty program',
          status: 'not_started',
          revenue: '$150K',
          effort: 'Large',
          team: 'Partnerships',
          deliverables: ['Legal agreement', 'API integration', 'Point conversion logic', 'Marketing launch']
        },
        {
          title: 'Aeroplan Integration',
          description: 'CurlPoints convertible to Aeroplan miles',
          status: 'not_started',
          revenue: '$100K',
          effort: 'Large',
          team: 'Partnerships',
          deliverables: ['Partnership agreement', 'API integration', 'Conversion rates', 'Launch campaign']
        },
        {
          title: 'Ticketmaster Deep Integration',
          description: 'Full mobile ticketing with seat upgrades and digital passes',
          status: 'not_started',
          revenue: '$180K',
          effort: 'Large',
          team: 'Platform',
          deliverables: ['API integration', 'Ticket UI', 'Wallet passes', 'Barcode scanning']
        },
        {
          title: 'Granite Elite VIP Tier',
          description: 'Premium tier with exclusive player access and VIP perks',
          status: 'not_started',
          revenue: '$200K',
          effort: 'Medium',
          team: 'Product',
          deliverables: ['Tier design', 'Partner agreements', 'Exclusive content', 'Launch plan']
        },
        {
          title: 'In-Venue F&B Ordering',
          description: 'Order food and drinks from your seat via mobile',
          status: 'not_started',
          revenue: '$120K',
          effort: 'Large',
          team: 'Platform',
          deliverables: ['POS integration', 'Menu management', 'Order tracking', 'Kitchen displays']
        },
        {
          title: 'Club Benchmarking Product',
          description: 'Launch analytics dashboard for clubs and MAs',
          status: 'not_started',
          revenue: '$100K',
          effort: 'Medium',
          team: 'Analytics',
          deliverables: ['Dashboard design', 'Data pipelines', 'Benchmark calculations', 'Sales materials']
        }
      ]
    },
    'Q3_2025': {
      quarter: 'Q3 2025',
      theme: 'Optimization & AI',
      revenue_impact: '$490K',
      initiatives: [
        {
          title: 'Churn Prevention AI',
          description: 'ML model to predict and prevent subscription cancellations',
          status: 'not_started',
          revenue: '$150K',
          effort: 'Medium',
          team: 'Data Science',
          deliverables: ['Model training', 'Retention campaigns', 'A/B testing', 'Monitoring dashboard']
        },
        {
          title: 'Sponsor Intelligence Reports',
          description: 'Launch premium analytics product for sponsors',
          status: 'not_started',
          revenue: '$200K',
          effort: 'Large',
          team: 'Analytics',
          deliverables: ['Report templates', 'Data pipelines', 'White-label dashboards', 'Sales process']
        },
        {
          title: 'VIP Recognition System',
          description: 'Auto-detect and serve VIP fans at events',
          status: 'not_started',
          revenue: '$90K',
          effort: 'Medium',
          team: 'Platform',
          deliverables: ['Bluetooth beacons', 'Staff app', 'Recognition logic', 'Concierge workflow']
        },
        {
          title: 'Happy Hour XP Multipliers',
          description: '2x-3x points during championship games',
          status: 'not_started',
          revenue: '$50K',
          effort: 'Small',
          team: 'Product',
          deliverables: ['Multiplier logic', 'Event scheduling', 'UI updates', 'Notifications']
        }
      ]
    },
    'Q4_2025': {
      quarter: 'Q4 2025',
      theme: 'Innovation & Scale',
      revenue_impact: '$540K',
      initiatives: [
        {
          title: 'Customer Data Platform (CDP)',
          description: 'Segment CDP for unified 360° fan intelligence',
          status: 'not_started',
          revenue: '$350K',
          effort: 'Large',
          team: 'Platform',
          deliverables: ['CDP implementation', 'Identity resolution', 'Data unification', 'Personalization engine']
        },
        {
          title: 'NFT Digital Collectibles',
          description: 'Launch blockchain-based patch and moment collectibles',
          status: 'not_started',
          revenue: '$300K',
          effort: 'Large',
          team: 'Innovation',
          deliverables: ['Blockchain selection', 'Smart contracts', 'NFT marketplace', 'Wallet integration']
        },
        {
          title: 'AR Shot Visualization',
          description: 'Point phone at sheet to see shot trajectories',
          status: 'not_started',
          revenue: '$70K',
          effort: 'Large',
          team: 'Innovation',
          deliverables: ['AR framework', 'Shot data API', '3D rendering', 'UX testing']
        },
        {
          title: 'Athlete Performance Analytics Product',
          description: 'Launch analytics product for athletes and coaches',
          status: 'not_started',
          revenue: '$60K',
          effort: 'Medium',
          team: 'HP',
          deliverables: ['Analytics dashboard', 'Data pipelines', 'Pricing model', 'Sales materials']
        }
      ]
    }
  };

  const quarters = Object.keys(roadmap);
  const selectedData = roadmap[selectedQuarter];

  const totalRevenue = Object.values(roadmap).reduce((sum, q) => 
    sum + parseInt(q.revenue_impact.replace(/\D/g, '')), 0
  );

  const allInitiatives = Object.values(roadmap).flatMap(q => q.initiatives);
  const totalInitiatives = allInitiatives.length;

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
            Digital Transformation Roadmap
          </h1>
          <p className="text-brand-text-secondary">
            {totalInitiatives} strategic initiatives delivering ${(totalRevenue / 1000).toFixed(1)}M revenue impact
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-3xl font-bold text-blue-400 mb-1">12</div>
            <p className="text-xs text-brand-text-secondary">Months to Execute</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Rocket className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-3xl font-bold text-purple-400 mb-1">{totalInitiatives}</div>
            <p className="text-xs text-brand-text-secondary">Strategic Initiatives</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-3xl font-bold text-green-400 mb-1">
              ${(totalRevenue / 1000).toFixed(1)}M
            </div>
            <p className="text-xs text-brand-text-secondary">Revenue Impact</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-950/30 to-orange-950/30 border-amber-500/30">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-3xl font-bold text-amber-400 mb-1">77→92</div>
            <p className="text-xs text-brand-text-secondary">Maturity Score Gain</p>
          </CardContent>
        </Card>
      </div>

      {/* Quarter Selector */}
      <div className="flex gap-2 flex-wrap">
        {quarters.map((quarter) => (
          <Button
            key={quarter}
            variant={selectedQuarter === quarter ? 'default' : 'outline'}
            onClick={() => setSelectedQuarter(quarter)}
          >
            {roadmap[quarter].quarter}
          </Button>
        ))}
      </div>

      {/* Selected Quarter Details */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{selectedData.quarter}</CardTitle>
              <p className="text-brand-text-secondary font-semibold">{selectedData.theme}</p>
            </div>
            <div className="text-right">
              <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                {selectedData.revenue_impact}
              </Badge>
              <p className="text-xs text-brand-text-secondary mt-1">Revenue Impact</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedData.initiatives.map((initiative, idx) => (
            <Card key={idx} className="bg-brand-charcoal/50 border-brand-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{initiative.title}</CardTitle>
                    <p className="text-sm text-brand-text-secondary">{initiative.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-400 mb-2">
                      {initiative.revenue}
                    </Badge>
                    <p className="text-xs text-brand-text-secondary">{initiative.team} team</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-3">
                  <Badge variant="outline" className="text-xs">{initiative.effort} Effort</Badge>
                  <Badge variant={
                    initiative.status === 'in_progress' ? 'default' :
                    initiative.status === 'completed' ? 'secondary' :
                    'outline'
                  } className="text-xs">
                    {initiative.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-brand-text-secondary font-semibold mb-2">Key Deliverables:</p>
                  <div className="grid md:grid-cols-3 gap-2">
                    {initiative.deliverables.map((deliverable, i) => (
                      <div key={i} className="p-2 bg-brand-card-bg rounded text-xs text-brand-text-secondary">
                        • {deliverable}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Rocket className="w-8 h-8 text-brand-red" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                Ready to Execute the Roadmap?
              </h3>
              <p className="text-brand-text-secondary mb-4">
                This 12-month transformation plan delivers <strong className="text-green-400">${(totalRevenue / 1000).toFixed(1)}M in new revenue</strong> through 
                {totalInitiatives} strategic initiatives. Each quarter builds on the last, progressing from quick wins to 
                transformational innovation.
              </p>
              <div className="flex gap-3">
                <Link to={createPageUrl('MonetizationAudit')}>
                  <Button className="bg-brand-red hover:bg-red-700">
                    <Target className="w-4 h-4 mr-2" />
                    View Full Audit
                  </Button>
                </Link>
                <Link to={createPageUrl('MonetizationHub')}>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Back to Hub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}