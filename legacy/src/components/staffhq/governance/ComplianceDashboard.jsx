import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ComplianceItem } from '@/api/entities';
import { GovernancePolicy } from '@/api/entities';
import { GovernanceMeeting } from '@/api/entities';
import { AlertTriangle, CheckCircle, Clock, FileText, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ComplianceDashboard() {
  const [complianceItems, setComplianceItems] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [complianceData, policiesData, meetingsData] = await Promise.all([
          ComplianceItem.list('-due_date'),
          GovernancePolicy.list('-next_review_date'),
          GovernanceMeeting.filter({ status: 'scheduled' }, '-date', 10)
        ]);
        setComplianceItems(complianceData);
        setPolicies(policiesData);
        setMeetings(meetingsData);
      } catch (error) {
        console.error('Error loading governance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const overviewStats = {
    totalCompliance: complianceItems.length,
    overdue: complianceItems.filter(item => new Date(item.due_date) < new Date() && item.status !== 'completed').length,
    dueThisWeek: complianceItems.filter(item => {
      const dueDate = new Date(item.due_date);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return dueDate <= weekFromNow && item.status !== 'completed';
    }).length,
    policiesDueReview: policies.filter(policy => new Date(policy.next_review_date) <= new Date()).length
  };

  const complianceRate = overviewStats.totalCompliance > 0 ? 
    ((overviewStats.totalCompliance - overviewStats.overdue) / overviewStats.totalCompliance) * 100 : 100;

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div></div>;
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
            {subtitle && <p className="text-xs text-brand-text-secondary">{subtitle}</p>}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Overall Compliance Rate" 
          value={`${Math.round(complianceRate)}%`} 
          icon={CheckCircle} 
          color="text-green-500" 
          subtitle={`${overviewStats.totalCompliance - overviewStats.overdue} of ${overviewStats.totalCompliance} items`}
        />
        <StatCard 
          title="Overdue Items" 
          value={overviewStats.overdue} 
          icon={AlertTriangle} 
          color="text-red-500" 
          subtitle="Require immediate attention"
        />
        <StatCard 
          title="Due This Week" 
          value={overviewStats.dueThisWeek} 
          icon={Clock} 
          color="text-yellow-500" 
          subtitle="Upcoming deadlines"
        />
        <StatCard 
          title="Policies Due Review" 
          value={overviewStats.policiesDueReview} 
          icon={FileText} 
          color="text-blue-500" 
          subtitle="Need review or update"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Critical Compliance Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceItems
                .filter(item => item.risk_level === 'critical' || item.status === 'overdue')
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-brand-charcoal rounded-lg">
                    <div>
                      <p className="font-medium text-brand-text-primary">{item.title}</p>
                      <p className="text-sm text-brand-text-secondary">{item.regulatory_body}</p>
                      <p className="text-xs text-brand-text-secondary">Due: {new Date(item.due_date).toLocaleDateString()}</p>
                    </div>
                    <Badge className={`${
                      item.status === 'overdue' ? 'bg-red-600' :
                      item.risk_level === 'critical' ? 'bg-orange-600' : 'bg-yellow-600'
                    } text-white`}>
                      {item.status === 'overdue' ? 'Overdue' : item.risk_level}
                    </Badge>
                  </div>
                ))}
              {complianceItems.filter(item => item.risk_level === 'critical' || item.status === 'overdue').length === 0 && (
                <p className="text-center text-brand-text-secondary py-4">No critical items at this time.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meetings.slice(0, 5).map((meeting) => (
                <div key={meeting.id} className="flex justify-between items-center p-3 bg-brand-charcoal rounded-lg">
                  <div>
                    <p className="font-medium text-brand-text-primary">{meeting.meeting_title}</p>
                    <p className="text-sm text-brand-text-secondary capitalize">{meeting.committee.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-brand-text-secondary">{new Date(meeting.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {meeting.meeting_type.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
              {meetings.length === 0 && (
                <p className="text-center text-brand-text-secondary py-4">No upcoming meetings scheduled.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Overall Compliance Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Compliance Rate</span>
              <span>{Math.round(complianceRate)}%</span>
            </div>
            <Progress value={complianceRate} className="h-2" />
            <div className="flex justify-between text-xs text-brand-text-secondary">
              <span>{overviewStats.totalCompliance - overviewStats.overdue} items completed</span>
              <span>{overviewStats.overdue} items overdue</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}