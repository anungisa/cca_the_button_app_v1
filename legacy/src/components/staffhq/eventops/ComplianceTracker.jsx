import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ComplianceItem } from '@/api/entities';
import { SafeSportCompletion } from '@/api/entities';
import { Volunteer } from '@/api/entities';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ComplianceOverview = ({ event }) => {
  const [complianceStats, setComplianceStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (event) {
      loadComplianceStats();
    }
  }, [event]);

  const loadComplianceStats = async () => {
    try {
      // Get all compliance items for this event type
      const complianceItems = await ComplianceItem.filter({
        compliance_type: 'safe_sport'
      });

      // Get volunteer compliance data
      const volunteers = await Volunteer.list();
      const eventVolunteers = volunteers.filter(v => 
        v.ma_region === event.ma_region ||
        v.events?.some(e => e.event_name.includes(event.name.split(' ')[0]))
      );

      const safeSpotCompletions = await SafeSportCompletion.list();

      let completed = 0;
      let pending = 0;
      let overdue = 0;

      eventVolunteers.forEach(volunteer => {
        const volunteerCompletions = safeSpotCompletions.filter(c => c.user_id === volunteer.id);
        const hasCurrentCompliance = volunteerCompletions.some(c => 
          c.status === 'completed' && 
          new Date(c.expiry_date) > new Date()
        );

        if (hasCurrentCompliance) {
          completed++;
        } else {
          const hasExpired = volunteerCompletions.some(c => 
            c.status === 'expired' || 
            new Date(c.expiry_date) < new Date()
          );
          
          if (hasExpired) {
            overdue++;
          } else {
            pending++;
          }
        }
      });

      const total = eventVolunteers.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      setComplianceStats({
        total,
        completed,
        pending,
        overdue,
        completionRate: Math.round(completionRate)
      });
    } catch (error) {
      console.error('Failed to load compliance stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-brand-text-primary">{complianceStats.total}</p>
              <p className="text-sm text-brand-text-secondary">Total Volunteers</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-400">{complianceStats.completed}</p>
              <p className="text-sm text-brand-text-secondary">Compliant</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-400">{complianceStats.pending}</p>
              <p className="text-sm text-brand-text-secondary">Pending</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-400">{complianceStats.overdue}</p>
              <p className="text-sm text-brand-text-secondary">Overdue</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ComplianceRequirements = ({ event }) => {
  const [requirements, setRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (event) {
      loadRequirements();
    }
  }, [event]);

  const loadRequirements = async () => {
    try {
      const complianceItems = await ComplianceItem.filter({
        compliance_type: 'safe_sport'
      });
      setRequirements(complianceItems);
    } catch (error) {
      console.error('Failed to load requirements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'in_progress': return 'bg-blue-600';
      case 'overdue': return 'bg-red-600';
      case 'escalated': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Compliance Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requirement</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirements.map((requirement) => (
              <TableRow key={requirement.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-brand-text-primary">{requirement.title}</p>
                    <p className="text-sm text-brand-text-secondary">{requirement.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-text-secondary" />
                    {format(new Date(requirement.due_date), 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(requirement.status)} text-white`}>
                    {requirement.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${getRiskColor(requirement.risk_level)} text-white`}>
                    {requirement.risk_level}
                  </Badge>
                </TableCell>
                <TableCell>
                  {requirement.assigned_to || 'Unassigned'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Update
                    </Button>
                    <Button size="sm" variant="outline">
                      Remind
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {requirements.length === 0 && (
          <div className="text-center py-8 text-brand-text-secondary">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No compliance requirements found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ComplianceTimeline = ({ event }) => {
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (event) {
      generateTimeline();
    }
  }, [event]);

  const generateTimeline = async () => {
    try {
      // Generate compliance timeline based on event date
      const eventDate = new Date(event.start_date);
      const timelineItems = [
        {
          date: new Date(eventDate.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 days before
          title: 'Safe Sport Training Deadline',
          description: 'All volunteers must complete Safe Sport training',
          status: 'upcoming',
          priority: 'high'
        },
        {
          date: new Date(eventDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days before
          title: 'Background Check Completion',
          description: 'Background checks must be current and verified',
          status: 'upcoming',
          priority: 'critical'
        },
        {
          date: new Date(eventDate.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days before
          title: 'Policy Acknowledgment',
          description: 'Event-specific policies must be signed',
          status: 'upcoming',
          priority: 'medium'
        },
        {
          date: new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days before
          title: 'Final Compliance Review',
          description: 'Complete compliance audit and issue credentials',
          status: 'upcoming',
          priority: 'high'
        }
      ];

      // Update status based on current date
      const now = new Date();
      timelineItems.forEach(item => {
        if (item.date < now) {
          item.status = 'completed';
        } else if (item.date.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
          item.status = 'due_soon';
        }
      });

      setTimeline(timelineItems.sort((a, b) => a.date - b.date));
    } catch (error) {
      console.error('Failed to generate timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'due_soon': return 'bg-yellow-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Compliance Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(item.status)} mt-1 flex-shrink-0`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-brand-text-primary">{item.title}</h4>
                    <p className="text-sm text-brand-text-secondary">{item.description}</p>
                    <p className="text-xs text-brand-text-secondary mt-1">
                      {format(item.date, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge className={`${item.priority === 'critical' ? 'bg-red-600' : 
                    item.priority === 'high' ? 'bg-orange-600' : 'bg-blue-600'} text-white`}>
                    {item.priority}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ComplianceTracker({ event }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Compliance Tracker</h2>
          <p className="text-brand-text-secondary">Monitor and manage compliance requirements for {event.name}</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <ComplianceOverview event={event} />

      <Tabs defaultValue="requirements" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="mt-6">
          <ComplianceRequirements event={event} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <ComplianceTimeline event={event} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-brand-text-secondary">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Detailed Compliance Reporting</h3>
                <p>Generate comprehensive compliance reports and audit trails.</p>
                <Button className="mt-4">
                  Generate Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}