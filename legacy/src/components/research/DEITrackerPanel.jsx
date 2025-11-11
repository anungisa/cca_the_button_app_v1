import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, CheckCircle, Clock } from 'lucide-react';

const projects = [
  {
    name: 'Indigenous Outreach Program',
    status: 'In Progress',
    progress: 60,
    owner: 'Community Development',
    statusColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  },
  {
    name: 'Gender Equity in Coaching Initiative',
    status: 'Completed',
    progress: 100,
    owner: 'High Performance',
    statusColor: 'bg-green-500/20 text-green-300 border-green-500/30'
  },
  {
    name: 'Accessibility Audit of National Events',
    status: 'On Hold',
    progress: 25,
    owner: 'Event Operations',
    statusColor: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }
];

export default function DEITrackerPanel() {
  return (
    <Card className="bg-brand-card-bg border-brand-border h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-brand-red" />
          <span>DEI Project Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-brand-text-primary">{project.name}</h4>
                <Badge variant="outline" className={project.statusColor}>
                  {project.status === 'Completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                  {project.status}
                </Badge>
              </div>
              <Progress value={project.progress} />
              <p className="text-xs text-brand-text-secondary mt-1 text-right">{project.owner}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}