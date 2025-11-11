import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { timeSince } from '../utils/timeSince';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function SurveyStatusCard({ status }) {
  const {
    clubName,
    year,
    completionPercentage,
    isComplete,
    lastSaved
  } = status;

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-lg">Survey Status: {year}</CardTitle>
        <p className="text-brand-text-secondary text-sm">{clubName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isComplete ? (
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Submitted</p>
              <p className="text-xs">Thank you for your submission.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-yellow-400">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <p className="font-semibold">In Progress</p>
              <p className="text-xs">Please complete and submit.</p>
            </div>
          </div>
        )}
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-brand-text-primary">Completion</span>
            <span className="text-sm text-brand-text-secondary">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} />
        </div>

        {lastSaved && !isComplete && (
          <div className="flex items-center text-xs text-brand-text-secondary gap-2">
            <Clock className="w-3 h-3" />
            <span>Last saved: {timeSince(new Date(lastSaved))}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}