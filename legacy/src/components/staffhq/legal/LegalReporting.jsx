import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Scale,
  Shield,
  Users,
  Calendar,
  DollarSign,
  Eye
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

export default function LegalReporting() {
  const [timeRange, setTimeRange] = useState('current_year');
  const [reportType, setReportType] = useState('overview');

  // Legal metrics data
  const complianceData = [
    { category: 'Privacy Policies', current: 98, target: 100, status: 'good' },
    { category: 'Employment Contracts', current: 94, target: 100, status: 'good' },
    { category: 'Safe Sport Training', current: 87, target: 95, status: 'warning' },
    { category: 'Board Governance', current: 100, target: 100, status: 'excellent' },
    { category: 'Sponsorship Agreements', current: 92, target: 98, status: 'good' },
    { category: 'Intellectual Property', current: 76, target: 90, status: 'attention' }
  ];

  const legalCasesData = [
    { month: 'Jan', active: 3, resolved: 2, new: 1 },
    { month: 'Feb', active: 4, resolved: 1, new: 2 },
    { month: 'Mar', active: 2, resolved: 3, new: 1 },
    { month: 'Apr', active: 5, resolved: 1, new: 4 },
    { month: 'May', active: 3, resolved: 2, new: 0 },
    { month: 'Jun', active: 4, resolved: 1, new: 2 }
  ];

  const contractTypesData = [
    { name: 'Sponsorship', value: 45, count: 23 },
    { name: 'Employment', value: 25, count: 12 },
    { name: 'Vendor/Supplier', value: 15, count: 8 },
    { name: 'Venue Rental', value: 10, count: 5 },
    { name: 'Media Rights', value: 3, count: 2 },
    { name: 'Other', value: 2, count: 1 }
  ];

  const riskAssessmentData = [
    { area: 'Data Privacy', risk: 25, mitigation: 90 },
    { area: 'Employment Law', risk: 45, mitigation: 85 },
    { area: 'Safe Sport', risk: 30, mitigation: 95 },
    { area: 'IP Protection', risk: 55, mitigation: 70 },
    { area: 'Contract Disputes', risk: 20, mitigation: 88 },
    { area: 'Regulatory Compliance', risk: 35, mitigation: 92 }
  ];

  const budgetData = [
    { category: 'External Legal Counsel', budgeted: 150000, spent: 89500, percentage: 59.7 },
    { category: 'Compliance Training', budgeted: 25000, spent: 18200, percentage: 72.8 },
    { category: 'Legal Software/Tools', budgeted: 35000, spent: 31800, percentage: 90.9 },
    { category: 'Document Management', budgeted: 15000, spent: 12400, percentage: 82.7 },
    { category: 'Risk Assessment', budgeted: 20000, spent: 8900, percentage: 44.5 },
    { category: 'Insurance Premiums', budgeted: 45000, spent: 45000, percentage: 100 }
  ];

  const getComplianceColor = (status) => {
    const colors = {
      excellent: 'bg-green-600',
      good: 'bg-blue-600',
      warning: 'bg-yellow-600',
      attention: 'bg-red-600'
    };
    return colors[status] || 'bg-gray-600';
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl font-semibold text-brand-text-primary">Legal Department Reporting</h3>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_year">Current Year</SelectItem>
              <SelectItem value="last_12_months">Last 12 Months</SelectItem>
              <SelectItem value="quarter">Current Quarter</SelectItem>
              <SelectItem value="month">Current Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg">
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="cases">Legal Cases</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="budget">Budget & Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Status Cards */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-red" />
                  Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complianceData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-text-primary">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-brand-text-secondary">{item.current}%</span>
                        <Badge className={`${getComplianceColor(item.status)} text-white`}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.current} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Assessment Chart */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-brand-red" />
                  Risk Assessment & Mitigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskAssessmentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="area" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="risk" fill="#ff6b6b" name="Risk Level" />
                    <Bar dataKey="mitigation" fill="#51cf66" name="Mitigation %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Legal Cases Trend */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-brand-red" />
                  Legal Cases Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={legalCasesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="active" stroke="#8884d8" name="Active Cases" />
                    <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved" />
                    <Line type="monotone" dataKey="new" stroke="#ffc658" name="New Cases" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Case Statistics */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-red" />
                  Case Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-brand-charcoal rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">12</div>
                    <div className="text-sm text-brand-text-secondary">Active Cases</div>
                  </div>
                  <div className="text-center p-4 bg-brand-charcoal rounded-lg">
                    <div className="text-2xl font-bold text-green-400">89%</div>
                    <div className="text-sm text-brand-text-secondary">Resolution Rate</div>
                  </div>
                  <div className="text-center p-4 bg-brand-charcoal rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">45</div>
                    <div className="text-sm text-brand-text-secondary">Avg Days to Resolve</div>
                  </div>
                  <div className="text-center p-4 bg-brand-charcoal rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">$127K</div>
                    <div className="text-sm text-brand-text-secondary">Legal Costs YTD</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-brand-text-primary">Case Categories</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-brand-text-secondary">Employment</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-brand-border rounded-full h-2">
                          <div className="bg-brand-red h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm text-brand-text-primary">6</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-brand-text-secondary">Contract Disputes</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-brand-border rounded-full h-2">
                          <div className="bg-brand-red h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <span className="text-sm text-brand-text-primary">3</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-brand-text-secondary">IP/Trademark</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-brand-border rounded-full h-2">
                          <div className="bg-brand-red h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        <span className="text-sm text-brand-text-primary">2</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-brand-text-secondary">Regulatory</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-brand-border rounded-full h-2">
                          <div className="bg-brand-red h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-sm text-brand-text-primary">1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contract Types Distribution */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-brand-red" />
                  Contract Types Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contractTypesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {contractTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value}% (${props.payload.count} contracts)`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Contract Metrics */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-red" />
                  Contract Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-brand-charcoal rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">51</div>
                    <div className="text-sm text-brand-text-secondary">Active Contracts</div>
                  </div>
                  <div className="text-center p-4 bg-brand-charcoal rounded-lg">
                    <div className="text-2xl font-bold text-green-400">$2.4M</div>
                    <div className="text-sm text-brand-text-secondary">Total Contract Value</div>
                  </div>
                  <div className="text-center p-4 bg-brand-charcoal rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">14</div>
                    <div className="text-sm text-brand-text-secondary">Expiring in 90 Days</div>
                  </div>
                  <div className="text-center p-4 bg-brand-charcoal rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">7</div>
                    <div className="text-sm text-brand-text-secondary">Pending Review</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-brand-text-primary">Contract Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-brand-text-primary">Fully Executed</span>
                      </div>
                      <Badge className="bg-green-600 text-white">38</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-brand-text-primary">In Negotiation</span>
                      </div>
                      <Badge className="bg-yellow-600 text-white">7</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-brand-text-primary">Under Review</span>
                      </div>
                      <Badge className="bg-blue-600 text-white">4</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-brand-charcoal rounded">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-brand-text-primary">Expired/Expiring</span>
                      </div>
                      <Badge className="bg-red-600 text-white">2</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget vs Spend */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-brand-red" />
                  Legal Department Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
                    <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget Utilization */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-red" />
                  Budget Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgetData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-text-primary">{item.category}</span>
                      <div className="text-right">
                        <div className="text-sm text-brand-text-primary">
                          {formatCurrency(item.spent)} / {formatCurrency(item.budgeted)}
                        </div>
                        <div className="text-xs text-brand-text-secondary">
                          {item.percentage.toFixed(1)}% utilized
                        </div>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}

                <div className="pt-4 border-t border-brand-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-brand-text-primary">Total Budget</span>
                    <span className="font-bold text-brand-text-primary">
                      {formatCurrency(budgetData.reduce((sum, item) => sum + item.budgeted, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-brand-text-primary">Total Spent</span>
                    <span className="font-bold text-green-400">
                      {formatCurrency(budgetData.reduce((sum, item) => sum + item.spent, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-brand-text-primary">Remaining</span>
                    <span className="font-bold text-blue-400">
                      {formatCurrency(budgetData.reduce((sum, item) => sum + (item.budgeted - item.spent), 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}