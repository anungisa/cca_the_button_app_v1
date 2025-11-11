
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Incident } from '@/api/entities';
import { format, subDays } from 'date-fns';

export default function CaseVolumeChart() {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      setIsLoading(true);
      try {
        const caseData = await Incident.list();
        setCases(caseData || []);
      } catch (error) {
        console.error("Failed to load incidents:", error);
        setCases([]); // Ensure cases is an empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    loadCases();
  }, []); // Empty dependency array means this runs once on mount

  const chartData = useMemo(() => {
    if (isLoading) return []; // Don't process data while loading
    if (!cases || cases.length === 0) return []; // Handle no data after loading

    const today = new Date();
    
    // Create array of last 30 days, ordered chronologically (oldest to newest)
    const dateRange = [...Array(30)].map((_, i) => {
      const date = subDays(today, 29 - i); // Get date from 29 days ago up to today
      return {
        date: format(date, 'yyyy-MM-dd'), // Format to 'YYYY-MM-DD'
        displayDate: format(date, 'MMM d'), // Format to 'Jan 1'
        newCases: 0,
        resolvedCases: 0
      };
    });
    
    // Count cases by day
    cases.forEach(caseItem => {
      const createdDate = caseItem.created_date ? format(new Date(caseItem.created_date), 'yyyy-MM-dd') : null;
      const resolvedDate = (caseItem.status === 'resolved' && caseItem.updated_date) ? 
                           format(new Date(caseItem.updated_date), 'yyyy-MM-dd') : null;
      
      // Count new cases if within the 30-day range
      const createdDayIndex = dateRange.findIndex(day => day.date === createdDate);
      if (createdDayIndex >= 0) {
        dateRange[createdDayIndex].newCases++;
      }
      
      // Count resolved cases if within the 30-day range
      if (resolvedDate) {
        const resolvedDayIndex = dateRange.findIndex(day => day.date === resolvedDate);
        if (resolvedDayIndex >= 0) {
          dateRange[resolvedDayIndex].resolvedCases++;
        }
      }
    });

    return dateRange;
  }, [cases, isLoading]); // Re-run useMemo if cases or isLoading changes

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-card-bg border border-brand-border p-3 rounded-lg shadow-lg">
          <p className="text-brand-text-primary font-medium mb-2">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.dataKey === 'newCases' ? 'New Cases' : 'Resolved Cases'}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalNewCases = chartData.reduce((sum, day) => sum + day.newCases, 0);
  const totalResolvedCases = chartData.reduce((sum, day) => sum + day.resolvedCases, 0);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-brand-text-primary">Case Volume (Last 30 Days)</CardTitle>
        <p className="text-sm text-brand-text-secondary">
          Daily case creation and resolution trends
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-brand-text-secondary">
            Loading case data...
          </div>
        ) : (cases.length === 0) ? ( // Check if no cases were loaded at all
          <div className="h-80 flex items-center justify-center text-brand-text-secondary">
            No case data available.
          </div>
        ) : (
          <>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="displayDate" 
                    stroke="#9ca3af"
                    fontSize={10}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="newCases" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="New Cases"
                    dot={{ fill: '#ef4444', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolvedCases" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Resolved Cases"
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-red-400">{totalNewCases}</div>
                <div className="text-xs text-brand-text-secondary">New Cases (30d)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">{totalResolvedCases}</div>
                <div className="text-xs text-brand-text-secondary">Resolved (30d)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-400">
                  {totalNewCases > 0 ? Math.round((totalResolvedCases / totalNewCases) * 100) : 0}%
                </div>
                <div className="text-xs text-brand-text-secondary">Resolution Rate</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
