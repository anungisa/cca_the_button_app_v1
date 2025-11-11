import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, TrendingUp, DollarSign, 
  Target, BarChart3, AlertCircle, Calendar
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function BudgytIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: false });
  const { toast } = useToast();

  const handleSync = async (syncType) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `Budgyt ${syncType} sync is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const testConnection = async () => {
    setConnectionStatus({ connected: false, loading: true });
    setTimeout(() => {
      setConnectionStatus({ connected: false, loading: false });
      toast({
        title: "Budgyt Integration",
        description: "Connection setup coming soon. Budgyt API integration in development.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-cyan-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-6 h-6 text-cyan-400" />
            Budgyt Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Budgyt is Curling Canada's collaborative budgeting and forecasting platform. This integration syncs 
            budget data, tracks departmental spending, and provides real-time variance analysis.
          </p>

          {/* Connection Status */}
          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span className="font-medium text-brand-text-primary">Connection Status</span>
              </div>
              {connectionStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
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
              <strong>Integration In Development:</strong> Budgyt API integration is currently being built. 
              Budget sync, variance tracking, and forecasting integration coming soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Sync Categories */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Budget Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="budgets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="budgets">
                <PieChart className="w-4 h-4 mr-2" />
                Budgets
              </TabsTrigger>
              <TabsTrigger value="forecasts">
                <TrendingUp className="w-4 h-4 mr-2" />
                Forecasts
              </TabsTrigger>
              <TabsTrigger value="variance">
                <BarChart3 className="w-4 h-4 mr-2" />
                Variance
              </TabsTrigger>
              <TabsTrigger value="reports">
                <Target className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="budgets" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-cyan-400" />
                  Budget Sync
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Departmental Budgets</div>
                      <div>Sync budget allocations for all departments and programs</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Project Budgets</div>
                      <div>Track budgets for specific events and initiatives</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Multi-Year Planning</div>
                      <div>Import strategic budget plans for multi-year cycles</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Budget')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Budgets</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="forecasts" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Forecast Management
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Revenue Forecasts</div>
                      <div>Track projected revenue from memberships, events, and sponsorships</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Expense Forecasts</div>
                      <div>Monitor projected expenses and adjust in real-time</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Scenario Planning</div>
                      <div>Import multiple forecast scenarios for planning</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Forecast')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Forecasts</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="variance" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  Variance Analysis
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Budget vs. Actual</div>
                      <div>Compare actual spending against budgeted amounts</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Over-Budget Alerts</div>
                      <div>Automatic notifications when departments exceed budget thresholds</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Trend Analysis</div>
                      <div>Track spending trends and identify patterns</div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSync('Variance')} 
                  disabled={isSyncing}
                  className="w-full mt-4"
                >
                  {isSyncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Sync Variance Data</>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4 mt-4">
              <div className="p-4 bg-brand-charcoal/30 rounded-lg">
                <h4 className="font-medium text-brand-text-primary mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Budget Reports
                </h4>
                <div className="space-y-3 text-sm text-brand-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Executive Dashboards</div>
                      <div>High-level budget summaries for leadership</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Department Reports</div>
                      <div>Detailed spending reports for each department</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-brand-text-primary">Board Reporting</div>
                      <div>Quarterly financial reports for board meetings</div>
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
            <div className="p-4 bg-cyan-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-cyan-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Real-Time Budget Tracking</h4>
              <p className="text-sm text-brand-text-secondary">
                Connect QuickBooks actuals with Budgyt plans for live budget monitoring
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Executive Visibility</h4>
              <p className="text-sm text-brand-text-secondary">
                Leadership gets real-time dashboards of budget performance across the organization
              </p>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Proactive Alerts</h4>
              <p className="text-sm text-brand-text-secondary">
                Automatic notifications when budgets approach or exceed thresholds
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-medium text-brand-text-primary mb-1">Multi-Year Planning</h4>
              <p className="text-sm text-brand-text-secondary">
                Support strategic planning with multi-year budget scenarios
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Link */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => window.open('https://www.budgyt.com', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Budgyt
        </Button>
      </div>
    </div>
  );
}