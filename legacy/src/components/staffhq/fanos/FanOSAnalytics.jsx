
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, Zap, Users, Trophy, Gift } from 'lucide-react';
import { User } from '@/api/entities';
import { PointTransaction } from '@/api/entities';

// Mock data for new charts
const engagementByTierData = [
  { name: 'Rookie', engagement: 400, amt: 2400 },
  { name: 'Star', engagement: 300, amt: 2210 },
  { name: 'Hero', engagement: 200, amt: 2290 },
  { name: 'Boss', engagement: 278, amt: 2000 },
  { name: 'Master', engagement: 189, amt: 2181 },
];

const rewardRedemptionData = [
  { name: 'Merchandise', value: 400 },
  { name: 'Discounts', value: 300 },
  { name: 'Exclusive Content', value: 300 },
  { name: 'Experiences', value: 200 },
];

// Updated COLORS for the new PieChart
const COLORS = ['#e11d48', '#db2777', '#c026d3', '#9333ea'];

export default function FanOSAnalytics() {
  const [stats, setStats] = useState({
    activePlayers: 12450, // Based on totalFans from original sample
    totalXPEarned: 1250000, // Based on pointsEarned from original sample
    challengesCompleted: 1280, // Hardcoded value from original
    rewardsRedeemed: 320, // Based on rewardsClaimed from original sample
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }
  
  const StatCard = ({ title, value, change, icon: Icon }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Players" value={stats.activePlayers} change="+5% this week" icon={Users} />
        <StatCard title="Total XP Earned" value={stats.totalXPEarned} change="+1.2M this month" icon={Zap} />
        <StatCard title="Challenges Completed" value={stats.challengesCompleted} change="7.2k this month" icon={Trophy} />
        <StatCard title="Rewards Redeemed" value={stats.rewardsRedeemed} change="1.5k this month" icon={Gift} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Engagement by Loyalty Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementByTierData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888"/>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                <Legend />
                <Bar dataKey="engagement" fill="#e11d48" name="XP Earned per User (Avg)"/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Reward Redemptions by Type</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rewardRedemptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {rewardRedemptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
