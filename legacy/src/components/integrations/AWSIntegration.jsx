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
  ExternalLink, Database, HardDrive, Zap, 
  Shield, Activity, BarChart3, Key, Lock
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function AWSIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const [awsConfig, setAwsConfig] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'ca-central-1'
  });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `AWS ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter AWS Access Key ID and Secret Access Key.",
      });
      return;
    }

    setConnectionStatus({ connected: false, loading: true });
    
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "AWS Connection",
        description: "Connection test coming soon. AWS SDK integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-orange-950/20 to-yellow-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-orange-400" />
            Amazon Web Services (AWS) Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            AWS provides cloud infrastructure for Curling Canada. This integration manages S3 storage, 
            Lambda functions, CloudWatch monitoring, and other AWS services for scalable operations.
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

            <div className="space-y-3">
              <div>
                <Label htmlFor="accessKeyId" className="text-sm text-brand-text-secondary">
                  AWS Access Key ID
                </Label>
                <Input
                  id="accessKeyId"
                  value={awsConfig.accessKeyId}
                  onChange={(e) => setAwsConfig({...awsConfig, accessKeyId: e.target.value})}
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Found in AWS Console → IAM → Users → Security credentials
                </p>
              </div>
              
              <div>
                <Label htmlFor="secretAccessKey" className="text-sm text-brand-text-secondary">
                  AWS Secret Access Key
                </Label>
                <Input
                  id="secretAccessKey"
                  type="password"
                  value={awsConfig.secretAccessKey}
                  onChange={(e) => setAwsConfig({...awsConfig, secretAccessKey: e.target.value})}
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="region" className="text-sm text-brand-text-secondary">
                  AWS Region
                </Label>
                <Input
                  id="region"
                  value={awsConfig.region}
                  onChange={(e) => setAwsConfig({...awsConfig, region: e.target.value})}
                  placeholder="ca-central-1"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-brand-text-secondary mt-1">
                  Default: ca-central-1 (Canada Central)
                </p>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
              disabled={connectionStatus.loading}
              className="w-full mt-3"
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
              <strong>Integration In Development:</strong> AWS SDK integration is currently being built. 
              S3, Lambda, and CloudWatch integration coming soon.
            </AlertDescription>
          </Alert>

          <Alert className="border-orange-500/50 bg-orange-500/10">
            <Lock className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-200">
              <strong>Security Best Practice:</strong> Use IAM roles with minimal permissions. 
              Store credentials in environment variables, never in code.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* AWS Services */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>AWS Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="s3" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="s3">
                <HardDrive className="w-4 h-4 mr-2" />
                S3 Storage
              </TabsTrigger>
              <TabsTrigger value="lambda">
                <Zap className="w-4 h-4 mr-2" />
                Lambda
              </TabsTrigger>
              <TabsTrigger value="cloudwatch">
                <Activity className="w-4 h-4 mr-2" />
                CloudWatch
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* S3 Storage */}
            <TabsContent value="s3" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <h4 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-orange-400" />
                  Amazon S3 (Simple Storage Service)
                </h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  S3 provides scalable object storage for files, backups, media assets, and data lakes.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="text-xs text-brand-text-secondary">Buckets</div>
                    <div className="text-2xl font-bold text-brand-text-primary">--</div>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="text-xs text-brand-text-secondary">Total Storage</div>
                    <div className="text-2xl font-bold text-brand-text-primary">-- GB</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-brand-text-primary">Common Use Cases:</h5>
                  <ul className="text-sm text-brand-text-secondary space-y-1 list-disc list-inside">
                    <li>Media asset storage (photos, videos)</li>
                    <li>Backup and archival</li>
                    <li>Static website hosting</li>
                    <li>Data lake for analytics</li>
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSync('S3')}
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> List Buckets</>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Lambda Functions */}
            <TabsContent value="lambda" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <h4 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  AWS Lambda
                </h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Serverless compute service for running code without provisioning servers.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="text-xs text-brand-text-secondary">Functions</div>
                    <div className="text-2xl font-bold text-brand-text-primary">--</div>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="text-xs text-brand-text-secondary">Invocations (24h)</div>
                    <div className="text-2xl font-bold text-brand-text-primary">--</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-brand-text-primary">Common Use Cases:</h5>
                  <ul className="text-sm text-brand-text-secondary space-y-1 list-disc list-inside">
                    <li>Image processing and resizing</li>
                    <li>Scheduled data processing</li>
                    <li>API backend services</li>
                    <li>Event-driven workflows</li>
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSync('Lambda')}
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> List Functions</>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* CloudWatch Monitoring */}
            <TabsContent value="cloudwatch" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <h4 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-400" />
                  Amazon CloudWatch
                </h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Monitoring and observability service for AWS resources and applications.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="text-xs text-brand-text-secondary">Alarms</div>
                    <div className="text-2xl font-bold text-brand-text-primary">--</div>
                  </div>
                  <div className="p-3 bg-brand-card-bg rounded border border-brand-border">
                    <div className="text-xs text-brand-text-secondary">Log Groups</div>
                    <div className="text-2xl font-bold text-brand-text-primary">--</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-brand-text-primary">Monitoring:</h5>
                  <ul className="text-sm text-brand-text-secondary space-y-1 list-disc list-inside">
                    <li>Application logs and metrics</li>
                    <li>Infrastructure health</li>
                    <li>Performance dashboards</li>
                    <li>Automated alerts</li>
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSync('CloudWatch')}
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><BarChart3 className="w-4 h-4 mr-2" /> View Metrics</>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <h4 className="font-medium text-brand-text-primary mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  IAM & Security
                </h4>
                <p className="text-sm text-brand-text-secondary mb-4">
                  Identity and Access Management for secure AWS resource access.
                </p>

                <div className="space-y-3">
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-200 text-sm">
                      <strong>Best Practices:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                        <li>Use IAM roles instead of access keys when possible</li>
                        <li>Enable MFA for root and admin accounts</li>
                        <li>Follow principle of least privilege</li>
                        <li>Rotate access keys regularly</li>
                        <li>Use AWS Secrets Manager for sensitive data</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open('https://console.aws.amazon.com/iam/', '_blank')}
                  className="w-full mt-4"
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Open IAM Console
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Services */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Other AWS Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <h5 className="font-medium text-brand-text-primary mb-2">RDS (Relational Database)</h5>
              <p className="text-sm text-brand-text-secondary">
                Managed PostgreSQL, MySQL, or other relational databases
              </p>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <h5 className="font-medium text-brand-text-primary mb-2">CloudFront (CDN)</h5>
              <p className="text-sm text-brand-text-secondary">
                Content delivery network for fast global distribution
              </p>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <h5 className="font-medium text-brand-text-primary mb-2">SES (Email Service)</h5>
              <p className="text-sm text-brand-text-secondary">
                Scalable email sending and receiving service
              </p>
            </div>

            <div className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
              <h5 className="font-medium text-brand-text-primary mb-2">SNS (Notifications)</h5>
              <p className="text-sm text-brand-text-secondary">
                Push notifications and pub/sub messaging
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>AWS Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('https://docs.aws.amazon.com/', '_blank')}
            className="w-full justify-start"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            AWS Documentation
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('https://aws.amazon.com/sdk-for-javascript/', '_blank')}
            className="w-full justify-start"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            AWS SDK for JavaScript
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('https://console.aws.amazon.com/', '_blank')}
            className="w-full justify-start"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            AWS Management Console
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}