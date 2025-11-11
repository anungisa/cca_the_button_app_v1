
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Globe,
  Filter,
  Eye,
  Plus,
  Settings,
  Save,
  Play
} from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { exportToCsv } from '../utils/export';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const generateSampleReportData = () => {
  const reportTypes = {
    membership: [],
    events: [],
    compliance: [],
    finance: []
  };

  // Generate membership data
  canadianProvincesAndTerritories.forEach(province => {
    reportTypes.membership.push({
      ma_region: province.abbreviation,
      region_name: province.name,
      total_members: Math.floor(Math.random() * 2000) + 500,
      youth_members: Math.floor(Math.random() * 400) + 100,
      new_registrations: Math.floor(Math.random() * 200) + 50,
      retention_rate: Math.floor(Math.random() * 20) + 75
    });

    // Generate event data
    reportTypes.events.push({
      ma_region: province.abbreviation,
      region_name: province.name,
      events_hosted: Math.floor(Math.random() * 20) + 5,
      total_participants: Math.floor(Math.random() * 500) + 100,
      volunteer_hours: Math.floor(Math.random() * 1000) + 200,
      revenue_generated: Math.floor(Math.random() * 50000) + 10000
    });

    // Generate compliance data
    reportTypes.compliance.push({
      ma_region: province.abbreviation,
      region_name: province.name,
      safe_sport_compliant: Math.floor(Math.random() * 20) + 80,
      policies_updated: Math.random() > 0.5,
      training_completion: Math.floor(Math.random() * 15) + 80,
      overdue_items: Math.floor(Math.random() * 5)
    });

    // Generate finance data
    reportTypes.finance.push({
      ma_region: province.abbreviation,
      region_name: province.name,
      total_revenue: Math.floor(Math.random() * 100000) + 50000,
      membership_revenue: Math.floor(Math.random() * 40000) + 20000,
      event_revenue: Math.floor(Math.random() * 30000) + 15000,
      expenses: Math.floor(Math.random() * 80000) + 40000
    });
  });

  return reportTypes;
};

