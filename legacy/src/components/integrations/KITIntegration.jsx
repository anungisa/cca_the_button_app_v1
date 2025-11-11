import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users, DollarSign, ShoppingCart, FileText, CheckCircle,
  RefreshCw, Download, BarChart3, AlertTriangle, Clock
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function KITIntegration() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Syncing KIT Data",
      description: "Fetching volunteer, expense, and purchase order data..."
    });

    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sync Complete",
        description: "KIT data synchronized successfully."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border-emerald-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            KIT Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-emerald-500/30 bg-emerald-500/10">
            <FileText className="w-4 h-4 text-emerald-400" />
            <AlertDescription className="text-brand-text-primary">
              KIT manages event volunteers, expense claims, and purchase orders for major championships.
              Provides financial and operational data that complements TrustEvent and Accredit systems.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-brand-text-primary font-medium">Connection Status</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
            </div>

            {/* Key Modules */}
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-brand-charcoal/50 rounded-lg border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-semibold text-brand-text-primary">Volunteers</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">847</p>
                <p className="text-xs text-brand-text-secondary">Active this season</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-brand-text-primary">Expenses</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">$127K</p>
                <p className="text-xs text-brand-text-secondary">YTD processed</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-semibold text-brand-text-primary">Purchase Orders</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">234</p>
                <p className="text-xs text-brand-text-secondary">Active POs</p>
              </div>
            </div>

            {/* Data Synced */}
            <div className="border-t border-brand-border pt-4">
              <h4 className="text-sm font-semibold text-brand-text-primary mb-3">Data Synced to Platform</h4>
              <div className="space-y-2">
                {[
                  { name: 'Volunteer Records', entity: 'Volunteer', sync: 'Hourly', status: 'synced' },
                  { name: 'Expense Claims', entity: 'FinancialTransaction', sync: 'Real-time', status: 'synced' },
                  { name: 'Purchase Orders', entity: 'VendorContract', sync: 'Daily', status: 'synced' },
                  { name: 'Event Budgets', entity: 'Budget', sync: 'Daily', status: 'synced' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-brand-charcoal/30 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-brand-text-primary">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{item.entity}</Badge>
                      <span className="text-xs text-brand-text-secondary">{item.sync}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync KIT Data
              </Button>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </div>

            {/* Use Cases */}
            <Alert className="border-teal-500/30 bg-teal-500/10">
              <Users className="w-4 h-4 text-teal-400" />
              <AlertDescription className="text-brand-text-primary">
                <strong className="text-teal-400">Integration Benefits:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Unified volunteer management across TrustEvent, Accredit, and KIT</li>
                  <li>• Automated expense claim processing and approval workflows</li>
                  <li>• Purchase order tracking integrated with budget monitoring</li>
                  <li>• Event financial reporting consolidated into QuickBooks/Budgyt</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}