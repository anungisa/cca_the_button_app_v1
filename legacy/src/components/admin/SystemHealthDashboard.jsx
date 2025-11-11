import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, CheckCircle, AlertTriangle, XCircle, 
  RefreshCw, TrendingUp, Zap, Database, Loader2 
} from 'lucide-react';
import { healthCheckService } from '../services/HealthCheckService';
import { performanceMonitor } from '../services/PerformanceMonitoringService';
import { enhancedCache } from '../services/EnhancedCacheService';

export default function SystemHealthDashboard() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const status = await healthCheckService.checkHealth();
      setHealthStatus(status);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

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
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!healthStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  const performanceReport = healthStatus.performance || {};
  const cacheStats = healthStatus.cache || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
          <Activity className="w-6 h-6" />
          System Health
        </h2>
        <Button 
          onClick={checkHealth} 
          disabled={isChecking}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(healthStatus.overall)}
              <div>
                <h3 className="text-lg font-semibold text-brand-text-primary">Overall Status</h3>
                <p className="text-sm text-brand-text-secondary">
                  Last checked: {new Date(healthStatus.lastCheck).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(healthStatus.overall)}>
              {healthStatus.overall.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Avg Page Load</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {performanceReport.avgPageLoad || 0}ms
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Avg API Latency</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {performanceReport.avgAPILatency || 0}ms
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Error Rate (1m)</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {performanceReport.errorRate || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cache Stats */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-brand-text-primary flex items-center gap-2">
            <Database className="w-5 h-5" />
            Cache Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-brand-text-secondary">Cached Entries</p>
              <p className="text-xl font-bold text-brand-text-primary">{cacheStats.entries || 0}</p>
            </div>
            <div>
              <p className="text-sm text-brand-text-secondary">Max Capacity</p>
              <p className="text-xl font-bold text-brand-text-primary">{cacheStats.maxSize || 0}</p>
            </div>
            <div>
              <p className="text-sm text-brand-text-secondary">Expired Entries</p>
              <p className="text-xl font-bold text-brand-text-primary">{cacheStats.expiredEntries || 0}</p>
            </div>
            <div>
              <p className="text-sm text-brand-text-secondary">Cache Size</p>
              <p className="text-xl font-bold text-brand-text-primary">
                {Math.round((cacheStats.totalSizeBytes || 0) / 1024)}KB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-brand-text-primary">Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(healthStatus.services || {}).map(([name, service]) => (
              <div key={name} className="flex items-center justify-between p-3 border border-brand-border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium text-brand-text-primary">{name}</p>
                    {service.responseTime && (
                      <p className="text-sm text-brand-text-secondary">
                        Response time: {service.responseTime}ms
                      </p>
                    )}
                    {service.error && (
                      <p className="text-sm text-red-400">{service.error}</p>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(service.status)}>
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {performanceReport.slowestPages?.length > 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="text-brand-text-primary">Slowest Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {performanceReport.slowestPages.slice(0, 5).map((page, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-brand-text-primary">{page.page}</span>
                  <Badge variant="outline">{page.loadTime}ms</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}