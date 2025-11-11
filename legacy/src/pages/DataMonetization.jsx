import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3, ArrowLeft, Brain, DollarSign, Users, Target,
  TrendingUp, Shield, Award, Sparkles, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DataMonetization() {
  const dataProducts = [
    {
      product: 'Sponsor Intelligence Reports',
      description: 'ROI analytics, audience demographics, engagement metrics for sponsors',
      target_customers: ['Presenting sponsors', 'Supporting sponsors', 'Media partners'],
      pricing: '$2,500/month per sponsor',
      potential_customers: 8,
      annual_revenue: '$200K',
      features: [
        'Real-time activation metrics',
        'Fan demographic breakdowns',
        'Engagement attribution',
        'Competitive benchmarking',
        'Custom reporting dashboards',
        'White-label analytics'
      ],
      effort: 'Large',
      timeline: 'Q3 2025',
      priority: 'High'
    },
    {
      product: 'Club Benchmarking Dashboard',
      description: 'Performance analytics comparing clubs to regional and national averages',
      target_customers: ['Club administrators', 'MA leaders', 'Club consultants'],
      pricing: '$500/month per club or $5K annual MA license',
      potential_customers: 20,
      annual_revenue: '$100K',
      features: [
        'Membership growth trends',
        'Financial health scoring',
        'Engagement benchmarks',
        'Best practice recommendations',
        'Retention analytics',
        'Survey insights integration'
      ],
      effort: 'Medium',
      timeline: 'Q2 2025',
      priority: 'High'
    },
    {
      product: 'Athlete Performance Analytics',
      description: 'Shot accuracy, drill progression, and performance insights for athletes and coaches',
      target_customers: ['High performance centers', 'Provincial teams', 'Elite athletes'],
      pricing: '$100/month per athlete',
      potential_customers: 50,
      annual_revenue: '$60K',
      features: [
        'Shot tracker analytics',
        'Drill progression reports',
        'Smart Broom insights',
        'Peer comparisons',
        'AI coaching recommendations',
        'Video analysis integration'
      ],
      effort: 'Medium',
      timeline: 'Q3 2025',
      priority: 'Medium'
    },
    {
      product: 'Fan Intelligence API',
      description: 'Anonymized fan behavior data for market research and product development',
      target_customers: ['Equipment manufacturers', 'Venue operators', 'Media companies'],
      pricing: '$1,000/month + usage fees',
      potential_customers: 4,
      annual_revenue: '$40K',
      features: [
        'Aggregated behavioral data',
        'Trend analysis',
        'Sentiment scoring',
        'Purchase pattern insights',
        'Geographic distribution',
        'Privacy-compliant datasets'
      ],
      effort: 'Large',
      timeline: 'Q4 2025',
      priority: 'Low'
    }
  ];

  const totalRevenue = dataProducts.reduce((sum, product) => 
    sum + parseInt(product.annual_revenue.replace(/\D/g, '')), 0
  );

  const privacyCompliance = [
    { requirement: 'GDPR Compliance', status: 'Implemented', details: 'Consent registry, right to deletion' },
    { requirement: 'PIPEDA Compliance', status: 'Implemented', details: 'Canadian privacy law adherence' },
    { requirement: 'Anonymization', status: 'Implemented', details: 'User data hashed for analytics products' },
    { requirement: 'Consent Management', status: 'Implemented', details: '6 granular consent types tracked' },
    { requirement: 'Data Governance', status: 'Implemented', details: 'Business glossary, quality rules' },
    { requirement: 'Audit Trails', status: 'Implemented', details: 'All data access logged and monitored' }
  ];

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
            Data Monetization Strategy
          </h1>
          <p className="text-brand-text-secondary">
            ${totalRevenue}K new revenue stream through analytics products
          </p>
        </div>
      </div>

      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-blue-500/30">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                Transforming Data into Revenue
              </h3>
              <p className="text-brand-text-secondary">
                The Button collects rich behavioral, engagement, and performance data across 
                <strong className="text-blue-400"> 40+ integrated systems</strong>. This data can be packaged 
                into premium analytics products for sponsors, clubs, and external partners - creating a 
                <strong className="text-green-400"> $400K annual revenue stream</strong> while maintaining 
                strict privacy compliance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Products */}
      <div className="space-y-6">
        {dataProducts.map((product, idx) => (
          <Card key={idx} className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{product.product}</CardTitle>
                  <p className="text-sm text-brand-text-secondary mb-3">
                    {product.description}
                  </p>
                  <div className="flex gap-2">
                    <Badge className={
                      product.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      product.priority === 'Medium' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }>
                      {product.priority} Priority
                    </Badge>
                    <Badge variant="outline">{product.effort} Effort</Badge>
                    <Badge variant="outline">{product.timeline}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500/20 text-green-400 mb-2">
                    {product.annual_revenue}
                  </Badge>
                  <p className="text-sm text-brand-text-secondary">{product.pricing}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-brand-text-primary mb-2 text-sm">Target Customers</h4>
                  <ul className="space-y-1">
                    {product.target_customers.map((customer, i) => (
                      <li key={i} className="text-sm text-brand-text-secondary flex items-center gap-2">
                        <Users className="w-3 h-3 text-brand-red" />
                        {customer}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-brand-text-secondary mt-2">
                    Potential customers: {product.potential_customers}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-brand-text-primary mb-2 text-sm">Key Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, i) => (
                      <div key={i} className="text-xs text-brand-text-secondary flex items-start gap-1">
                        <Sparkles className="w-3 h-3 text-brand-red mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Privacy & Compliance */}
      <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-400" />
            Privacy & Compliance Framework
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {privacyCompliance.map((item, idx) => (
              <div key={idx} className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <h4 className="font-semibold text-green-400 text-sm">{item.requirement}</h4>
                </div>
                <Badge className="bg-green-500/20 text-green-400 text-xs mb-2">
                  {item.status}
                </Badge>
                <p className="text-xs text-brand-text-secondary">{item.details}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <p className="text-sm text-brand-text-secondary">
              <strong className="text-green-400">Privacy-First Architecture:</strong> All data products are built 
              on anonymized, aggregated datasets with explicit consent. Personal identifiable information is never 
              sold or shared. The Button's data governance framework ensures full compliance with Canadian and 
              international privacy regulations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}