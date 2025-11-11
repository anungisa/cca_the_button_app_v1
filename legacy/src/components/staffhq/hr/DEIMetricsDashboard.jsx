import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaffProfile } from '@/api/entities';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#e11d48', '#db2777', '#c026d3', '#9333ea', '#7c3aed'];

export default function DEIMetricsDashboard() {
  const [deiData, setDeiData] = useState({ gender: [], ethnicity: [], language: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeiData = async () => {
      try {
        const staff = await StaffProfile.list();
        const activeStaff = staff.filter(s => s.is_active && s.dei_demographics);

        const processData = (key) => {
          const counts = activeStaff.reduce((acc, curr) => {
            const value = curr.dei_demographics[key] || 'prefer_not_to_say';
            acc[value] = (acc[value] || 0) + 1;
            return acc;
          }, {});
          return Object.entries(counts).map(([name, value]) => ({ name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value }));
        };
        
        setDeiData({
          gender: processData('gender_identity'),
          ethnicity: processData('ethnicity'),
          language: processData('language_preference'),
        });
      } catch (e) {
        console.error("Failed to load DEI data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeiData();
  }, []);

  const ChartCard = ({ title, data }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ChartCard title="Gender Identity" data={deiData.gender} />
      <ChartCard title="Ethnicity" data={deiData.ethnicity} />
      <ChartCard title="Language Preference" data={deiData.language} />
    </div>
  );
}