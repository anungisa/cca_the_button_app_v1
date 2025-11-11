
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ExternalLink, RefreshCw, CheckCircle, AlertTriangle, 
  Users, Calendar, Settings, Download, Upload,
  ArrowRight, Globe, Database
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrustEventIntegration() {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [workspaces, setWorkspaces] = useState([]);
  const [syncStats, setSyncStats] = useState({
    last_sync: null,
    events_synced: 0,
    volunteers_synced: 0,
    assignments_synced: 0,
    errors: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');

  useEffect(() => {
    loadTrustEventData();
  }, []);

  const loadTrustEventData = async () => {
    setIsLoading(true);
    
    // Mock data - in production, this would call TrustEvent API
    const mockWorkspaces = [
      {
        id: 'ws_brier2025',
        name: 'Brier 2025 - Thunder Bay',
        status: 'active',
        volunteer_count: 156,
        last_updated: '2024-01-15T10:30:00Z',
        url: 'https://trustevent.com/workspace/brier2025'
      },
      {
        id: 'ws_scotties2025',
        name: 'Scotties 2025 - Sydney',
        status: 'setup',
        volunteer_count: 89,
        last_updated: '2024-01-14T15:45:00Z',
        url: 'https://trustevent.com/workspace/scotties2025'
      },
      {
        id: 'ws_u18champs',
        name: 'U18 Championships - Calgary',
        status: 'planning',
        volunteer_count: 45,
        last_updated: '2024-01-13T09:15:00Z',
        url: 'https://trustevent.com/workspace/u18champs'
      }
    ];

    const mockSyncStats = {
      last_sync: new Date().toISOString(),
      events_synced: 3,
      volunteers_synced: 290,
      assignments_synced: 847,
      errors: 2
    };

    setWorkspaces(mockWorkspaces);
    setSyncStats(mockSyncStats);
    setIsLoading(false);
  };

  const triggerSync = async (workspaceId = null) => {
    setIsLoading(true);
    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSyncStats(prev => ({
      ...prev,
      last_sync: new Date().toISOString(),
      volunteers_synced: prev.volunteers_synced + Math.floor(Math.random() * 10),
      assignments_synced: prev.assignments_synced + Math.floor(Math.random() * 20)
    }));
    
    setIsLoading(false);
  };

  const createWorkspace = async (eventData) => {
    // Mock workspace creation
    const newWorkspace = {
      id: `ws_${eventData.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: eventData.name,
      status: 'setup',
      volunteer_count: 0,
      last_updated: new Date().toISOString(),
      url: `https://trustevent.com/workspace/${eventData.name.toLowerCase().replace(/\s+/g, '_')}`
    };
    
    setWorkspaces(prev => [...prev, newWorkspace]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'setup': return 'bg-blue-600 text-white';
      case 'planning': return 'bg-yellow-600 text-black';
      case 'completed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getConnectionStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'syncing': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
            <ExternalLink className="w-6 h-6 text-brand-red" />
            TrustEvent Integration Hub
          </h2>
          <p className="text-brand-text-secondary">
            Bi-directional sync with Local Host Committee workspaces
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${getConnectionStatusColor(connectionStatus)}`}>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
            <span className="text-sm font-medium capitalize">{connectionStatus}</span>
          </div>
          <Button variant="outline" onClick={() => triggerSync()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Alert className="bg-green-900/20 border-green-500/30">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-100">
          Connected to TrustEvent API • Last sync: {syncStats.last_sync ? new Date(syncStats.last_sync).toLocaleString() : 'Never'}
        </AlertDescription>
      </Alert>

      {/* Sync Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-brand-red mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">{syncStats.events_synced}</p>
            <p className="text-sm text-brand-text-secondary">Events Synced</p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">{syncStats.volunteers_synced}</p>
            <p className="text-sm text-brand-text-secondary">Volunteers Synced</p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">{syncStats.assignments_synced}</p>
            <p className="text-sm text-brand-text-secondary">Assignments Synced</p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <AlertTriangle className={`w-6 h-6 mx-auto mb-2 ${syncStats.errors > 0 ? 'text-red-400' : 'text-green-400'}`} />
            <p className="text-2xl font-bold text-brand-text-primary">{syncStats.errors}</p>
            <p className="text-sm text-brand-text-secondary">Sync Errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Workspaces */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-brand-text-primary flex items-center justify-between">
            <span>Active TrustEvent Workspaces</span>
            <Button size="sm" className="bg-brand-red hover:bg-red-700">
              Create Workspace
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workspaces.map((workspace) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border hover:border-brand-red/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-brand-text-primary">{workspace.name}</h3>
                    <p className="text-sm text-brand-text-secondary">
                      {workspace.volunteer_count} volunteers • Last updated: {new Date(workspace.last_updated).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(workspace.status)}>
                    {workspace.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => triggerSync(workspace.id)}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    Sync
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(workspace.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sync Settings */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="text-brand-text-primary flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sync Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Auto-Sync Frequency
              </label>
              <Select defaultValue="hourly">
                <SelectTrigger className="bg-brand-charcoal border-brand-border text-brand-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="15min">Every 15 minutes</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="manual">Manual only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Data Sync Direction
              </label>
              <Select defaultValue="bidirectional">
                <SelectTrigger className="bg-brand-charcoal border-brand-border text-brand-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bidirectional">Bi-directional</SelectItem>
                  <SelectItem value="hq_to_trust">HQ → TrustEvent only</SelectItem>
                  <SelectItem value="trust_to_hq">TrustEvent → HQ only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-brand-red hover:bg-red-700">
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Data Mapping */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="text-brand-text-primary flex items-center gap-2">
              <Database className="w-5 h-5" />
              Field Mapping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 bg-brand-charcoal/30 rounded">
                <span className="text-brand-text-secondary">HQ Volunteer Name</span>
                <ArrowRight className="w-3 h-3 text-brand-text-secondary" />
                <span className="text-brand-text-primary">TrustEvent Full Name</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-brand-charcoal/30 rounded">
                <span className="text-brand-text-secondary">HQ Email</span>
                <ArrowRight className="w-3 h-3 text-brand-text-secondary" />
                <span className="text-brand-text-primary">TrustEvent Email</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-brand-charcoal/30 rounded">
                <span className="text-brand-text-secondary">HQ Skills</span>
                <ArrowRight className="w-3 h-3 text-brand-text-secondary" />
                <span className="text-brand-text-primary">TrustEvent Roles</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-brand-charcoal/30 rounded">
                <span className="text-brand-text-secondary">HQ Compliance</span>
                <ArrowRight className="w-3 h-3 text-brand-text-secondary" />
                <span className="text-brand-text-primary">TrustEvent Verified</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              <Settings className="w-4 h-4 mr-2" />
              Configure Mapping
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Integration Health */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-brand-text-primary">Integration Health Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-semibold text-green-300">API Connection</p>
              <p className="text-sm text-green-200">Healthy</p>
              <p className="text-xs text-green-200/70 mt-1">Response: 120ms</p>
            </div>
            
            <div className="text-center p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="font-semibold text-blue-300">Data Sync</p>
              <p className="text-sm text-blue-200">Active</p>
              <p className="text-xs text-blue-200/70 mt-1">Last: 2 min ago</p>
            </div>
            
            <div className="text-center p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-semibold text-green-300">Data Integrity</p>
              <p className="text-sm text-green-200">99.8%</p>
              <p className="text-xs text-green-200/70 mt-1">0 conflicts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
