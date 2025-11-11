
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeSportCompletion } from '@/api/entities';
import { SafeSportPolicy } from '@/api/entities';
import { SafeSportTraining } from '@/api/entities';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, Users, Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { getProvinceNameByAbbreviation } from '@/components/utils/provinces';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ComplianceCommandCenter({ selectedRegion }) {
  const [complianceData, setComplianceData] = useState({
    totalUsers: 0,
    compliantUsers: 0,
    expiringSoon: 0,
    overdue: 0,
    totalExpired: 0, // New stat for expired completions
    complianceRate: 0, // New stat for overall compliance rate
    policyAdoptionRate: 0, // New stat for policy adoption rate
    complianceByRegion: [],
    trainingCompletion: [],
    policyUpdates: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComplianceData = async () => {
      setIsLoading(true);
      try {
        const [allCompletions, allPolicies, allTrainings] = await Promise.all([
          SafeSportCompletion.list(),
          SafeSportPolicy.list(),
          SafeSportTraining.list()
        ]);

        // Filter completions based on selectedRegion
        const filteredCompletions = selectedRegion === 'all'
          ? allCompletions
          : allCompletions.filter(c => c.ma_region === selectedRegion);
        
        // Filter policies based on selectedRegion. Policies without a specific region are considered global.
        const filteredPolicies = selectedRegion === 'all'
          ? allPolicies
          : allPolicies.filter(p => !p.ma_region || p.ma_region === selectedRegion);

        // Calculate statistics based on filtered data
        const totalUsersCount = filteredCompletions.length;
        const compliantUsersCount = filteredCompletions.filter(c => c.status === 'completed').length;
        const totalExpiredCount = filteredCompletions.filter(c => c.status === 'expired').length;

        // Mock values for expiringSoon and overdue based on filtered completions
        const expiringSoonCount = Math.floor(totalUsersCount * 0.08); // Example: 8% of total users
        const overdueCount = Math.floor(totalUsersCount * 0.03); // Example: 3% of total users

        const overallComplianceRate = totalUsersCount > 0 ? (compliantUsersCount / totalUsersCount) * 100 : 0;
        const policyAdoptionRate = filteredPolicies.length > 0 
          ? (filteredPolicies.filter(p => p.status === 'active').length / filteredPolicies.length) * 100 
          : 0;
        
        // Prepare data for Compliance by Region chart
        let regionalComplianceData;
        if (selectedRegion === 'all') {
            // Use existing mock data for 'all' regions
            regionalComplianceData = [
                { name: 'BC', compliant: 95, total: 120 },
                { name: 'AB', compliant: 88, total: 110 },
                { name: 'SK', compliant: 92, total: 85 },
                { name: 'MB', compliant: 90, total: 75 },
                { name: 'ON', compliant: 87, total: 200 },
                { name: 'QC', compliant: 94, total: 150 },
                { name: 'NB', compliant: 96, total: 60 },
                { name: 'NS', compliant: 93, total: 70 },
                { name: 'PE', compliant: 98, total: 25 },
                { name: 'NL', compliant: 91, total: 45 }
            ];
        } else {
            // For a specific region, display only that region's data
            regionalComplianceData = [{
                name: getProvinceNameByAbbreviation(selectedRegion) || selectedRegion,
                compliant: compliantUsersCount,
                total: totalUsersCount
            }];
        }

        // Training Completion data - currently not filtered by region as per outline
        const trainingCompletionData = [
            { month: 'Jan', completions: 45 },
            { month: 'Feb', completions: 52 },
            { month: 'Mar', completions: 38 },
            { month: 'Apr', completions: 67 },
            { month: 'May', completions: 73 },
            { month: 'Jun', completions: 55 }
        ];

        setComplianceData({
          totalUsers: totalUsersCount,
          compliantUsers: compliantUsersCount,
          expiringSoon: expiringSoonCount,
          overdue: overdueCount,
          totalExpired: totalExpiredCount,
          complianceRate: overallComplianceRate,
          policyAdoptionRate: policyAdoptionRate,
          complianceByRegion: regionalComplianceData,
          trainingCompletion: trainingCompletionData,
          policyUpdates: filteredPolicies.slice(0, 5) // Display top 5 filtered policies
        });
      } catch (error) {
        console.error('Error loading safe sport compliance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadComplianceData();
  }, [selectedRegion]); // Re-run effect when selectedRegion changes

  const StatCard = ({ title, value, icon: Icon, color = "text-brand-text-primary" }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={complianceData.totalUsers} icon={Users} />
        <StatCard title="Compliant" value={complianceData.compliantUsers} icon={CheckCircle} color="text-green-500" />
        <StatCard title="Expiring Soon" value={complianceData.expiringSoon} icon={Clock} color="text-yellow-500" />
        <StatCard title="Overdue" value={complianceData.overdue} icon={AlertTriangle} color="text-red-500" />
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Overall Safe Sport Compliance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={complianceData.complianceRate} className="flex-1 h-4" />
            <span className="text-3xl font-bold text-green-500">{Math.round(complianceData.complianceRate)}%</span>
          </div>
          <p className="text-sm text-brand-text-secondary mt-2">
            {complianceData.compliantUsers} of {complianceData.totalUsers} users are currently compliant
          </p>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Policy Adoption Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={complianceData.policyAdoptionRate} className="flex-1 h-4" />
            <span className="text-3xl font-bold text-blue-500">{Math.round(complianceData.policyAdoptionRate)}%</span>
          </div>
          <p className="text-sm text-brand-text-secondary mt-2">
            {Math.round(complianceData.policyAdoptionRate)}% of policies applicable to this region are active.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Compliance by Region</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceData.complianceByRegion}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  formatter={(value, name) => [value, name === 'compliant' ? 'Compliant' : 'Total']}
                />
                <Bar dataKey="compliant" fill="#16a34a" name="Compliant" />
                <Bar dataKey="total" fill="#e11d48" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Training Completions (2024)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceData.trainingCompletion}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="completions" stroke="#e11d48" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader><CardTitle>Recent Policy Updates</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceData.policyUpdates.length > 0 ? (
              complianceData.policyUpdates.map(policy => (
                <div key={policy.id} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                  <div>
                    <p className="font-medium text-brand-text-primary">{policy.title}</p>
                    <p className="text-sm text-brand-text-secondary">Version {policy.version} • {new Date(policy.effective_date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                    {policy.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-brand-text-secondary">No recent policy updates for this region.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
