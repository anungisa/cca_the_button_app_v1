
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileSignature, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  Database, FileText, Clock, 
  Send, CheckSquare, Users, BarChart3, Key, Layers, Webhook
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function DocuSignIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [docuSignConfig, setDocuSignConfig] = useState({
    accountId: '',
    integrationKey: '',
    secretKey: ''
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `DocuSign ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!docuSignConfig.accountId || !docuSignConfig.integrationKey) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter DocuSign Account ID and Integration Key.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "DocuSign Connection",
        description: "Connection test coming soon. DocuSign eSignature API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-blue-400" />
            DocuSign eSignature Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            DocuSign manages electronic signatures for sponsor contracts, vendor agreements, HR documents, 
            and governance policies. This integration tracks signature status and automates contract workflows.
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
                <Label htmlFor="accountId" className="text-sm text-brand-text-secondary">
                  DocuSign Account ID
                </Label>
                <Input
                  id="accountId"
                  value={docuSignConfig.accountId}
                  onChange={(e) => setDocuSignConfig({...docuSignConfig, accountId: e.target.value})}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in DocuSign Admin → Integrations → API and Keys
                </p>
              </div>
              
              <div>
                <Label htmlFor="integrationKey" className="text-sm text-brand-text-secondary">
                  Integration Key (Client ID)
                </Label>
                <Input
                  id="integrationKey"
                  value={docuSignConfig.integrationKey}
                  onChange={(e) => setDocuSignConfig({...docuSignConfig, integrationKey: e.target.value})}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="secretKey" className="text-sm text-brand-text-secondary">
                  Secret Key
                </Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={docuSignConfig.secretKey}
                  onChange={(e) => setDocuSignConfig({...docuSignConfig, secretKey: e.target.value})}
                  placeholder="••••••••••••••••••••••••••••"
                  className="mt-1"
                />
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
              <strong>OAuth Setup:</strong> DocuSign uses OAuth 2.0 with JWT authentication. 
              You'll need to configure redirect URIs and generate an RSA keypair in DocuSign Admin.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Document Management */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Document Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contracts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="contracts">
                <FileText className="w-4 h-4 mr-2" />
                Contracts
              </TabsTrigger>
              <TabsTrigger value="envelopes">
                <Send className="w-4 h-4 mr-2" />
                Envelopes
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Layers className="w-4 h-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contracts" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Contract Types</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Sponsor Contracts</span>
                      <Badge className="bg-gray-500/20 text-gray-400">0 Pending</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-3">
                      Partnership agreements and sponsorship deals
                    </p>
                    <Button size="sm" onClick={() => handleSync('sponsor-contracts')} disabled={isSyncing} className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Contracts
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Vendor Agreements</span>
                      <Badge className="bg-gray-500/20 text-gray-400">0 Pending</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-3">
                      Service agreements and purchase orders
                    </p>
                    <Button size="sm" onClick={() => handleSync('vendor-contracts')} disabled={isSyncing} className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Agreements
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">HR Documents</span>
                      <Badge className="bg-gray-500/20 text-gray-400">0 Pending</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-3">
                      Employment contracts and policy acknowledgments
                    </p>
                    <Button size="sm" onClick={() => handleSync('hr-docs')} disabled={isSyncing} className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Documents
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Governance Policies</span>
                      <Badge className="bg-gray-500/20 text-gray-400">0 Pending</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-3">
                      Board resolutions and policy approvals
                    </p>
                    <Button size="sm" onClick={() => handleSync('governance-docs')} disabled={isSyncing} className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Policies
                    </Button>
                  </div>
                </div>
              </div>

              <Alert>
                <FileSignature className="h-4 w-4" />
                <AlertDescription>
                  <strong>Auto-Sync:</strong> DocuSign envelope status automatically syncs to The Button. 
                  Contract records update when signatures are completed.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="envelopes" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Envelope Status Tracking</h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Sent Envelopes</span>
                      <Badge className="bg-blue-500/20 text-blue-400">0 Active</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-3">
                      Documents sent for signature, awaiting completion
                    </p>
                    <div className="text-xs bg-brand-charcoal/50 p-2 rounded mb-2">
                      <strong className="text-brand-text-primary">Status Types:</strong>
                      <div className="mt-1 space-y-1 text-brand-text-secondary">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-yellow-400" />
                          <span>Sent (awaiting signatures)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-blue-400" />
                          <span>Partially Signed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-3 h-3 text-green-400" />
                          <span>Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          <span>Declined/Voided</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleSync('envelopes')} disabled={isSyncing} className="w-full">
                      {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Sync Envelope Status
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-brand-text-primary">Webhooks</span>
                      <Badge className="bg-gray-500/20 text-gray-400">Not Configured</Badge>
                    </div>
                    <p className="text-xs text-brand-text-secondary mb-3">
                      Real-time notifications when signatures are completed
                    </p>
                    <div className="text-xs bg-brand-charcoal/50 p-2 rounded mb-2">
                      <strong className="text-brand-text-primary">Webhook Events:</strong>
                      <div className="mt-1 space-y-1 text-brand-text-secondary font-mono">
                        <div>• envelope-sent</div>
                        <div>• recipient-completed</div>
                        <div>• envelope-completed</div>
                        <div>• envelope-declined</div>
                        <div>• envelope-voided</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleSync('webhooks')} disabled={isSyncing} className="w-full">
                      <Webhook className="w-4 h-4 mr-2" />
                      Configure Webhooks
                    </Button>
                  </div>
                </div>
              </div>

              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200">
                  <strong>Auto-Update:</strong> When a DocuSign envelope is completed, The Button automatically updates 
                  the corresponding SponsorContract, VendorContract, or HRDocument record with the signed file URL.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Document Templates</h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Pre-configured DocuSign templates for common contract types. 
                  Templates can be launched directly from The Button with auto-populated fields.
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Sponsorship Templates</h5>
                    <ul className="text-xs text-brand-text-secondary space-y-1 mb-3">
                      <li>• National Partner Agreement</li>
                      <li>• Presenting Sponsor Contract</li>
                      <li>• Supporting Sponsor Agreement</li>
                      <li>• Official Supplier Contract</li>
                      <li>• Event-Specific Partnership</li>
                    </ul>
                    <Button size="sm" variant="outline" onClick={() => handleSync('sponsor-templates')} disabled={isSyncing} className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Templates
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Vendor Templates</h5>
                    <ul className="text-xs text-brand-text-secondary space-y-1 mb-3">
                      <li>• Service Agreement</li>
                      <li>• Purchase Order</li>
                      <li>• Consulting Agreement</li>
                      <li>• Venue Rental Contract</li>
                      <li>• Software License Agreement</li>
                    </ul>
                    <Button size="sm" variant="outline" onClick={() => handleSync('vendor-templates')} disabled={isSyncing} className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Templates
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">HR Templates</h5>
                    <ul className="text-xs text-brand-text-secondary space-y-1 mb-3">
                      <li>• Employment Offer Letter</li>
                      <li>• Employment Agreement</li>
                      <li>• Policy Acknowledgment</li>
                      <li>• Confidentiality Agreement</li>
                      <li>• Contractor Agreement</li>
                    </ul>
                    <Button size="sm" variant="outline" onClick={() => handleSync('hr-templates')} disabled={isSyncing} className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Templates
                    </Button>
                  </div>

                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <h5 className="text-sm font-medium text-brand-text-primary mb-2">Governance Templates</h5>
                    <ul className="text-xs text-brand-text-secondary space-y-1 mb-3">
                      <li>• Board Resolution</li>
                      <li>• Policy Approval</li>
                      <li>• Conflict of Interest Declaration</li>
                      <li>• Meeting Minutes Approval</li>
                      <li>• Strategic Plan Endorsement</li>
                    </ul>
                    <Button size="sm" variant="outline" onClick={() => handleSync('governance-templates')} disabled={isSyncing} className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Templates
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <h5 className="text-sm font-medium text-brand-text-primary mb-2">Smart Field Mapping</h5>
                <p className="text-xs text-brand-text-secondary mb-2">
                  Automatically populate DocuSign templates with data from The Button entities:
                </p>
                <div className="text-xs space-y-1 text-brand-text-secondary">
                  <div>• <strong>Sponsor Name</strong> → from SponsorDeal.company_name</div>
                  <div>• <strong>Contract Value</strong> → from SponsorDeal.deal_value</div>
                  <div>• <strong>Start/End Dates</strong> → from SponsorContract dates</div>
                  <div>• <strong>Deliverables</strong> → from SponsorContract.deliverables</div>
                  <div>• <strong>Signing Authority</strong> → from User.full_name (role: executive)</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Signature Analytics</h4>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-brand-card-bg rounded-lg">
                    <div className="text-2xl font-bold text-brand-text-primary">--</div>
                    <div className="text-xs text-brand-text-secondary">Sent This Month</div>
                  </div>
                  <div className="text-center p-4 bg-brand-card-bg rounded-lg">
                    <div className="text-2xl font-bold text-brand-text-primary">--</div>
                    <div className="text-xs text-brand-text-secondary">Completed This Month</div>
                  </div>
                  <div className="text-center p-4 bg-brand-card-bg rounded-lg">
                    <div className="text-2xl font-bold text-brand-text-primary">--</div>
                    <div className="text-xs text-brand-text-secondary">Avg. Days to Complete</div>
                  </div>
                </div>

                <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                  <h5 className="text-sm font-medium text-brand-text-primary mb-2">Completion Trends</h5>
                  <p className="text-xs text-brand-text-secondary mb-2">
                    Track time-to-signature and identify bottlenecks in your contract workflows
                  </p>
                  <Button size="sm" variant="outline" onClick={() => handleSync('analytics')} disabled={isSyncing} className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Benefits */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg">
              <h5 className="text-sm font-semibold text-green-400 mb-2">Automated Workflows</h5>
              <p className="text-xs text-brand-text-secondary">
                Launch signature requests directly from sponsor deals, vendor contracts, or HR records in The Button
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h5 className="text-sm font-semibold text-blue-400 mb-2">Real-Time Updates</h5>
              <p className="text-xs text-brand-text-secondary">
                Webhooks notify The Button immediately when signatures are completed, updating contract status
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <h5 className="text-sm font-semibold text-purple-400 mb-2">Compliance Tracking</h5>
              <p className="text-xs text-brand-text-secondary">
                Audit trail of all signature activities, ensuring compliance and record-keeping
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
        <AlertDescription className="text-yellow-200">
          <strong>Integration In Development:</strong> DocuSign API integration is currently being built. 
          Template launching, webhook handling, and status syncing coming soon.
        </AlertDescription>
      </Alert>
    </div>
  );
}
