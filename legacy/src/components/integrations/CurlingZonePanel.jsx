import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { RefreshCw, Loader2, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import { syncCurlingZoneData } from '@/api/functions';

export default function CurlingZonePanel() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [region, setRegion] = useState('5');
  const [year, setYear] = useState('2025');
  const [eventTypes, setEventTypes] = useState('81,82');
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const response = await syncCurlingZoneData({
        region,
        eventTypes: eventTypes.split(',').map(t => t.trim()),
        year
      });

      if (response && response.data) {
        setSyncResult(response.data);
        
        if (response.data.success) {
          toast({
            title: "Sync Complete",
            description: `✅ Created: ${response.data.summary.events.created} | 🔄 Updated: ${response.data.summary.events.updated}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Sync Failed",
            description: response.data.error || "Unknown error occurred",
          });
        }
      }
    } catch (error) {
      console.error("CurlingZone sync failed:", error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          CurlingZone XML Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription className="text-sm">
            Syncs event data from CurlingZone's XML feeds. Configure region, event types (comma-separated), and year.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-brand-text-primary mb-2 block">
              Region
            </label>
            <Input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="5"
              className="bg-brand-charcoal border-brand-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-text-primary mb-2 block">
              Event Types
            </label>
            <Input
              type="text"
              value={eventTypes}
              onChange={(e) => setEventTypes(e.target.value)}
              placeholder="81,82"
              className="bg-brand-charcoal border-brand-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-text-primary mb-2 block">
              Year
            </label>
            <Input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2025"
              className="bg-brand-charcoal border-brand-border"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
          <div className="flex-1">
            <p className="text-sm text-brand-text-secondary">
              URL: {`curlingzone.com/.../region${region}_eventtype[${eventTypes}]_year${year}.xml`}
            </p>
          </div>
          <Button onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        </div>

        {syncResult && (
          <Alert className={syncResult.success ? 'bg-green-950/30 border-green-800' : 'bg-red-950/30 border-red-800'}>
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {syncResult.success ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-semibold">
                    {syncResult.success ? 'Sync Successful' : 'Sync Failed'}
                  </span>
                </div>
                
                {syncResult.summary && (
                  <div className="text-sm space-y-1">
                    <p>✅ Created: {syncResult.summary.events.created}</p>
                    <p>🔄 Updated: {syncResult.summary.events.updated}</p>
                    <p>📊 Total: {syncResult.summary.total}</p>
                  </div>
                )}

                {syncResult.syncedEvents && syncResult.syncedEvents.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-brand-text-secondary hover:text-brand-text-primary">
                      View Synced Events ({syncResult.syncedEvents.length})
                    </summary>
                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                      {syncResult.syncedEvents.map((event, i) => (
                        <div key={i} className="text-xs p-2 bg-brand-charcoal rounded">
                          <Badge variant="outline" className="text-xs mr-2">
                            {event.action}
                          </Badge>
                          {event.name}
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {syncResult.summary?.errors && syncResult.summary.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-yellow-400">
                      ⚠️ Errors ({syncResult.summary.errors.length})
                    </summary>
                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                      {syncResult.summary.errors.map((err, i) => (
                        <div key={i} className="text-xs text-red-400 font-mono">
                          {err.event || err.eventType}: {err.error}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}