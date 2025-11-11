
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceItem } from '@/api/entities';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Scale, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function ComplianceOverviewPanel({ selectedRegion }) {
  const [complianceData, setComplianceData] = useState({
    totalItems: 0,
    completed: 0,
    overdue: 0,
    upcoming: 0,
    byRiskLevel: [],
    byCategory: []
  });
  const [recentItems, setRecentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComplianceData = async () => {
      setIsLoading(true);
      try {
        const allItems = await ComplianceItem.list('-due_date');
        
        const items = selectedRegion === 'all' 
          ? allItems 
          : allItems.filter(item => item.ma_region === selectedRegion);
        
        const completed = items.filter(i => i.status === 'completed').length;
        const overdue = items.filter(i => i.status === 'overdue').length;
        const upcoming = items.filter(i => i.status === 'not_started' && new Date(i.due_date) > new Date()).length;
        
        const byRiskLevel = [
          { name: 'Low', value: items.filter(i => i.risk_level === 'low').length, color: '#16a34a' },
          { name: 'Medium', value: items.filter(i => i.risk_level === 'medium').length, color: '#f59e0b' },
          { name: 'High', value: items.filter(i => i.risk_level === 'high').length, color: '#dc2626' },
          { name: 'Critical', value: items.filter(i => i.risk_level === 'critical').length, color: '#991b1b' }
        ];

        const byCategory = [
          { name: 'Safe Sport', count: items.filter(i => i.compliance_type === 'safe_sport').length },
          { name: 'CRA Filing', count: items.filter(i => i.compliance_type === 'cra_filing').length },
          { name: 'Sport Canada', count: items.filter(i => i.compliance_type === 'sport_canada_report').length },
          { name: 'Provincial', count: items.filter(i => i.compliance_type === 'provincial_registration').length },
          { name: 'Audit', count: items.filter(i => i.compliance_type === 'audit_requirement').length }
        ];

        setComplianceData({
          totalItems: items.length,
          completed,
          overdue,
          upcoming,
          byRiskLevel,
          byCategory
        });
        setRecentItems(items.slice(0, 5));
      } catch (error) {
        console.error('Error loading compliance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadComplianceData();
  }, [selectedRegion]);

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

  const completionRate = complianceData.totalItems > 0 ? Math.round((complianceData.completed / complianceData.totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Compliance Items" value={complianceData.totalItems} icon={Scale} />
        <StatCard title="Completed" value={complianceData.completed} icon={CheckCircle} color="text-green-500" />
        <StatCard title="Overdue" value={complianceData.overdue} icon={AlertTriangle} color="text-red-500" />
        <StatCard title="Upcoming" value={complianceData.upcoming} icon={Clock} color="text-yellow-500" />
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Overall Compliance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={completionRate} className="flex-1 h-3" />
            <span className="text-2xl font-bold">{completionRate}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Items by Risk Level</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={complianceData.byRiskLevel}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {complianceData.byRiskLevel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader><CardTitle>Items by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complianceData.byCategory}>
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="count" fill="#e11d48" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader><CardTitle>Recent Compliance Items</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                <div>
                  <p className="font-medium text-brand-text-primary">{item.title}</p>
                  <p className="text-sm text-brand-text-secondary">Due: {new Date(item.due_date).toLocaleDateString()}</p>
                </div>
                <Badge variant={
                  item.status === 'completed' ? 'default' :
                  item.status === 'overdue' ? 'destructive' : 'secondary'
                }>
                  {item.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
