import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Ticket, DollarSign, Eye, BarChart3 } from 'lucide-react';

export default function EventAnalyticsDashboard() {
  const attendanceData = [
    { day: 'Fri', attendance: 2500 },
    { day: 'Sat', attendance: 4200 },
    { day: 'Sun', attendance: 3800 },
    { day: 'Mon', attendance: 1800 },
    { day: 'Tue', attendance: 2100 },
    { day: 'Wed', attendance: 2300 },
    { day: 'Thu', attendance: 2800 },
  ];

  const revenueData = [
    { source: 'Tickets', value: 350000 },
    { source: 'Merchandise', value: 120000 },
    { source: 'Concessions', value: 85000 },
    { source: 'Sponsorship', value: 250000 },
  ];

  return (
    <div className="space-y-6">
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-6 h-6 text-brand-red" />Event Analytics</CardTitle></CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-brand-card-bg border-brand-border"><CardHeader><CardTitle className="text-sm font-medium">Total Attendance</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">19,700</p></CardContent></Card>
            <Card className="bg-brand-card-bg border-brand-border"><CardHeader><CardTitle className="text-sm font-medium">Total Revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">$805,000</p></CardContent></Card>
            <Card className="bg-brand-card-bg border-brand-border"><CardHeader><CardTitle className="text-sm font-medium">Media Impressions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">12.5M</p></CardContent></Card>
            <Card className="bg-brand-card-bg border-brand-border"><CardHeader><CardTitle className="text-sm font-medium">Volunteer Hours</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">4,280</p></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader><CardTitle>Daily Attendance</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={attendanceData}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="attendance" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader><CardTitle>Revenue Breakdown</CardTitle></CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData} layout="vertical">
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="source" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}