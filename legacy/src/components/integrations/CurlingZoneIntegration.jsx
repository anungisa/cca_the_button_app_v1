import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Globe, RefreshCw, Loader2, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { base44 } from '@/api/base44Client';

export default function CurlingZoneIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [syncParams, setSyncParams] = useState({
    region: '5',
    eventTypes: ['81', '82'],
    year: '2025'
  });
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const response = await base44.functions.invoke('syncCurlingZoneData', syncParams);

      if(response && response.data && response.data.success) {
        setSyncResult(response.data.summary);
        toast({
          title: "Sync Complete",
          description: `${response.data.summary.events.created} events created, ${response.data.summary.events.updated} updated.`,
        });
      } else {
        throw new Error(response.data?.error || 'Sync failed');
      }
    } catch (error) {
      console.error("Sync failed:", error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-green-500" />
            CurlingZone XML Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            CurlingZone provides event schedules and results via XML feeds. This integration imports competition data for specific regions and event types.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Data Synced</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Event schedules</li>
                <li>• Competition results</li>
                <li>• Venue information</li>
                <li>• Regional data</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Sync Method</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• XML feed parsing</li>
                <li>• Regional filtering</li>
                <li>• No API key required</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> CurlingZone uses XML feeds - no authentication required, but sync is based on publicly available data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Sync Configuration */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Sync Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Region</Label>
            <Input
              value={syncParams.region}
              onChange={(e) => setSyncParams({ ...syncParams, region: e.target.value })}
              placeholder="5 (Ontario)"
            />
            <p className="text-xs text-brand-text-secondary">Region ID (e.g., 5 for Ontario)</p>
          </div>

          <div className="space-y-2">
            <Label>Event Types</Label>
            <Input
              value={syncParams.eventTypes.join(', ')}
              onChange={(e) => setSyncParams({ ...syncParams, eventTypes: e.target.value.split(',').map(t => t.trim()) })}
              placeholder="81, 82"
            />
            <p className="text-xs text-brand-text-secondary">Comma-separated event type IDs</p>
          </div>

          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              value={syncParams.year}
              onChange={(e) => setSyncParams({ ...syncParams, year: e.target.value })}
              placeholder="2025"
            />
            <p className="text-xs text-brand-text-secondary">Competition year</p>
          </div>

          <Button onClick={handleSync} disabled={isSyncing} className="w-full">
            {isSyncing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
            ) : (
              <><RefreshCw className="w-4 h-4 mr-2" /> Sync Events</>
            )}
          </Button>

          {syncResult && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sync Complete:</strong><br />
                Events: {syncResult.events.created} created, {syncResult.events.updated} updated<br />
                Total: {syncResult.total} events processed
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => window.open('https://www.curlingzone.com', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit CurlingZone
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}