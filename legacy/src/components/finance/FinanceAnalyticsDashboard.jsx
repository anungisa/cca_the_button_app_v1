import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

const revenueData = [
  { month: 'Jun', '2023': 250000, '2024': 280000 },
  { month: 'Jul', '2023': 260000, '2024': 295000 },
  { month: 'Aug', '2023': 240000, '2024': 270000 },
  { month: 'Sep', '2023': 320000, '2024': 350000 },
  { month: 'Oct', '2023': 380000, '2024': 410000 },
  { month: 'Nov', '2023': 410000, '2024': 450000 },
  { month: 'Dec', '2023': 450000, '2024': 490000 },
  { month: 'Jan', '2024': 480000 },
  { month: 'Feb', '2024': 420000 },
  { month: 'Mar', '2024': 510000 },
  { month: 'Apr', '2024': 490000 },
  { month: 'May', '2024': 380000 },
];

const expenseData = [
  { name: 'Operations', value: 89500 },
  { name: 'Marketing', value: 62100 },
  { name: 'Events', value: 145200 },
  { name: 'Technology', value: 31800 },
  { name: 'Salaries', value: 250000 },
  { name: 'Travel', value: 45000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

export default function FinanceAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('current_fy');

  const formatYAxis = (tickItem) => {
    return `$${(tickItem / 1000).toFixed(0)}k`;
  };

  const currencyFormatter = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-brand-text-primary">Financial Analytics</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current_fy">Current Fiscal Year</SelectItem>
            <SelectItem value="last_12_months">Last 12 Months</SelectItem>
            <SelectItem value="calendar_year">Calendar Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-red" />
              Monthly Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData.slice(0, 12)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip formatter={currencyFormatter} />
                <Legend />
                <Bar dataKey="2024" fill="#8884d8" name="Current FY" />
                <Bar dataKey="2023" fill="#82ca9d" name="Previous FY" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-brand-red" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={currencyFormatter} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-red" />
            Year-Over-Year Revenue Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip formatter={currencyFormatter} />
              <Legend />
              <Line type="monotone" dataKey="2024" stroke="#8884d8" name="Current FY" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="2023" stroke="#82ca9d" name="Previous FY" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}