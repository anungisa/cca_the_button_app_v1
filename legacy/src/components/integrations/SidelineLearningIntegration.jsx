import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, Award, Users, 
  FileText, Clock, BarChart3, AlertCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function SidelineLearningIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Sideline Learning ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Sideline Learning Integration",
        description: "Connection setup coming soon. Sideline Learning API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-green-950/20 to-teal-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-400" />
            Sideline Learning Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Sideline Learning provides Safe Sport training for Curling Canada. This integration syncs training 
            completion status, certificates, and compliance data for coaches, officials, and volunteers.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-green-400" />
              ) : connectionStatus.connected ? (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400">Not Connected</Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
              disabled={connectionStatus.loading}
              className="w-full"
            >
              {connectionStatus.loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing Connection...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Test Connection</>
              )}
            </Button>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> Sideline Learning API integration is currently being built. 
              Training completion sync, certificate management, and compliance tracking coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Safe Sport Training</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="training" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="training">
                <FileText className="w-4 h-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="compliance">
                <Shield className="w-4 h-4 mr-2" />
                Compliance
              </TabsTrigger>
              <TabsTrigger value="reporting">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reporting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="training" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  Training Modules
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Respect in Sport (RIS)</div>
                      <div>Activity Leaders and Coaches certification courses</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Concussion Awareness</div>
                      <div>Required concussion training for all coaches</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Making Ethical Decisions (MED)</div>
                      <div>Ethics training for officials and administrators</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Training')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Training Data</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  User Training Status
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Coaches</div>
                      <div>Track RIS and concussion training completion for all coaches</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Officials</div>
                      <div>Monitor training status for curling officials</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Volunteers</div>
                      <div>Track volunteer training requirements</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Staff</div>
                      <div>Ensure all staff complete required Safe Sport training</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('User')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync User Status</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  Compliance Tracking
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Certificate Expiry</div>
                      <div>Monitor training expiry dates (typically every 5 years)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Renewal Reminders</div>
                      <div>Automatic notifications before certification expires</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Sport Canada Requirements</div>
                      <div>Ensure compliance with federal Safe Sport requirements</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Compliance')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Compliance</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reporting" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  Compliance Reporting
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">MA Compliance Rates</div>
                      <div>Track Safe Sport training completion by region</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Club-Level Reports</div>
                      <div>Monitor training status at individual clubs</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Grant Reporting</div>
                      <div>Generate compliance reports for Sport Canada and funding applications</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Report')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Reports</>
                  )}
                </Button>
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
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-green-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Automated Compliance Tracking</h4>
              <p className="text-sm text-brand-text-secondary">
                Automatically update Safe Sport status on user profiles in The Button
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <Award className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Digital Certificates</h4>
              <p className="text-sm text-brand-text-secondary">
                Store and display Safe Sport certificates on user profiles
              </p>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Proactive Renewal Notifications</h4>
              <p className="text-sm text-brand-text-secondary">
                Alert coaches before their RIS certification expires
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Compliance Dashboards</h4>
              <p className="text-sm text-brand-text-secondary">
                Real-time compliance reporting for Safe Sport leadership
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Link */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => window.open('https://www.sidelinelearning.com', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Sideline Learning
        </Button>
      </div>
    </div>
  );
}