import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag, ArrowLeft, MapPin, CreditCard, Smartphone, Zap,
  Coffee, Ticket, Crown, Star, AlertTriangle, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Progress } from '@/components/ui/progress';

export default function VenueCommerce() {
  const venueCapabilities = [
    {
      capability: 'Mobile Ticketing',
      status: 'missing',
      current_state: 'Not integrated',
      desired_state: 'Full Ticketmaster integration with digital tickets, seat upgrades, and check-in',
      revenue_impact: '$180K annual',
      implementation: {
        effort: 'Large (8-10 weeks)',
        dependencies: ['Ticketmaster API access', 'Venue barcode scanners', 'Apple/Google Wallet'],
        timeline: 'Q2 2025'
      },
      features: [
        'Purchase tickets in-app',
        'Digital tickets in Apple/Google Wallet',
        'Real-time seat availability',
        'Seat upgrade recommendations',
        'Barcode scanning at gates',
        'Transfer tickets to friends'
      ]
    },
    {
      capability: 'F&B Mobile Ordering',
      status: 'missing',
      current_state: 'No ordering system',
      desired_state: 'Order food/drinks from seat, skip lines, earn bonus XP',
      revenue_impact: '$120K annual',
      implementation: {
        effort: 'Large (10-12 weeks)',
        dependencies: ['Venue POS integration', 'Kitchen display systems', 'Payment processing'],
        timeline: 'Q2 2025'
      },
      features: [
        'Full menu in-app during events',
        'Order-to-delivery under 15 min',
        'Payment via card or CurlPoints',
        'Bonus XP for mobile orders',
        'Order tracking and notifications',
        'Dietary restrictions filtering'
      ]
    },
    {
      capability: 'VIP Recognition',
      status: 'partial',
      current_state: 'Tier badges only',
      desired_state: 'Auto-detect VIP fans, trigger concierge services',
      revenue_impact: '$90K annual',
      implementation: {
        effort: 'Medium (5-6 weeks)',
        dependencies: ['Bluetooth beacons', 'Staff tablets', 'CRM integration'],
        timeline: 'Q3 2025'
      },
      features: [
        'VIP auto-recognition on entry',
        'Staff alerts on tablets',
        'Personalized welcome messages',
        'VIP lounge access tracking',
        'Upgrade offers at check-in',
        'Priority customer service'
      ]
    },
    {
      capability: 'Contactless Payments',
      status: 'missing',
      current_state: 'Cash/card only',
      desired_state: 'Apple Pay, Google Pay, tap-to-pay with CurlPoints',
      revenue_impact: '$200K annual',
      implementation: {
        effort: 'Large (8-10 weeks)',
        dependencies: ['Payment terminal upgrades', 'POS system integration', 'NFC readers'],
        timeline: 'Q2 2025'
      },
      features: [
        'Tap phone to pay anywhere',
        'CurlPoints as payment option',
        'Instant digital receipts',
        'Loyalty points on all purchases',
        'Split payment (points + card)',
        'Purchase history tracking'
      ]
    },
    {
      capability: 'Wallet Pass Integration',
      status: 'partial',
      current_state: 'Uplifter connected but incomplete',
      desired_state: 'Full Apple/Google Wallet for tickets, passes, loyalty cards',
      revenue_impact: '$50K annual',
      implementation: {
        effort: 'Medium (4-5 weeks)',
        dependencies: ['Complete Uplifter integration', 'Pass templates design'],
        timeline: 'Q1 2025'
      },
      features: [
        'Event tickets in Wallet',
        'Digital loyalty card',
        'Real-time balance updates',
        'Location-based notifications',
        'Pass sharing capabilities',
        'Offline access'
      ]
    },
    {
      capability: 'Seat Upgrade System',
      status: 'missing',
      current_state: 'Manual only',
      desired_state: 'Intelligent upgrade offers based on availability and fan value',
      revenue_impact: '$60K annual',
      implementation: {
        effort: 'Medium (6-7 weeks)',
        dependencies: ['Ticketmaster API', 'Dynamic pricing engine', 'Payment processing'],
        timeline: 'Q3 2025'
      },
      features: [
        'Real-time seat availability',
        'Personalized upgrade offers',
        'One-tap upgrade purchase',
        'Price comparison display',
        'Upgrade deadline timers',
        'Loyalty discount application'
      ]
    }
  ];

  const totalRevenue = venueCapabilities.reduce((sum, cap) => 
    sum + parseInt(cap.revenue_impact.replace(/\D/g, '')), 0
  );

  const implementedCount = venueCapabilities.filter(cap => cap.status === 'implemented').length;
  const partialCount = venueCapabilities.filter(cap => cap.status === 'partial').length;
  const missingCount = venueCapabilities.filter(cap => cap.status === 'missing').length;

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
            In-Venue Commerce Strategy
          </h1>
          <p className="text-brand-text-secondary">
            ${totalRevenue}K revenue opportunity through mobile payments, ticketing & F&B
          </p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-950/30 to-orange-950/30 border-red-500/30">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <div className="text-3xl font-bold text-red-400 mb-1">{missingCount}</div>
            <p className="text-xs text-brand-text-secondary">Not Implemented</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-950/30 to-yellow-950/30 border-amber-500/30">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-3xl font-bold text-amber-400 mb-1">{partialCount}</div>
            <p className="text-xs text-brand-text-secondary">Partially Complete</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/30">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-3xl font-bold text-green-400 mb-1">{implementedCount}</div>
            <p className="text-xs text-brand-text-secondary">Fully Implemented</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-3xl font-bold text-blue-400 mb-1">${totalRevenue}K</div>
            <p className="text-xs text-brand-text-secondary">Total Opportunity</p>
          </CardContent>
        </Card>
      </div>

      {/* Capabilities Breakdown */}
      <div className="space-y-6">
        {venueCapabilities.map((capability, idx) => {
          const statusConfig = {
            implemented: { color: 'green', icon: CheckCircle, label: 'Implemented' },
            partial: { color: 'amber', icon: Zap, label: 'Partial' },
            missing: { color: 'red', icon: AlertTriangle, label: 'Missing' }
          };
          
          const config = statusConfig[capability.status];
          const StatusIcon = config.icon;

          return (
            <Card key={idx} className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 bg-${config.color}-500/20 rounded-lg flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 text-${config.color}-400`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{capability.capability}</CardTitle>
                        <Badge className={`mt-1 bg-${config.color}-500/20 text-${config.color}-400 border-${config.color}-500/30`}>
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-400 mb-1">
                      {capability.revenue_impact}
                    </Badge>
                    <p className="text-xs text-brand-text-secondary">{capability.implementation.timeline}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
                    <p className="text-xs text-red-400 font-semibold mb-1">Current State</p>
                    <p className="text-sm text-brand-text-secondary">{capability.current_state}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                    <p className="text-xs text-green-400 font-semibold mb-1">Target State</p>
                    <p className="text-sm text-brand-text-secondary">{capability.desired_state}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-brand-text-primary mb-2 text-sm">Key Features</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {capability.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                        <Star className="w-3 h-3 text-brand-red flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-text-secondary">Implementation Effort</span>
                    <Badge variant="outline">{capability.implementation.effort}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {capability.implementation.dependencies.map((dep, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Priority Matrix */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-8 h-8 text-brand-red" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                Venue Experience Score: 65/100
              </h3>
              <p className="text-brand-text-secondary mb-4">
                The Button has <strong className="text-green-400">strong foundations</strong> (patch scanning, geofencing, Smart Broom) 
                but is missing critical commerce capabilities. Implementing the top 3 priorities 
                (Ticketmaster, F&B, Contactless Payments) unlocks <strong className="text-green-400">$500K annual revenue</strong> 
                and elevates the fan experience to industry-leading status.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                  <p className="text-green-400 font-semibold mb-2">What's Working</p>
                  <ul className="space-y-1 text-brand-text-secondary text-xs">
                    <li>✓ Patch scanning + QR</li>
                    <li>✓ Geofencing</li>
                    <li>✓ Smart Broom IoT</li>
                    <li>✓ Event check-in XP</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-500/10 rounded border border-amber-500/30">
                  <p className="text-amber-400 font-semibold mb-2">Critical Gaps</p>
                  <ul className="space-y-1 text-brand-text-secondary text-xs">
                    <li>✗ No mobile ticketing</li>
                    <li>✗ No F&B ordering</li>
                    <li>✗ No contactless pay</li>
                    <li>✗ No seat upgrades</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <p className="text-blue-400 font-semibold mb-2">Top Priorities</p>
                  <ul className="space-y-1 text-brand-text-secondary text-xs">
                    <li>1. Ticketmaster ($180K)</li>
                    <li>2. F&B Ordering ($120K)</li>
                    <li>3. Payments ($200K)</li>
                    <li>4. VIP System ($90K)</li>
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