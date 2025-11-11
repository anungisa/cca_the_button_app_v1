import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Users, Shield, Trophy, Building } from 'lucide-react';

export default function OperationalReports() {
  const [generatingReport, setGeneratingReport] = useState(null);

  const reportCategories = [
    {
      title: 'Staff & HR Reports',
      icon: Users,
      reports: [
        { name: 'Staff Directory Report', description: 'Complete staff listing with roles and departments', lastGenerated: '2024-01-15' },
        { name: 'Onboarding Status Report', description: 'Status of new hire onboarding processes', lastGenerated: '2024-01-14' },
        { name: 'Policy Acknowledgment Report', description: 'Staff policy acknowledgment tracking', lastGenerated: '2024-01-13' }
      ]
    },
    {
      title: 'Safe Sport & Compliance',
      icon: Shield,
      reports: [
        { name: 'Compliance Status Report', description: 'Overall compliance status across all requirements', lastGenerated: '2024-01-15' },
        { name: 'Training Completion Report', description: 'Safe Sport and other mandatory training completion', lastGenerated: '2024-01-14' },
        { name: 'Policy Review Schedule', description: 'Upcoming policy reviews and renewals', lastGenerated: '2024-01-12' }
      ]
    },
    {
      title: 'Events & Operations',
      icon: Calendar,
      reports: [
        { name: 'Event Planning Status', description: 'Status of all active event plans and tasks', lastGenerated: '2024-01-15' },
        { name: 'Volunteer Engagement Report', description: 'Volunteer participation and engagement metrics', lastGenerated: '2024-01-13' },
        { name: 'Incident Summary Report', description: 'Summary of incidents and resolution status', lastGenerated: '2024-01-11' }
      ]
    },
    {
      title: 'Club & Community',
      icon: Building,
      reports: [
        { name: 'Club Health Assessment', description: 'Comprehensive club health and engagement metrics', lastGenerated: '2024-01-14' },
        { name: 'Community Activity Report', description: 'Community engagement and content metrics', lastGenerated: '2024-01-13' },
        { name: 'Membership Analytics', description: 'Membership growth and retention analysis', lastGenerated: '2024-01-12' }
      ]
    }
  ];

  const handleGenerateReport = async (reportName) => {
    setGeneratingReport(reportName);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingReport(null);
    
    // In a real implementation, this would trigger the actual report generation
    console.log(`Generated report: ${reportName}`);
  };

  const ReportCategoryCard = ({ category }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <category.icon className="w-5 h-5 text-brand-red" />
          {category.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {category.reports.map((report, index) => (
            <div key={index} className="p-3 bg-brand-charcoal rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-brand-text-primary">{report.name}</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateReport(report.name)}
                    disabled={generatingReport === report.name}
                  >
                    {generatingReport === report.name ? (
                      <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-1" />
                        Generate
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-brand-text-secondary mb-2">{report.description}</p>
              <p className="text-xs text-brand-text-muted">Last generated: {report.lastGenerated}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-brand-text-primary">Standard Operational Reports</h3>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportCategories.map((category, index) => (
          <ReportCategoryCard key={index} category={category} />
        ))}
      </div>
    </div>
  );
}