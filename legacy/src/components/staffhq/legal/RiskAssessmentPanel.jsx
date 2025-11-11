import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ComplianceItem } from '@/api/entities';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RiskAssessmentPanel({ selectedRegion }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const data = await ComplianceItem.list();
        setItems(data || []); // Ensure items is always an array
      } catch (error) {
        console.error("Failed to load compliance items:", error);
        setItems([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!items) return []; // Add safety check for items
    if (selectedRegion === 'all') {
      return items;
    }
    // Assuming compliance items might have a region field, though not explicit in schema
    // This is a defensive implementation.
    return items.filter(item => item.ma_region === selectedRegion);
  }, [items, selectedRegion]);

  const riskMatrixData = useMemo(() => {
    if (!filteredItems) return {}; // Add safety check
    return filteredItems.reduce((acc, item) => {
      const key = `${item.risk_level || 'unknown'}-${(item.risk_type && item.risk_type[0]) || 'unknown'}`;
      if (!acc[key]) {
        acc[key] = { count: 0, risk_level: item.risk_level || 'unknown', risk_type: (item.risk_type && item.risk_type[0]) || 'unknown' };
      }
      acc[key].count += 1;
      return acc;
    }, {});
  }, [filteredItems]);

  const chartData = useMemo(() => {
    if (!filteredItems) return []; // Add safety check
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    return riskLevels.map(level => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      count: filteredItems.filter(item => item.risk_level === level).length,
    }));
  }, [filteredItems]);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }
  
  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
          <CardDescription>Number of compliance items by risk level.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f9fafb' }}
              />
              <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Risk Matrix placeholder */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Risk Matrix</CardTitle>
          <CardDescription>Visualizing risk by type and severity.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-brand-text-secondary text-center py-8">Risk Matrix visualization coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}