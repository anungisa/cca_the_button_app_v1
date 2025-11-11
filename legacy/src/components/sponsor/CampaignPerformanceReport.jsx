import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Zap, Eye, MousePointerClick } from 'lucide-react';

const mockData = [
  { name: 'Patch Scans', value: 1245, fill: '#ED1C24' },
  { name: 'Digital Clicks', value: 834, fill: '#ffc72c' },
  { name: 'Impressions', value: 45098, fill: '#111827' },
];

const engagementData = [
    { day: 'Mon', engagement: 250 },
    { day: 'Tue', engagement: 310 },
    { day: 'Wed', engagement: 450 },
    { day: 'Thu', engagement: 400 },
    { day: 'Fri', engagement: 590 },
    { day: 'Sat', engagement: 820 },
    { day: 'Sun', engagement: 750 },
];

const MetricCard = ({ icon, value, label, color }) => {
    const Icon = icon;
    return (
        <div className="bg-brand-charcoal/50 p-4 rounded-lg flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-brand-text-primary">{value.toLocaleString()}</p>
                <p className="text-sm text-brand-text-secondary">{label}</p>
            </div>
        </div>
    )
}

export default function CampaignPerformanceReport({ sponsor }) {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Campaign ROI Summary: {sponsor?.name || 'Your Campaign'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard icon={Zap} value={mockData[0].value} label="Total XP Scans" color="bg-brand-red" />
            <MetricCard icon={MousePointerClick} value={mockData[1].value} label="Digital Engagements" color="bg-amber-500" />
            <MetricCard icon={Eye} value={mockData[2].value} label="Brand Impressions" color="bg-blue-500" />
        </div>
        
        <div>
            <h4 className="text-lg font-semibold text-brand-text-primary mb-4">Fan Engagement This Week</h4>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={engagementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                background: "#1f2937",
                                border: "1px solid #374151",
                                color: "#f9fafb"
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "14px" }} />
                        <Bar dataKey="engagement" fill="#ED1C24" name="Engagements" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}