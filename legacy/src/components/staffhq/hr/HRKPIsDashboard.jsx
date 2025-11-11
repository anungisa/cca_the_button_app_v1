import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaffProfile } from '@/api/entities';
import { OnboardingChecklist } from '@/api/entities';
import { PolicyAcknowledgment } from '@/api/entities';
import { Users, UserPlus, ClipboardCheck, Library, Loader2 } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function HRKPIsDashboard() {
  const [stats, setStats] = useState({
    totalStaff: 0,
    newHires: 0,
    onboardingInProgress: 0,
    policyAckRate: 0,
    staffByDept: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [staff, onboarding, policyAcks] = await Promise.all([
          StaffProfile.list(),
          OnboardingChecklist.list(),
          PolicyAcknowledgment.list(),
        ]);
        
        const totalStaff = staff.filter(s => s.is_active).length;
        
        const deptCounts = staff.reduce((acc, curr) => {
          acc[curr.department] = (acc[curr.department] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalStaff: totalStaff,
          newHires: staff.filter(s => new Date(s.start_date) > new Date(new Date().setMonth(new Date().getMonth() - 3))).length,
          onboardingInProgress: onboarding.filter(o => o.overall_status === 'in_progress').length,
          policyAckRate: totalStaff > 0 ? (policyAcks.length / totalStaff) * 100 : 0, // This is a simplification
          staffByDept: Object.entries(deptCounts).map(([name, value]) => ({ name, count: value })),
        });
      } catch (e) {
        console.error("Error fetching HR stats:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
            {subtitle && <p className="text-xs text-brand-text-secondary">{subtitle}</p>}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Active Staff" value={stats.totalStaff} icon={Users} color="text-blue-500" />
        <StatCard title="New Hires (Quarter)" value={stats.newHires} icon={UserPlus} color="text-green-500" />
        <StatCard title="Onboarding In Progress" value={stats.onboardingInProgress} icon={ClipboardCheck} color="text-yellow-500" />
        <StatCard title="Policy Acknowledged" value={`${Math.round(stats.policyAckRate)}%`} icon={Library} color="text-purple-500" />
      </div>
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Staff by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.staffByDept}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}