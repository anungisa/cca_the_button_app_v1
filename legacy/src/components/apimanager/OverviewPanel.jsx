
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '../hooks/use-toast';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Zap,
  Clock,
  TrendingUp,
  Globe,
  Database,
  Users,
  Mail,
  Video,
  DollarSign,
  FileText,
  Shield,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Server,
  Trophy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { syncCurlingData } from '@/api/functions';
import { testCurlingIOConnection } from '@/api/functions';

// Remove the problematic DOMOIntegration import for now

// Move allIntegrations outside component
const allIntegrations = [
  {
    id: 'curling_reg',
    friendly_name: 'CurlingReg API',
    base_url: 'https://api.curlingreg.com',
    category: 'Registration & Membership',
    status: 'ok',
    is_enabled: true,
    last_sync: '2024-01-23T10:30:00Z',
    error_count_24h: 0,
    latency_avg_ms: 245,
    icon: Users,
    description: 'Member registration, club data, and membership management'
  },
  {
    id: 'curling_io',
    friendly_name: 'Curling.io API',
    base_url: 'https://api.curling.io',
    category: 'Live Scoring',
    status: 'ok',
    is_enabled: true,
    last_sync: '2024-01-23T10:25:00Z',
    error_count_24h: 0,
    latency_avg_ms: 180,
    icon: BarChart3,
    description: 'Live game scores, draw sheets, and competition data'
  },
  {
    id: 'curlingzone_xml',
    friendly_name: 'CurlingZone XML Feed',
    base_url: 'https://curlingzone.com/feed/xml',
    category: 'Live Scoring',
    status: 'ok',
    is_enabled: true,
    last_sync: '2024-01-23T10:15:00Z',
    error_count_24h: 0,
    latency_avg_ms: 310,
    icon: Globe,
    description: 'Import event and game data from CurlingZone XML feeds'
  },
  {
    id: 'trust_events',
    friendly_name: 'TrustEvents API',
    base_url: 'https://api.trustevents.com',
    category: 'Volunteer Management',
    status: 'ok',
    is_enabled: true,
    last_sync: '2024-01-23T09:45:00Z',
    error_count_24h: 1,
    latency_avg_ms: 320,
    icon: Shield,
    description: 'Volunteer registration, credentials, and event management'
  },
  {
    id: 'domo',
    friendly_name: 'DOMO Analytics',
    base_url: 'https://curlingcanada.domo.com',
    category: 'Analytics & BI',
    status: 'ok',
    is_enabled: true,
    last_sync: '2024-01-23T08:00:00Z',
    error_count_24h: 0,
    latency_avg_ms: 450,
    icon: TrendingUp,
    description: 'Business intelligence dashboards and data analytics'
  }
];

