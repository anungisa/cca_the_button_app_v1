import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function DemoBanner() {
  return (
    <Card className="bg-blue-900/20 border-blue-500/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-400" />
          <div>
            <h4 className="font-semibold text-brand-text-primary">Demonstration Mode</h4>
            <p className="text-sm text-brand-text-secondary">
              Live data is not available. You are viewing a demonstration stream.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}