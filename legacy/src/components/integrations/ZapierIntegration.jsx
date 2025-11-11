import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Workflow, ArrowRight, 
  Clock, BarChart3, Code
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function ZapierIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleConnect = async () => {
    toast({
      title: "Coming Soon",
      description: "Zapier OAuth connection coming soon.",
    });
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Zapier Connection",
        description: "Connection test coming soon. Zapier webhook integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-orange-950/20 to-amber-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-400" />
            Zapier Workflow Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Zapier enables no-code workflow automation by connecting The Button with 5,000+ apps. 
            Create automated workflows (Zaps) to sync data, trigger actions, and streamline operations.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleConnect}
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Connect Zapier Account
            </Button>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> Zapier webhook triggers, actions, 
              and pre-built Zap templates coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Example Workflows */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Example Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="triggers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="triggers">
                <Workflow className="w-4 h-4 mr-2" />
                Triggers
              </TabsTrigger>
              <TabsTrigger value="actions">
                <ArrowRight className="w-4 h-4 mr-2" />
                Actions
              </TabsTrigger>
              <TabsTrigger value="zaps">
                <Zap className="w-4 h-4 mr-2" />
                Popular Zaps
              </TabsTrigger>
            </TabsList>

            <TabsContent value="triggers" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Available Triggers</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  These events in The Button can trigger Zaps in other apps:
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-brand-text-primary text-sm">New User Registered</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">When a new user signs up for The Button</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-brand-text-primary text-sm">New Event Created</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">When a new curling event is created</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-brand-text-primary text-sm">Form Submitted</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">When a form is submitted through The Button</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-brand-text-primary text-sm">New Donation Received</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">When a FTLOC donation is made</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-brand-text-primary text-sm">New Incident Created</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">When a new case is created in Incident Management</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Available Actions</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  These actions can be triggered in The Button from other apps:
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-brand-text-primary text-sm">Create Event</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">Add a new event to The Button calendar</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-brand-text-primary text-sm">Add Entity Record</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">Create a new record in any entity</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-brand-text-primary text-sm">Send Notification</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">Send a notification to a user</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-brand-text-primary text-sm">Award XP Points</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">Grant XP to a user in the loyalty program</p>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-brand-text-primary text-sm">Create Incident</span>
                    </div>
                    <p className="text-xs text-brand-text-secondary">Create a new case in Incident Management</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="zaps" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3">Popular Zap Templates</h4>
                <p className="text-sm text-brand-text-secondary mb-3">
                  Pre-built workflows to get you started:
                </p>
                <div className="space-y-3">
                  <div className="p-4 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-text-primary text-sm">Slack → The Button</p>
                        <p className="text-xs text-brand-text-secondary">Create event from Slack message</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">Trigger: New Message</Badge>
                      <Badge variant="outline" className="text-xs">Action: Create Event</Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-text-primary text-sm">The Button → Google Sheets</p>
                        <p className="text-xs text-brand-text-secondary">Add form submissions to spreadsheet</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">Trigger: Form Submitted</Badge>
                      <Badge variant="outline" className="text-xs">Action: Add Row</Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-text-primary text-sm">Stripe → The Button</p>
                        <p className="text-xs text-brand-text-secondary">Award XP when payment succeeds</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">Trigger: Payment Success</Badge>
                      <Badge variant="outline" className="text-xs">Action: Award XP</Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-card-bg rounded border border-brand-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-text-primary text-sm">The Button → Mailchimp</p>
                        <p className="text-xs text-brand-text-secondary">Add new users to email list</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">Trigger: New User</Badge>
                      <Badge variant="outline" className="text-xs">Action: Add Subscriber</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Features */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Workflow className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">No-Code Automation</h5>
                <p className="text-xs text-brand-text-secondary">
                  Build workflows without writing code using Zapier's visual editor
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Real-Time Sync</h5>
                <p className="text-xs text-brand-text-secondary">
                  Instant webhooks trigger Zaps as soon as events happen in The Button
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <Code className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Custom Code Steps</h5>
                <p className="text-xs text-brand-text-secondary">
                  Add JavaScript code steps for advanced data transformations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-brand-charcoal/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-brand-text-primary mb-1">Zap Analytics</h5>
                <p className="text-xs text-brand-text-secondary">
                  Monitor Zap execution, success rates, and troubleshoot failures
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Integration Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Connect Your Zapier Account</h5>
              <p className="text-sm text-brand-text-secondary">
                Authorize Zapier to access The Button API to create and trigger Zaps
              </p>
              <a 
                href="https://zapier.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1 mt-1"
              >
                Open Zapier
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">Base44 App in Zapier</h5>
              <p className="text-sm text-brand-text-secondary">
                Search for "Base44" or "The Button" in Zapier to find our app and pre-built templates
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Workflow className="w-5 h-5 text-brand-text-secondary mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-text-primary mb-1">5,000+ App Integrations</h5>
              <p className="text-sm text-brand-text-secondary">
                Connect The Button to Gmail, Slack, Google Sheets, Stripe, and thousands more apps
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}