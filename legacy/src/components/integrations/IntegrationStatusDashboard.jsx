import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Zap,
  Database,
  Globe,
  Mail,
  Video,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';

export default function IntegrationStatusDashboard() {
  const [integrations, setIntegrations] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Complete integration inventory
  const allIntegrations = [
    {
      name: 'CurlingReg API',
      category: 'Registration/Membership',
      status: 'active',
      health: 'healthy',
      lastSync: '2024-01-23T10:30:00Z',
      description: 'Member registration and club data',
      icon: Users,
      color: 'text-green-500'
    },
    {
      name: 'Curling.io API',
      category: 'Live Scoring',
      status: 'active',
      health: 'healthy',
      lastSync: '2024-01-23T10:25:00Z',
      description: 'Live game scores and draw sheets',
      icon: BarChart3,
      color: 'text-green-500'
    },
    {
      name: 'Ticketmaster',
      category: 'Ticketing',
      status: 'pending',
      health: 'not_configured',
      lastSync: null,
      description: 'Primary ticketing platform for major events',
      icon: Globe,
      color: 'text-red-500'
    }
  ];

  useEffect(() => {
    setIntegrations(allIntegrations);
  }, []);

  const getStatusBadge = (status, health) => {
    const statusConfig = {
      active: 'Active',
      pending: 'Pending',
      planned: 'Planned',
      in_development: 'In Dev',
      inactive: 'Inactive'
    };
    
    const statusColors = {
      active: 'bg-green-600 text-white',
      pending: 'bg-yellow-600 text-white',
      planned: 'bg-blue-600 text-white',
      in_development: 'bg-purple-600 text-white',
      inactive: 'bg-gray-600 text-white'
    };
    
    const label = statusConfig[status] || 'Unknown';
    const color = statusColors[status] || 'bg-gray-500 text-white';
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getHealthIndicator = (health) => {
    const healthIcons = {
      healthy: CheckCircle,
      warning: AlertTriangle,
      error: XCircle,
      testing: Clock,
      not_configured: XCircle
    };
    
    const healthColors = {
      healthy: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      testing: 'text-blue-500',
      not_configured: 'text-gray-400'
    };
    
    const Icon = healthIcons[health] || XCircle;
    const color = healthColors[health] || 'text-gray-400';
    
    return <Icon className={`w-5 h-5 ${color}`} />;
  };

  const formatLastSync = (syncTime) => {
    if (!syncTime) return 'Never';
    
    try {
      const date = new Date(syncTime);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-red" />
            Integration Status Dashboard
          </CardTitle>
          <p className="text-brand-text-secondary">
            Monitor all external system integrations and their health status
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {integrations.map((integration, index) => {
              const IconComponent = integration.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-charcoal/50">
                      <IconComponent className={`w-5 h-5 ${integration.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-text-primary">{integration.name}</h3>
                      <p className="text-sm text-brand-text-secondary">{integration.description}</p>
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Category: {integration.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {getStatusBadge(integration.status, integration.health)}
                      <p className="text-xs text-brand-text-secondary mt-1">
                        Last sync: {formatLastSync(integration.lastSync)}
                      </p>
                    </div>
                    {getHealthIndicator(integration.health)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}