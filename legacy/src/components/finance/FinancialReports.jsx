import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';

export default function FinancialReports() {
  const [reports, setReports] = useState([
    { id: 'r1', name: 'FY2024 P&L Statement', type: 'Profit & Loss', date: '2024-06-05', format: 'PDF' },
    { id: 'r2', name: 'Q2 2024 Balance Sheet', type: 'Balance Sheet', date: '2024-04-15', format: 'Excel' },
    { id: 'r3', name: 'May 2024 Cash Flow', type: 'Cash Flow', date: '2024-06-01', format: 'PDF' },
  ]);

  const ReportGenerator = ({ title, options }) => (
    <Card className="bg-brand-charcoal">
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select defaultValue="fy2024">
          <SelectTrigger>
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fy2024">Fiscal Year 2024</SelectItem>
            <SelectItem value="q2_2024">Q2 2024</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" /> PDF</Button>
          <Button variant="outline" className="flex-1"><FileSpreadsheet className="w-4 h-4 mr-2" /> Excel</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-brand-red"/>Generate Financial Reports</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportGenerator title="Profit & Loss Statement" />
            <ReportGenerator title="Balance Sheet" />
            <ReportGenerator title="Cash Flow Statement" />
            <ReportGenerator title="Budget vs. Actuals" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-brand-charcoal rounded-lg">
                <div>
                  <p className="font-medium text-brand-text-primary">{report.name}</p>
                  <p className="text-sm text-brand-text-secondary">{format(new Date(report.date), 'MMM d, yyyy')}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}