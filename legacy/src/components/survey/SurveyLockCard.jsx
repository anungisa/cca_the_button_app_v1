import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, FileText } from 'lucide-react';

const SurveyLockCard = ({ onStartSurvey }) => {
  return (
    <Card className="bg-brand-card-bg border-brand-border max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <Lock className="w-12 h-12 text-brand-red mx-auto mb-4" />
        <h2 className="text-xl font-bold text-brand-text-primary mb-2">
          Unlock Your Club's Benchmarks
        </h2>
        <p className="text-brand-text-secondary mb-6">
          Complete the National Club Survey to access valuable insights and compare your club's performance against regional and national averages.
        </p>
        <Button onClick={onStartSurvey} className="bg-brand-red hover:bg-red-700">
          <FileText className="w-4 h-4 mr-2" />
          Start or Continue Survey
        </Button>
      </CardContent>
    </Card>
  );
};

export default SurveyLockCard;