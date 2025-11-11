import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, TrendingUp, Clock, Users, 
  FileText, Download, Filter
} from 'lucide-react';
import { FormDefinition, FormSubmission } from '@/api/entities';

export default function FormAnalytics() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState('all');
  const [timeRange, setTimeRange] = useState('30');
  const [analytics, setAnalytics] = useState({
    totalSubmissions: 0,
    avgCompletionTime: 0,
    completionRate: 0,
    statusBreakdown: {},
    regionBreakdown: {},
    submissionTrend: []
  });

  useEffect(() => {
    loadForms();
    loadAnalytics();
  }, [selectedForm, timeRange]);

  const loadForms = async () => {
    try {
      const formData = await FormDefinition.list();
      setForms(formData || []);
    } catch (error) {
      console.error('Error loading forms:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      // This would be a more sophisticated analytics query in a real implementation
      const submissions = await FormSubmission.list('-created_date', 1000);
      
      let filteredSubmissions = submissions || [];
      
      // Filter by form if specified
      if (selectedForm !== 'all') {
        filteredSubmissions = filteredSubmissions.filter(s => s.form_id === selectedForm);
      }
      
      // Filter by time range
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
      filteredSubmissions = filteredSubmissions.filter(s => 
        new Date(s.created_date) >= cutoffDate
      );

      // Calculate analytics
      const totalSubmissions = filteredSubmissions.length;
      const avgCompletionTime = filteredSubmissions.reduce((sum, s) => 
        sum + (s.completion_time_minutes || 0), 0) / totalSubmissions || 0;
      
      const statusBreakdown = filteredSubmissions.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {});

      const regionBreakdown = filteredSubmissions.reduce((acc, s) => {
        if (s.ma_region) {
          acc[s.ma_region] = (acc[s.ma_region] || 0) + 1;
        }
        return acc;
      }, {});

      // Calculate completion rate (simplified)
      const completedSubmissions = filteredSubmissions.filter(s => 
        ['approved', 'completed'].includes(s.status)
      ).length;
      const completionRate = totalSubmissions > 0 ? 
        (completedSubmissions / totalSubmissions) * 100 : 0;

      setAnalytics({
        totalSubmissions,
        avgCompletionTime: Math.round(avgCompletionTime),
        completionRate: Math.round(completionRate),
        statusBreakdown,
        regionBreakdown,
        submissionTrend: [] // Would calculate daily/weekly trends
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const exportAnalytics = async () => {
    // Export functionality would go here
    console.log('Exporting analytics...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Form Analytics</h2>
          <p className="text-brand-text-secondary">Track form performance and submission data</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              {forms.map(form => (
                <SelectItem key={form.id} value={form.id}>
                  {form.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={exportAnalytics}
            className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Total Submissions</p>
                <p className="text-2xl font-bold text-brand-text-primary">{analytics.totalSubmissions}</p>
              </div>
              <FileText className="w-8 h-8 text-brand-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Avg. Completion Time</p>
                <p className="text-2xl font-bold text-brand-text-primary">{analytics.avgCompletionTime}m</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Completion Rate</p>
                <p className="text-2xl font-bold text-brand-text-primary">{analytics.completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-secondary">Active Forms</p>
                <p className="text-2xl font-bold text-brand-text-primary">{forms.filter(f => f.status === 'active').length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submission Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-red h-2 rounded-full" 
                        style={{ width: `${(count / analytics.totalSubmissions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.regionBreakdown).map(([region, count]) => (
                <div key={region} className="flex items-center justify-between">
                  <span className="font-medium">{region}</span>
                  <div className="flex items-center gap-2">
                    <span>{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-red h-2 rounded-full" 
                        style={{ width: `${(count / analytics.totalSubmissions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Form Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left py-2">Form Name</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Submissions</th>
                  <th className="text-left py-2">Avg. Time</th>
                  <th className="text-left py-2">Completion Rate</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {forms.map(form => (
                  <tr key={form.id} className="border-b border-brand-border/50">
                    <td className="py-3 font-medium">{form.title}</td>
                    <td className="py-3 capitalize">{form.category.replace('_', ' ')}</td>
                    <td className="py-3">{form.analytics?.submission_count || 0}</td>
                    <td className="py-3">{Math.round(form.analytics?.avg_completion_time || 0)}m</td>
                    <td className="py-3">{Math.round(form.analytics?.completion_rate || 0)}%</td>
                    <td className="py-3">
                      <Badge className={form.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                        {form.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}