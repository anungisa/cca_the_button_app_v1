import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ClubSurveyPanel() {
  const navigate = useNavigate();

  return (
    <Card className="bg-brand-card-bg border-brand-border h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="w-5 h-5 text-brand-red" />
          <span>Club Data Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg">
          <div>
            <p className="text-brand-text-secondary">Completed Surveys</p>
            <p className="text-2xl font-bold text-brand-text-primary">111 / 150</p>
          </div>
          <div className="text-right">
            <p className="text-brand-text-secondary">Completion Rate</p>
            <p className="text-2xl font-bold text-brand-text-primary">74%</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg">
          <p className="font-semibold text-brand-text-primary">Key Insight: 65% of clubs report needing facility upgrades in the next 5 years.</p>
          <PieChart className="w-8 h-8 text-blue-400" />
        </div>
        <Button className="w-full bg-brand-red hover:bg-red-700" onClick={() => navigate(createPageUrl('SurveyAnalytics'))}>
          View Detailed Analytics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}