import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Database, BarChart3, TrendingUp, AlertTriangle,
  CheckCircle, Zap, Eye, RefreshCw, Target
} from 'lucide-react';

export default function DataProfilingPanel() {
  const [isProfileRunning, setIsProfileRunning] = useState(false);

  const runProfile = async (entity) => {
    setIsProfileRunning(true);
    setTimeout(() => {
      setIsProfileRunning(false);
    }, 2000);
  };

  const entityProfiles = [
    {
      entity: 'Club',
      totalRecords: 1247,
      completeness: 94,
      uniqueness: 99,
      validity: 91,
      nullFields: ['logo_url (23%)', 'website (15%)'],
      duplicates: 2,
      outliers: 5,
      lastProfiled: '2 hours ago'
    },
    {
      entity: 'User',
      totalRecords: 45823,
      completeness: 87,
      uniqueness: 100,
      validity: 89,
      nullFields: ['phone (45%)', 'home_club_id (12%)'],
      duplicates: 0,
      outliers: 12,
      lastProfiled: '1 hour ago'
    },
    {
      entity: 'Event',
      totalRecords: 892,
      completeness: 96,
      uniqueness: 98,
      validity: 94,
      nullFields: ['livestream_url (68%)', 'venue.city (3%)'],
      duplicates: 3,
      outliers: 2,
      lastProfiled: '3 hours ago'
    },
    {
      entity: 'Donation',
      totalRecords: 3456,
      completeness: 92,
      uniqueness: 100,
      validity: 88,
      nullFields: ['campaign (34%)', 'ma_region (18%)'],
      duplicates: 0,
      outliers: 23,
      lastProfiled: '30 minutes ago'
    }
  ];

  return (
    <div className="space-y-6">
      <Alert className="border-blue-500/50 bg-blue-500/10">
        <BarChart3 className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-brand-text-secondary">
          <strong>Data Profiling:</strong> Automated statistical analysis of your data to identify quality issues, 
          patterns, and anomalies. Profiling runs daily and on-demand.
        </AlertDescription>
      </Alert>

      {/* Profile Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {entityProfiles.map((profile) => (
          <Card key={profile.entity} className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{profile.entity}</CardTitle>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => runProfile(profile.entity)}
                  disabled={isProfileRunning}
                >
                  <RefreshCw className={`w-3 h-3 ${isProfileRunning ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-xs text-brand-text-secondary">{profile.totalRecords.toLocaleString()} records</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Completeness */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-brand-text-secondary">Completeness</span>
                  <span className={`font-bold ${profile.completeness >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {profile.completeness}%
                  </span>
                </div>
                <Progress value={profile.completeness} className="h-1" />
              </div>

              {/* Uniqueness */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-brand-text-secondary">Uniqueness</span>
                  <span className={`font-bold ${profile.uniqueness >= 95 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {profile.uniqueness}%
                  </span>
                </div>
                <Progress value={profile.uniqueness} className="h-1" />
              </div>

              {/* Validity */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-brand-text-secondary">Validity</span>
                  <span className={`font-bold ${profile.validity >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {profile.validity}%
                  </span>
                </div>
                <Progress value={profile.validity} className="h-1" />
              </div>

              {/* Issues Summary */}
              <div className="pt-3 border-t border-brand-border space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-text-secondary">Null Fields:</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                    {profile.nullFields.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-text-secondary">Duplicates:</span>
                  <Badge className={`text-xs ${profile.duplicates > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                    {profile.duplicates}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-text-secondary">Outliers:</span>
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                    {profile.outliers}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-brand-text-secondary pt-2 border-t border-brand-border">
                Last profiled: {profile.lastProfiled}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Profiling Results */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-lg">Field-Level Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entityProfiles.map((profile) => (
              <div key={profile.entity} className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-brand-text-primary">{profile.entity}</h4>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>

                {profile.nullFields.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      Fields with High Null Rates
                    </p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {profile.nullFields.map((field, idx) => (
                        <div key={idx} className="text-xs text-brand-text-secondary bg-brand-charcoal/50 px-3 py-2 rounded">
                          {field}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}