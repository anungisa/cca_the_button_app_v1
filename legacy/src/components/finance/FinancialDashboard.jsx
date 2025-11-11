import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialTransaction } from '@/api/entities';
import { Budget } from '@/api/entities';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function FinancialDashboard() {
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    budgetUtilization: 0,
    monthlyTrends: [],
    categoryBreakdown: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFinancialData = async () => {
      setIsLoading(true);
      try {
        const [transactions, budgets] = await Promise.all([
          FinancialTransaction.list('-created_date', 100),
          Budget.list()
        ]);

        const totalRevenue = transactions
          .filter(t => t.transaction_type === 'revenue')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
          .filter(t => t.transaction_type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const netIncome = totalRevenue - totalExpenses;

        // Mock data for charts
        const monthlyTrends = [
          { month: 'Jan', revenue: 125000, expenses: 95000 },
          { month: 'Feb', revenue: 132000, expenses: 98000 },
          { month: 'Mar', revenue: 128000, expenses: 102000 },
          { month: 'Apr', revenue: 145000, expenses: 105000 },
          { month: 'May', revenue: 158000, expenses: 108000 },
          { month: 'Jun', revenue: 162000, expenses: 112000 }
        ];

        const categoryBreakdown = [
          { name: 'Sponsorship', value: 45, color: '#16a34a' },
          { name: 'Membership', value: 25, color: '#3b82f6' },
          { name: 'Events', value: 20, color: '#f59e0b' },
          { name: 'Grants', value: 10, color: '#8b5cf6' }
        ];

        setFinancialData({
          totalRevenue,
          totalExpenses,
          netIncome,
          budgetUtilization: 78.5,
          monthlyTrends,
          categoryBreakdown
        });
      } catch (error) {
        console.error('Error loading financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinancialData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  const formatCurrency = (amount) => new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(financialData.totalRevenue)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(financialData.totalExpenses)}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Net Income</p>
                <p className={`text-2xl font-bold ${financialData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(financialData.netIncome)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Budget Utilization</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {financialData.budgetUtilization}%
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financialData.monthlyTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialData.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {financialData.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}