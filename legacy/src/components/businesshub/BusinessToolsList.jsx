import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Calendar, Users, BarChart } from 'lucide-react';

const tools = [
  {
    icon: Calculator,
    title: "Budget Planner",
    description: "Plan your club's annual budget with our easy-to-use templates.",
    link: "#"
  },
  {
    icon: Calendar,
    title: "Event Scheduler",
    description: "Organize bonspiels, leagues, and social events.",
    link: "#"
  },
  {
    icon: Users,
    title: "Membership Drive Kit",
    description: "Resources and marketing materials for growing your member base.",
    link: "#"
  },
  {
    icon: BarChart,
    title: "Facility Utilization Tool",
    description: "Optimize your ice time and facility rentals for maximum revenue.",
    link: "#"
  }
];

export default function BusinessToolsList() {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Business Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tools.map(tool => (
          <div key={tool.title} className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
            <div className="flex items-center gap-4">
              <tool.icon className="w-6 h-6 text-brand-red" />
              <div>
                <h4 className="font-semibold text-brand-text-primary">{tool.title}</h4>
                <p className="text-sm text-brand-text-secondary">{tool.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <a href={tool.link}><ArrowRight className="w-4 h-4" /></a>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}