import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StrategicKPI } from '@/api/entities';
import { Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function KPIDashboard() {
  const [kpis, setKpis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadKPIs = async () => {
      try {
        const data = await StrategicKPI.list();
        setKpis(data);
      } catch (error) {
        console.error("Failed to load KPIs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadKPIs();
  }, []);

  const TrendIcon = ({ trend }) => {
    if (trend === 'increasing') return <ArrowUp className="w-5 h-5 text-green-500" />;
    if (trend === 'decreasing') return <ArrowDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-yellow-500" />;
  };

  const KPICard = ({ kpi }) => {
    const progress = kpi.target_value > 0 ? (kpi.current_value / kpi.target_value) * 100 : 0;
    return (
      <Card className="bg-brand-charcoal border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{kpi.kpi_name}</CardTitle>
          <TrendIcon trend={kpi.trend} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpi.current_value.toLocaleString()}{kpi.metric_type === 'percentage' ? '%' : ''}</div>
          <p className="text-xs text-brand-text-secondary">
            Target: {kpi.target_value.toLocaleString()}{kpi.metric_type === 'percentage' ? '%' : ''}
          </p>
          <div className="w-full bg-brand-border rounded-full h-2.5 mt-2">
            <div className="bg-brand-red h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.slice(0, 4).map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
      </div>
       <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>KPI Performance vs Target</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={kpis}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="kpi_name" hide />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
              <Legend />
              <Bar dataKey="current_value" name="Current" fill="#e11d48" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target_value" name="Target" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}