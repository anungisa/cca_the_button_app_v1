import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Map, Activity } from 'lucide-react';

const ClubIntelligence = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-green-400" />
            Engagement Index Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-brand-text-secondary">
            <p>Club engagement heatmap by region will be displayed here.</p>
            <p className="text-sm mt-2">DOMO integration pending.</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5 text-purple-400" />
            Club Growth Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-brand-text-secondary">
            <p>Year-over-year membership growth will be displayed here.</p>
            <p className="text-sm mt-2">DOMO integration pending.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubIntelligence;