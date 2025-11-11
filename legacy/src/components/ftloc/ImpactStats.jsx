import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Donation } from '@/api/entities';
import { ScholarshipApplication } from '@/api/entities';
import { YouthInitiative } from '@/api/entities';
import { DollarSign, Users, GraduationCap, Target } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-brand-text-secondary mt-1">{subtitle}</p>}
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </CardContent>
  </Card>
);

export default function ImpactStats() {
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonors: 0,
    scholarshipsAwarded: 0,
    youthReached: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadImpactData();
  }, []);

  const loadImpactData = async () => {
    try {
      // Load donation data
      const donations = await Donation.list();
      const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
      const uniqueDonors = new Set(donations.map(d => d.donor_email)).size;

      // Load scholarship data
      const scholarships = await ScholarshipApplication.filter({ status: 'awarded' });
      
      // Load youth initiative data
      const youthInitiatives = await YouthInitiative.list();
      const youthReached = youthInitiatives.reduce((sum, yi) => sum + (yi.participant_count || 0), 0);

      // Calculate monthly donation data for chart
      const monthlyDonations = {};
      donations.forEach(donation => {
        const month = new Date(donation.created_date).toISOString().substring(0, 7); // YYYY-MM
        monthlyDonations[month] = (monthlyDonations[month] || 0) + donation.amount;
      });

      const chartData = Object.entries(monthlyDonations)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12) // Last 12 months
        .map(([month, amount]) => ({
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
          amount
        }));

      setStats({
        totalRaised,
        totalDonors: uniqueDonors,
        scholarshipsAwarded: scholarships.length,
        youthReached
      });
      setMonthlyData(chartData);
    } catch (error) {
      console.error('Failed to load impact data:', error);
      // Set fallback values
      setStats({ totalRaised: 0, totalDonors: 0, scholarshipsAwarded: 0, youthReached: 0 });
      setMonthlyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-brand-card-bg rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Raised"
          value={`$${stats.totalRaised.toLocaleString()}`}
          subtitle="All time"
          color="text-green-400"
        />
        <StatCard
          icon={Users}
          title="Donors"
          value={stats.totalDonors.toLocaleString()}
          subtitle="Unique supporters"
          color="text-blue-400"
        />
        <StatCard
          icon={GraduationCap}
          title="Scholarships"
          value={stats.scholarshipsAwarded}
          subtitle="Dreams funded"
          color="text-purple-400"
        />
        <StatCard
          icon={Target}
          title="Youth Reached"
          value={stats.youthReached.toLocaleString()}
          subtitle="Through programs"
          color="text-amber-400"
        />
      </div>

      {monthlyData.length > 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `$${(value/1000)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Donations']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#ED1C24" 
                  fill="url(#colorAmount)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ED1C24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ED1C24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}