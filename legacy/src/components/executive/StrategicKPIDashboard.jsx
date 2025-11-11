import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StrategicKPI } from '@/api/entities';
import { StrategicGoal } from '@/api/entities';
import { Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function StrategicKPIDashboard() {
  const [kpis, setKpis] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [kpiData, goalData] = await Promise.all([
          StrategicKPI.list(),
          StrategicGoal.list()
        ]);
        setKpis(kpiData);
        setGoals(goalData);
      } catch (error) {
        console.error("Failed to load executive data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const TrendIcon = ({ trend }) => {
    if (trend === 'increasing') return <ArrowUp className="w-5 h-5 text-green-500" />;
    if (trend === 'decreasing') return <ArrowDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-yellow-500" />;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }
  
  return (
    <div className="space-y-6">
        <h3 className="text-xl font-semibold">Key Performance Indicators</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map(kpi => (
                 <Card key={kpi.id} className="bg-brand-charcoal border-brand-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.kpi_name}</CardTitle>
                        <TrendIcon trend={kpi.trend} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.current_value.toLocaleString()}</div>
                        <p className="text-xs text-brand-text-secondary">Target: {kpi.target_value.toLocaleString()}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <h3 className="text-xl font-semibold">Strategic Goal Progress</h3>
        <div className="space-y-4">
            {goals.map(goal => (
                <Card key={goal.id}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">{goal.title}</p>
                            <p className="text-sm font-bold">{goal.progress_percentage}%</p>
                        </div>
                        <Progress value={goal.progress_percentage} />
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}