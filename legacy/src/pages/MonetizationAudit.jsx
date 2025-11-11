import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle, AlertTriangle, XCircle, Target, Rocket, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function MonetizationAudit() {
  const [selectedPillar, setSelectedPillar] = useState('identity');

  const pillarScores = {
    identity: { score: 78, title: 'Fan Identity & Engagement', status: 'good' },
    loyalty: { score: 72, title: 'Loyalty + Rewards', status: 'good' },
    venue: { score: 65, title: 'Venue Experience', status: 'needs_improvement' },
    data: { score: 81, title: 'Data & Personalization', status: 'excellent' },
    business: { score: 88, title: 'Business Alignment', status: 'excellent' }
  };

  const pillarDetails = {
    identity: {
      strengths: [
        { item: 'Unique fan identity with comprehensive profile system', impact: 'High' },
        { item: 'Multi-tier loyalty program (6 tiers)', impact: 'High' },
        { item: 'Year-round XP missions across 15+ action types', impact: 'High' },
        { item: 'AI-powered recommendation engine', impact: 'High' },
        { item: 'Predictive engagement during live games', impact: 'High' }
      ],
      gaps: [
        { item: 'Limited Gen Z sharing (no TikTok/Instagram stories)', severity: 'Medium', revenue_impact: '$25K' },
        { item: 'No in-app messaging between fans', severity: 'Medium', revenue_impact: '$20K' },
        { item: 'Missing AR filters for patches', severity: 'Low', revenue_impact: '$10K' }
      ],
      critical: [
        { item: 'Multiscreen second-screen sync not implemented', severity: 'Critical', revenue_impact: '$75K', timeline: 'Q1 2025' },
        { item: 'Social sharing + viral loops underdeveloped', severity: 'Critical', revenue_impact: '$100K', timeline: 'Q1 2025' }
      ],
      recommendations: [
        { title: 'Instagram Story Integration', effort: 'Medium', impact: '$35K', priority: 'High' },
        { title: 'TikTok Challenge Framework', effort: 'Small', impact: '$50K', priority: 'High' },
        { title: 'AR Patch Scanner', effort: 'Medium', impact: '$20K', priority: 'Medium' }
      ]
    },
    loyalty: {
      strengths: [
        { item: 'Sophisticated point economy with 15+ earn methods', impact: 'High' },
        { item: 'Tiered rewards marketplace', impact: 'High' },
        { item: 'Club Hero Program', impact: 'High' },
        { item: 'Sponsor-activated quests', impact: 'High' }
      ],
      gaps: [
        { item: 'No dynamic pricing for rewards', severity: 'Medium', revenue_impact: '$30K' },
        { item: 'Missing VIP exclusive tiers', severity: 'High', revenue_impact: '$60K' },
        { item: 'No coalition partnerships', severity: 'High', revenue_impact: '$150K' }
      ],
      critical: [
        { item: 'No subscription upsell funnel', severity: 'Critical', revenue_impact: '$200K', timeline: 'Q2 2025' },
        { item: 'Missing NFT/digital collectibles', severity: 'Critical', revenue_impact: '$300K', timeline: 'Q3 2025' }
      ],
      recommendations: [
        { title: 'Granite Elite VIP Tier', effort: 'Medium', impact: '$200K', priority: 'Critical' },
        { title: 'Coalition Partnerships', effort: 'Large', impact: '$300K', priority: 'Critical' },
        { title: 'Flash Sales Engine', effort: 'Small', impact: '$85K', priority: 'High' }
      ]
    },
    venue: {
      strengths: [
        { item: 'Patch scanning with QR codes', impact: 'High' },
        { item: 'Geofencing for challenges', impact: 'High' },
        { item: 'Smart Broom IoT integration', impact: 'High' }
      ],
      gaps: [
        { item: 'No Ticketmaster integration', severity: 'Critical', revenue_impact: '$100K' },
        { item: 'No F&B ordering', severity: 'High', revenue_impact: '$80K' },
        { item: 'Missing seat upgrades', severity: 'Medium', revenue_impact: '$40K' }
      ],
      critical: [
        { item: 'Mobile wallet passes not fully integrated', severity: 'Critical', revenue_impact: '$120K', timeline: 'Q1 2025' },
        { item: 'No contactless in-venue payments', severity: 'Critical', revenue_impact: '$200K', timeline: 'Q2 2025' }
      ],
      recommendations: [
        { title: 'Ticketmaster Deep Integration', effort: 'Large', impact: '$180K', priority: 'Critical' },
        { title: 'In-Venue F&B Ordering', effort: 'Large', impact: '$120K', priority: 'High' },
        { title: 'VIP Recognition System', effort: 'Medium', impact: '$90K', priority: 'High' }
      ]
    },
    data: {
      strengths: [
        { item: '40+ data sources integrated', impact: 'High' },
        { item: 'Consent registry for compliance', impact: 'High' },
        { item: 'Comprehensive audit logging', impact: 'High' },
        { item: 'AI/ML models for predictions', impact: 'High' }
      ],
      gaps: [
        { item: 'No CDP implementation', severity: 'Critical', revenue_impact: '$250K' },
        { item: 'Fragmented identity across systems', severity: 'High', revenue_impact: '$80K' }
      ],
      critical: [
        { item: 'No unified 360° fan view', severity: 'Critical', revenue_impact: '$300K', timeline: 'Q2 2025' }
      ],
      recommendations: [
        { title: 'Implement Segment CDP', effort: 'Large', impact: '$350K', priority: 'Critical' },
        { title: 'Master Data Management', effort: 'Large', impact: '$150K', priority: 'Critical' },
        { title: 'A/B Testing Platform', effort: 'Medium', impact: '$80K', priority: 'High' }
      ]
    },
    business: {
      strengths: [
        { item: 'Cloud-native architecture', impact: 'High' },
        { item: 'Scalable integration ecosystem', impact: 'High' },
        { item: 'Enterprise security & compliance', impact: 'High' }
      ],
      gaps: [
        { item: 'No formal SLA monitoring', severity: 'Low', revenue_impact: '$10K' }
      ],
      critical: [],
      recommendations: [
        { title: 'CI/CD Pipeline', effort: 'Medium', impact: '$50K', priority: 'Medium' }
      ]
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to={createPageUrl('MonetizationHub')}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">
            Digital Fan Engagement Audit
          </h1>
          <p className="text-brand-text-secondary">
            Comprehensive analysis against industry best practices
          </p>
        </div>
      </div>

      {/* Pillar Scores */}
      <div className="grid md:grid-cols-5 gap-4">
        {Object.entries(pillarScores).map(([key, pillar]) => (
          <Card key={key} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-brand-text-primary mb-2">
                {pillar.score}
              </div>
              <p className="text-sm font-medium text-brand-text-primary mb-2">
                {pillar.title}
              </p>
              <Progress value={pillar.score} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            Pillar-by-Pillar Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPillar} onValueChange={setSelectedPillar}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
              <TabsTrigger value="venue">Venue</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>

            {Object.entries(pillarDetails).map(([key, details]) => (
              <TabsContent key={key} value={key} className="space-y-6 mt-6">
                {/* Strengths */}
                <div>
                  <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths ({details.strengths.length})
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {details.strengths.map((strength, idx) => (
                      <div key={idx} className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-brand-text-primary">{strength.item}</p>
                            <Badge className="mt-1 text-xs" variant="outline">
                              {strength.impact} Impact
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gaps */}
                {details.gaps.length > 0 && (
                  <div>
                    <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Gaps ({details.gaps.length})
                    </h4>
                    <div className="space-y-3">
                      {details.gaps.map((gap, idx) => (
                        <div key={idx} className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-brand-text-primary flex-1">
                              {gap.item}
                            </p>
                            <div className="flex gap-2">
                              <Badge className="bg-amber-500/20 text-amber-400">
                                {gap.severity}
                              </Badge>
                              <Badge className="bg-green-500/20 text-green-400">
                                {gap.revenue_impact}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Critical Issues */}
                {details.critical.length > 0 && (
                  <div>
                    <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Critical Issues ({details.critical.length})
                    </h4>
                    <div className="space-y-3">
                      {details.critical.map((issue, idx) => (
                        <div key={idx} className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-brand-text-primary flex-1">
                              {issue.item}
                            </p>
                            <div className="flex gap-2">
                              <Badge className="bg-red-500/20 text-red-400">
                                {issue.severity}
                              </Badge>
                              <Badge className="bg-green-500/20 text-green-400">
                                {issue.revenue_impact}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-brand-text-secondary">
                            Timeline: {issue.timeline}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Recommendations ({details.recommendations.length})
                  </h4>
                  <div className="space-y-3">
                    {details.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold text-brand-text-primary">
                            {rec.title}
                          </h5>
                          <Badge className={
                            rec.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            rec.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-blue-500/20 text-blue-400'
                          }>
                            {rec.priority}
                          </Badge>
                        </div>
                        <div className="flex gap-3 text-xs mt-2">
                          <Badge variant="outline">Effort: {rec.effort}</Badge>
                          <Badge className="bg-green-500/20 text-green-400">
                            Impact: {rec.impact}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}