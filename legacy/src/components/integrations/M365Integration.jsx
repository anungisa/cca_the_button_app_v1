import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, FileText, FolderOpen, 
  MessageSquare, Video, Calendar, Users, Lock, Key
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function M365Integration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [m365Config, setM365Config] = useState({
    tenantId: '',
    clientId: '',
    clientSecret: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Microsoft 365 ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!m365Config.tenantId || !m365Config.clientId || !m365Config.clientSecret) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter all Microsoft 365 credentials.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Microsoft 365 Connection",
        description: "Connection test coming soon. Microsoft Graph API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-cyan-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-blue-400" />
            Microsoft 365 Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Connect The Button with Microsoft 365 to integrate SharePoint document libraries, 
            OneDrive file storage, Teams channels, and Outlook calendars for seamless collaboration.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="tenantId" className="text-sm text-brand-text-secondary">
                  Tenant ID (Directory ID)
                </Label>
                <Input
                  id="tenantId"
                  value={m365Config.tenantId}
                  onChange={(e) => setM365Config({...m365Config, tenantId: e.target.value})}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in Azure Portal → Azure Active Directory → Overview
                </p>
              </div>
              
              <div>
                <Label htmlFor="clientId" className="text-sm text-brand-text-secondary">
                  Application (Client) ID
                </Label>
                <Input
                  id="clientId"
                  value={m365Config.clientId}
                  onChange={(e) => setM365Config({...m365Config, clientId: e.target.value})}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in Azure Portal → App Registrations → Your App
                </p>
              </div>

              <div>
                <Label htmlFor="clientSecret" className="text-sm text-brand-text-secondary">
                  Client Secret
                </Label>
                <Input
                  id="clientSecret"
                  type="password"
                  value={m365Config.clientSecret}
                  onChange={(e) => setM365Config({...m365Config, clientSecret: e.target.value})}
                  placeholder="••••••••••••••••••••••••••••"
                  className="mt-1"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Generated in Azure Portal → App Registrations → Certificates & secrets
                </p>
              </div>

              <Button 
                onClick={testConnection}
                disabled={connectionStatus.loading}
                className="w-full"
              >
                {connectionStatus.loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing Connection...</>
                ) : (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Test Connection</>
                )}
              </Button>
            </div>
          </div>

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Key className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <strong>Azure AD Setup Required:</strong> Register an application in Azure Portal and grant Microsoft Graph API permissions 
              (Files.ReadWrite.All, Sites.ReadWrite.All, Calendars.ReadWrite, Team.ReadBasic.All).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Integration Features */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>M365 Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sharepoint" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="sharepoint">
                <FolderOpen className="w-4 h-4 mr-2" />
                SharePoint
              </TabsTrigger>
              <TabsTrigger value="onedrive">
                <Cloud className="w-4 h-4 mr-2" />
                OneDrive
              </TabsTrigger>
              <TabsTrigger value="teams">
                <MessageSquare className="w-4 h-4 mr-2" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="outlook">
                <Calendar className="w-4 h-4 mr-2" />
                Outlook
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <Lock className="w-4 h-4 mr-2" />
                Permissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sharepoint" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">SharePoint Integration</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Connect to SharePoint document libraries to store and manage files for incidents, 
                  event planning, policies, and other organizational documents.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Document Libraries</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-3">
                      Sync files from SharePoint libraries to The Button entities
                    </p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="text-xs">
                        <Label className="text-brand-text-secondary">SharePoint Site URL</Label>
                        <Input 
                          placeholder="https://curlingcanada.sharepoint.com/sites/TheButton"
                          className="mt-1 text-xs"
                        />
                      </div>
                      <div className="text-xs">
                        <Label className="text-brand-text-secondary">Document Library Name</Label>
                        <Input 
                          placeholder="Shared Documents"
                          className="mt-1 text-xs"
                        />
                      </div>
                    </div>
                    
                    <Button size="sm" onClick={() => handleSync('sharepoint-docs')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Configure Library
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Folder Structure</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Suggested folder structure for The Button integration:
                    </p>
                    <div className="text-xs font-mono bg-brand-charcoal/50 p-2 rounded space-y-1">
                      <div>📁 Incidents/</div>
                      <div className="ml-4">📁 Safe Sport/</div>
                      <div className="ml-4">📁 Operational/</div>
                      <div>📁 Event Planning/</div>
                      <div className="ml-4">📁 Templates/</div>
                      <div className="ml-4">📁 Active Events/</div>
                      <div>📁 Policies/</div>
                      <div className="ml-4">📁 Governance/</div>
                      <div className="ml-4">📁 Safe Sport/</div>
                      <div>📁 HR Documents/</div>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Use Cases</h5>
                    <ul className="text-xs text-brand-text-secondary space-y-1">
                      <li>• Store incident case files and attachments</li>
                      <li>• Manage event planning documents and templates</li>
                      <li>• Archive governance policies and meeting minutes</li>
                      <li>• Share HR documents securely with staff</li>
                      <li>• Collaborate on sponsor contracts and proposals</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Files uploaded in The Button can be automatically saved to SharePoint with proper metadata and folder organization.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="onedrive" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">OneDrive for Business</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Enable staff to access and manage their OneDrive files directly from The Button, 
                  with automatic file backup and version control.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Personal Storage</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Connect staff OneDrive accounts for personal file management
                    </p>
                    <Button size="sm" onClick={() => handleSync('onedrive')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Enable OneDrive Access
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Features</h5>
                    <ul className="text-xs text-brand-text-secondary space-y-1">
                      <li>• Upload files from The Button to OneDrive</li>
                      <li>• Share files with colleagues</li>
                      <li>• Version history and recovery</li>
                      <li>• Automatic backup of work documents</li>
                      <li>• Sync across devices</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-1">File Picker</h5>
                    <p className="text-xs text-brand-text-secondary">
                      Microsoft Graph File Picker can be embedded to let users browse and select files from OneDrive 
                      when attaching documents to incidents, tasks, or other records.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Microsoft Teams Integration</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Send notifications to Teams channels, create meetings, and enable team collaboration 
                  directly from The Button workflows.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Channel Notifications</span>
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Send automated notifications to Teams channels (already implemented via webhook)
                    </p>
                    <div className="text-xs bg-brand-charcoal/50 p-2 rounded mb-2">
                      <strong className="text-brand-text-primary">Current Channels:</strong>
                      <div className="mt-1 space-y-1 text-brand-text-secondary">
                        <div>• General</div>
                        <div>• Safe Sport</div>
                        <div>• Event Operations</div>
                        <div>• Finance</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleSync('teams-channels')} disabled={isSyncing} className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Manage Channels
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Meeting Creation</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Coming Soon</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Create Teams meetings directly from events, incidents, or governance meetings
                    </p>
                    <Button size="sm" onClick={() => handleSync('teams-meetings')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Video className="w-4 h-4 mr-2" />}
                      Configure Meetings
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Bot Integration</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Coming Soon</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Add The Button bot to Teams for quick access to data and notifications
                    </p>
                    <div className="text-xs bg-brand-charcoal/50 p-2 rounded">
                      <strong className="text-brand-text-primary">Bot Commands (Planned):</strong>
                      <div className="mt-1 space-y-1 text-brand-text-secondary font-mono">
                        <div>@TheButton incident #123</div>
                        <div>@TheButton my tasks</div>
                        <div>@TheButton club search</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-1">Adaptive Cards</h5>
                    <p className="text-xs text-brand-text-secondary">
                      Rich, interactive notifications with action buttons (approve/reject, view details, assign tasks) 
                      sent directly to Teams channels.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="outlook" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Outlook Calendar Integration</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Sync events, governance meetings, and staff schedules with Outlook calendars 
                  for seamless calendar management.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Calendar Sync</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Coming Soon</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Automatically create Outlook events when scheduling meetings or events in The Button
                    </p>
                    <Button size="sm" onClick={() => handleSync('outlook-calendar')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
                      Enable Calendar Sync
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Sync Capabilities</h5>
                    <ul className="text-xs text-brand-text-secondary space-y-1">
                      <li>• Event planning deadlines → Outlook tasks</li>
                      <li>• Governance meetings → Outlook calendar</li>
                      <li>• Staff schedules → shared calendars</li>
                      <li>• Incident response calls → meeting invites</li>
                      <li>• Training sessions → calendar events</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Email Integration</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Coming Soon</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-2">
                      Send emails from The Button using Outlook, with proper threading and tracking
                    </p>
                    <div className="text-xs bg-brand-charcoal/50 p-2 rounded">
                      <strong className="text-brand-text-primary">Use Cases:</strong>
                      <div className="mt-1 space-y-1 text-brand-text-secondary">
                        <div>• Incident notifications to stakeholders</div>
                        <div>• Event planning communication</div>
                        <div>• Policy update announcements</div>
                        <div>• Approval request emails</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Required API Permissions</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Configure these Microsoft Graph API permissions in Azure AD for full integration functionality.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Delegated Permissions (User Context)</h5>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">Files.ReadWrite.All</strong>
                          <p className="text-brand-text-secondary">Access and modify user files in OneDrive and SharePoint</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">Sites.ReadWrite.All</strong>
                          <p className="text-brand-text-secondary">Access and modify SharePoint sites and lists</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">Calendars.ReadWrite</strong>
                          <p className="text-brand-text-secondary">Create and modify calendar events</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">Mail.Send</strong>
                          <p className="text-brand-text-secondary">Send emails on behalf of users</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">User.Read</strong>
                          <p className="text-brand-text-secondary">Read user profile information</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Application Permissions (Service Context)</h5>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">Sites.ReadWrite.All</strong>
                          <p className="text-brand-text-secondary">For automated SharePoint operations (requires admin consent)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">ChannelMessage.Send</strong>
                          <p className="text-brand-text-secondary">Send messages to Teams channels (for notifications)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-brand-text-primary">OnlineMeetings.ReadWrite.All</strong>
                          <p className="text-brand-text-secondary">Create Teams meetings programmatically</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-200">
                      <strong>Admin Consent Required:</strong> Application permissions require Global Administrator consent 
                      in Azure AD. Contact your IT admin to grant these permissions.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-2">Setup Instructions</h4>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 font-bold text-blue-400">1.</span>
                    <div>
                      <strong className="text-brand-text-primary">Register App in Azure Portal</strong>
                      <p className="text-xs text-brand-text-secondary">
                        Go to Azure Portal → Azure Active Directory → App registrations → New registration
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 font-bold text-blue-400">2.</span>
                    <div>
                      <strong className="text-brand-text-primary">Configure API Permissions</strong>
                      <p className="text-xs text-brand-text-secondary">
                        Add the Microsoft Graph permissions listed above
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 font-bold text-blue-400">3.</span>
                    <div>
                      <strong className="text-brand-text-primary">Generate Client Secret</strong>
                      <p className="text-xs text-brand-text-secondary">
                        Certificates & secrets → New client secret → Copy the value
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 font-bold text-blue-400">4.</span>
                    <div>
                      <strong className="text-brand-text-primary">Grant Admin Consent</strong>
                      <p className="text-xs text-brand-text-secondary">
                        API permissions → Grant admin consent for [Your Organization]
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 font-bold text-blue-400">5.</span>
                    <div>
                      <strong className="text-brand-text-primary">Enter Credentials Above</strong>
                      <p className="text-xs text-brand-text-secondary">
                        Copy Tenant ID, Client ID, and Client Secret into the form
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Architecture & Best Practices */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-brand-charcoal/30 rounded-lg">
              <h5 className="font-medium text-brand-text-primary mb-2">Data Flow</h5>
              <div className="text-xs space-y-2 text-brand-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span>The Button → Microsoft Graph API</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>SharePoint ← Files & Metadata</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span>Teams ← Notifications & Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <span>Outlook ← Calendar Events</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg">
              <h5 className="font-medium text-brand-text-primary mb-2">Security Considerations</h5>
              <ul className="text-xs space-y-1 text-brand-text-secondary">
                <li>• OAuth 2.0 authentication with Azure AD</li>
                <li>• Encrypted credential storage</li>
                <li>• Role-based access control (RBAC)</li>
                <li>• Audit logging for all file operations</li>
                <li>• Token refresh handling</li>
                <li>• Compliance with data residency rules</li>
              </ul>
            </div>
          </div>

          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">
              <strong>Recommended Setup:</strong> Use a dedicated service account for application permissions, 
              and implement user-delegated permissions for personal file access to maintain proper attribution.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}