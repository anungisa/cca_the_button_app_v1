import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const HPSyncAudit = ({ syncStatus, lastSync, onManualSync }) => {
  const getSyncStatusColor = (status) => {
    switch (status) {
      case 'synced': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'synced': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            Sync Status
          </div>
          <Button variant="outline" size="sm" onClick={onManualSync}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Sync Now
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-text-secondary">Teamworks Connection</span>
            <div className="flex items-center gap-2">
              <span className={`${getSyncStatusColor(syncStatus?.connection)} text-sm`}>
                {getSyncStatusIcon(syncStatus?.connection)}
              </span>
              <Badge className={
                syncStatus?.connection === 'synced' ? 'bg-green-900/50 text-green-300' :
                syncStatus?.connection === 'pending' ? 'bg-yellow-900/50 text-yellow-300' :
                'bg-red-900/50 text-red-300'
              }>
                {syncStatus?.connection || 'Unknown'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-text-secondary">Last Sync</span>
            <span className="text-sm text-brand-text-primary">
              {lastSync ? new Date(lastSync).toLocaleString('en-CA') : 'Never'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-text-secondary">Smart Broom Integration</span>
            <Badge className="bg-amber-900/50 text-amber-300">
              Active
            </Badge>
          </div>

          {syncStatus?.last_error && (
            <div className="p-2 bg-red-900/20 border border-red-500/30 rounded text-sm text-red-300">
              Last Error: {syncStatus.last_error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HPSyncAudit;