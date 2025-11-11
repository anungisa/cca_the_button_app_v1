import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Globe, 
  TrendingUp, 
  Trophy,
  RefreshCw,
  Activity
} from 'lucide-react';
import CurlingZonePanel from '../components/integrations/CurlingZonePanel';
import CTRSPanel from '../components/integrations/CTRSPanel';
import WCFPanel from '../components/integrations/WCFPanel';

export default function CurlingDataHub() {
  const [lastSync, setLastSync] = useState(new Date());

  const integrationStatus = {
    curlingzone: { status: 'active', lastSync: '2 hours ago', records: 0 },
    ctrs: { status: 'active', lastSync: '1 hour ago', records: 0 },
    wcf: { status: 'pending', lastSync: 'Not synced', records: 0 }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-brand-red rounded-lg flex items-center justify-center">
              <Database className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-brand-text-primary">Curling Data Hub</h1>
          <p className="text-xl text-brand-text-secondary mt-2">
            Integrated data from CurlingZone, CTRS, and World Curling Federation
          </p>
        </div>

        {/* Integration Status */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-red" />
              Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-brand-text-primary capitalize">CurlingZone</h4>
                  <p className="text-sm text-brand-text-secondary">XML Feed Sync</p>
                </div>
                <Badge className="bg-green-600">
                  <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                  Ready
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-brand-text-primary capitalize">CTRS</h4>
                  <p className="text-sm text-brand-text-secondary">Rankings Sync</p>
                </div>
                <Badge className="bg-green-600">
                  <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                  Ready
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-brand-text-primary capitalize">WCF</h4>
                  <p className="text-sm text-brand-text-secondary">Coming Soon</p>
                </div>
                <Badge variant="outline" className="bg-amber-600/20 text-amber-400 border-amber-600">
                  Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources Tabs */}
        <Tabs defaultValue="curlingzone" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
            <TabsTrigger value="curlingzone" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              CurlingZone
            </TabsTrigger>
            <TabsTrigger value="ctrs" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              CTRS
            </TabsTrigger>
            <TabsTrigger value="wcf" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              WCF
            </TabsTrigger>
          </TabsList>

          <TabsContent value="curlingzone" className="mt-6">
            <CurlingZonePanel />
          </TabsContent>

          <TabsContent value="ctrs" className="mt-6">
            <CTRSPanel />
          </TabsContent>

          <TabsContent value="wcf" className="mt-6">
            <WCFPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}