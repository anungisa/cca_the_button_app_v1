import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Send, 
  TrendingUp,
  Loader2,
  RefreshCw,
  Settings,
  BarChart3,
  UserPlus,
  List
} from 'lucide-react';

export default function MailchimpIntegration() {
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: true });
  const [lists, setLists] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    testConnection();
    loadLists();
    loadCampaigns();
    loadStats();
  }, []);

  const testConnection = async () => {
    try {
      const response = await base44.functions.invoke('mailchimpSync', {
        action: 'test_connection'
      });
      
      setConnectionStatus({
        connected: response.data.success,
        loading: false,
        details: response.data
      });
    } catch (error) {
      console.error('Mailchimp connection test failed:', error);
      setConnectionStatus({
        connected: false,
        loading: false,
        error: error.message
      });
    }
  };

  const loadLists = async () => {
    try {
      const response = await base44.functions.invoke('mailchimpSync', {
        action: 'get_lists'
      });
      
      if (response.data.success) {
        setLists(response.data.lists || []);
      }
    } catch (error) {
      console.error('Error loading Mailchimp lists:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      const response = await base44.functions.invoke('mailchimpSync', {
        action: 'get_campaigns',
        limit: 10
      });
      
      if (response.data.success) {
        setCampaigns(response.data.campaigns || []);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await base44.functions.invoke('mailchimpSync', {
        action: 'get_stats'
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const syncSubscribers = async (listId) => {
    setSyncing(true);
    try {
      const response = await base44.functions.invoke('mailchimpSync', {
        action: 'sync_subscribers',
        list_id: listId
      });
      
      if (response.data.success) {
        alert(`Successfully synced ${response.data.synced} subscribers!`);
        loadLists();
        loadStats();
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Sync failed: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Mailchimp Connection
          </CardTitle>
          <CardDescription>
            Email marketing automation and campaign management
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus.loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Testing connection...</span>
            </div>
          ) : connectionStatus.connected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-brand-text-primary font-medium">Connected to Mailchimp</span>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              
              {connectionStatus.details && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                    <div className="text-sm text-brand-text-secondary">Account</div>
                    <div className="text-lg font-bold text-brand-text-primary">
                      {connectionStatus.details.account_name || 'Curling Canada'}
                    </div>
                  </div>
                  <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                    <div className="text-sm text-brand-text-secondary">Total Contacts</div>
                    <div className="text-lg font-bold text-brand-text-primary">
                      {connectionStatus.details.total_subscribers?.toLocaleString() || '0'}
                    </div>
                  </div>
                  <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                    <div className="text-sm text-brand-text-secondary">Lists</div>
                    <div className="text-lg font-bold text-brand-text-primary">
                      {lists.length}
                    </div>
                  </div>
                  <div className="p-3 bg-brand-charcoal/50 rounded-lg">
                    <div className="text-sm text-brand-text-secondary">Campaigns</div>
                    <div className="text-lg font-bold text-brand-text-primary">
                      {campaigns.length}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-400">Not connected</span>
              {connectionStatus.error && (
                <span className="text-sm text-gray-400">- {connectionStatus.error}</span>
              )}
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={testConnection}
              disabled={connectionStatus.loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different features */}
      <Tabs defaultValue="lists" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lists">
            <List className="w-4 h-4 mr-2" />
            Lists
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Send className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Settings className="w-4 h-4 mr-2" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Lists Tab */}
        <TabsContent value="lists" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mailchimp Lists</span>
                <Button size="sm" onClick={loadLists}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your Mailchimp audience lists and sync subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lists.length > 0 ? (
                <div className="space-y-3">
                  {lists.map((list) => (
                    <div key={list.id} className="p-4 border border-brand-border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-brand-text-primary">{list.name}</div>
                          <div className="text-sm text-brand-text-secondary mt-1">
                            {list.stats?.member_count || 0} subscribers
                          </div>
                          {list.stats?.open_rate && (
                            <div className="text-xs text-brand-text-secondary mt-1">
                              Avg. Open Rate: {(list.stats.open_rate * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => syncSubscribers(list.id)}
                          disabled={syncing}
                        >
                          {syncing ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <UserPlus className="w-4 h-4 mr-2" />
                          )}
                          Sync from Button
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-brand-text-secondary">
                  <List className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No lists found. Create lists in Mailchimp first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Campaigns</span>
                <Button size="sm" onClick={loadCampaigns}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaigns.length > 0 ? (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 border border-brand-border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-brand-text-primary">
                            {campaign.settings?.title || campaign.settings?.subject_line}
                          </div>
                          <div className="flex gap-3 mt-2 text-sm text-brand-text-secondary">
                            <span>Sent: {campaign.emails_sent || 0}</span>
                            <span>Opens: {campaign.report_summary?.opens || 0}</span>
                            <span>Clicks: {campaign.report_summary?.clicks || 0}</span>
                          </div>
                          {campaign.report_summary?.open_rate && (
                            <div className="mt-1 text-xs text-brand-text-secondary">
                              Open Rate: {(campaign.report_summary.open_rate * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                        <Badge className={
                          campaign.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                          campaign.status === 'sending' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-brand-text-secondary">
                  <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No campaigns found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Email Automation</CardTitle>
              <CardDescription>
                Automated email sequences and triggers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-brand-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-brand-text-primary">Welcome Series</div>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <p className="text-sm text-brand-text-secondary">
                    Automatic welcome email sent to new Button users
                  </p>
                </div>

                <div className="p-4 border border-brand-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-brand-text-primary">Event Reminders</div>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <p className="text-sm text-brand-text-secondary">
                    Automated reminders for registered events
                  </p>
                </div>

                <div className="p-4 border border-brand-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-brand-text-primary">Donation Thank You</div>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <p className="text-sm text-brand-text-secondary">
                    Automatic thank you emails for donations
                  </p>
                </div>

                <div className="p-4 border border-brand-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-brand-text-primary">Engagement Re-activation</div>
                    <Badge className="bg-gray-500/20 text-gray-400">Planned</Badge>
                  </div>
                  <p className="text-sm text-brand-text-secondary">
                    Re-engage inactive users after 30 days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Email Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-brand-charcoal/50 rounded-lg">
                    <div className="text-sm text-brand-text-secondary">Total Sent</div>
                    <div className="text-2xl font-bold text-brand-text-primary">
                      {stats.emails_sent?.toLocaleString() || '0'}
                    </div>
                  </div>
                  <div className="p-4 bg-brand-charcoal/50 rounded-lg">
                    <div className="text-sm text-brand-text-secondary">Avg. Open Rate</div>
                    <div className="text-2xl font-bold text-brand-text-primary">
                      {stats.avg_open_rate ? `${(stats.avg_open_rate * 100).toFixed(1)}%` : '0%'}
                    </div>
                  </div>
                  <div className="p-4 bg-brand-charcoal/50 rounded-lg">
                    <div className="text-sm text-brand-text-secondary">Avg. Click Rate</div>
                    <div className="text-2xl font-bold text-brand-text-primary">
                      {stats.avg_click_rate ? `${(stats.avg_click_rate * 100).toFixed(1)}%` : '0%'}
                    </div>
                  </div>
                  <div className="p-4 bg-brand-charcoal/50 rounded-lg">
                    <div className="text-sm text-brand-text-secondary">Unsubscribes</div>
                    <div className="text-2xl font-bold text-brand-text-primary">
                      {stats.unsubscribes || '0'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-brand-text-secondary">Loading analytics...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}