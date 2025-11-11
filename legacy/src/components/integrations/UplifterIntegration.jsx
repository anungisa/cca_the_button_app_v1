import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Zap, RefreshCw, Loader2, Building, AlertTriangle, ExternalLink, Calendar, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function UplifterIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: "Uplifter integration is being developed.",
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-500" />
            Uplifter Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Uplifter is a club management platform handling facility bookings, member management, and operational workflows.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-cyan-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Data Available</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Club operations data</li>
                <li>• Facility bookings</li>
                <li>• Member management</li>
                <li>• Ice scheduling</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Sync Method</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• API integration (planned)</li>
                <li>• Club data sync</li>
                <li>• Booking webhooks</li>
              </ul>
            </div>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> Uplifter API integration is currently being built. Club management sync capabilities coming soon.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
              {isSyncing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Sync Club Data</>
              )}
            </Button>
            <Button variant="outline" onClick={() => window.open('https://uplifter.com', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Uplifter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Planned Features */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Planned Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Club Operations Sync</div>
                <div className="text-sm text-brand-text-secondary">
                  Sync club facility data, hours, and operational status
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Booking Integration</div>
                <div className="text-sm text-brand-text-secondary">
                  Import facility bookings and ice time schedules
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Member Analytics</div>
                <div className="text-sm text-brand-text-secondary">
                  Track club membership trends and utilization metrics
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}