import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Sync, 
  CheckCircle, 
  AlertCircle,
  Settings,
  ArrowRightLeft,
  Building2,
  Users,
  FileText,
  Clock
} from 'lucide-react';
import { CRMIntegration } from '@/api/entities';

class CRMConnector {
  constructor(config) {
    this.config = config;
    this.apiEndpoint = config.apiEndpoint;
    this.authMethod = config.authMethod;
  }

  async testConnection() {
    // Simulate API connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        // 80% chance of success for demo
        const success = Math.random() > 0.2;
        resolve({
          success,
          latency: Math.floor(Math.random() * 500) + 100,
          message: success ? 'Connection successful' : 'Authentication failed'
        });
      }, 2000);
    });
  }

  async syncData(entityType, direction = 'bidirectional') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const recordCount = Math.floor(Math.random() * 100) + 10;
        resolve({
          success: true,
          recordsProcessed: recordCount,
          recordsUpdated: Math.floor(recordCount * 0.3),
          recordsCreated: Math.floor(recordCount * 0.7),
          errors: Math.floor(Math.random() * 3)
        });
      }, 3000);
    });
  }

  async getSystemInfo() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          version: '2024.1.15',
          lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          userCount: Math.floor(Math.random() * 50) + 10,
          storageUsed: `${(Math.random() * 10 + 5).toFixed(1)} GB`,
          apiCallsToday: Math.floor(Math.random() * 1000) + 200
        });
      }, 1000);
    });
  }
}

