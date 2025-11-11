import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Calendar, 
  Shield, 
  DollarSign,
  Users,
  Download,
  ExternalLink,
  Clock
} from 'lucide-react';
import { GovernanceMeeting, GovernancePolicy, ComplianceItem, BoardMember } from '@/api/entities';
import ExternalAccessGate from './ExternalAccessGate';

const BoardPortal = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [recentPolicies, setRecentPolicies] = useState([]);
  const [complianceItems, setComplianceItems] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBoardData();
  }, []);

  const loadBoardData = async () => {
    setIsLoading(true);
    try {
      const [meetings, policies, compliance, members] = await Promise.all([
        GovernanceMeeting.filter({ status: 'scheduled' }),
        GovernancePolicy.filter({ approval_status: 'approved' }),
        ComplianceItem.filter({ status: ['not_started', 'in_progress'] }),
        BoardMember.filter({ is_active: true })
      ]);

      setUpcomingMeetings(meetings.slice(0, 3));
      setRecentPolicies(policies.slice(0, 5));
      setComplianceItems(compliance.slice(0, 4));
      setBoardMembers(members);
    } catch (error) {
      console.error('Error loading board data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MeetingCard = ({ meeting }) => (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-brand-text-primary">{meeting.meeting_title}</h4>
            <p className="text-sm text-brand-text-secondary capitalize">{meeting.committee} Committee</p>
          </div>
          <Badge className="bg-blue-600 text-white">
            {new Date(meeting.date).toLocaleDateString()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {meeting.attendees?.length || 0} attendees
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="border-brand-border">
            <FileText className="w-4 h-4 mr-2" />
            Agenda
          </Button>
          {meeting.meeting_link && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Loading board portal...</p>
        </div>
      </div>
    );
  }

  return (
    <ExternalAccessGate 
      requiredRole="board_member"
      fallbackMessage="This portal is only available to board members."
    >
      <div className="min-h-screen bg-brand-charcoal p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Board Portal</h1>
            <p className="text-brand-text-secondary">Access meeting materials, policies, and governance documents</p>
          </div>

          <Tabs defaultValue="meetings" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg border-brand-border">
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="members">Directory</TabsTrigger>
            </TabsList>

            <TabsContent value="meetings" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-brand-text-primary">Upcoming Meetings</h2>
                  <Button variant="outline" className="border-brand-border">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Full Calendar
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="policies" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-brand-text-primary">Current Policies</h2>
                {recentPolicies.map((policy) => (
                  <Card key={policy.id} className="bg-brand-card-bg border-brand-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-brand-text-primary">{policy.title}</h4>
                          <p className="text-sm text-brand-text-secondary capitalize">
                            {policy.policy_type.replace('_', ' ')} • Version {policy.version}
                          </p>
                          <p className="text-sm text-brand-text-secondary">
                            Effective: {new Date(policy.effective_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-brand-border">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-brand-text-primary">Compliance Status</h2>
                {complianceItems.map((item) => (
                  <Card key={item.id} className="bg-brand-card-bg border-brand-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-brand-text-primary">{item.title}</h4>
                          <p className="text-sm text-brand-text-secondary capitalize">
                            {item.regulatory_body.replace('_', ' ')} • {item.risk_level} risk
                          </p>
                          <p className="text-sm text-brand-text-secondary">
                            Due: {new Date(item.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={`${
                          item.status === 'completed' ? 'bg-green-600' :
                          item.status === 'in_progress' ? 'bg-blue-600' :
                          item.status === 'overdue' ? 'bg-red-600' :
                          'bg-gray-600'
                        } text-white`}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-brand-text-primary">Board Directory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boardMembers.map((member) => (
                    <Card key={member.id} className="bg-brand-card-bg border-brand-border">
                      <CardContent className="p-4 text-center">
                        <h4 className="font-semibold text-brand-text-primary">{member.name}</h4>
                        <p className="text-sm text-brand-text-secondary capitalize mb-2">
                          {member.role.replace('_', ' ')}
                        </p>
                        {member.committee_memberships && (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {member.committee_memberships.map((committee, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-brand-border">
                                {committee}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExternalAccessGate>
  );
};

export default BoardPortal;