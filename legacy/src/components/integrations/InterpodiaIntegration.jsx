import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CreditCard, RefreshCw, Loader2, DollarSign, AlertTriangle, ExternalLink, TrendingUp } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function InterpodiaIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: "Interpodia integration is being developed.",
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-500" />
            Interpodia Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Interpodia handles payment processing and financial transactions for curling registrations and memberships.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Data Available</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Payment transactions</li>
                <li>• Registration fees</li>
                <li>• Membership payments</li>
                <li>• Refund records</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h4 className="font-medium text-brand-text-primary mb-2">Sync Method</h4>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• API integration (planned)</li>
                <li>• Transaction webhooks</li>
                <li>• Payment status sync</li>
              </ul>
            </div>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> Interpodia API integration is currently being built. Payment sync capabilities coming soon.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
              {isSyncing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Sync Transactions</>
              )}
            </Button>
            <Button variant="outline" onClick={() => window.open('https://interpodia.com', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Interpodia
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
              <DollarSign className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Transaction Sync</div>
                <div className="text-sm text-brand-text-secondary">
                  Automatic sync of payment transactions to FinancialTransaction entity
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Revenue Analytics</div>
                <div className="text-sm text-brand-text-secondary">
                  Track registration revenue by region, event, and category
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <div className="font-medium text-brand-text-primary">Payment Reconciliation</div>
                <div className="text-sm text-brand-text-secondary">
                  Match payments to memberships and event registrations
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}