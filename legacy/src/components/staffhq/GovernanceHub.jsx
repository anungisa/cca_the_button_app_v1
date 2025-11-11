import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Users,
  Shield,
  Clock,
  PlusCircle,
  Gavel
} from 'lucide-react';

const complianceItems = [
  { title: "Annual Audit", status: "completed", dueDate: "Dec 31, 2023", priority: "high" },
  { title: "Board Policy Review", status: "in_progress", dueDate: "Feb 15, 2024", priority: "medium" },
  { title: "Safe Sport Compliance", status: "overdue", dueDate: "Jan 15, 2024", priority: "high" },
  { title: "MA Agreement Updates", status: "pending", dueDate: "Mar 1, 2024", priority: "low" }
];

const boardMeetings = [
  { title: "Q1 Board Meeting", date: "Jan 25, 2024", status: "upcoming", attendees: 12 },
  { title: "Executive Committee", date: "Feb 8, 2024", status: "scheduled", attendees: 5 },
  { title: "Governance Committee", date: "Feb 22, 2024", status: "scheduled", attendees: 7 }
];

const policyMetrics = [
  { title: "Active Policies", value: "47", change: "+3 this quarter" },
  { title: "Pending Reviews", value: "8", change: "2 overdue" },
  { title: "Board Compliance", value: "94%", change: "+2% from last quarter" },
  { title: "MA Compliance", value: "87%", change: "3 regions at risk" }
];

export default function GovernanceHub() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Governance & Compliance</h2>
          <p className="text-brand-text-secondary">Board operations, policy management, and regulatory compliance</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Policy
        </Button>
      </div>

      {/* Compliance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {policyMetrics.map((metric, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Gavel className="h-4 w-4 text-brand-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-text-primary">{metric.value}</div>
              <p className="text-xs text-brand-text-secondary">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Tracking */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Compliance Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-brand-text-primary">{item.title}</p>
                  <p className="text-sm text-brand-text-secondary">Due: {item.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={
                      item.status === 'completed' ? 'bg-green-600/20 text-green-300' :
                      item.status === 'in_progress' ? 'bg-blue-600/20 text-blue-300' :
                      item.status === 'overdue' ? 'bg-red-600/20 text-red-300' :
                      'bg-gray-600/20 text-gray-300'
                    }
                  >
                    {item.status.replace('_', ' ')}
                  </Badge>
                  {item.status === 'overdue' && (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Board Meetings */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Board & Committee Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {boardMeetings.map((meeting, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded-lg">
                <div>
                  <p className="font-medium text-brand-text-primary">{meeting.title}</p>
                  <p className="text-sm text-brand-text-secondary">{meeting.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-brand-text-secondary">{meeting.attendees} attendees</span>
                  <Badge className="bg-blue-600/20 text-blue-300">
                    {meeting.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Policy Management */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Policy Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Policy Library
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Board Portal
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Approval Workflow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}