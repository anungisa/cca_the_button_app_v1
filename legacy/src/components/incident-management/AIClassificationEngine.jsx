import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Zap, Check, Brain } from 'lucide-react';

export default function AIClassificationEngine({ incidents, onRetrain }) {
  const [isTraining, setIsTraining] = useState(false);
  const [accuracy, setAccuracy] = useState(92.3);

  const handleRetrain = async () => {
    setIsTraining(true);
    // Simulate retraining process
    await new Promise(resolve => setTimeout(resolve, 2500));
    setAccuracy(prev => Math.min(99, prev + Math.random() * 2));
    setIsTraining(false);
    if (onRetrain) onRetrain();
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-teal-400" />
          AI Incident Classification Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-brand-text-secondary">
          This model automatically categorizes and prioritizes incoming incidents based on their content.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <p className="text-sm font-medium text-brand-text-primary">Current Model Accuracy</p>
            <p className="text-2xl font-bold text-teal-400">{accuracy.toFixed(1)}%</p>
          </div>
          <Progress value={accuracy} className="h-2" />
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleRetrain} disabled={isTraining}>
            {isTraining ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Retraining...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Retrain on New Data
              </>
            )}
          </Button>
          <p className="text-sm text-brand-text-secondary">
            Based on {incidents.length} available incident records.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}