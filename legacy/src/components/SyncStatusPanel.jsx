import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Clock,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function SyncStatusPanel() {
  const [syncStatus, setSyncStatus] = useState({
    curlingReg: { status: 'connected', lastSync: new Date().toISOString() },
    curlingIO: { status: 'connected', lastSync: new Date().toISOString() },
    trustEvents: { status: 'warning', lastSync: new Date(Date.now() - 1800000).toISOString() },
    domo: { status: 'connected', lastSync: new Date().toISOString() }
  });
  const [isLoading, setIsLoading] = useState(false);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'syncing': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'syncing': return RefreshCw;
      default: return WifiOff;
    }
  };

  const handleSync = async (system) => {
    setIsLoading(true);
    setSyncStatus(prev => ({
      ...prev,
      [system]: { ...prev[system], status: 'syncing' }
    }));

    // Mock sync operation
    setTimeout(() => {
      setSyncStatus(prev => ({
        ...prev,
        [system]: { 
          status: 'connected', 
          lastSync: new Date().toISOString() 
        }
      }));
      setIsLoading(false);
    }, 2000);
  };

  const syncSystems = [
    { key: 'curlingReg', name: 'Curling Registration', description: 'User accounts and memberships' },
    { key: 'curlingIO', name: 'Curling.io', description: 'Events and game data' },
    { key: 'trustEvents', name: 'Trust Events', description: 'Volunteer management' },
    { key: 'domo', name: 'DOMO Analytics', description: 'Business intelligence data' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-brand-text-primary">Integration Status</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {syncSystems.map((system) => {
          const status = syncStatus[system.key];
          const StatusIcon = getStatusIcon(status.status);
          
          return (
            <Card key={system.key} className="bg-brand-card-bg border-brand-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-brand-text-primary">
                    {system.name}
                  </CardTitle>
                  <Badge variant="outline" className={getStatusColor(status.status)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-brand-text-secondary">
                  {system.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-brand-text-secondary">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Last sync: {formatTimestamp(status.lastSync)}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleSync(system.key)}
                    disabled={isLoading || status.status === 'syncing'}
                  >
                    {status.status === 'syncing' ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      'Sync'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          This is a demo environment. All sync operations are simulated and no real data is transferred.
        </AlertDescription>
      </Alert>
    </div>
  );
}