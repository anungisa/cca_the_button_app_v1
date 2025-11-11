import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Repeat, Target } from 'lucide-react';

export default function DrillLogFeed({ drills }) {
    if (!drills || drills.length === 0) {
        return (
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Repeat /> Drill Log
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-brand-text-secondary">No drills logged yet.</p>
                </CardContent>
            </Card>
        );
    }
  
    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Repeat /> Drill Log
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {drills.map((drill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                        <div className="flex-1">
                            <p className="font-semibold text-brand-text-primary">{drill.title}</p>
                            <p className="text-sm text-brand-text-secondary">{new Date(drill.date).toLocaleDateString()}</p>
                        </div>
                        <Badge className="text-lg" variant="outline">
                            {drill.score}/5
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}