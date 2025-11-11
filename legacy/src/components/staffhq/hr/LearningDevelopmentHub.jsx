import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';
export default function LearningDevelopmentHub() {
    return (
    <Card className="bg-brand-card-bg border-brand-border text-center p-8">
      <Award className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
      <p className="font-bold text-brand-text-primary">Learning & Development</p>
      <p className="text-sm text-brand-text-secondary">Management of learning tracks and employee progress will be available here.</p>
    </Card>
  );
}