const SyncServicesPanel = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const response = await testCurlingIOConnection();
      
      if (response && response.data) {
        setTestResult(response.data);
        
        console.log('=== CURLING.IO API TEST RESULTS ===');
        console.log('API Key Status:', response.data.apiKey);
        
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
      const response = await syncCurlingData();

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
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-brand-text-primary flex items-center gap-2">
          <Server className="w-5 h-5" />
          Sync Services
        </CardTitle>
        <p className="text-sm text-brand-text-secondary">Manually trigger data synchronization jobs.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-brand-text-primary">Curling.io Data Sync</h4>
            <p className="text-sm text-brand-text-secondary">Syncs events and live game data from Curling.io API.</p>
            {syncResult && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-green-400">
                  ✓ Events: {syncResult.events.created} created, {syncResult.events.updated} updated
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTest} disabled={isTesting}>
              {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Settings className="w-4 h-4 mr-2" />}
              Test
            </Button>
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Sync
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CurlingZonePanel = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const { syncCurlingZoneData } = await import('@/api/functions');
      const response = await syncCurlingZoneData({
        region: '5',
        eventTypes: ['81', '82'],
        year: '2025'
      });

      if(response && response.data && response.data.success) {
        setSyncResult(response.data.summary);
        toast({
          title: "CurlingZone Sync Complete",
          description: `✓ ${response.data.summary.events.created} events created, ${response.data.summary.events.updated} updated`,
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
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-brand-text-primary flex items-center gap-2">
          <Globe className="w-5 h-5" />
          CurlingZone XML Sync
        </CardTitle>
        <p className="text-sm text-brand-text-secondary">
          Import events from CurlingZone XML feeds (Region 5, 2025 season).
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-brand-text-primary">CurlingZone XML Data Sync</h4>
            {syncResult && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-green-400">
                  ✓ Events: {syncResult.events.created} created, {syncResult.events.updated} updated
                </p>
              </div>
            )}
          </div>
          <Button onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Sync
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CTRSPanel = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleCTRSSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const { syncCTRSData } = await import('@/api/functions');
      const response = await syncCTRSData();

      if(response && response.data && response.data.success) {
        setSyncResult(response.data.summary);
        toast({
          title: "CTRS Sync Complete",
          description: `✓ ${response.data.summary.teams.created} Canadian teams synced`,
        });
      } else {
        throw new Error(response.data?.error || 'CTRS sync failed');
      }
    } catch (error) {
      console.error("CTRS sync failed:", error);
      toast({
        variant: "destructive",
        title: "CTRS Sync Failed",
        description: error.message,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-brand-text-primary flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          CTRS Rankings Sync
        </CardTitle>
        <p className="text-sm text-brand-text-secondary">
          Import official Canadian Team Ranking System data.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-brand-text-primary">CTRS Data Sync</h4>
            <p className="text-sm text-brand-text-secondary">
              Syncs rankings from Curling Canada (Canadian teams only).
            </p>
            {syncResult && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-green-400">
                  ✓ Teams: {syncResult.teams.created} synced
                </p>
              </div>
            )}
          </div>
          <Button onClick={handleCTRSSync} disabled={isSyncing}>
            {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Sync
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Simple DOMO placeholder component
const DOMOIntegrationPlaceholder = () => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardHeader>
      <CardTitle className="text-brand-text-primary flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        DOMO Analytics Integration
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-brand-text-secondary">
        DOMO integration coming soon. This will provide business intelligence dashboards and data analytics.
      </p>
    </CardContent>
  </Card>
);

export default function OverviewPanel() {
  const [apiConfigs, setApiConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadApiConfigurations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await new Promise(resolve => setTimeout(resolve, 1000));

      setApiConfigs(allIntegrations);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error loading API configurations:', err);
      setError(err.message || 'Failed to load API configurations');
      setApiConfigs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApiConfigurations();
  }, [loadApiConfigurations]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'disabled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      ok: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      disabled: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={variants[status] || variants.disabled}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const calculateOverallHealth = () => {
    if (apiConfigs.length === 0) return 100;
    const okCount = apiConfigs.filter(config => config.status === 'ok').length;
    return Math.round((okCount / apiConfigs.length) * 100);
  };

  const getAverageLatency = () => {
    if (apiConfigs.length === 0) return 0;
    const enabledConfigs = apiConfigs.filter(config => config.is_enabled);
    if (enabledConfigs.length === 0) return 0;
    const totalLatency = enabledConfigs.reduce((sum, config) => sum + (config.latency_avg_ms || 0), 0);
    return Math.round(totalLatency / enabledConfigs.length);
  };

  const groupedIntegrations = apiConfigs.reduce((acc, integration) => {
    const category = integration.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(integration);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-red mx-auto mb-4" />
          <p className="text-brand-text-secondary">Loading API configurations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Error:</strong> {error}
          <Button onClick={loadApiConfigurations} variant="outline" size="sm" className="ml-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-text-primary">API Ecosystem Overview</h2>
        <Button onClick={loadApiConfigurations} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">System Health</p>
                <p className="text-2xl font-bold text-brand-text-primary">{calculateOverallHealth()}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Active APIs</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {apiConfigs.filter(config => config.is_enabled).length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Avg Latency</p>
                <p className="text-2xl font-bold text-brand-text-primary">{getAverageLatency()}ms</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SyncServicesPanel />
      <CurlingZonePanel />
      <CTRSPanel />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-brand-text-primary mb-4">DOMO Integration</h2>
        <DOMOIntegrationPlaceholder />
      </div>

      {Object.entries(groupedIntegrations).map(([category, integrations]) => (
        <Card key={category} className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="text-brand-text-primary">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.map((config) => {
                const IconComponent = config.icon;
                return (
                  <div key={config.id} className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand-charcoal/50">
                        <IconComponent className="w-5 h-5 text-brand-red" />
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(config.status)}
                        <div>
                          <h4 className="font-medium text-brand-text-primary">{config.friendly_name}</h4>
                          <p className="text-sm text-brand-text-secondary">{config.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-brand-text-secondary">
                          Last sync: {config.last_sync ? new Date(config.last_sync).toLocaleString() : 'Never'}
                        </p>
                      </div>
                      {getStatusBadge(config.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {lastRefresh && (
        <p className="text-sm text-brand-text-secondary text-center">
          Last updated: {lastRefresh.toLocaleString()}
        </p>
      )}
    </div>
  );
}