const MembershipReportCard = ({ data, selectedRegion }) => {
  const filteredData = selectedRegion === 'all' ? data : data.filter(d => d.ma_region === selectedRegion);
  
  const totals = filteredData.reduce((acc, curr) => ({
    total_members: acc.total_members + curr.total_members,
    youth_members: acc.youth_members + curr.youth_members,
    new_registrations: acc.new_registrations + curr.new_registrations,
    avg_retention: acc.avg_retention + curr.retention_rate
  }), { total_members: 0, youth_members: 0, new_registrations: 0, avg_retention: 0 });

  totals.avg_retention = totals.avg_retention / filteredData.length;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Membership Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-text-primary">{totals.total_members.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Total Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{totals.youth_members.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Youth Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">{totals.new_registrations.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">New Registrations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-500">{totals.avg_retention.toFixed(1)}%</p>
            <p className="text-sm text-brand-text-secondary">Avg Retention</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="ma_region" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} />
              <Bar dataKey="total_members" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const EventsReportCard = ({ data, selectedRegion }) => {
  const filteredData = selectedRegion === 'all' ? data : data.filter(d => d.ma_region === selectedRegion);
  
  const totals = filteredData.reduce((acc, curr) => ({
    events_hosted: acc.events_hosted + curr.events_hosted,
    total_participants: acc.total_participants + curr.total_participants,
    volunteer_hours: acc.volunteer_hours + curr.volunteer_hours,
    revenue_generated: acc.revenue_generated + curr.revenue_generated
  }), { events_hosted: 0, total_participants: 0, volunteer_hours: 0, revenue_generated: 0 });

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          Events & Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-text-primary">{totals.events_hosted}</p>
            <p className="text-sm text-brand-text-secondary">Events Hosted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{totals.total_participants.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Participants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">{totals.volunteer_hours.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Volunteer Hours</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-500">${totals.revenue_generated.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Revenue Generated</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="ma_region" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} />
              <Line type="monotone" dataKey="events_hosted" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const ComplianceReportCard = ({ data, selectedRegion }) => {
  const filteredData = selectedRegion === 'all' ? data : data.filter(d => d.ma_region === selectedRegion);
  
  const avgCompliance = filteredData.reduce((acc, curr) => acc + curr.safe_sport_compliant, 0) / filteredData.length;
  const totalOverdueItems = filteredData.reduce((acc, curr) => acc + curr.overdue_items, 0);
  const policiesUpdatedCount = filteredData.filter(d => d.policies_updated).length;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-500" />
          Compliance Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{avgCompliance.toFixed(1)}%</p>
            <p className="text-sm text-brand-text-secondary">Avg Safe Sport</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">{policiesUpdatedCount}</p>
            <p className="text-sm text-brand-text-secondary">Policies Updated</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{totalOverdueItems}</p>
            <p className="text-sm text-brand-text-secondary">Overdue Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-500">{filteredData.length}</p>
            <p className="text-sm text-brand-text-secondary">Regions Reporting</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Compliant', value: avgCompliance },
                  { name: 'Non-Compliant', value: 100 - avgCompliance }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                <Cell fill="#10B981" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const FinanceReportCard = ({ data, selectedRegion }) => {
  const filteredData = selectedRegion === 'all' ? data : data.filter(d => d.ma_region === selectedRegion);
  
  const totals = filteredData.reduce((acc, curr) => ({
    total_revenue: acc.total_revenue + curr.total_revenue,
    membership_revenue: acc.membership_revenue + curr.membership_revenue,
    event_revenue: acc.event_revenue + curr.event_revenue,
    expenses: acc.expenses + curr.expenses
  }), { total_revenue: 0, membership_revenue: 0, event_revenue: 0, expenses: 0 });

  const netIncome = totals.total_revenue - totals.expenses;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Financial Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">${totals.total_revenue.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">${totals.membership_revenue.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Membership Rev</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">${totals.expenses.toLocaleString()}</p>
            <p className="text-sm text-brand-text-secondary">Total Expenses</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${netIncome.toLocaleString()}
            </p>
            <p className="text-sm text-brand-text-secondary">Net Income</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="ma_region" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(value) => `$${(value/1000)}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                formatter={(value) => [`$${value.toLocaleString()}`, '']}
              />
              <Bar dataKey="total_revenue" fill="#10B981" />
              <Bar dataKey="expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const ReportBuilder = ({ selectedRegion, onBuildReport }) => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    dateRange: 'last_30_days',
    metrics: [],
    groupBy: 'ma_region',
    chartType: 'bar',
    includeRegions: selectedRegion === 'all' ? [] : [selectedRegion]
  });

  // Effect to update includeRegions if selectedRegion changes and it's not 'all'
  useEffect(() => {
    if (selectedRegion !== 'all' && !reportConfig.includeRegions.includes(selectedRegion)) {
      setReportConfig(prev => ({
        ...prev,
        includeRegions: [selectedRegion]
      }));
    } else if (selectedRegion === 'all' && reportConfig.includeRegions.length > 0 && !reportConfig.includeRegions.some(r => r === selectedRegion)) {
        // If switching back to 'all' from a specific region, clear the includeRegions
        // unless they manually selected something else already
        // This logic can be adjusted based on desired UX
        // For now, if "all" is selected, we expect the user to select regions explicitly
        setReportConfig(prev => ({
          ...prev,
          includeRegions: []
        }));
    }
  }, [selectedRegion]);


  const availableMetrics = [
    { id: 'total_members', label: 'Total Members', category: 'membership' },
    { id: 'youth_members', label: 'Youth Members', category: 'membership' },
    { id: 'new_registrations', label: 'New Registrations', category: 'membership' },
    { id: 'retention_rate', label: 'Retention Rate', category: 'membership' },
    { id: 'events_hosted', label: 'Events Hosted', category: 'events' },
    { id: 'total_participants', label: 'Total Participants', category: 'events' },
    { id: 'volunteer_hours', label: 'Volunteer Hours', category: 'events' },
    { id: 'revenue_generated', label: 'Revenue Generated', category: 'events' },
    { id: 'safe_sport_compliant', label: 'Safe Sport Compliance %', category: 'compliance' },
    { id: 'training_completion', label: 'Training Completion %', category: 'compliance' },
    { id: 'overdue_items', label: 'Overdue Compliance Items', category: 'compliance' },
    { id: 'total_revenue', label: 'Total Revenue', category: 'finance' },
    { id: 'membership_revenue', label: 'Membership Revenue', category: 'finance' },
    { id: 'event_revenue', label: 'Event Revenue', category: 'finance' },
    { id: 'expenses', label: 'Total Expenses', category: 'finance' }
  ];

  const handleMetricToggle = (metricId) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(id => id !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  const handleRegionToggle = (regionCode) => {
    setReportConfig(prev => ({
      ...prev,
      includeRegions: prev.includeRegions.includes(regionCode)
        ? prev.includeRegions.filter(code => code !== regionCode)
        : [...prev.includeRegions, regionCode]
    }));
  };

  const handleBuildReport = () => {
    if (reportConfig.metrics.length === 0) {
      alert('Please select at least one metric');
      return;
    }
    onBuildReport(reportConfig);
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          Custom Report Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reportName" className="block text-sm font-medium text-brand-text-secondary mb-2">
              Report Name
            </label>
            <Input
              id="reportName"
              placeholder="Enter report name"
              value={reportConfig.name}
              onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-brand-text-secondary mb-2">
              Date Range
            </label>
            <Select 
              value={reportConfig.dateRange} 
              onValueChange={(value) => setReportConfig(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger id="dateRange">
                <SelectValue placeholder="Select a date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                <SelectItem value="current_year">Current Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics Selection */}
        <div>
          <label className="block text-sm font-medium text-brand-text-secondary mb-3">
            Select Metrics to Include
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableMetrics.map(metric => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={reportConfig.metrics.includes(metric.id)}
                  onCheckedChange={() => handleMetricToggle(metric.id)}
                />
                <label htmlFor={metric.id} className="text-sm text-brand-text-primary flex items-center">
                  {metric.label}
                  <Badge variant="secondary" className="ml-2 text-xs bg-brand-charcoal text-brand-text-secondary">
                    {metric.category}
                  </Badge>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="chartType" className="block text-sm font-medium text-brand-text-secondary mb-2">
              Chart Type
            </label>
            <Select 
              value={reportConfig.chartType} 
              onValueChange={(value) => setReportConfig(prev => ({ ...prev, chartType: value }))}
            >
              <SelectTrigger id="chartType">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="table">Data Table</SelectItem>
                {/* <SelectItem value="pie">Pie Chart</SelectItem> */} {/* Pie chart is not generic for multiple metrics */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="groupBy" className="block text-sm font-medium text-brand-text-secondary mb-2">
              Group By
            </label>
            <Select 
              value={reportConfig.groupBy} 
              onValueChange={(value) => setReportConfig(prev => ({ ...prev, groupBy: value }))}
            >
              <SelectTrigger id="groupBy">
                <SelectValue placeholder="Select grouping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ma_region">By Region</SelectItem>
                <SelectItem value="month">By Month (Not implemented in sample data)</SelectItem>
                <SelectItem value="category">By Category (Not implemented in sample data)</SelectItem>
                <SelectItem value="none">No Grouping (Sum totals)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Region Selection */}
        {selectedRegion === 'all' && (
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-3">
              Include Regions (select none for all regions)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {canadianProvincesAndTerritories.map(province => (
                <div key={province.abbreviation} className="flex items-center space-x-2">
                  <Checkbox
                    id={`region-${province.abbreviation}`}
                    checked={reportConfig.includeRegions.includes(province.abbreviation)}
                    onCheckedChange={() => handleRegionToggle(province.abbreviation)}
                  />
                  <label htmlFor={`region-${province.abbreviation}`} className="text-sm text-brand-text-primary">
                    {province.abbreviation}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          <Button onClick={handleBuildReport} className="bg-brand-red hover:bg-red-700">
            <Play className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomReportDisplay = ({ config, data }) => {
  if (!data || !config || config.metrics.length === 0) return null;

  let filteredData = data;
  if (config.includeRegions.length > 0) {
    filteredData = data.filter(d => config.includeRegions.includes(d.ma_region));
  }

  // Aggregate data based on groupBy or sum totals if no grouping
  const chartData = useMemo(() => {
    if (config.groupBy === 'none') {
      // Sum all selected metrics
      const totals = {};
      config.metrics.forEach(metric => {
        totals[metric] = filteredData.reduce((acc, curr) => acc + (curr[metric] || 0), 0);
      });
      // Return a single object for "no grouping" scenario
      return [{ name: 'Total', ...totals }];
    } else if (config.groupBy === 'ma_region') {
      // Group by region, assume 'ma_region' and 'region_name' exist
      return filteredData.map(item => {
        const chartItem = { name: item.region_name || item.ma_region };
        config.metrics.forEach(metric => {
          chartItem[metric] = item[metric] || 0;
        });
        return chartItem;
      });
    }
    // Add other groupBy logics (month, category) if sample data supported them
    return [];
  }, [config.metrics, config.groupBy, filteredData]);


  const renderChart = () => {
    if (chartData.length === 0) return <div className="text-brand-text-secondary text-center py-8">No data to display for the selected configuration.</div>;

    switch(config.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="name" stroke="#888" interval={0} angle={config.groupBy !== 'none' && chartData.length > 5 ? -45 : 0} textAnchor={config.groupBy !== 'none' && chartData.length > 5 ? 'end' : 'middle'} height={config.groupBy !== 'none' && chartData.length > 5 ? 80 : 30} />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} />
              <Legend />
              {config.metrics.map((metric, index) => (
                <Bar key={metric} dataKey={metric} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="name" stroke="#888" interval={0} angle={config.groupBy !== 'none' && chartData.length > 5 ? -45 : 0} textAnchor={config.groupBy !== 'none' && chartData.length > 5 ? 'end' : 'middle'} height={config.groupBy !== 'none' && chartData.length > 5 ? 80 : 30} />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} />
              <Legend />
              {config.metrics.map((metric, index) => (
                <Line 
                  key={metric} 
                  type="monotone" 
                  dataKey={metric} 
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-border">
              <thead className="bg-brand-charcoal">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">
                    {config.groupBy === 'ma_region' ? 'Region' : 'Category'}
                  </th>
                  {config.metrics.map(metric => (
                    <th key={metric} className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">
                      {availableMetrics.find(m => m.id === metric)?.label || metric.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-brand-card-bg divide-y divide-brand-border">
                {chartData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text-primary">
                      {row.name}
                    </td>
                    {config.metrics.map(metric => (
                      <td key={metric} className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">
                        {typeof row[metric] === 'number' 
                          ? (row[metric] > 1000 || metric.includes('revenue') || metric.includes('expenses'))
                            ? row[metric].toLocaleString()
                            : row[metric]
                          : row[metric]
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <div>Chart type not supported</div>;
    }
  };

  const availableMetrics = [
    { id: 'total_members', label: 'Total Members', category: 'membership' },
    { id: 'youth_members', label: 'Youth Members', category: 'membership' },
    { id: 'new_registrations', label: 'New Registrations', category: 'membership' },
    { id: 'retention_rate', label: 'Retention Rate', category: 'membership' },
    { id: 'events_hosted', label: 'Events Hosted', category: 'events' },
    { id: 'total_participants', label: 'Total Participants', category: 'events' },
    { id: 'volunteer_hours', label: 'Volunteer Hours', category: 'events' },
    { id: 'revenue_generated', label: 'Revenue Generated', category: 'events' },
    { id: 'safe_sport_compliant', label: 'Safe Sport Compliance %', category: 'compliance' },
    { id: 'training_completion', label: 'Training Completion %', category: 'compliance' },
    { id: 'overdue_items', label: 'Overdue Compliance Items', category: 'compliance' },
    { id: 'total_revenue', label: 'Total Revenue', category: 'finance' },
    { id: 'membership_revenue', label: 'Membership Revenue', category: 'finance' },
    { id: 'event_revenue', label: 'Event Revenue', category: 'finance' },
    { id: 'expenses', label: 'Total Expenses', category: 'finance' }
  ];

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            {config.name || 'Custom Report'}
          </CardTitle>
          <Button 
            variant="outline" 
            onClick={() => exportToCsv(`custom_report_${config.name.replace(/\s/g, '_') || 'generated'}_${Date.now()}`, chartData)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        {config.description && (
          <p className="text-brand-text-secondary">{config.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default function ReportsHub() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customReport, setCustomReport] = useState(null);
  const [activeTab, setActiveTab] = useState('membership');

  useEffect(() => {
    // Simulate loading report data
    setTimeout(() => {
      setReportData(generateSampleReportData());
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleExportReport = (reportType) => {
    if (!reportData) return;
    
    const data = reportData[reportType];
    const filteredData = selectedRegion === 'all' 
      ? data 
      : data.filter(d => d.ma_region === selectedRegion);

    const timestamp = new Date().toISOString().split('T')[0];
    const regionSuffix = selectedRegion === 'all' ? 'National' : selectedRegion;
    
    exportToCsv(`${reportType}_report_${regionSuffix}_${timestamp}`, filteredData);
  };

  const handleBuildCustomReport = (config) => {
    let dataSource;
    // Determine the primary data source based on the first selected metric's category
    const firstMetricId = config.metrics[0];
    const availableMetrics = [ // Re-define locally or import if needed globally
        { id: 'total_members', category: 'membership' }, { id: 'youth_members', category: 'membership' },
        { id: 'new_registrations', category: 'membership' }, { id: 'retention_rate', category: 'membership' },
        { id: 'events_hosted', category: 'events' }, { id: 'total_participants', category: 'events' },
        { id: 'volunteer_hours', category: 'events' }, { id: 'revenue_generated', category: 'events' },
        { id: 'safe_sport_compliant', category: 'compliance' }, { id: 'training_completion', category: 'compliance' },
        { id: 'overdue_items', category: 'compliance' },
        { id: 'total_revenue', category: 'finance' }, { id: 'membership_revenue', category: 'finance' },
        { id: 'event_revenue', category: 'finance' }, { id: 'expenses', category: 'finance' }
    ];
    const category = availableMetrics.find(m => m.id === firstMetricId)?.category;
    
    switch (category) {
        case 'membership':
            dataSource = reportData?.membership || [];
            break;
        case 'events':
            dataSource = reportData?.events || [];
            break;
        case 'compliance':
            dataSource = reportData?.compliance || [];
            break;
        case 'finance':
            dataSource = reportData?.finance || [];
            break;
        default:
            dataSource = [];
            console.warn("Could not determine primary data source for custom report.");
    }
    
    setCustomReport({ config, data: dataSource });
    setActiveTab('builder'); // Switch to builder tab to show results
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Reports Hub</h2>
            <p className="text-brand-text-secondary">
              Comprehensive reporting and analytics
              {selectedRegion !== 'all' && ` - ${getProvinceNameByAbbreviation(selectedRegion)} View`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-brand-text-secondary" />
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48 bg-brand-card-bg border-brand-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {canadianProvincesAndTerritories.map(province => (
                <SelectItem key={province.abbreviation} value={province.abbreviation}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-brand-card-bg">
          <TabsTrigger value="membership">
            <Users className="w-4 h-4 mr-2" />
            Membership
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <FileText className="w-4 h-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="finance">
            <TrendingUp className="w-4 h-4 mr-2" />
            Finance
          </TabsTrigger>
          <TabsTrigger value="builder">
            <Plus className="w-4 h-4 mr-2" />
            Report Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="membership" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => handleExportReport('membership')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
          <MembershipReportCard data={reportData.membership} selectedRegion={selectedRegion} />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => handleExportReport('events')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
          <EventsReportCard data={reportData.events} selectedRegion={selectedRegion} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => handleExportReport('compliance')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
          <ComplianceReportCard data={reportData.compliance} selectedRegion={selectedRegion} />
        </TabsContent>

        <TabsContent value="finance" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => handleExportReport('finance')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
          <FinanceReportCard data={reportData.finance} selectedRegion={selectedRegion} />
        </TabsContent>

        <TabsContent value="builder" className="mt-6">
          <div className="space-y-6">
            <ReportBuilder 
              selectedRegion={selectedRegion}
              onBuildReport={handleBuildCustomReport}
            />
            {customReport && (
              <CustomReportDisplay 
                config={customReport.config}
                data={customReport.data}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
