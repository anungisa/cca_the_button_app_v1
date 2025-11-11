import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, CheckCircle, XCircle, Loader2, RefreshCw, 
  Download, Upload, AlertTriangle 
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mongoSync } from '@/api/functions';

export default function MongoDBIntegration() {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [syncDirection, setSyncDirection] = useState('pull');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const { toast } = useToast();

  const availableEntities = [
    'Club', 'ClubMetrics', 'User', 'LoyaltyProgram', 'PointTransaction',
    'Event', 'Game', 'Donation', 'FinancialTransaction', 'Purchase',
    'HitDrawTap', 'ShotTrackerLog', 'Volunteer', 'Incident', 'Task'
  ].sort();

  const testConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await mongoSync({ action: 'test' });
      
      if (response.data && response.data.connected) {
        setConnectionStatus('connected');
        setDebugInfo(response.data);
        toast({
          title: "MongoDB Connected",
          description: "Successfully connected to MongoDB",
        });
        await loadCollections();
      } else {
        setConnectionStatus('error');
        setDebugInfo(response.data);
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: response.data?.error || "Failed to connect to MongoDB",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message,
      });
    }
  };

  const loadCollections = async () => {
    try {
      const response = await mongoSync({ action: 'list' });
      if (response.data && response.data.success) {
        setCollections(response.data.collections || []);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const handleSync = async () => {
    if (!selectedCollection || !selectedEntity) {
      toast({
        variant: "destructive",
        title: "Missing Selection",
        description: "Please select both a collection and an entity",
      });
      return;
    }

    setIsSyncing(true);
    try {
      const response = await mongoSync({
        action: syncDirection,
        collection: selectedCollection,
        entity: selectedEntity
      });

      if (response.data && response.data.success) {
        setLastSync(new Date());
        toast({
          title: "Sync Complete",
          description: syncDirection === 'pull' 
            ? `Imported ${response.data.imported || 0} records from MongoDB`
            : `Exported ${response.data.exported || 0} records to MongoDB`,
        });
      } else {
        throw new Error(response.data?.error || 'Sync failed');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <Loader2 className="w-5 h-5 animate-spin text-brand-text-secondary" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-green-500" />
            MongoDB Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(connectionStatus)}
              <div>
                <p className="font-medium text-brand-text-primary">
                  {connectionStatus === 'connected' && 'Connected'}
                  {connectionStatus === 'error' && 'Connection Error'}
                  {connectionStatus === 'checking' && 'Checking Connection...'}
                </p>
                <p className="text-sm text-brand-text-secondary">
                  {connectionStatus === 'connected' && 'MongoDB is accessible'}
                  {connectionStatus === 'error' && 'Unable to connect to MongoDB'}
                  {connectionStatus === 'checking' && 'Testing MongoDB connection'}
                </p>
              </div>
            </div>
            <Button onClick={testConnection} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>

          {debugInfo && debugInfo.database && (
            <Alert className="bg-green-950/20 border-green-900">
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-1 text-sm">
                  <div><strong>Database:</strong> {debugInfo.database}</div>
                  <div><strong>Collections:</strong> {collections.length}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === 'error' && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>Connection Failed.</strong> Please verify:
                <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
                  <li>MONGODB_URI is set correctly</li>
                  <li>Format: <code className="bg-gray-800 px-1 rounded">mongodb+srv://username:password@cluster.mongodb.net/dbname</code></li>
                  <li>IP whitelist includes your server IP</li>
                  <li>Database user has read/write permissions</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {connectionStatus === 'connected' && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Sync Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-brand-text-primary mb-2 block">
                  Sync Direction
                </label>
                <Select value={syncDirection} onValueChange={setSyncDirection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pull">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Pull from MongoDB → The Button
                      </div>
                    </SelectItem>
                    <SelectItem value="push">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Push from The Button → MongoDB
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-brand-text-primary mb-2 block">
                  MongoDB Collection
                </label>
                <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-brand-text-primary mb-2 block">
                  The Button Entity
                </label>
                <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEntities.map((entity) => (
                      <SelectItem key={entity} value={entity}>
                        {entity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSync} 
              disabled={isSyncing || !selectedCollection || !selectedEntity}
              className="w-full"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  {syncDirection === 'pull' ? <Download className="w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                  Start Sync
                </>
              )}
            </Button>

            {lastSync && (
              <p className="text-sm text-brand-text-secondary text-center">
                Last synced: {lastSync.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}