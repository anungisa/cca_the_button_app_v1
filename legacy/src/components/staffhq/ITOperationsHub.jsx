
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Server,
  Database,
  Globe,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Wifi,
  Cloud,
  Settings,
  RefreshCw,
  Bell,
  Eye,
  Edit,
  Plus,
  Zap,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Trash2
} from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const generateMonitoringData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const time = new Date();
        time.setMinutes(time.getMinutes() - i * 5);
        data.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cpu: Math.floor(Math.random() * 40) + 20,
            memory: Math.floor(Math.random() * 30) + 50,
            network_mbps: Math.floor(Math.random() * 500) + 100,
            api_requests: Math.floor(Math.random() * 2000) + 5000,
        });
    }
    return data;
};

export default function ITOperationsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemHealth, setSystemHealth] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [monitoringData, setMonitoringData] = useState([]);
  const [alertRules, setAlertRules] = useState([
    { id: 1, metric: 'CPU Usage', condition: '>', threshold: '85%', enabled: true, notification: 'DevOps Slack' },
    { id: 2, metric: 'API 5xx Errors', condition: '>', threshold: '10/min', enabled: true, notification: 'PagerDuty' },
    { id: 3, metric: 'Database Latency', condition: '>', threshold: '500ms', enabled: false, notification: 'Email' },
    { id: 4, metric: 'SSL Certificate', condition: '<', threshold: '14 days expiry', enabled: true, notification: 'DevOps Slack' },
  ]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // IT Operations Stats
  const itStats = [
    { title: 'System Uptime', value: '99.8%', change: 'Last 30 days', icon: CheckCircle, color: 'text-green-400' },
    { title: 'Active Alerts', value: '3', change: '2 critical, 1 warning', icon: AlertTriangle, color: 'text-orange-400' },
    { title: 'API Response Time', value: '124ms', change: '↓ 15ms from yesterday', icon: Activity, color: 'text-blue-400' },
    { title: 'Database Health', value: '98%', change: 'All queries optimized', icon: Database, color: 'text-purple-400' }
  ];

  // System Health Data
  const systemHealthData = [
    {
      service: 'The Button App',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 145,
      lastIncident: '2024-01-15',
      dependencies: ['Auth Service', 'User DB', 'XP Engine'],
      endpoint: 'https://thebutton.curling.ca',
      version: 'v2.4.1'
    },
    {
      service: 'CurlingReg API',
      status: 'healthy',
      uptime: 99.2,
      responseTime: 203,
      lastIncident: '2024-01-20',
      dependencies: ['Registration DB', 'Payment Gateway'],
      endpoint: 'https://api.curlingreg.com',
      version: 'v1.8.2'
    },
    {
      service: 'Live Scoring System',
      status: 'warning',
      uptime: 97.8,
      responseTime: 456,
      lastIncident: '2024-01-22',
      dependencies: ['Game DB', 'WebSocket Service'],
      endpoint: 'https://livescoring.curling.ca',
      version: 'v3.1.0'
    },
    {
      service: 'Curling+ Streaming',
      status: 'healthy',
      uptime: 99.5,
      responseTime: 89,
      lastIncident: '2024-01-10',
      dependencies: ['CDN', 'Video Processing', 'Payment Service'],
      endpoint: 'https://curlingplus.ca',
      version: 'v1.2.3'
    },
    {
      service: 'Staff HQ Portal',
      status: 'critical',
      uptime: 94.2,
      responseTime: 1200,
      lastIncident: '2024-01-23',
      dependencies: ['Auth Service', 'File Storage', 'Notification Service'],
      endpoint: 'https://staffhq.curling.ca',
      version: 'v1.1.8'
    }
  ];

  // Infrastructure Metrics
  const infrastructureMetrics = [
    {
      component: 'Web Servers',
      type: 'compute',
      instances: 6,
      healthy: 6,
      cpuUsage: 42,
      memoryUsage: 68,
      diskUsage: 35,
      status: 'healthy'
    },
    {
      component: 'Database Cluster',
      type: 'database',
      instances: 3,
      healthy: 3,
      cpuUsage: 28,
      memoryUsage: 78,
      diskUsage: 62,
      status: 'healthy'
    },
    {
      component: 'CDN Edge Nodes',
      type: 'network',
      instances: 12,
      healthy: 11,
      cpuUsage: 15,
      memoryUsage: 45,
      diskUsage: 25,
      status: 'warning'
    },
    {
      component: 'Load Balancers',
      type: 'network',
      instances: 2,
      healthy: 2,
      cpuUsage: 22,
      memoryUsage: 35,
      diskUsage: 18,
      status: 'healthy'
    }
  ];

  // Recent IT Incidents
  const recentIncidents = [
    {
      id: 'INC-2024-001',
      title: 'Staff HQ Portal Slow Response Times',
      severity: 'high',
      status: 'investigating',
      affectedServices: ['Staff HQ Portal', 'File Storage'],
      reportedAt: '2024-01-23T14:30:00Z',
      assignedTo: 'DevOps Team',
      description: 'Users reporting slow load times on Staff HQ portal, investigating database performance'
    },
    {
      id: 'INC-2024-002',
      title: 'CDN Edge Node Offline',
      severity: 'medium',
      status: 'resolved',
      affectedServices: ['Content Delivery', 'Static Assets'],
      reportedAt: '2024-01-22T09:15:00Z',
      resolvedAt: '2024-01-22T10:45:00Z',
      assignedTo: 'Infrastructure Team',
      description: 'Toronto edge node went offline, traffic rerouted to Montreal node'
    },
    {
      id: 'INC-2024-003',
      title: 'Live Scoring WebSocket Issues',
      severity: 'medium',
      status: 'monitoring',
      affectedServices: ['Live Scoring', 'Real-time Updates'],
      reportedAt: '2024-01-21T16:20:00Z',
      assignedTo: 'Platform Team',
      description: 'Intermittent WebSocket connection drops during high-traffic events'
    }
  ];

  // Security Metrics
  const securityMetrics = [
    {
      metric: 'Failed Login Attempts',
      value: 1247,
      threshold: 2000,
      status: 'normal',
      trend: 'down',
      period: 'Last 24h'
    },
    {
      metric: 'API Rate Limit Hits',
      value: 89,
      threshold: 500,
      status: 'normal',
      trend: 'stable',
      period: 'Last 24h'
    },
    {
      metric: 'Suspicious IP Blocks',
      value: 23,
      threshold: 100,
      status: 'normal',
      trend: 'up',
      period: 'Last 24h'
    },
    {
      metric: 'SSL Cert Expiring',
      value: 2,
      threshold: 5,
      status: 'warning',
      trend: 'stable',
      period: 'Next 30 days'
    }
  ];

  useEffect(() => {
    loadITData();
    const interval = setInterval(loadITData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadITData = async () => {
    try {
      // In a real implementation, this would fetch from monitoring APIs
      setSystemHealth(systemHealthData);
      setIncidents(recentIncidents);
      setMonitoringData(generateMonitoringData());
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading IT data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRule = (ruleId) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      healthy: { color: 'bg-green-600', text: 'Healthy', icon: CheckCircle },
      warning: { color: 'bg-yellow-600', text: 'Warning', icon: AlertTriangle },
      critical: { color: 'bg-red-600', text: 'Critical', icon: AlertTriangle },
      offline: { color: 'bg-gray-600', text: 'Offline', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.offline;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getIncidentSeverityBadge = (severity) => {
    const severityConfig = {
      critical: { color: 'bg-red-600', text: 'Critical' },
      high: { color: 'bg-orange-600', text: 'High' },
      medium: { color: 'bg-yellow-600', text: 'Medium' },
      low: { color: 'bg-blue-600', text: 'Low' }
    };

    const config = severityConfig[severity] || severityConfig.low;
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  const getIncidentStatusBadge = (status) => {
    const statusConfig = {
      investigating: { color: 'bg-orange-600', text: 'Investigating' },
      resolved: { color: 'bg-green-600', text: 'Resolved' },
      monitoring: { color: 'bg-blue-600', text: 'Monitoring' },
      open: { color: 'bg-red-600', text: 'Open' }
    };

    const config = statusConfig[status] || statusConfig.open;
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const ServiceHealthCard = ({ service }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-brand-text-primary">{service.service}</CardTitle>
            <p className="text-sm text-brand-text-secondary">Version {service.version}</p>
          </div>
          {getStatusBadge(service.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-brand-text-secondary">Uptime</div>
            <div className="font-semibold text-brand-text-primary">{service.uptime}%</div>
          </div>
          <div>
            <div className="text-brand-text-secondary">Response Time</div>
            <div className="font-semibold text-brand-text-primary">{service.responseTime}ms</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-brand-text-secondary mb-2">Dependencies</div>
          <div className="flex flex-wrap gap-1">
            {service.dependencies.map((dep, index) => (
              <Badge key={index} variant="outline" className="text-xs">{dep}</Badge>
            ))}
          </div>
        </div>

        <div className="text-xs text-brand-text-secondary">
          <div>Endpoint: {service.endpoint}</div>
          <div>Last Incident: {new Date(service.lastIncident).toLocaleDateString()}</div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-brand-border">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            Monitor
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const InfrastructureCard = ({ component }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base text-brand-text-primary">{component.component}</CardTitle>
          {getStatusBadge(component.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-brand-text-secondary">Instances</span>
            <span className="text-brand-text-primary">{component.healthy}/{component.instances}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-text-secondary">CPU Usage</span>
              <span className="text-brand-text-primary">{component.cpuUsage}%</span>
            </div>
            <Progress value={component.cpuUsage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-text-secondary">Memory</span>
              <span className="text-brand-text-primary">{component.memoryUsage}%</span>
            </div>
            <Progress value={component.memoryUsage} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-text-secondary">Disk</span>
              <span className="text-brand-text-primary">{component.diskUsage}%</span>
            </div>
            <Progress value={component.diskUsage} className="h-2" />
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-brand-border">
          <Button size="sm" variant="outline" className="flex-1">
            <BarChart3 className="w-4 h-4 mr-1" />
            Metrics
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Server className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">IT Operations Hub</h2>
            <p className="text-brand-text-secondary">System monitoring, infrastructure management, and operational oversight</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button variant="outline" onClick={loadITData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {itStats.map((stat, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">{stat.title}</p>
                  <p className="text-2xl font-bold text-brand-text-primary">{stat.value}</p>
                  <p className="text-xs text-brand-text-secondary">{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="overview">System Health</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {systemHealth.map((service, index) => (
              <ServiceHealthCard key={index} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {infrastructureMetrics.map((component, index) => (
              <InfrastructureCard key={index} component={component} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Incidents</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Report Incident
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-mono">{incident.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-brand-text-primary">{incident.title}</div>
                          <div className="text-sm text-brand-text-secondary">{incident.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getIncidentSeverityBadge(incident.severity)}</TableCell>
                      <TableCell>{getIncidentStatusBadge(incident.status)}</TableCell>
                      <TableCell>{incident.assignedTo}</TableCell>
                      <TableCell>{new Date(incident.reportedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityMetrics.map((metric, index) => (
              <Card key={index} className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{metric.metric}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-brand-text-primary">{metric.value}</div>
                    <div className="text-sm text-brand-text-secondary">
                      Threshold: {metric.threshold} • {metric.period}
                    </div>
                    <Progress 
                      value={(metric.value / metric.threshold) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      {getStatusBadge(metric.status === 'normal' ? 'healthy' : 'warning')}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6 space-y-6">
           <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Real-Time System Metrics</CardTitle>
              <p className="text-brand-text-secondary">Live server and application performance metrics.</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monitoringData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis yAxisId="left" stroke="#888" tickFormatter={(value) => `${value}%`}/>
                  <YAxis yAxisId="right" orientation="right" stroke="#888" tickFormatter={(value) => `${value.toLocaleString()}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}/>
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU Usage (%)" dot={false} strokeWidth={2}/>
                  <Line yAxisId="left" type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory Usage (%)" dot={false} strokeWidth={2}/>
                   <Line yAxisId="right" type="monotone" dataKey="api_requests" stroke="#ffc658" name="API Requests" dot={false} strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Alerting Rules</CardTitle>
                 <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Alert Rule
                </Button>
              </div>
               <p className="text-brand-text-secondary">Configure automated alerts for system events.</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Notification</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium text-brand-text-primary">{rule.metric}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{`${rule.condition} ${rule.threshold}`}</Badge>
                      </TableCell>
                      <TableCell>{rule.notification}</TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                           <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
