
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MarketingCampaign } from '@/api/entities'; // Assuming this path is correct based on the outline

const STATUS_COLORS = {
  planning: '#94a3b8',
  review: '#f59e0b',
  approved: '#10b981',
  published: '#3b82f6',
  completed: '#6366f1',
  cancelled: '#ef4444'
};

export default function CampaignStatusPieChart() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        const campaignData = await MarketingCampaign.list();
        setCampaigns(campaignData || []);
      } catch (error) {
        console.error("Failed to load marketing campaigns:", error);
        setCampaigns([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  const statusCounts = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return {};
    return campaigns.reduce((acc, campaign) => {
      const status = campaign.status || 'planning';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [campaigns]);

  const chartData = useMemo(() => {
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      value: count,
      color: STATUS_COLORS[status] || '#94a3b8'
    }));
  }, [statusCounts]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-brand-card-bg border border-brand-border p-3 rounded-lg shadow-lg">
          <p className="text-brand-text-primary font-medium">{data.name}</p>
          <p className="text-brand-text-secondary">
            {data.value} campaign{data.value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-brand-text-primary">Campaign Status Distribution</CardTitle>
          <p className="text-sm text-brand-text-secondary">Current status of all marketing campaigns</p>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-brand-text-secondary">
            Loading campaigns...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-brand-text-primary">Campaign Status Distribution</CardTitle>
        <p className="text-sm text-brand-text-secondary">Current status of all marketing campaigns</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-text-primary">{campaigns.length}</div>
            <div className="text-sm text-brand-text-secondary">Total Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {statusCounts.completed || 0}
            </div>
            <div className="text-sm text-brand-text-secondary">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
