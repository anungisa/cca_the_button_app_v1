import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  FileText,
  Target,
  BarChart3
} from 'lucide-react';

const executiveMetrics = [
  {
    title: "Strategic Initiatives",
    value: "12/15",
    change: "On Track",
    icon: Target,
    color: "text-green-400"
  },
  {
    title: "Board Compliance",
    value: "98%",
    change: "Excellent",
    icon: CheckCircle,
    color: "text-green-400"
  },
  {
    title: "Risk Items",
    value: "3",
    change: "Medium Priority",
    icon: AlertTriangle,
    color: "text-yellow-400"
  },
  {
    title: "Stakeholder Satisfaction",
    value: "4.2/5",
    change: "+0.3 from last quarter",
    icon: Users,
    color: "text-blue-400"
  }
];

const upcomingMilestones = [
  { title: "Q1 Board Meeting", date: "Jan 25", status: "ready" },
  { title: "Strategic Plan Review", date: "Feb 15", status: "in_progress" },
  { title: "Annual General Meeting", date: "Mar 20", status: "planning" },
  { title: "Governance Policy Update", date: "Apr 10", status: "pending" }
];

const platformAlignment = [
  { platform: "The Button", adoption: 85, health: "excellent" },
  { platform: "CurlingReg", adoption: 92, health: "good" },
  { platform: "Scoring Hub", adoption: 78, health: "good" },
  { platform: "Business Hub", adoption: 65, health: "fair" }
];

export default function ExecutiveHub() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-text-primary">Executive Dashboard</h2>
        <p className="text-brand-text-secondary">Strategic oversight and organizational alignment</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {executiveMetrics.map((metric, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              <p className="text-xs text-brand-text-secondary">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategic Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMilestones.map((milestone, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                <div>
                  <p className="font-medium text-brand-text-primary">{milestone.title}</p>
                  <p className="text-sm text-brand-text-secondary">{milestone.date}</p>
                </div>
                <Badge 
                  className={
                    milestone.status === 'ready' ? 'bg-green-600/20 text-green-300' :
                    milestone.status === 'in_progress' ? 'bg-blue-600/20 text-blue-300' :
                    milestone.status === 'planning' ? 'bg-yellow-600/20 text-yellow-300' :
                    'bg-gray-600/20 text-gray-300'
                  }
                >
                  {milestone.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Platform Alignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformAlignment.map((platform, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-brand-text-primary">{platform.platform}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-brand-text-secondary">{platform.adoption}%</span>
                    <Badge 
                      className={
                        platform.health === 'excellent' ? 'bg-green-600/20 text-green-300' :
                        platform.health === 'good' ? 'bg-blue-600/20 text-blue-300' :
                        'bg-yellow-600/20 text-yellow-300'
                      }
                    >
                      {platform.health}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-brand-charcoal rounded-full h-2">
                  <div 
                    className="bg-brand-red h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${platform.adoption}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Executive Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Review Board Papers
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Strategic Dashboard
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Stakeholder Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}