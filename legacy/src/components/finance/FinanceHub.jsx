
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  FileText,
  Globe,
  Building,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  BarChart3,
  GitCompareArrows // New Icon
} from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinanceData } from '../hooks/useFinanceData';
import AccountsReconciliationHub from './AccountsReconciliationHub';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4'];

const generateSampleFinancialData = () => {
  const financialData = {
    transactions: [],
    budgets: [],
    grants: [],
    sponsorships: [],
    vendors: [],
    approvals: []
  };

  // Generate transactions by region
  canadianProvincesAndTerritories.forEach(province => {
    const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
    
    months.forEach(month => {
      // Revenue transactions
      financialData.transactions.push({
        ma_region: province.abbreviation,
        month,
        type: 'revenue',
        category: 'membership_fees',
        amount: Math.floor(Math.random() * 15000) + 5000,
        description: `${province.name} Membership Revenue`,
        approval_status: 'approved'
      });
      
      financialData.transactions.push({
        ma_region: province.abbreviation,
        month,
        type: 'revenue',
        category: 'event_revenue',
        amount: Math.floor(Math.random() * 25000) + 10000,
        description: `${province.name} Event Revenue`,
        approval_status: 'approved'
      });

      // Expense transactions
      financialData.transactions.push({
        ma_region: province.abbreviation,
        month,
        type: 'expense',
        category: 'operational_expense',
        amount: -(Math.floor(Math.random() * 8000) + 3000),
        description: `${province.name} Operations`,
        approval_status: 'approved'
      });

      // Pending approval transactions
      if (Math.random() > 0.7) {
        financialData.approvals.push({
          ma_region: province.abbreviation,
          type: 'expense',
          category: 'equipment_costs',
          amount: -(Math.floor(Math.random() * 5000) + 1000),
          description: `${province.name} Equipment Purchase`,
          approval_status: 'pending_approval',
          requested_by: 'Regional Manager',
          due_date: '2024-07-15'
        });
      }
    });

    // Regional budgets
    financialData.budgets.push({
      ma_region: province.abbreviation,
      region_name: province.name,
      fiscal_year: 2024,
      total_budget: Math.floor(Math.random() * 200000) + 100000,
      spent_amount: Math.floor(Math.random() * 80000) + 40000,
      committed_amount: Math.floor(Math.random() * 30000) + 10000,
      variance_threshold: 0.1,
      categories: [
        { name: 'Operations', budgeted: 50000, spent: 32000, variance: -0.36 },
        { name: 'Events', budgeted: 40000, spent: 28000, variance: -0.30 },
        { name: 'Development', budgeted: 25000, spent: 15000, variance: -0.40 },
        { name: 'Marketing', budgeted: 15000, spent: 8000, variance: -0.47 }
      ]
    });

    // Grant tracking
    financialData.grants.push({
      ma_region: province.abbreviation,
      grant_name: `${province.name} Sport Development Grant`,
      grantor: 'Provincial Government',
      amount: Math.floor(Math.random() * 50000) + 25000,
      status: ['awarded', 'applied', 'reporting'][Math.floor(Math.random() * 3)],
      due_date: '2024-12-31',
      report_due_date: '2025-01-31'
    });

    // Vendor contracts
    financialData.vendors.push({
      ma_region: province.abbreviation,
      vendor_name: `${province.name} Sports Equipment Ltd`,
      contract_value: Math.floor(Math.random() * 30000) + 10000,
      contract_type: 'equipment_lease',
      status: 'active',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      performance_rating: Math.floor(Math.random() * 2) + 3 // 3-5 rating
    });
  });

  // National level data
  const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
  months.forEach(month => {
    financialData.transactions.push({
      ma_region: null, // National
      month,
      type: 'revenue',
      category: 'sponsorship',
      amount: Math.floor(Math.random() * 100000) + 50000,
      description: 'National Sponsorship Revenue',
      approval_status: 'approved'
    });

    financialData.transactions.push({
      ma_region: null,
      month,
      type: 'expense',
      category: 'staff_costs',
      amount: -(Math.floor(Math.random() * 80000) + 40000),
      description: 'National Staff Costs',
      approval_status: 'approved'
    });
  });

  // National level approvals
  financialData.approvals.push(
    {
      ma_region: null,
      type: 'expense',
      category: 'marketing',
      amount: -25000,
      description: 'National Championship Marketing Campaign',
      approval_status: 'pending_approval',
      requested_by: 'Marketing Director',
      due_date: '2024-07-20'
    },
    {
      ma_region: null,
      type: 'revenue',
      category: 'grants',
      amount: 75000,
      description: 'Sport Canada Development Grant',
      approval_status: 'pending_approval',
      requested_by: 'Executive Director',
      due_date: '2024-07-25'
    }
  );

  return financialData;
};

