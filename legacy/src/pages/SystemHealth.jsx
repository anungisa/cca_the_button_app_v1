
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Activity, CheckCircle, AlertTriangle, XCircle,
  RefreshCw, TrendingUp, Zap, Database, Loader2,
  Server, Cpu, HardDrive, Globe, Shield, Download, Trophy
} from 'lucide-react';
import { monitoringService } from '../components/services/MonitoringService';
import { healthCheckService } from '../components/services/HealthCheckService';
import { performanceMonitor } from '../components/services/PerformanceMonitoringService';
import { productionReadinessService } from '../components/services/ProductionReadinessService';
import { usePermissions } from '../components/hooks/usePermissions';
import SupabaseHealthCheck from '../components/admin/SupabaseHealthCheck';

export default function SystemHealth() {
  const [health, setHealth] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { permissions } = usePermissions();

  const loadHealthData = async () => {
    setIsLoading(true);
    try {
      const [healthData, readinessData] = await Promise.all([
        healthCheckService.checkHealth(true),
        productionReadinessService.runAllChecks()
      ]);

      setHealth(healthData);
      setReadiness(readinessData);
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHealthData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadHealthData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'unhealthy': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-500';
    if (score >= 85) return 'text-blue-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleExportDiagnostics = () => {
    monitoringService.exportDiagnostics();
  };

  const handleResetCircuitBreakers = () => {
    monitoringService.resetAllCircuitBreakers();
    loadHealthData();
  };

  if (!permissions?.canAccessPlatformSettings) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">
          You don't have permission to view system health.
        </p>
      </div>
    );
  }

  if (isLoading && !health) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-2">
            <Activity className="w-8 h-8" />
            System Health Monitor
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Real-time system status and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDiagnostics}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Diagnostics
          </Button>
          <Button onClick={loadHealthData} disabled={isLoading} size="sm">
            <RefreshCw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Production Readiness Score */}
      {readiness && (
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              Production Readiness Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div>
                <div className={cn('text-6xl font-bold', getScoreColor(readiness.score))}>
                  {readiness.score}
                </div>
                <div className="text-sm text-brand-text-secondary mt-2">
                  Grade: {readiness.grade}
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Performance', 'Security', 'Reliability', 'Architecture'].map(category => {
                    const categoryChecks = readiness.checks.filter(c => c.category === category);
                    const passed = categoryChecks.filter(c => c.passed).length;
                    const total = categoryChecks.length;
                    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;

                    return (
                      <div key={category} className="text-center">
                        <div className={cn('text-2xl font-bold', getScoreColor(percentage))}>
                          {percentage}%
                        </div>
                        <div className="text-xs text-brand-text-secondary">{category}</div>
                        <div className="text-xs text-brand-text-muted">{passed}/{total} checks</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Critical Issues */}
            {readiness.getCriticalIssues && readiness.getCriticalIssues().length > 0 && (
              <Alert className="mt-4 border-red-500 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-500">Critical Issues Detected</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside text-sm">
                    {readiness.getCriticalIssues().map((issue, index) => (
                      <li key={index}>{issue.name}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Overall Status Card */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-brand-red/10">
                    {getStatusIcon(health?.health?.overall || 'healthy')}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-text-primary">
                      System Status
                    </h3>
                    <p className="text-sm text-brand-text-secondary">
                      Uptime: {Math.floor((health?.uptime || 0) / 60000)} minutes
                    </p>
                    {health?.health?.degradationMode && (
                      <Badge className="mt-2 bg-yellow-500/20 text-yellow-700">
                        Degradation Mode Active
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge className={`text-lg px-4 py-2 ${getStatusColor(health?.health?.overall || 'healthy')} ${health?.health?.overall === 'healthy' ? 'bg-green-100 dark:bg-green-900/30' : health?.health?.overall === 'degraded' ? 'bg-yellow-100 dark:bg-yellow-900/30' : health?.health?.overall === 'unhealthy' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-900/30'}`}>
                  {(health?.health?.overall || 'healthy').toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text-secondary">API Latency (P95)</p>
                    <p className="text-2xl font-bold text-brand-text-primary">
                      {health?.performance?.apiLatencyP95 || 0}ms
                    </p>
                  </div>
                  <Zap className={`w-8 h-8 ${
                    (health?.performance?.apiLatencyP95 || 0) < 1000 ? 'text-green-500' : 'text-yellow-500'
                  }`} />
                </div>
                <Progress
                  value={Math.min(100, ((health?.performance?.apiLatencyP95 || 0) / 3000) * 100)}
                  className="mt-2 h-1"
                />
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text-secondary">Cache Hit Rate</p>
                    <p className="text-2xl font-bold text-brand-text-primary">
                      {Math.round(health?.cache?.hitRate || 0)}%
                    </p>
                  </div>
                  <Database className="w-8 h-8 text-blue-500" />
                </div>
                <Progress
                  value={health?.cache?.hitRate || 0}
                  className="mt-2 h-1"
                />
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text-secondary">Error Rate</p>
                    <p className="text-2xl font-bold text-brand-text-primary">
                      {(health?.performance?.errorRate || 0).toFixed(1)}%
                    </p>
                  </div>
                  <AlertTriangle className={`w-8 h-8 ${
                    (health?.performance?.errorRate || 0) < 5 ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
                <Progress
                  value={Math.min(100, health?.performance?.errorRate || 0)}
                  className="mt-2 h-1"
                />
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text-secondary">Circuit Breakers</p>
                    <p className="text-2xl font-bold text-brand-text-primary">
                      {health?.circuitBreakers?.open || 0} / {health?.circuitBreakers?.total || 0}
                    </p>
                    <p className="text-xs text-brand-text-secondary">Open / Total</p>
                  </div>
                  <Shield className={`w-8 h-8 ${
                    (health?.circuitBreakers?.open || 0) === 0 ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Status Details */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-brand-text-primary flex items-center gap-2">
                <Server className="w-5 h-5" />
                Service Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {health?.services && Object.entries(health.services).map(([serviceName, service]) => (
                  <div key={serviceName} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg border border-brand-border">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium text-brand-text-primary capitalize">
                          {serviceName.replace('_', ' ')}
                        </p>
                        {service.responseTime && (
                          <p className="text-xs text-brand-text-secondary">
                            Response: {service.responseTime}ms
                          </p>
                        )}
                        {service.error && (
                          <p className="text-xs text-red-400">{service.error}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(service.status)} ${service.status === 'healthy' ? 'bg-green-100 dark:bg-green-900/30' : service.status === 'degraded' ? 'bg-yellow-100 dark:bg-yellow-900/30' : service.status === 'unhealthy' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-900/30'}`}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Circuit Breakers */}
          {health?.circuitBreakers?.total > 0 && (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-brand-text-primary flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Circuit Breakers
                  </CardTitle>
                  {health?.circuitBreakers?.open > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetCircuitBreakers}
                    >
                      Reset All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monitoringService.getCircuitBreakerStatus().map((breaker, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border border-brand-border rounded">
                      <span className="text-brand-text-primary">{breaker.entity}</span>
                      <Badge className={
                        breaker.state === 'CLOSED' ? 'bg-green-100 text-green-800' :
                        breaker.state === 'HALF_OPEN' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {breaker.state}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Offline Sync Status */}
          {health?.offline && (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-brand-text-primary flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {health.offline.isOnline ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-brand-text-primary">
                        {health.offline.isOnline ? 'Online' : 'Offline'}
                      </p>
                      {health.offline.queueSize > 0 && (
                        <p className="text-sm text-brand-text-secondary">
                          {health.offline.queueSize} operations pending sync
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {health.offline.isOnline ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Readiness Checks */}
          {readiness && (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Detailed Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="Performance">
                  <TabsList>
                    {['Performance', 'Security', 'Reliability', 'Architecture', 'Code Quality'].map(cat => (
                      <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                    ))}
                  </TabsList>

                  {['Performance', 'Security', 'Reliability', 'Architecture', 'Code Quality'].map(category => (
                    <TabsContent key={category} value={category} className="space-y-2 mt-4">
                      {readiness.checks
                        .filter(check => check.category === category)
                        .map((check, index) => (
                          <div
                            key={index}
                            className={cn(
                              'flex items-center justify-between p-3 rounded-lg',
                              check.passed ? 'bg-green-500/10' : 'bg-red-500/10'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {check.passed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              <div>
                                <div className="font-medium text-brand-text-primary">
                                  {check.name}
                                  {check.critical && (
                                    <Badge className="ml-2 bg-red-500 text-white text-xs">Critical</Badge>
                                  )}
                                </div>
                                {check.value !== undefined && check.value !== null && (
                                  <div className="text-sm text-brand-text-secondary">
                                    Current: {check.value}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-brand-text-secondary">
                              Weight: {check.weight}
                            </div>
                          </div>
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {readiness && readiness.getRecommendations && readiness.getRecommendations().length > 0 && (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {readiness.getRecommendations().map((rec, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 rounded-lg bg-brand-charcoal/50"
                    >
                      <AlertTriangle className={cn(
                        'w-5 h-5 flex-shrink-0',
                        rec.priority === 'HIGH' ? 'text-red-500' : 'text-yellow-500'
                      )} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-brand-text-primary">
                            {rec.issue}
                          </span>
                          <Badge className={cn(
                            'text-xs',
                            rec.priority === 'HIGH' ? 'bg-red-500' : 'bg-yellow-500'
                          )}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-brand-text-secondary">{rec.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="supabase" className="mt-6">
          <SupabaseHealthCheck />
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          {/* Detailed service health information can go here */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader><CardTitle>Service Details Coming Soon</CardTitle></CardHeader>
            <CardContent>More granular service health metrics and logs will appear here.</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          {/* Detailed performance metrics can go here */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader><CardTitle>Performance Metrics Coming Soon</CardTitle></CardHeader>
            <CardContent>In-depth performance graphs and statistics will be displayed here.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
