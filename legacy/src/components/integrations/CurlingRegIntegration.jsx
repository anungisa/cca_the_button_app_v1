import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Users, RefreshCw, Loader2, CheckCircle, AlertTriangle, ExternalLink, Database } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function CurlingRegIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: "CurlingReg integration is being developed.",
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            CurlingReg Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            CurlingReg manages member registrations, credentials, and digital wallets for Canadian curlers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Data Available</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Member registrations</li>
                <li>• Digital credentials</li>
                <li>• Wallet IDs</li>
                <li>• Membership status</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Sync Method</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• API integration (planned)</li>
                <li>• Real-time credential sync</li>
                <li>• Webhook support</li>
              </ul>
            </div>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> CurlingReg API integration is currently being built. Full sync capabilities coming soon.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
              {isSyncing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Sync Members</>
              )}
            </Button>
            <Button variant="outline" onClick={() => window.open('https://curlingreg.com', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit CurlingReg
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
              <Database className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Member Sync</div>
                <div className="text-sm text-brand-text-secondary">
                  Automatic sync of member data to The Button User entity
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Credential Verification</div>
                <div className="text-sm text-brand-text-secondary">
                  Real-time verification of member credentials and status
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Wallet Integration</div>
                <div className="text-sm text-brand-text-secondary">
                  Sync digital wallet IDs for Apple/Google Wallet passes
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}