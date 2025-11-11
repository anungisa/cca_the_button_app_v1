
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, CheckCircle, Percent, Users, PieChart as PieChartIcon, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AuditGrantReadiness = () => {

  // Dummy data for demonstration purposes
  const complianceData = {
    totalClubs: 150,
    compliantClubs: 125,
    partialClubs: 20,
    nonCompliantClubs: 5,
  };

  const coverageData = [
    { name: 'Athletes', value: 4000 },
    { name: 'Coaches', value: 800 },
    { name: 'Volunteers', value: 1200 },
    { name: 'Officials', value: 300 },
  ];
  
  const uccmsData = {
    adherence: 98, // percentage
    policiesCovered: 12,
    totalPolicies: 12,
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const compliancePieData = [
    { name: 'Compliant', value: complianceData.compliantClubs },
    { name: 'Partial', value: complianceData.partialClubs },
    { name: 'Non-Compliant', value: complianceData.nonCompliantClubs },
  ];

  const handleGenerateReport = (reportType) => {
    alert(`Generating ${reportType} report... (PDF/DOCX export functionality would be implemented here)`);
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Audit & Grant Readiness</CardTitle>
            <Button variant="outline" onClick={() => handleGenerateReport('Full Audit Package')}>
                <Download className="w-4 h-4 mr-2" />
                Generate Full Audit Package
            </Button>
        </div>
        <p className="text-brand-text-secondary">
          Generate compliance summaries and reports for audits and grant applications.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Compliance Summary */}
        <Card className="bg-brand-charcoal border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              National Compliance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={compliancePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {compliancePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-brand-card-bg/50 rounded-lg">
                  <p className="font-medium text-brand-text-primary">Total Clubs Monitored</p>
                  <p className="text-2xl font-bold text-brand-text-primary">{complianceData.totalClubs}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-brand-card-bg/50 rounded-lg">
                  <p className="font-medium text-brand-text-primary">Overall Compliance Rate</p>
                  <p className="text-2xl font-bold text-green-400">
                    {((complianceData.compliantClubs / complianceData.totalClubs) * 100).toFixed(1)}%
                  </p>
                </div>
                 <Button className="w-full" onClick={() => handleGenerateReport('Compliance PDF')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Compliance Report (PDF)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Program Coverage by Demographic */}
            <Card className="bg-brand-charcoal border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Program Coverage by Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                    {coverageData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <span className="text-brand-text-secondary">{item.name} Trained</span>
                            <Badge variant="secondary">{item.value.toLocaleString()}</Badge>
                        </div>
                    ))}
                </div>
                <Button className="w-full mt-6" onClick={() => handleGenerateReport('Program Coverage DOCX')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Coverage Report (DOCX)
                </Button>
              </CardContent>
            </Card>

            {/* UCCMS Adherence */}
            <Card className="bg-brand-charcoal border-brand-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  UCCMS Adherence Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                    <p className="text-5xl font-bold text-purple-400">{uccmsData.adherence}%</p>
                    <p className="text-brand-text-secondary">Adherence to UCCMS Standards</p>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-brand-card-bg/50 rounded-lg">
                    <span className="text-brand-text-primary">Policies Mapped</span>
                    <span className="font-semibold text-brand-text-primary">{uccmsData.policiesCovered} / {uccmsData.totalPolicies}</span>
                </div>
                 <Button className="w-full mt-6" onClick={() => handleGenerateReport('UCCMS Adherence PDF')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Adherence Report (PDF)
                </Button>
              </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditGrantReadiness;
