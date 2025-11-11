
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp, CheckCircle, XCircle, Loader2, RefreshCw,
  Download, Upload, Database, AlertTriangle, ListFilter, Info
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { domoSync } from '@/api/functions';
import DOMOSchemaManager from './DOMOSchemaManager'; // Import the new DOMOSchemaManager component

export default function DOMOIntegration() {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [syncDirection, setSyncDirection] = useState('pull');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('sync');

  const [isCreatingDataset, setIsCreatingDataset] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');
  const [showCreateDataset, setShowCreateDataset] = useState(false);
  const [entityRecordCounts, setEntityRecordCounts] = useState({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [isGeneratingData, setIsGeneratingData] = useState(false);

  const { toast } = useToast();

  const availableEntities = [
    // Club & Organization
    'Club', 'ClubMetrics', 'ClubLoyalty', 'SurveySubmission', 'SurveyBenchmark',

    // User & Engagement
    'User', 'LoyaltyProgram', 'PointTransaction', 'ActivityFeed', 'UserStreak', 'UserMilestone',

    // Event Data
    'Event', 'Game', 'EventStandings', 'LiveInteraction',

    // Financial Data
    'Donation', 'FinancialTransaction', 'Purchase', 'Order', 'Subscription', 'CurlingPlusSubscription',

    // Performance Data
    'HitDrawTap', 'ShotTrackerLog', 'DrillLog', 'SmartBroomSession', 'UnifiedPerformanceLog',

    // Volunteer Data
    'Volunteer', 'VolunteerCampaign',

    // Content & Engagement
    'KnowledgeArticle', 'KnowledgeProgress', 'StreamingEvent', 'TriviaQuestion', 'TriviaSession',

    // Safety & Compliance
    'SafeSportCompletion', 'ComplianceItem', 'Incident',

    // Strategic Data
    'StrategicKPI', 'StrategicGoal', 'StrategicInitiative',

    // Sponsorship Data
    'SponsorDeal', 'SponsorContract', 'SponsorCampaign',

    // High Performance
    'NationalTeam', 'HPCenter', 'NextGenAthlete', 'Achievement', 'CTRSRanking',

    // Staff Operations
    'Task', 'Project', 'FormSubmission', 'EventPlan'
  ].sort();

  const loadDatasets = useCallback(async () => {
    console.log('Loading DOMO datasets...');
    try {
      const response = await domoSync({ action: 'list' });
      console.log('List datasets response:', response);

      if (response.data && response.data.success && response.data.datasets) {
        setDatasets(response.data.datasets);
        console.log('Datasets loaded:', response.data.datasets.length);
      } else {
        console.error('Failed to load datasets:', response.data);
      }
    } catch (error) {
      console.error('Failed to load datasets:', error);
      toast({
        variant: "destructive",
        title: "Failed to Load Datasets",
        description: error.message,
      });
    }
  }, [toast]);

  const testConnection = useCallback(async () => {
    console.log('Testing DOMO connection...');
    setConnectionStatus('checking');
    setDebugInfo(null);

    try {
      console.log('Calling domoSync function...');
      const response = await domoSync({ action: 'test' });
      console.log('DOMO test response:', response);
      console.log('Response data:', response.data);

      setDebugInfo(response.data);

      if (response.data && response.data.success && response.data.connected) {
        setConnectionStatus('connected');
        console.log('DOMO connected successfully!');
        toast({
          title: "DOMO Connected",
          description: "Successfully connected to DOMO instance.",
        });
        await loadDatasets();
      } else {
        setConnectionStatus('error');
        console.error('DOMO connection failed:', response.data);

        // Better error message handling
        let errorMsg = 'Failed to connect to DOMO';
        if (response.data?.error) {
          errorMsg = response.data.error;
        }
        if (response.data?.details) {
          errorMsg += ' - ' + (typeof response.data.details === 'string' ? response.data.details : JSON.stringify(response.data.details));
        }

        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: errorMsg,
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('DOMO connection error:', error);
      console.error('Error stack:', error.stack);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message || 'Unknown error occurred',
      });
    }
  }, [toast, loadDatasets]);

  useEffect(() => {
    testConnection();
  }, [testConnection]);

  // Check record counts for selected entity
  const checkEntityRecordCount = async (entityName) => {
    try {
      // Dynamically import the entity module
      const entityModule = await import(`@/api/entities/${entityName}`);
      const Entity = entityModule[entityName]; // Access the entity class/object by its name
      const records = await Entity.list('', 1); // Fetch only 1 record to check existence
      return records.length;
    } catch (error) {
      console.error(`Error checking records for ${entityName}:`, error);
      // If there's an error (e.g., entity file not found, method not available), assume 0 or handle specifically
      return 0;
    }
  };

  // Load record counts when entity is selected and create dataset section is open
  useEffect(() => {
    if (selectedEntity && showCreateDataset) {
      setIsLoadingCounts(true);
      checkEntityRecordCount(selectedEntity).then(count => {
        setEntityRecordCounts(prev => ({ ...prev, [selectedEntity]: count }));
        setIsLoadingCounts(false);
      });
    }
  }, [selectedEntity, showCreateDataset]);

  const generateSampleData = async (entityName) => {
    setIsGeneratingData(true);
    try {
      const { [entityName]: Entity } = await import(`@/api/entities/${entityName}`);

      let sampleData = [];

      // Generate entity-specific sample data
      switch(entityName) {
        case 'Club':
          sampleData = [
            { name: 'Calgary Curling Club', location: { city: 'Calgary', province: 'AB', address: '123 Curling Way', postal_code: 'T2P 1A1' }, ma_region: 'CCA-AB', membership_count: 250, status: 'active', facilities: { num_sheets: 6, lounge: true, pro_shop: true } },
            { name: 'Toronto Granite Club', location: { city: 'Toronto', province: 'ON', address: '456 Ice Lane', postal_code: 'M5H 2N2' }, ma_region: 'CCA-ON', membership_count: 320, status: 'active', facilities: { num_sheets: 8, lounge: true, pro_shop: true } },
            { name: 'Vancouver Curling Club', location: { city: 'Vancouver', province: 'BC', address: '789 Stone St', postal_code: 'V6B 3K9' }, ma_region: 'CCA-BC', membership_count: 180, status: 'active', facilities: { num_sheets: 4, lounge: true } }
          ];
          break;

        case 'Event':
          sampleData = [
            { name: '2025 Provincial Championship', start_date: '2025-02-15', end_date: '2025-02-18', venue: { name: 'Calgary Arena', city: 'Calgary' }, registration_fee: 500 },
            { name: 'Spring Bonspiel', start_date: '2025-03-10', end_date: '2025-03-12', venue: { name: 'Toronto CC', city: 'Toronto' }, registration_fee: 250 },
            { name: 'Youth Development Camp', start_date: '2025-04-05', end_date: '2025-04-07', venue: { name: 'Vancouver CC', city: 'Vancouver' }, registration_fee: 150 }
          ];
          break;

        case 'Donation':
          sampleData = [
            { amount: 100, type: 'one_time', donor_name: 'John Smith', donor_email: 'john@example.com', payment_status: 'completed', campaign: 'FTLOC 2025', ma_region: 'CCA-ON' },
            { amount: 50, type: 'monthly', donor_name: 'Jane Doe', donor_email: 'jane@example.com', payment_status: 'completed', campaign: 'FTLOC 2025', ma_region: 'CCA-AB' },
            { amount: 250, type: 'one_time', donor_name: 'Bob Johnson', donor_email: 'bob@example.com', payment_status: 'completed', campaign: 'FTLOC 2025', ma_region: 'CCA-BC' }
          ];
          break;

        case 'PointTransaction':
          sampleData = [
            { user_id: 'sample_user_1', points_amount: 100, transaction_type: 'volunteer', description: 'Volunteered at local event', source: 'app' },
            { user_id: 'sample_user_2', points_amount: 50, transaction_type: 'livestream', description: 'Watched championship game', source: 'app' },
            { user_id: 'sample_user_3', points_amount: 25, transaction_type: 'trivia', description: 'Completed daily trivia', source: 'app' }
          ];
          break;

        case 'ClubMetrics':
          sampleData = [
            { club_id: 'club_1', reporting_period: '2025-01-01', membership_stats: { total_members: 250, new_members: 25, youth_members: 45 }, engagement_metrics: { volunteer_hours: 120, events_hosted: 4 }, ma_region: 'CCA-AB' },
            { club_id: 'club_2', reporting_period: '2025-01-01', membership_stats: { total_members: 320, new_members: 35, youth_members: 68 }, engagement_metrics: { volunteer_hours: 180, events_hosted: 6 }, ma_region: 'CCA-ON' }
          ];
          break;

        case 'FinancialTransaction':
          sampleData = [
            { transaction_type: 'revenue', category: 'membership_fees', amount: 5000, description: 'Monthly membership fees', payment_status: 'completed' },
            { transaction_type: 'revenue', category: 'event_revenue', amount: 2500, description: 'Bonspiel registration', payment_status: 'completed' },
            { transaction_type: 'expense', category: 'facility_costs', amount: -1200, description: 'Ice maintenance', payment_status: 'completed' }
          ];
          break;

        case 'Incident':
          sampleData = [
            { title: 'Equipment Malfunction', category: 'technical_issue', status: 'resolved', priority: 'medium', description: 'Ice machine stopped working mid-game' },
            { title: 'Volunteer No-Show', category: 'volunteer_issue', status: 'open', priority: 'low', description: 'Scheduled volunteer did not arrive for shift' }
          ];
          break;

        case 'Task':
          sampleData = [
            { title: 'Review sponsorship proposals', status: 'in_progress', priority: 'high', assigned_to: 'admin', description: 'Review Q2 sponsorship opportunities', due_date: '2025-02-01T17:00:00Z' },
            { title: 'Update website content', status: 'todo', priority: 'medium', assigned_to: 'admin', description: 'Update event calendar for March', due_date: '2025-01-28T17:00:00Z' }
          ];
          break;

        case 'Achievement':
          sampleData = [
            { athlete_id: 'athlete_1', achievement_type: 'championship', event_name: '2024 Provincial Championship', event_level: 'provincial', medal: 'gold', year: 2024, location: 'Calgary, AB' },
            { athlete_id: 'athlete_2', achievement_type: 'medal', event_name: '2024 National Championship', event_level: 'national', medal: 'silver', year: 2024, location: 'Ottawa, ON' }
          ];
          break;

        case 'SponsorCampaign':
          sampleData = [
            { name: 'Tim Hortons Patch Challenge', sponsor_name: 'Tim Hortons', description: 'Scan Tim Hortons branded patches at events', quest_type: 'scan_qr', xp_reward: 100, start_date: '2025-01-01', end_date: '2025-04-30', is_active: true },
            { name: 'Watch & Win', sponsor_name: 'PointsBet', description: 'Watch live games and make predictions', quest_type: 'watch_video', xp_reward: 50, start_date: '2025-02-01', end_date: '2025-03-31', is_active: true }
          ];
          break;

        case 'Volunteer':
          sampleData = [
            { full_name: 'Sarah Wilson', email: 'sarah@example.com', ma_region: 'CCA-ON', source_system: 'the_button', compliance: { respect_in_sport: 'compliant', policy_signed: 'compliant' } },
            { full_name: 'Mike Chen', email: 'mike@example.com', ma_region: 'CCA-BC', source_system: 'the_button', compliance: { respect_in_sport: 'compliant', policy_signed: 'compliant' } }
          ];
          break;

        case 'TriviaQuestion':
          sampleData = [
            { question_text: 'What year was the first Brier held?', options: ['1927', '1930', '1935', '1940'], correct_answer_index: 0, category: 'history', difficulty: 'medium', xp_reward: 10 },
            { question_text: 'How many ends in a standard curling game?', options: ['6', '8', '10', '12'], correct_answer_index: 2, category: 'rules', difficulty: 'easy', xp_reward: 5 }
          ];
          break;

        case 'KnowledgeArticle':
          sampleData = [
            { title: 'How to Run a Successful Bonspiel', category: 'Event Operations', content_type: 'article', target_roles: ['club_admin', 'volunteer'], status: 'published', difficulty_level: 'intermediate', xp_reward: 25 },
            { title: 'Ice Maintenance Best Practices', category: 'Club Operations', content_type: 'video', target_roles: ['club_admin'], status: 'published', difficulty_level: 'advanced', xp_reward: 50 }
          ];
          break;

        case 'StrategicKPI':
          sampleData = [
            { kpi_name: 'Monthly Active Users', category: 'fan_engagement', metric_type: 'count', current_value: 12500, target_value: 15000, baseline_value: 10000, period: 'monthly', data_source: 'the_button' },
            { kpi_name: 'Club Adoption Rate', category: 'club_adoption', metric_type: 'percentage', current_value: 68, target_value: 85, baseline_value: 50, period: 'quarterly', data_source: 'manual' }
          ];
          break;

        case 'ComplianceItem':
          sampleData = [
            { title: 'CRA Annual Filing', compliance_type: 'cra_filing', regulatory_body: 'cra', due_date: '2025-06-30', frequency: 'annual', risk_level: 'high', status: 'not_started', assigned_to: 'finance_team', department: 'finance' },
            { title: 'Sport Canada Report', compliance_type: 'sport_canada_report', regulatory_body: 'sport_canada', due_date: '2025-04-15', frequency: 'annual', risk_level: 'high', status: 'in_progress', assigned_to: 'admin', department: 'governance' }
          ];
          break;

        default:
          toast({
            variant: "destructive",
            title: "No Sample Data Available",
            description: `Sample data generation not configured for ${entityName}. Please add data manually.`,
          });
          setIsGeneratingData(false);
          return;
      }

      // Insert sample data
      await Entity.bulkCreate(sampleData);

      // Refresh count
      const newCount = await checkEntityRecordCount(entityName);
      setEntityRecordCounts(prev => ({ ...prev, [entityName]: newCount }));

      toast({
        title: "Sample Data Generated",
        description: `Added ${sampleData.length} sample records to ${entityName}`,
      });

    } catch (error) {
      console.error('Error generating data:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message,
      });
    } finally {
      setIsGeneratingData(false);
    }
  };

  const handleCreateDataset = async () => {
    if (!selectedEntity || !newDatasetName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select an entity and enter a dataset name.",
      });
      return;
    }

    // Check if entity has data
    const recordCount = entityRecordCounts[selectedEntity];
    if (recordCount === undefined || recordCount === 0) {
      toast({
        variant: "destructive",
        title: "No Data Available",
        description: `${selectedEntity} has no records. Please add data first (or use "Generate Sample Data") before creating a dataset.`,
      });
      return;
    }

    console.log('Creating dataset...', { selectedEntity, newDatasetName });
    setIsCreatingDataset(true);

    try {
      const payload = {
        action: 'create_dataset',
        sourceEntity: selectedEntity,
        datasetName: newDatasetName
      };

      console.log('Create dataset payload:', payload);
      const response = await domoSync(payload);
      console.log('Create dataset response:', response);

      if (response.data && response.data.success) {
        toast({
          title: "Dataset Created",
          description: `Dataset "${newDatasetName}" created successfully in DOMO with ${recordCount} records.`,
        });

        // Set the newly created dataset as selected
        setSelectedDataset(response.data.datasetId);
        setShowCreateDataset(false);
        setNewDatasetName('');

        // Reload datasets
        await loadDatasets();
      } else {
        throw new Error(response.data?.error || 'Dataset creation failed');
      }
    } catch (error) {
      console.error('Create dataset error:', error);
      toast({
        variant: "destructive",
        title: "Dataset Creation Failed",
        description: error.message,
      });
    } finally {
      setIsCreatingDataset(false);
    }
  };

  const handleSync = async () => {
    if (!selectedDataset || !selectedEntity) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select both a dataset and an entity.",
      });
      return;
    }

    console.log('Starting sync...', { syncDirection, selectedDataset, selectedEntity });
    setIsSyncing(true);

    try {
      const payload = syncDirection === 'pull'
        ? { action: 'pull', datasetId: selectedDataset, targetEntity: selectedEntity }
        : { action: 'push', datasetId: selectedDataset, sourceEntity: selectedEntity };

      console.log('Sync payload:', payload);
      const response = await domoSync(payload);
      console.log('Sync response:', response);

      if (response.data && response.data.success) {
        setLastSync({
          direction: syncDirection,
          dataset: selectedDataset,
          entity: selectedEntity,
          timestamp: new Date().toISOString(),
          ...response.data
        });

        toast({
          title: "Sync Complete",
          description: syncDirection === 'pull'
            ? `Pulled ${response.data.total} records. Created: ${response.data.created}, Updated: ${response.data.updated}`
            : `Pushed ${response.data.pushed} records to DOMO.`,
        });
      } else {
        throw new Error(response.data?.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
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
            <TrendingUp className="w-6 h-6 text-brand-red" />
            DOMO Integration
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
                  {connectionStatus === 'connected' && 'DOMO API is accessible'}
                  {connectionStatus === 'error' && 'Unable to connect to DOMO'}
                  {connectionStatus === 'checking' && 'Testing DOMO credentials'}
                </p>
              </div>
            </div>
            <Button onClick={testConnection} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>

          {debugInfo && (
            <Alert className="mt-4 bg-gray-900 border-gray-700">
              <AlertDescription>
                <div className="space-y-2 text-xs font-mono">
                  <div><strong>Debug Info:</strong></div>
                  <div>Client ID Set: {debugInfo.debug?.hasClientId ? '✅' : '❌'}</div>
                  <div>Client Secret Set: {debugInfo.debug?.hasClientSecret ? '✅' : '❌'}</div>
                  <div>Instance URL: {debugInfo.debug?.instanceUrl || 'Not set'}</div>
                  {debugInfo.error && <div className="text-red-400">Error: {debugInfo.error}</div>}
                  {debugInfo.details && <div className="text-yellow-400">Details: {debugInfo.details}</div>}
                  {debugInfo.debug?.hint && <div className="text-blue-400">Hint: {debugInfo.debug.hint}</div>}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === 'error' && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20 mt-4">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>Connection Failed.</strong> Please verify:
                <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
                  <li>DOMO_CLIENT_ID is set correctly</li>
                  <li>DOMO_CLIENT_SECRET is set correctly</li>
                  <li>DOMO_INSTANCE_URL is set to: <code className="bg-gray-800 px-1 rounded">https://api.domo.com</code></li>
                  <li>OAuth client has 'data' scope enabled in DOMO</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {connectionStatus === 'connected' && (
        <div className="flex gap-2 border-b border-brand-border">
          <Button
            variant={activeTab === 'sync' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('sync')}
            className={activeTab === 'sync' ? 'bg-brand-red' : ''}
          >
            <Database className="w-4 h-4 mr-2" />
            Data Synchronization
          </Button>
          <Button
            variant={activeTab === 'schema' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('schema')}
            className={activeTab === 'schema' ? 'bg-brand-red' : ''}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Schema Reference
          </Button>
        </div>
      )}

      {/* Data Sync Panel */}
      {connectionStatus === 'connected' && activeTab === 'sync' && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Synchronization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sync Direction */}
            <div>
              <label className="block text-sm font-medium mb-2 text-brand-text-primary">
                Sync Direction
              </label>
              <div className="flex gap-2">
                <Button
                  variant={syncDirection === 'pull' ? 'default' : 'outline'}
                  onClick={() => setSyncDirection('pull')}
                  className={syncDirection === 'pull' ? 'bg-brand-red' : ''}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Pull from DOMO
                </Button>
                <Button
                  variant={syncDirection === 'push' ? 'default' : 'outline'}
                  onClick={() => setSyncDirection('push')}
                  className={syncDirection === 'push' ? 'bg-brand-red' : ''}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Push to DOMO
                </Button>
              </div>
            </div>

            {/* Entity Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-brand-text-primary">
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

            {/* Dataset Selection or Creation */}
            <div>
              <label className="block text-sm font-medium mb-2 text-brand-text-primary">
                DOMO Dataset
              </label>

              {!showCreateDataset ? (
                <div className="space-y-2">
                  <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select DOMO dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasets.length > 0 ? (
                        datasets.map((dataset) => (
                          <SelectItem key={dataset.id} value={dataset.id}>
                            {dataset.name || dataset.id}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No datasets found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateDataset(true)}
                    className="w-full"
                  >
                    + Create New Dataset
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 p-4 border border-brand-border rounded-lg bg-brand-charcoal/30">
                  <Input
                    placeholder="Enter dataset name (e.g., TheButton_Clubs)"
                    value={newDatasetName}
                    onChange={(e) => setNewDatasetName(e.target.value)}
                    className="bg-brand-charcoal border-brand-border"
                  />

                  {/* Show record count */}
                  {selectedEntity && (
                    <div className="space-y-2">
                      <div className="text-sm">
                        {isLoadingCounts ? (
                          <span className="text-brand-text-secondary flex items-center">
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            Checking data...
                          </span>
                        ) : (
                          <span className={entityRecordCounts[selectedEntity] > 0 ? 'text-green-400 flex items-center' : 'text-yellow-400 flex items-center'}>
                            {entityRecordCounts[selectedEntity] > 0 ? (
                              <>✓ {entityRecordCounts[selectedEntity]} records found in {selectedEntity}</>
                            ) : (
                              <>⚠ No records in {selectedEntity}</>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Generate Sample Data Button */}
                      {entityRecordCounts[selectedEntity] === 0 && !isLoadingCounts && (
                        <Alert className="border-blue-500/50 bg-blue-500/10">
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-2">
                              <p className="text-sm">This entity has no data. Generate sample data to test DOMO sync:</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => generateSampleData(selectedEntity)}
                                disabled={isGeneratingData}
                                className="w-full"
                              >
                                {isGeneratingData ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Database className="w-4 h-4 mr-2" />
                                    Generate Sample Data
                                  </>
                                )}
                              </Button>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateDataset}
                      disabled={isCreatingDataset || !selectedEntity || !newDatasetName || entityRecordCounts[selectedEntity] === 0}
                      className="flex-1 bg-brand-red"
                    >
                      {isCreatingDataset ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Dataset'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateDataset(false);
                        setNewDatasetName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <Alert className="mt-2">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      The dataset will be created with the schema from {selectedEntity} and populated with current records.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>

            {/* Sync Button */}
            <Button
              onClick={handleSync}
              disabled={isSyncing || !selectedDataset || !selectedEntity}
              className="w-full bg-brand-red hover:bg-red-700"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Sync
                </>
              )}
            </Button>

            {/* Last Sync Info */}
            {lastSync && (
              <div className="mt-4 p-4 bg-brand-charcoal rounded-lg">
                <p className="text-sm font-medium text-brand-text-primary mb-2">Last Sync</p>
                <div className="space-y-1 text-sm text-brand-text-secondary">
                  <p>Direction: {lastSync.direction === 'pull' ? 'DOMO → The Button' : 'The Button → DOMO'}</p>
                  <p>Dataset: {lastSync.dataset}</p>
                  <p>Entity: {lastSync.entity}</p>
                  <p>Time: {new Date(lastSync.timestamp).toLocaleString()}</p>
                  {lastSync.direction === 'pull' && (
                    <>
                      <p>Records: {lastSync.total} total, {lastSync.created} created, {lastSync.updated} updated</p>
                      {lastSync.errors > 0 && (
                        <p className="text-red-400">Errors: {lastSync.errors}</p>
                      )}
                    </>
                  )}
                  {lastSync.direction === 'push' && (
                    <p>Records pushed: {lastSync.pushed}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Schema Reference Panel */}
      {connectionStatus === 'connected' && activeTab === 'schema' && (
        <DOMOSchemaManager />
      )}
    </div>
  );
}
