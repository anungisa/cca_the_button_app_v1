import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { BarChart3, RefreshCw, Loader2, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { base44 } from '@/api/base44Client';

export default function CurlingIOIntegration() {
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [syncResult, setSyncResult] = useState(null);
  const { toast } = useToast();

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const response = await base44.functions.invoke('testCurlingIOConnection');
      
      if (response && response.data) {
        setTestResult(response.data);
        
        const successfulTests = response.data.tests?.filter(t => t.success) || [];
        
        if (successfulTests.length > 0) {
          toast({
            title: "Connection Test Complete",
            description: `Found ${successfulTests.length} working endpoint(s).`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "All Endpoints Failed",
            description: "Could not connect to Curling.io. Check your API key.",
          });
        }
      }
    } catch (error) {
      console.error("Test failed:", error);
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: error.message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const response = await base44.functions.invoke('syncCurlingData');

      if(response && response.data && response.data.success) {
        setSyncResult(response.data.summary);
        toast({
          title: "Sync Complete",
          description: `Events: ${response.data.summary.events.created} created, ${response.data.summary.events.updated} updated.`,
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
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Curling.io Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Curling.io provides live scoring data and competition information from curling events worldwide.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Data Synced</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Live competition data</li>
                <li>• Event schedules</li>
                <li>• Draw sheets</li>
                <li>• Team information</li>
              </ul>
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Sync Method</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• API polling every 5 minutes</li>
                <li>• Heroku Scheduler job</li>
                <li>• Manual sync available</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>API Key Required:</strong> Set CURLING_IO_API_KEY in Dashboard → Settings → Environment Variables
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Test Connection */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Test Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-brand-text-secondary">
              Verify API key and test endpoint connectivity
            </p>
            <Button onClick={handleTest} disabled={isTesting}>
              {isTesting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing...</>
              ) : (
                <><CheckCircle className="w-4 h-4 mr-2" /> Test Connection</>
              )}
            </Button>
          </div>

          {testResult && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={testResult.apiKey === '✓ Set' ? 'bg-green-500' : 'bg-red-500'}>
                  {testResult.apiKey}
                </Badge>
                <span className="text-sm text-brand-text-secondary">API Key Status</span>
              </div>

              {testResult.tests && testResult.tests.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium text-brand-text-primary">Endpoint Tests:</h4>
                  {testResult.tests.map((test, idx) => (
                    <div key={idx} className="p-3 bg-brand-charcoal rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brand-text-primary">{test.name}</span>
                        {test.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs text-brand-text-secondary mt-1">
                        Status: {test.status} | {test.statusText}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
              Trigger an immediate sync of event and game data
            </p>
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Sync Now</>
              )}
            </Button>
          </div>

          {syncResult && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sync Complete:</strong><br />
                Events: {syncResult.events.created} created, {syncResult.events.updated} updated
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
            onClick={() => window.open('https://curling.io/docs/api', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Curling.io API Docs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}