const FinancialSummaryCards = ({ data, selectedRegion }) => {
  const filteredTransactions = useMemo(() => {
    if (selectedRegion === 'all') return data.transactions;
    return data.transactions.filter(t => t.ma_region === selectedRegion || t.ma_region === null);
  }, [data.transactions, selectedRegion]);

  const summaryStats = useMemo(() => {
    const totalRevenue = filteredTransactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Math.abs(filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));

    const netIncome = totalRevenue - totalExpenses;
    
    const membershipRevenue = filteredTransactions
      .filter(t => t.category === 'membership_fees')
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalRevenue, totalExpenses, netIncome, membershipRevenue };
  }, [filteredTransactions]);

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${summaryStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500',
      trend: '+12.5%'
    },
    {
      title: 'Total Expenses',
      value: `$${summaryStats.totalExpenses.toLocaleString()}`,
      icon: CreditCard,
      color: 'text-red-500',
      trend: '+8.2%'
    },
    {
      title: 'Net Income',
      value: `$${summaryStats.netIncome.toLocaleString()}`,
      icon: summaryStats.netIncome >= 0 ? TrendingUp : TrendingDown,
      color: summaryStats.netIncome >= 0 ? 'text-green-500' : 'text-red-500',
      trend: summaryStats.netIncome >= 0 ? '+15.3%' : '-5.2%'
    },
    {
      title: 'Membership Revenue',
      value: `$${summaryStats.membershipRevenue.toLocaleString()}`,
      icon: Building,
      color: 'text-blue-500',
      trend: '+6.8%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">{card.title}</p>
                <p className="text-2xl font-bold text-brand-text-primary">{card.value}</p>
                <p className="text-xs text-green-500">{card.trend} vs last period</p>
              </div>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const RevenueByRegionChart = ({ data, selectedRegion }) => {
  const chartData = useMemo(() => {
    if (selectedRegion !== 'all') {
      // For specific region, show monthly trends
      return data.transactions
        .filter(t => t.ma_region === selectedRegion && t.type === 'revenue')
        .reduce((acc, t) => {
          const existing = acc.find(item => item.month === t.month);
          if (existing) {
            existing.amount += t.amount;
          } else {
            acc.push({ month: t.month, amount: t.amount });
          }
          return acc;
        }, [])
        .sort((a, b) => new Date(a.month) - new Date(b.month));
    } else {
      // For national view, show by region
      return canadianProvincesAndTerritories.map(province => {
        const regionRevenue = data.transactions
          .filter(t => t.ma_region === province.abbreviation && t.type === 'revenue')
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          region: province.abbreviation,
          amount: regionRevenue
        };
      });
    }
  }, [data.transactions, selectedRegion]);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          {selectedRegion === 'all' ? 'Revenue by Region' : 'Monthly Revenue Trend'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey={selectedRegion === 'all' ? 'region' : 'month'} 
              stroke="#888" 
            />
            <YAxis 
              stroke="#888" 
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
            />
            <Bar dataKey="amount" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const BudgetOverviewPanel = ({ data, selectedRegion }) => {
  const filteredBudgets = useMemo(() => {
    if (selectedRegion === 'all') return data.budgets;
    return data.budgets.filter(b => b.ma_region === selectedRegion);
  }, [data.budgets, selectedRegion]);

  const budgetSummary = useMemo(() => {
    return filteredBudgets.reduce((acc, budget) => {
      acc.totalBudget += budget.total_budget;
      acc.totalSpent += budget.spent_amount;
      acc.totalCommitted += budget.committed_amount;
      return acc;
    }, { totalBudget: 0, totalSpent: 0, totalCommitted: 0 });
  }, [filteredBudgets]);

  const utilizationPercentage = budgetSummary.totalBudget > 0 
    ? ((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100).toFixed(1)
    : 0;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Budget Overview - FY 2024
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-brand-charcoal rounded-lg">
            <p className="text-sm text-brand-text-secondary">Total Budget</p>
            <p className="text-2xl font-bold text-brand-text-primary">
              ${budgetSummary.totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-brand-charcoal rounded-lg">
            <p className="text-sm text-brand-text-secondary">Spent</p>
            <p className="text-2xl font-bold text-orange-500">
              ${budgetSummary.totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-brand-charcoal rounded-lg">
            <p className="text-sm text-brand-text-secondary">Utilization</p>
            <p className="text-2xl font-bold text-blue-500">{utilizationPercentage}%</p>
          </div>
        </div>

        {selectedRegion === 'all' ? (
          <div className="space-y-3">
            <h4 className="font-medium text-brand-text-primary">Regional Budget Status</h4>
            {filteredBudgets.map(budget => {
              const utilization = (budget.spent_amount / budget.total_budget) * 100;
              return (
                <div key={budget.ma_region} className="flex items-center justify-between p-3 bg-brand-charcoal rounded">
                  <div>
                    <span className="font-medium text-brand-text-primary">{budget.region_name}</span>
                    <p className="text-sm text-brand-text-secondary">
                      ${budget.spent_amount.toLocaleString()} / ${budget.total_budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${utilization > 85 ? 'bg-red-500' : utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{utilization.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          filteredBudgets.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-brand-text-primary">Budget Categories</h4>
              {filteredBudgets[0].categories.map(category => {
                const utilization = (category.spent / category.budgeted) * 100;
                const isOverBudget = utilization > 100;
                const varianceColor = category.variance < -0.1 ? 'text-red-500' : category.variance > 0.1 ? 'text-green-500' : 'text-yellow-500';
                
                return (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-brand-charcoal rounded">
                    <div>
                      <span className="font-medium text-brand-text-primary">{category.name}</span>
                      <p className="text-sm text-brand-text-secondary">
                        ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
                      </p>
                      <p className={`text-xs ${varianceColor}`}>
                        Variance: {(category.variance * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${isOverBudget ? 'text-red-500' : ''}`}>
                        {utilization.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

const GrantTrackingPanel = ({ data, selectedRegion }) => {
  const filteredGrants = useMemo(() => {
    if (selectedRegion === 'all') return data.grants;
    return data.grants.filter(g => g.ma_region === selectedRegion);
  }, [data.grants, selectedRegion]);

  const grantStats = useMemo(() => {
    const totalValue = filteredGrants.reduce((sum, g) => sum + g.amount, 0);
    const awardedCount = filteredGrants.filter(g => g.status === 'awarded').length;
    const pendingCount = filteredGrants.filter(g => g.status === 'applied').length;
    const reportingCount = filteredGrants.filter(g => g.status === 'reporting').length;

    return { totalValue, awardedCount, pendingCount, reportingCount };
  }, [filteredGrants]);

  const getStatusBadge = (status) => {
    const config = {
      awarded: { color: 'bg-green-500', text: 'Awarded', icon: CheckCircle },
      applied: { color: 'bg-yellow-500', text: 'Applied', icon: Clock },
      reporting: { color: 'bg-blue-500', text: 'Reporting', icon: FileText }
    };
    const { color, text, icon: Icon } = config[status] || { color: 'bg-gray-500', text: 'Unknown', icon: AlertTriangle };
    return (
      <Badge className={`${color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Grant Tracking & Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-brand-charcoal rounded">
            <p className="text-sm text-brand-text-secondary">Total Value</p>
            <p className="text-lg font-bold text-green-500">
              ${grantStats.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-brand-charcoal rounded">
            <p className="text-sm text-brand-text-secondary">Awarded</p>
            <p className="text-lg font-bold text-green-400">{grantStats.awardedCount}</p>
          </div>
          <div className="text-center p-3 bg-brand-charcoal rounded">
            <p className="text-sm text-brand-text-secondary">Pending</p>
            <p className="text-lg font-bold text-yellow-400">{grantStats.pendingCount}</p>
          </div>
          <div className="text-center p-3 bg-brand-charcoal rounded">
            <p className="text-sm text-brand-text-secondary">Reporting</p>
            <p className="text-lg font-bold text-blue-400">{grantStats.reportingCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredGrants.map((grant, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
              <div>
                <h4 className="font-medium text-brand-text-primary">{grant.grant_name}</h4>
                <p className="text-sm text-brand-text-secondary">
                  {grant.grantor} • ${grant.amount.toLocaleString()}
                </p>
                <p className="text-xs text-brand-text-secondary">
                  Due: {grant.due_date} • Report Due: {grant.report_due_date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedRegion === 'all' && (
                  <Badge variant="outline">{grant.ma_region}</Badge>
                )}
                {getStatusBadge(grant.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const VendorManagementPanel = ({ data, selectedRegion }) => {
  const filteredVendors = useMemo(() => {
    if (selectedRegion === 'all') return data.vendors || [];
    return (data.vendors || []).filter(v => v.ma_region === selectedRegion);
  }, [data.vendors, selectedRegion]);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5 text-orange-500" />
          Vendor Contract Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredVendors.map((vendor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
              <div>
                <h4 className="font-medium text-brand-text-primary">{vendor.vendor_name}</h4>
                <p className="text-sm text-brand-text-secondary">
                  {vendor.contract_type.replace(/_/g, ' ')} • ${vendor.contract_value.toLocaleString()}
                </p>
                <p className="text-xs text-brand-text-secondary">
                  {vendor.start_date} - {vendor.end_date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedRegion === 'all' && (
                  <Badge variant="outline">{vendor.ma_region}</Badge>
                )}
                <Badge className={vendor.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                  {vendor.status}
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-sm">★</span>
                  <span className="text-sm font-medium">{vendor.performance_rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ApprovalQueuePanel = ({ data, selectedRegion }) => {
  const filteredApprovals = useMemo(() => {
    if (selectedRegion === 'all') return data.approvals || [];
    return (data.approvals || []).filter(a => a.ma_region === selectedRegion || a.ma_region === null);
  }, [data.approvals, selectedRegion]);

  const pendingApprovals = filteredApprovals.filter(a => a.approval_status === 'pending_approval');

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-yellow-500" />
          Pending Approvals
          {pendingApprovals.length > 0 && (
            <Badge className="bg-yellow-500 text-black">
              {pendingApprovals.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingApprovals.length === 0 ? (
          <p className="text-brand-text-secondary text-center py-4">No pending approvals</p>
        ) : (
          <div className="space-y-3">
            {pendingApprovals.map((approval, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                <div>
                  <h4 className="font-medium text-brand-text-primary">{approval.description}</h4>
                  <p className="text-sm text-brand-text-secondary">
                    {approval.requested_by} • {approval.type === 'expense' ? '-' : '+'}${Math.abs(approval.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-brand-text-secondary">Due: {approval.due_date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedRegion === 'all' && approval.ma_region && (
                    <Badge variant="outline">{approval.ma_region}</Badge>
                  )}
                  {selectedRegion === 'all' && !approval.ma_region && (
                    <Badge variant="outline">National</Badge>
                  )}
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="text-green-500 border-green-500">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500 border-red-500">
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ExpenseBreakdownChart = ({ data, selectedRegion }) => {
  const chartData = useMemo(() => {
    const filteredTransactions = selectedRegion === 'all' 
      ? data.transactions 
      : data.transactions.filter(t => t.ma_region === selectedRegion || t.ma_region === null);

    const expensesByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const category = t.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        return acc;
      }, {});

    return Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  }, [data.transactions, selectedRegion]);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-500" />
          Expense Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default function FinanceHub({ selectedRegion = 'all' }) {
  const { data: financialData, isLoading, error, refetch } = useFinanceData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-brand-text-primary mb-2">Error Loading Financial Data</h2>
            <p className="text-brand-text-secondary mb-4">{error}</p>
            <Button onClick={refetch} className="bg-brand-red hover:bg-red-700">
            Try Again
            </Button>
        </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="w-8 h-8 text-green-500" />
        <div>
          <h3 className="text-2xl font-bold text-brand-text-primary">Curling Canada Finance Hub</h3>
          <p className="text-brand-text-secondary">
            National financial management, reporting, and reconciliation.
            {selectedRegion !== 'all' && ` (Viewing: ${getProvinceNameByAbbreviation(selectedRegion)})`}
          </p>
        </div>
      </div>

      <FinancialSummaryCards data={financialData} selectedRegion={selectedRegion} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="reconciliation">
            <GitCompareArrows className="w-4 h-4 mr-2" />
            Reconciliation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueByRegionChart data={financialData} selectedRegion={selectedRegion} />
            <ExpenseBreakdownChart data={financialData} selectedRegion={selectedRegion} />
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="mt-6">
          <BudgetOverviewPanel data={financialData} selectedRegion={selectedRegion} />
        </TabsContent>

        <TabsContent value="grants" className="mt-6">
          <GrantTrackingPanel data={financialData} selectedRegion={selectedRegion} />
        </TabsContent>

        <TabsContent value="vendors" className="mt-6">
          <VendorManagementPanel data={financialData} selectedRegion={selectedRegion} />
        </TabsContent>

        <TabsContent value="approvals" className="mt-6">
          <ApprovalQueuePanel data={financialData} selectedRegion={selectedRegion} />
        </TabsContent>

        <TabsContent value="reconciliation" className="mt-6">
            <AccountsReconciliationHub />
        </TabsContent>
      </Tabs>
    </div>
  );
}
