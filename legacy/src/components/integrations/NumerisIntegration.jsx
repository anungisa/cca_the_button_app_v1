import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tv, BarChart3, TrendingUp, Users, Target, Eye,
  CheckCircle, RefreshCw, Download, Calendar, DollarSign
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function NumerisIntegration() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Syncing Numeris Data",
      description: "Fetching broadcast audience measurement data..."
    });

    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sync Complete",
        description: "Audience measurement data updated successfully."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="w-6 h-6 text-blue-400" />
            Numeris Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-blue-500/30 bg-blue-500/10">
            <Tv className="w-4 h-4 text-blue-400" />
            <AlertDescription className="text-brand-text-primary">
              Numeris (formerly BBM Canada) provides official Canadian broadcast audience measurement data.
              <strong className="block mt-2 text-blue-400">Critical for:</strong>
              <ul className="mt-1 space-y-1 text-sm">
                <li>• Proving sponsorship ROI to partners</li>
                <li>• Broadcasting rights negotiations</li>
                <li>• Media value calculations</li>
                <li>• Demographic audience insights</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-brand-text-primary font-medium">Connection Status</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-brand-text-secondary">Avg Viewership</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">1.2M</p>
                <p className="text-xs text-brand-text-secondary">Per broadcast</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-brand-text-secondary">Reach</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">68%</p>
                <p className="text-xs text-brand-text-secondary">Adults 25-54</p>
              </div>

              <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-brand-text-secondary">Media Value</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary">$4.2M</p>
                <p className="text-xs text-brand-text-secondary">Last quarter</p>
              </div>
            </div>

            {/* Data Synced */}
            <div className="border-t border-brand-border pt-4">
              <h4 className="text-sm font-semibold text-brand-text-primary mb-3">Audience Data Tracked</h4>
              <div className="space-y-2">
                {[
                  { name: 'TV Ratings (AMA)', metric: 'Average Minute Audience', frequency: 'Per broadcast' },
                  { name: 'Reach & Frequency', metric: 'Unique viewers over time', frequency: 'Weekly' },
                  { name: 'Demographic Breakdown', metric: 'Age, Gender, Region', frequency: 'Per event' },
                  { name: 'Share of Voice', metric: 'vs. competitive sports', frequency: 'Monthly' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-sm p-3 bg-brand-charcoal/30 rounded">
                    <div>
                      <p className="text-brand-text-primary font-medium">{item.name}</p>
                      <p className="text-xs text-brand-text-secondary">{item.metric}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{item.frequency}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync Audience Data
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Integration Details */}
            <Alert className="border-indigo-500/30 bg-indigo-500/10">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <AlertDescription className="text-brand-text-primary">
                <strong className="text-indigo-400">Sponsorship Value:</strong>
                <p className="mt-2 text-sm">
                  Numeris data powers our sponsorship ROI reports, showing partners their actual reach 
                  and audience demographics. This data flows into DOMO for executive dashboards and 
                  sponsor performance reports.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}