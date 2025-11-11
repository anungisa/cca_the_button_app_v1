
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Zap } from 'lucide-react';

const SponsorPerformance = () => {
  // Mock data for sponsor performance
  const mockMetrics = [
    { name: 'Total Campaigns', value: '12', change: '+3', icon: BarChart },
    { name: 'Active Quests', value: '8', change: '+2', icon: TrendingUp },
    { name: 'XP Distributed', value: '45.2K', change: '+12%', icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Main title for the Sponsorship HQ CRM Module */}
      <h1 className="text-3xl font-bold text-brand-text-primary">Sponsorship HQ CRM Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-text-secondary">{metric.name}</p>
                    <p className="text-2xl font-bold text-brand-text-primary">{metric.value}</p>
                    <p className="text-xs text-green-400">{metric.change}</p>
                  </div>
                  <IconComponent className="w-8 h-8 text-brand-text-secondary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Campaign Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-brand-text-secondary">
            <p>Detailed sponsor campaign analytics will be displayed here.</p>
            <p className="text-sm mt-2">Integration with DOMO dashboards pending.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorPerformance;
