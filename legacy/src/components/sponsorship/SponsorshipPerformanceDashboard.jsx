import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { SponsorDeal } from '@/api/entities';
import { SponsorCampaign } from '@/api/entities';
import { Loader2, DollarSign, TrendingUp, Users, Target } from 'lucide-react';

const COLORS = ['#ED1C24', '#ffc72c', '#3b82f6', '#8b5cf6', '#10b981'];

const ChartCard = ({ title, icon: Icon, children }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base">
        <Icon className="w-5 h-5 text-brand-red" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div style={{ width: '100%', height: 300 }}>
        {children}
      </div>
    </CardContent>
  </Card>
);

export default function SponsorshipPerformanceDashboard() {
  const [dealData, setDealData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deals, campaigns] = await Promise.all([
          SponsorDeal.list(),
          SponsorCampaign.list()
        ]);

        // Process Deal Data for Chart
        const dealStageData = (deals || []).reduce((acc, deal) => {
          const stage = deal.stage.replace('_', ' ');
          const existing = acc.find(item => item.name === stage);
          if (existing) {
            existing.value += (deal.deal_value || 0);
          } else {
            acc.push({ name: stage, value: (deal.deal_value || 0) });
          }
          return acc;
        }, []);
        setDealData(dealStageData);

        // Process Campaign Data for Chart
        const campaignPerfData = (campaigns || []).map(c => ({
          name: c.name,
          Impressions: c.impressions || 0,
          Completions: c.completions || 0
        }));
        setCampaignData(campaignPerfData);

      } catch (error) {
        console.error("Failed to load performance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading performance dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Deal Pipeline Value by Stage" icon={DollarSign}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={dealData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {dealData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Campaign Performance (Impressions vs Completions)" icon={Target}>
        <ResponsiveContainer>
          <BarChart data={campaignData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
            <Tooltip wrapperStyle={{ backgroundColor: '#333' }} contentStyle={{ backgroundColor: '#333', border: 'none' }}/>
            <Legend />
            <Bar dataKey="Impressions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Completions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}