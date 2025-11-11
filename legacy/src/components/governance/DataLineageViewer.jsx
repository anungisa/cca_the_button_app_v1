
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  GitBranch, Database, ArrowRight, Layers, ExternalLink,
  Zap, Shield, Filter, Eye, Target, AlertTriangle
} from 'lucide-react';

export default function DataLineageViewer() {
  const [selectedEntity, setSelectedEntity] = useState('Club');

  const lineageData = {
    Club: {
      sources: [
        { system: 'CurlingReg', fields: ['name', 'location', 'contact_info'], updateFrequency: 'Real-time' },
        { system: 'The Button Survey', fields: ['facilities', 'governance', 'financials'], updateFrequency: 'Annual' },
        { system: 'Manual Entry', fields: ['admin_notes', 'verification_status'], updateFrequency: 'As needed' }
      ],
      transformations: [
        'Location geocoding via Google Maps API',
        'Data normalization and validation',
        'Duplicate detection and merging'
      ],
      destinations: [
        { system: 'DOMO', purpose: 'Analytics & Reporting', fields: 'All' },
        { system: 'CRM', purpose: 'Relationship Management', fields: 'Contact Info, Engagement' },
        { system: 'The Button UI', purpose: 'Public Directory', fields: 'All except admin_fields' }
      ],
      quality: 92
    },
    User: {
      sources: [
        { system: 'CurlingReg', fields: ['curling_id', 'full_name', 'email', 'ma_region'], updateFrequency: 'Real-time' },
        { system: 'Supabase Auth', fields: ['email', 'authentication'], updateFrequency: 'Real-time' },
        { system: 'The Button App', fields: ['preferences', 'xp_data', 'club_affiliation'], updateFrequency: 'Real-time' }
      ],
      transformations: [
        'Email normalization and validation',
        'Role and permission assignment',
        'XP calculation and tier assignment',
        'PII encryption for sensitive fields'
      ],
      destinations: [
        { system: 'DOMO', purpose: 'User Analytics', fields: 'Aggregated/Anonymous' },
        { system: 'CRM', purpose: 'Marketing & Engagement', fields: 'Contact & Behavioral' },
        { system: 'Teamworks', purpose: 'HP Athlete Management', fields: 'HP Athletes Only' }
      ],
      quality: 88
    },
    Donation: {
      sources: [
        { system: 'GiveCloud', fields: ['amount', 'donor_name', 'donor_email', 'campaign'], updateFrequency: 'Real-time' },
        { system: 'DonorPerfect', fields: ['donor_history', 'tax_receipts'], updateFrequency: 'Daily' },
        { system: 'Stripe', fields: ['payment_status', 'payment_method'], updateFrequency: 'Real-time' }
      ],
      transformations: [
        'Donor deduplication across systems',
        'Anonymous donation handling',
        'Campaign categorization',
        'Tax receipt generation'
      ],
      destinations: [
        { system: 'DOMO', purpose: 'Fundraising Analytics', fields: 'All' },
        { system: 'CRM', purpose: 'Donor Relationship Mgmt', fields: 'All' },
        { system: 'QuickBooks', purpose: 'Financial Accounting', fields: 'Amounts & Categories' }
      ],
      quality: 85
    }
  };

  const currentLineage = lineageData[selectedEntity];

  return (
    <div className="space-y-6">
      <Alert className="border-purple-500/50 bg-purple-500/10">
        <GitBranch className="h-4 w-4 text-purple-400" />
        <AlertDescription className="text-brand-text-secondary">
          <strong>Data Lineage:</strong> Track the flow of data from source systems through transformations 
          to final destinations. Essential for compliance, troubleshooting, and impact analysis.
        </AlertDescription>
      </Alert>

      {/* Entity Selector */}
      <div className="flex gap-2">
        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="px-4 py-2 bg-brand-charcoal border border-brand-border rounded-md"
        >
          <option value="Club">Club</option>
          <option value="User">User</option>
          <option value="Donation">Donation</option>
          {/* Add other options as needed, ensuring they exist in lineageData or are handled */}
          {/* <option value="Event">Event</option> */}
          {/* <option value="ShotTrackerLog">ShotTrackerLog</option> */}
        </select>
        <Badge className={`px-3 py-2 ${
          currentLineage.quality >= 90 ? 'bg-green-500/20 text-green-400' :
          currentLineage.quality >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {currentLineage.quality}% Quality Score
        </Badge>
      </div>

      {/* Lineage Visualization */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Source Systems */}
        <Card className="bg-gradient-to-br from-blue-950/20 to-cyan-950/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Source Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentLineage.sources.map((source, idx) => (
              <div key={idx} className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-brand-text-primary text-sm">{source.system}</span>
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                    {source.updateFrequency}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {source.fields.slice(0, 3).map((field, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                  {source.fields.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{source.fields.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Transformations */}
        <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Transformations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentLineage.transformations.map((transform, idx) => (
              <div key={idx} className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
                <p className="text-sm text-brand-text-primary flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{transform}</span>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Destination Systems */}
        <Card className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Destinations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentLineage.destinations.map((dest, idx) => (
              <div key={idx} className="p-3 bg-brand-charcoal/50 rounded border border-brand-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-brand-text-primary text-sm">{dest.system}</span>
                  <ExternalLink className="w-3 h-3 text-green-400" />
                </div>
                <p className="text-xs text-brand-text-secondary mb-2">{dest.purpose}</p>
                <Badge variant="outline" className="text-xs">
                  {dest.fields}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Impact Analysis */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-brand-text-secondary">
              <strong>Downstream Impact:</strong> Changes to {selectedEntity} data affect {currentLineage.destinations.length} downstream systems. 
              Quality issues here cascade to {currentLineage.destinations.map(d => d.system).join(', ')}.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
