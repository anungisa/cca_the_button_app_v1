import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile } from 'lucide-react';
export default function EmployeeFeedbackHub() {
  return (
    <Card className="bg-brand-card-bg border-brand-border text-center p-8">
      <Smile className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
      <p className="font-bold text-brand-text-primary">Employee Feedback Hub</p>
      <p className="text-sm text-brand-text-secondary">Pulse surveys and feedback analysis will be shown here.</p>
    </Card>
  );
}