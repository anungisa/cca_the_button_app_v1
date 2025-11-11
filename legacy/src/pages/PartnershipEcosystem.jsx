import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Handshake, ArrowLeft, Sparkles, TrendingUp, Users, DollarSign,
  Zap, Gift, Star, Globe, Target, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PartnershipEcosystem() {
  const partnershipCategories = [
    {
      category: 'Coalition Loyalty Programs',
      current_partners: 0,
      potential_partners: 4,
      revenue_opportunity: '$300K annual',
      priority: 'Critical',
      timeline: 'Q2-Q3 2025',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      partners: [
        {
          name: 'Scene+',
          members: '13M Canadians',
          benefit: '1:1 point conversion, access to Scene+ catalog',
          revenue: '$150K annual',
          effort: 'Large',
          status: 'not_started'
        },
        {
          name: 'Aeroplan',
          members: '5M Canadians',
          benefit: 'Premium travel rewards, airline upgrades',
          revenue: '$100K annual',
          effort: 'Large',
          status: 'not_started'
        },
        {
          name: 'Canadian Tire Money',
          members: '11M Canadians',
          benefit: 'Cross-brand redemption, sporting goods',
          revenue: '$30K annual',
          effort: 'Medium',
          status: 'not_started'
        },
        {
          name: 'Petro-Points',
          members: '8M Canadians',
          benefit: 'Gas station rewards, convenience items',
          revenue: '$20K annual',
          effort: 'Medium',
          status: 'not_started'
        }
      ]
    },
    {
      category: 'Sponsor Activation Partners',
      current_partners: 8,
      potential_partners: 15,
      revenue_opportunity: '$400K annual',
      priority: 'High',
      timeline: 'Q1-Q2 2025',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      partners: [
        {
          name: 'PointsBet',
          status: 'active',
          activation: 'In-game predictions, sponsored quests',
          revenue: '$75K annual',
          engagement: '3,200 predictions/month'
        },
        {
          name: 'Tim Hortons',
          status: 'opportunity',
          activation: 'Roll Up The Rim integration, bonus XP on purchases',
          revenue: '$60K annual',
          engagement: 'Estimated 5,000 interactions/month'
        },
        {
          name: 'Canadian Tire',
          status: 'opportunity',
          activation: 'Product placement in reward catalog, sponsored missions',
          revenue: '$50K annual',
          engagement: 'Estimated 2,500 redemptions/month'
        },
        {
          name: 'Sobeys/FreshCo',
          status: 'opportunity',
          activation: 'Grocery rewards, health & wellness quests',
          revenue: '$40K annual',
          engagement: 'Estimated 1,800 interactions/month'
        }
      ]
    },
    {
      category: 'Technology Partners',
      current_partners: 12,
      potential_partners: 18,
      revenue_opportunity: '$200K annual',
      priority: 'Medium',
      timeline: 'Q2-Q4 2025',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      partners: [
        {
          name: 'Ticketmaster',
          status: 'not_started',
          benefit: 'Mobile ticketing, seat upgrades, check-in',
          revenue: '$180K through improved conversion'
        },
        {
          name: 'Square/Moneris',
          status: 'opportunity',
          benefit: 'Contactless payments, F&B ordering',
          revenue: '$120K through increased spend'
        },
        {
          name: 'Shopify',
          status: 'opportunity',
          benefit: 'Enhanced e-commerce, product recommendations',
          revenue: '$40K through upsells'
        }
      ]
    },
    {
      category: 'Content & Media Partners',
      current_partners: 3,
      potential_partners: 8,
      revenue_opportunity: '$150K annual',
      priority: 'Medium',
      timeline: 'Q3-Q4 2025',
      icon: Star,
      color: 'from-red-500 to-pink-500',
      partners: [
        {
          name: 'TSN',
          status: 'active',
          benefit: 'Broadcast integration, exclusive content',
          revenue: '$50K through viewing engagement'
        },
        {
          name: 'Sportsnet',
          status: 'opportunity',
          benefit: 'Additional broadcast coverage, highlights',
          revenue: '$40K potential'
        },
        {
          name: 'YouTube',
          status: 'active',
          benefit: 'Video streaming, channel integration',
          revenue: '$25K through ad revenue share'
        }
      ]
    }
  ];

  const totalCurrent = partnershipCategories.reduce((sum, cat) => sum + cat.current_partners, 0);
  const totalPotential = partnershipCategories.reduce((sum, cat) => sum + cat.potential_partners, 0);
  const totalRevenue = partnershipCategories.reduce((sum, cat) => 
    sum + parseInt(cat.revenue_opportunity.replace(/\D/g, '')), 0
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
            Partnership Ecosystem Strategy
          </h1>
          <p className="text-brand-text-secondary">
            ${totalRevenue}K revenue opportunity through strategic partnerships
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Handshake className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <div className="text-4xl font-bold text-blue-400 mb-2">{totalCurrent}</div>
            <p className="text-sm text-brand-text-secondary">Active Partners</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Target className="w-10 h-10 mx-auto mb-3 text-purple-400" />
            <div className="text-4xl font-bold text-purple-400 mb-2">{totalPotential}</div>
            <p className="text-sm text-brand-text-secondary">Partnership Potential</p>
            <Badge className="mt-2 bg-purple-500/20 text-purple-400 text-xs">
              +{totalPotential - totalCurrent} opportunities
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <div className="text-4xl font-bold text-green-400 mb-2">
              ${(totalRevenue / 1000).toFixed(1)}M
            </div>
            <p className="text-sm text-brand-text-secondary">Revenue Opportunity</p>
          </CardContent>
        </Card>
      </div>

      {/* Partnership Categories */}
      {partnershipCategories.map((category) => {
        const Icon = category.icon;
        
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
                      {category.current_partners} active • {category.potential_partners} potential
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={
                    category.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30 mb-2' :
                    category.priority === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30 mb-2' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30 mb-2'
                  }>
                    {category.priority}
                  </Badge>
                  <p className="text-2xl font-bold text-green-400">{category.revenue_opportunity}</p>
                  <p className="text-xs text-brand-text-secondary">{category.timeline}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {category.partners.map((partner, idx) => (
                  <div key={idx} className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-brand-text-primary">{partner.name}</h4>
                      <Badge variant={partner.status === 'active' ? 'default' : 'outline'} className="text-xs">
                        {partner.status?.replace('_', ' ') || 'Opportunity'}
                      </Badge>
                    </div>
                    {partner.members && (
                      <p className="text-xs text-brand-text-secondary mb-2">
                        <Users className="w-3 h-3 inline mr-1" />
                        {partner.members}
                      </p>
                    )}
                    <p className="text-sm text-brand-text-secondary mb-3">
                      {partner.benefit || partner.activation}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                      <span className="text-xs text-brand-text-secondary">Revenue Impact</span>
                      <span className="font-bold text-green-400 text-sm">{partner.revenue}</span>
                    </div>
                    {partner.engagement && (
                      <p className="text-xs text-brand-text-secondary mt-1">{partner.engagement}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Implementation Roadmap */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            Partnership Implementation Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'].map((quarter) => (
              <div key={quarter} className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h3 className="font-bold text-brand-text-primary mb-3">{quarter}</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {quarter === 'Q1 2025' && (
                    <>
                      <div className="p-3 bg-brand-card-bg rounded text-sm">
                        <p className="font-semibold text-brand-text-primary">Scene+ Negotiations</p>
                        <p className="text-xs text-brand-text-secondary">Legal, API scoping</p>
                      </div>
                      <div className="p-3 bg-brand-card-bg rounded text-sm">
                        <p className="font-semibold text-brand-text-primary">PointsBet Expansion</p>
                        <p className="text-xs text-brand-text-secondary">New quest types</p>
                      </div>
                    </>
                  )}
                  {quarter === 'Q2 2025' && (
                    <>
                      <div className="p-3 bg-brand-card-bg rounded text-sm">
                        <p className="font-semibold text-brand-text-primary">Scene+ Launch</p>
                        <p className="text-xs text-green-400">$150K impact</p>
                      </div>
                      <div className="p-3 bg-brand-card-bg rounded text-sm">
                        <p className="font-semibold text-brand-text-primary">Aeroplan Integration</p>
                        <p className="text-xs text-green-400">$100K impact</p>
                      </div>
                      <div className="p-3 bg-brand-card-bg rounded text-sm">
                        <p className="font-semibold text-brand-text-primary">Ticketmaster API</p>
                        <p className="text-xs text-green-400">$180K impact</p>
                      </div>
                    </>
                  )}
                  {quarter === 'Q3 2025' && (
                    <>
                      <div className="p-3 bg-brand-card-bg rounded text-sm">
                        <p className="font-semibold text-brand-text-primary">CDN Tire Integration</p>
                        <p className="text-xs text-green-400">$30K impact</p>
                      </div>
                      <div className="p-3 bg-brand-card-bg rounded text-sm">
                        <p className="font-semibold text-brand-text-primary">Tim Hortons Partnership</p>
                        <p className="text-xs text-green-400">$60K impact</p>
                      </div>
                    </>
                  )}
                  {quarter === 'Q4 2025' && (
                    <>
                      <div className="p-3 bg-brand-card-bg rounded text-sm">
                        <p className="font-semibold text-brand-text-primary">Partnership Review</p>
                        <p className="text-xs text-brand-text-secondary">Optimize ROI</p>
                      </div>
                      <div className="p-3 bg-brand-card-bg rounded text-sm">
                        <p className="font-semibold text-brand-text-primary">Year 2 Planning</p>
                        <p className="text-xs text-brand-text-secondary">2026 roadmap</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Handshake className="w-8 h-8 text-brand-red" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                Partnership Revenue: $600K Opportunity
              </h3>
              <p className="text-brand-text-secondary mb-4">
                Coalition loyalty partnerships (Scene+, Aeroplan) represent the <strong className="text-green-400">single largest 
                revenue opportunity</strong> at $300K annual. These partnerships dramatically expand The Button's value 
                proposition by giving fans access to <strong className="text-blue-400">37M loyalty program members</strong> across Canada.
              </p>
              <div className="flex gap-3">
                <Link to={createPageUrl('SponsorshipHQ')}>
                  <Button className="bg-brand-red hover:bg-red-700">
                    <Handshake className="w-4 h-4 mr-2" />
                    Sponsorship Dashboard
                  </Button>
                </Link>
                <Link to={createPageUrl('MonetizationAudit')}>
                  <Button variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Full Audit
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