export default function CRMIntegrationManager() {
  const [integrations, setIntegrations] = useState([]);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [syncResults, setSyncResults] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const crmIntegrations = await CRMIntegration.list();
      setIntegrations(crmIntegrations);
      if (crmIntegrations.length > 0) {
        setSelectedIntegration(crmIntegrations[0]);
        loadSystemInfo(crmIntegrations[0]);
      }
    } catch (error) {
      console.error('Failed to load CRM integrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemInfo = async (integration) => {
    if (!integration) return;
    
    const connector = new CRMConnector(integration);
    try {
      const info = await connector.getSystemInfo();
      setSystemInfo(info);
    } catch (error) {
      console.error('Failed to load system info:', error);
    }
  };

  const testConnection = async () => {
    if (!selectedIntegration) return;

    setIsLoading(true);
    setConnectionStatus(null);
    
    const connector = new CRMConnector(selectedIntegration);
    try {
      const result = await connector.testConnection();
      setConnectionStatus(result);
      
      // Update integration status
      await CRMIntegration.update(selectedIntegration.id, {
        connection_status: result.success ? 'connected' : 'error',
        last_sync: new Date().toISOString()
      });
      
      loadIntegrations();
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'Connection test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const performSync = async (entityType) => {
    if (!selectedIntegration) return;

    setIsLoading(true);
    setSyncResults(null);
    
    const connector = new CRMConnector(selectedIntegration);
    try {
      const result = await connector.syncData(entityType);
      setSyncResults(result);
      
      // Update last sync time
      await CRMIntegration.update(selectedIntegration.id, {
        last_sync: new Date().toISOString(),
        sync_status: result.success ? 'success' : 'failed'
      });
      
      loadIntegrations();
    } catch (error) {
      setSyncResults({
        success: false,
        message: 'Sync operation failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewIntegration = async () => {
    const newIntegration = await CRMIntegration.create({
      integration_name: 'New CRM Integration',
      crm_system: 'dynamics_365',
      connection_status: 'disconnected',
      entity_mappings: {
        sponsors_to_accounts: true,
        incidents_to_cases: true,
        contacts_to_leads: false,
        events_to_opportunities: false
      }
    });
    
    loadIntegrations();
    setSelectedIntegration(newIntegration);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-900/20';
      case 'syncing': return 'text-blue-400 bg-blue-900/20';
      case 'error': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-400" />
            CRM Integration Manager
          </h2>
          <p className="text-brand-text-secondary">
            Connect and sync data with external CRM systems
          </p>
        </div>
        <Button onClick={createNewIntegration}>
          <Building2 className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Integration List */}
        <div className="lg:col-span-1">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Active Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  onClick={() => {
                    setSelectedIntegration(integration);
                    loadSystemInfo(integration);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedIntegration?.id === integration.id
                      ? 'bg-brand-red/20 border border-brand-red/30'
                      : 'bg-brand-charcoal hover:bg-brand-charcoal/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-brand-text-primary">
                      {integration.integration_name}
                    </span>
                    <Badge className={getStatusColor(integration.connection_status)}>
                      {integration.connection_status}
                    </Badge>
                  </div>
                  <div className="text-sm text-brand-text-secondary capitalize">
                    {integration.crm_system.replace('_', ' ')}
                  </div>
                </div>
              ))}
              
              {integrations.length === 0 && (
                <p className="text-brand-text-secondary text-center py-4">
                  No integrations configured
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Integration Details */}
        <div className="lg:col-span-3">
          {selectedIntegration ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sync">Data Sync</TabsTrigger>
                <TabsTrigger value="mappings">Field Mappings</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle>Connection Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusColor(selectedIntegration.connection_status)}>
                        {selectedIntegration.connection_status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Last Sync:</span>
                      <span className="text-brand-text-secondary">
                        {formatDate(selectedIntegration.last_sync)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Sync Frequency:</span>
                      <span className="text-brand-text-secondary capitalize">
                        {selectedIntegration.sync_frequency}
                      </span>
                    </div>

                    <Button onClick={testConnection} disabled={isLoading} className="w-full">
                      {isLoading ? <Clock className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                      Test Connection
                    </Button>

                    {connectionStatus && (
                      <Alert className={connectionStatus.success ? 'border-green-500/30' : 'border-red-500/30'}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {connectionStatus.message}
                          {connectionStatus.latency && ` (${connectionStatus.latency}ms)`}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {systemInfo && (
                  <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader>
                      <CardTitle>System Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-brand-text-secondary">Version</div>
                          <div className="font-medium text-brand-text-primary">{systemInfo.version}</div>
                        </div>
                        <div>
                          <div className="text-sm text-brand-text-secondary">Users</div>
                          <div className="font-medium text-brand-text-primary">{systemInfo.userCount}</div>
                        </div>
                        <div>
                          <div className="text-sm text-brand-text-secondary">Storage Used</div>
                          <div className="font-medium text-brand-text-primary">{systemInfo.storageUsed}</div>
                        </div>
                        <div>
                          <div className="text-sm text-brand-text-secondary">API Calls Today</div>
                          <div className="font-medium text-brand-text-primary">{systemInfo.apiCallsToday}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="sync" className="space-y-4">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle>Data Synchronization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        onClick={() => performSync('sponsors')}
                        disabled={isLoading}
                        variant="outline"
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        Sync Sponsors
                      </Button>
                      
                      <Button 
                        onClick={() => performSync('incidents')}
                        disabled={isLoading}
                        variant="outline"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Sync Incidents
                      </Button>
                      
                      <Button 
                        onClick={() => performSync('contacts')}
                        disabled={isLoading}
                        variant="outline"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Sync Contacts
                      </Button>
                      
                      <Button 
                        onClick={() => performSync('all')}
                        disabled={isLoading}
                        className="bg-brand-red hover:bg-red-700"
                      >
                        <Sync className="w-4 h-4 mr-2" />
                        Full Sync
                      </Button>
                    </div>

                    {syncResults && (
                      <Alert className={syncResults.success ? 'border-green-500/30' : 'border-red-500/30'}>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          {syncResults.success ? (
                            <div>
                              <p>Sync completed successfully!</p>
                              <p className="text-sm mt-1">
                                {syncResults.recordsProcessed} records processed, 
                                {syncResults.recordsUpdated} updated, 
                                {syncResults.recordsCreated} created
                                {syncResults.errors > 0 && `, ${syncResults.errors} errors`}
                              </p>
                            </div>
                          ) : (
                            syncResults.message
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mappings" className="space-y-4">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle>Entity Mappings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-brand-text-primary">Sponsors → Accounts</div>
                          <div className="text-sm text-brand-text-secondary">Map sponsor records to CRM accounts</div>
                        </div>
                        <Switch 
                          checked={selectedIntegration.entity_mappings?.sponsors_to_accounts || false}
                          disabled={true}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-brand-text-primary">Incidents → Cases</div>
                          <div className="text-sm text-brand-text-secondary">Map incident records to CRM cases</div>
                        </div>
                        <Switch 
                          checked={selectedIntegration.entity_mappings?.incidents_to_cases || false}
                          disabled={true}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-brand-text-primary">Contacts → Leads</div>
                          <div className="text-sm text-brand-text-secondary">Map contact records to CRM leads</div>
                        </div>
                        <Switch 
                          checked={selectedIntegration.entity_mappings?.contacts_to_leads || false}
                          disabled={true}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-brand-text-primary">Events → Opportunities</div>
                          <div className="text-sm text-brand-text-secondary">Map event records to CRM opportunities</div>
                        </div>
                        <Switch 
                          checked={selectedIntegration.entity_mappings?.events_to_opportunities || false}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle>Integration Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-text-primary mb-2">
                        Integration Name
                      </label>
                      <Input 
                        value={selectedIntegration.integration_name}
                        disabled={true}
                        className="bg-brand-charcoal border-brand-border"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brand-text-primary mb-2">
                        CRM System
                      </label>
                      <Select value={selectedIntegration.crm_system} disabled={true}>
                        <SelectTrigger className="bg-brand-charcoal border-brand-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dynamics_365">Dynamics 365</SelectItem>
                          <SelectItem value="salesforce">Salesforce</SelectItem>
                          <SelectItem value="hubspot">HubSpot</SelectItem>
                          <SelectItem value="pipedrive">Pipedrive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brand-text-primary mb-2">
                        Sync Frequency
                      </label>
                      <Select value={selectedIntegration.sync_frequency} disabled={true}>
                        <SelectTrigger className="bg-brand-charcoal border-brand-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="real_time">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brand-text-primary mb-2">
                        API Endpoint
                      </label>
                      <Input 
                        value={selectedIntegration.api_endpoint || 'https://api.dynamics.com/v1/'}
                        disabled={true}
                        className="bg-brand-charcoal border-brand-border"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="text-center py-12">
                <Database className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
                <h3 className="text-lg font-medium text-brand-text-primary mb-2">No Integration Selected</h3>
                <p className="text-brand-text-secondary">
                  Select an integration from the list or create a new one to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}