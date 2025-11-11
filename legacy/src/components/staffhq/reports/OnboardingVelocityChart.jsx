import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { OnboardingChecklist } from '@/api/entities';
import { format, differenceInDays } from 'date-fns';

export default function OnboardingVelocityChart() {
  const [checklists, setChecklists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const checklistData = await OnboardingChecklist.filter({ overall_status: 'completed' });
        setChecklists(checklistData || []);
      } catch (error) {
        console.error("Failed to load onboarding checklists:", error);
        setChecklists([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const chartData = useMemo(() => {
    if (!checklists || checklists.length === 0) return [];
    
    const dataByTemplate = checklists.reduce((acc, checklist) => {
      const completionDays = differenceInDays(new Date(checklist.created_date), new Date(checklist.start_date));
      const template = checklist.template_type || 'General';

      if (!acc[template]) {
        acc[template] = { template, totalDays: 0, count: 0 };
      }
      acc[template].totalDays += completionDays;
      acc[template].count += 1;
      return acc;
    }, {});

    return Object.values(dataByTemplate).map(d => ({
      name: d.template.charAt(0).toUpperCase() + d.template.slice(1),
      'Avg. Time (Days)': (d.totalDays / d.count).toFixed(1),
    }));
  }, [checklists]);

  if (isLoading) {
    return <div className="h-64 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Onboarding Velocity</CardTitle>
        <CardDescription>Average time to complete onboarding by role type.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-center text-brand-text-secondary py-8">No completed onboarding checklists to analyze.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" stroke="#888888" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f9fafb' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Avg. Time (Days)" fill="#e11d48" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}