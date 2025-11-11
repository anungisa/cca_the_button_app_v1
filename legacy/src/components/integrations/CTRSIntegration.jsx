import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Trophy, RefreshCw, Loader2, CheckCircle, ExternalLink, Info } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { base44 } from '@/api/base44Client';

export default function CTRSIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const response = await base44.functions.invoke('syncCTRSData');

      if(response && response.data && response.data.success) {
        setSyncResult(response.data.summary);
        toast({
          title: "CTRS Sync Complete",
          description: `${response.data.summary.teams.created} Canadian teams synced.`,
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
            <Trophy className="w-6 h-6 text-amber-500" />
            CTRS Rankings Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            The Canadian Team Ranking System (CTRS) provides official rankings for Canadian curling teams across all competitive categories.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Data Synced</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Team rankings</li>
                <li>• CTRS points</li>
                <li>• Team rosters</li>
                <li>• Recent results</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Categories</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Men's</li>
                <li>• Women's</li>
                <li>• Mixed Doubles</li>
                <li>• Wheelchair</li>
              </ul>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Canadian Teams Only:</strong> CTRS data is limited to teams competing in Canadian competitions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Manual Sync */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Manual Sync</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-brand-text-secondary">
              Import latest CTRS rankings from Curling Canada
            </p>
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Sync Rankings</>
              )}
            </Button>
          </div>

          {syncResult && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sync Complete:</strong><br />
                Teams: {syncResult.teams.created} synced
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
            onClick={() => window.open('https://www.curling.ca/rankings', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Official CTRS Rankings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}