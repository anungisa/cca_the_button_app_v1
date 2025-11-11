import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, DollarSign, Calendar, FileText, 
  Clock, TrendingUp, Shield
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function ADPIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `ADP ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    // Simulate connection test
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "ADP Integration",
        description: "Connection setup coming soon. ADP Workforce Now API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            ADP Workforce Now Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            ADP Workforce Now manages all HR, payroll, benefits, and time tracking for Curling Canada staff. 
            This integration syncs employee data to The Button for organizational management.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
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
              <strong>Integration In Development:</strong> ADP Workforce Now API integration is currently being built. 
              OAuth authentication and data sync capabilities coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Data Sync Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employees" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="employees">
                <Users className="w-4 h-4 mr-2" />
                Employees
              </TabsTrigger>
              <TabsTrigger value="payroll">
                <DollarSign className="w-4 h-4 mr-2" />
                Payroll
              </TabsTrigger>
              <TabsTrigger value="time">
                <Clock className="w-4 h-4 mr-2" />
                Time & Attendance
              </TabsTrigger>
              <TabsTrigger value="benefits">
                <FileText className="w-4 h-4 mr-2" />
                Benefits
              </TabsTrigger>
            </TabsList>

            {/* Employee Data Tab */}
            <TabsContent value="employees" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Employee Roster Sync</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sync employee data to StaffProfile entity - job titles, departments, managers, start dates
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Organizational Structure</div>
                    <div className="text-sm text-brand-text-secondary">
                      Maintain reporting relationships and department hierarchies
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Contact Information</div>
                    <div className="text-sm text-brand-text-secondary">
                      Keep email, phone, and emergency contacts up-to-date
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Employee')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Employee Data</>
                )}
              </Button>
            </TabsContent>

            {/* Payroll Tab */}
            <TabsContent value="payroll" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Payroll Records</div>
                    <div className="text-sm text-brand-text-secondary">
                      Import payroll data for finance reconciliation and reporting
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Compensation Analytics</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track compensation trends and budget allocation
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Tax & Deductions</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sync tax withholding and deduction data for compliance
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Payroll')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Payroll Data</>
                )}
              </Button>
            </TabsContent>

            {/* Time & Attendance Tab */}
            <TabsContent value="time" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Time Tracking</div>
                    <div className="text-sm text-brand-text-secondary">
                      Import hours worked, overtime, and attendance records
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Time Off Management</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sync vacation, sick leave, and PTO balances
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Attendance Analytics</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track attendance patterns and identify trends
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Time & Attendance')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Time Data</>
                )}
              </Button>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Benefits Enrollment</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track employee benefit elections and coverage
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Benefits Costs</div>
                    <div className="text-sm text-brand-text-secondary">
                      Monitor benefits costs and employer contributions
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Open Enrollment</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track enrollment periods and employee elections
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSync('Benefits')} disabled={isSyncing} className="w-full">
                {isSyncing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Sync Benefits Data</>
                )}
              </Button>
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
              <h5 className="text-xs font-semibold text-green-400 mb-1 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Single Source of Truth
              </h5>
              <p className="text-xs text-brand-text-secondary">
                ADP remains the authoritative source for all HR data, syncing to The Button for organizational visibility
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Automated Onboarding
              </h5>
              <p className="text-xs text-brand-text-secondary">
                New employees in ADP automatically trigger onboarding workflows in The Button
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Reporting & Analytics
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Combine HR data with operational metrics for comprehensive people analytics
              </p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg">
              <h5 className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Compliance & Security
              </h5>
              <p className="text-xs text-brand-text-secondary">
                Maintain data privacy and compliance with secure, encrypted sync
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">API Version:</span>
              <span className="text-brand-text-primary font-medium">ADP Workforce Now v2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Authentication:</span>
              <span className="text-brand-text-primary font-medium">OAuth 2.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Sync Frequency:</span>
              <span className="text-brand-text-primary font-medium">Daily (automated)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Data Retention:</span>
              <span className="text-brand-text-primary font-medium">Current + 2 years historical</span>
            </div>
          </div>

          <Button variant="outline" onClick={() => window.open('https://www.adp.com', '_blank')} className="w-full mt-4">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit ADP Workforce Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}