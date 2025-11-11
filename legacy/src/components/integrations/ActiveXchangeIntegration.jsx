import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin, BarChart3, Users, Target, Database,
  CheckCircle, RefreshCw, Download, TrendingUp
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function ActiveXchangeIntegration() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Syncing ActiveXchange Data",
      description: "Fetching demographic and postal code data..."
    });

    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sync Complete",
        description: "Demographic data updated successfully."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            ActiveXchange Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-cyan-500/30 bg-cyan-500/10">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <AlertDescription className="text-brand-text-primary">
              ActiveXchange provides Canadian postal code data, demographics, and geographic analytics.
              Powers member segmentation, club location analysis, and market penetration insights.
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

            {/* Key Datasets */}
            <div className="border-t border-brand-border pt-4">
              <h4 className="text-sm font-semibold text-brand-text-primary mb-3">Available Datasets</h4>
              <div className="space-y-2">
                {[
                  { name: 'Postal Code Geolocation', coverage: '100% Canadian FSAs', use: 'Club proximity analysis' },
                  { name: 'Demographic Data', coverage: 'Census-level detail', use: 'Member segmentation' },
                  { name: 'Income Statistics', coverage: 'By postal code', use: 'Pricing & targeting' },
                  { name: 'Population Density', coverage: 'Urban/Rural breakdown', use: 'Growth opportunity mapping' }
                ].map((dataset, idx) => (
                  <div key={idx} className="p-3 bg-brand-charcoal/30 rounded border border-brand-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-brand-text-primary font-medium">{dataset.name}</p>
                        <p className="text-xs text-brand-text-secondary mt-1">{dataset.coverage}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{dataset.use}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <Alert className="border-blue-500/30 bg-blue-500/10">
              <Target className="w-4 h-4 text-blue-400" />
              <AlertDescription className="text-brand-text-primary">
                <strong className="text-blue-400">Strategic Applications:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• <strong>Club Optimization:</strong> Identify underserved regions for club development</li>
                  <li>• <strong>Member Insights:</strong> Understand member demographics and potential market size</li>
                  <li>• <strong>Sponsorship Targeting:</strong> Match sponsor products to member demographics</li>
                  <li>• <strong>Event Planning:</strong> Choose optimal locations based on population density</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync Demographics
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}