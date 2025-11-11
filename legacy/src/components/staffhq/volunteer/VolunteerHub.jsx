
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Users,
  UserPlus,
  Calendar,
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Mail,
  Phone
} from 'lucide-react';

// Helper hook for media queries
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure window is defined (for SSR compatibility)
      const mediaQueryList = window.matchMedia(query);
      const listener = (event) => {
        setMatches(event.matches);
      };

      setMatches(mediaQueryList.matches); // Set initial state
      mediaQueryList.addEventListener('change', listener);

      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    }
  }, [query]);

  return matches;
};

export default function VolunteerHub() {
  const [activeTab, setActiveTab] = useState('roster');
  const isMobile = useMediaQuery('(max-width: 768px)'); // Breakpoint for mobile

  const volunteerStats = [
    {
      title: 'Active Volunteers',
      value: '1,247',
      change: '+89 this month',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Pending Applications',
      value: '23',
      change: '12 need review',
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      title: 'Events Staffed',
      value: '156',
      change: '8 upcoming',
      icon: Calendar,
      color: 'text-green-400'
    },
    {
      title: 'Compliance Rate',
      value: '94%',
      change: '+2% this quarter',
      icon: CheckCircle,
      color: 'text-purple-400'
    }
  ];

  const sampleVolunteers = [
    { id: 1, name: 'Sarah Chen', email: 'sarah@email.com', role: 'Event Coordinator', status: 'Active', compliance: 'Current' },
    { id: 2, name: 'Mike Johnson', email: 'mike@email.com', role: 'Technical Support', status: 'Active', compliance: 'Current' },
    { id: 3, name: 'Emma Wilson', email: 'emma@email.com', role: 'Registration', status: 'Pending', compliance: 'Expired' },
    { id: 4, name: 'David Brown', email: 'david@email.com', role: 'Security', status: 'Active', compliance: 'Current' }
  ];

  const sampleCampaigns = [
    { id: 1, name: 'Brier 2024 Volunteers', status: 'Active', applications: 45, needed: 60 },
    { id: 2, name: 'Scotties Tournament', status: 'Planning', applications: 12, needed: 40 },
    { id: 3, name: 'Youth Championships', status: 'Completed', applications: 25, needed: 25 }
  ];

  const recentActivity = [
    { type: 'new_application', message: 'Sarah Chen applied for event volunteer role', time: '2 hours ago' },
    { type: 'compliance_update', message: 'Mike Johnson completed Safe Sport training', time: '4 hours ago' },
    { type: 'event_assignment', message: '15 volunteers assigned to Brier 2024', time: '1 day ago' },
    { type: 'incident_report', message: 'Minor incident reported at Provincial Championship', time: '2 days ago' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_application': return UserPlus;
      case 'compliance_update': return CheckCircle;
      case 'event_assignment': return Calendar;
      case 'incident_report': return AlertTriangle;
      default: return Users;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'new_application': return 'text-blue-400';
      case 'compliance_update': return 'text-green-400';
      case 'event_assignment': return 'text-purple-400';
      case 'incident_report': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-600 text-white">Active</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>;
      case 'Planning': // Added for campaigns
        return <Badge className="bg-yellow-600 text-white">Planning</Badge>;
      case 'Inactive':
      case 'Completed': // Added for campaigns
        return <Badge className="bg-gray-600 text-white">Completed</Badge>; // Changed text to Completed for consistency
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getComplianceBadge = (compliance) => {
    switch (compliance) {
      case 'Current':
        return <Badge className="bg-green-600 text-white">Current</Badge>;
      case 'Expired':
        return <Badge className="bg-red-600 text-white">Expired</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>;
      default:
        return <Badge variant="outline">{compliance}</Badge>;
    }
  };

  const tabs = [
    { id: 'roster', label: 'Roster', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: UserPlus },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Overview Stats - Mobile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {volunteerStats.map((stat, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-2 md:mb-0">
                  <p className="text-xs md:text-sm text-brand-text-secondary">{stat.title}</p>
                  <p className="text-lg md:text-2xl font-bold text-brand-text-primary">{stat.value}</p>
                  <p className="text-xs text-brand-text-secondary md:hidden mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color} self-end md:self-auto`} />
              </div>
              <p className="text-xs text-brand-text-secondary hidden md:block">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {isMobile ? (
            <div className="space-y-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full bg-brand-card-bg border-brand-border text-brand-text-primary">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {tabs.find(t => t.id === activeTab)?.icon &&
                        React.createElement(tabs.find(t => t.id === activeTab)?.icon, { className: "w-4 h-4" })
                      }
                      {tabs.find(t => t.id === activeTab)?.label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-brand-card-bg border-brand-border">
                  {tabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      <div className="flex items-center gap-2">
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mobile Content - Roster */}
              {activeTab === 'roster' && (
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Volunteer Roster</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
                        <Input placeholder="Search..." className="pl-10 h-9 text-sm" />
                      </div>
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Filter className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="h-9 px-3">
                        <UserPlus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sampleVolunteers.map((volunteer) => (
                        <div key={volunteer.id} className="p-3 bg-brand-charcoal/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-medium text-sm">
                                  {volunteer.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-brand-text-primary text-sm">{volunteer.name}</p>
                                <p className="text-xs text-brand-text-secondary">{volunteer.role}</p>
                              </div>
                            </div>
                            {getStatusBadge(volunteer.status)}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-brand-text-secondary">{volunteer.email}</span>
                            <div className="flex items-center gap-2">
                              {getComplianceBadge(volunteer.compliance)}
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Mail className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mobile Content - Campaigns */}
              {activeTab === 'campaigns' && (
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Recruitment Campaigns</CardTitle>
                    <Button size="sm" className="h-9 px-3">
                      <UserPlus className="w-4 h-4 mr-1" /> New Campaign
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sampleCampaigns.map((campaign) => (
                        <div key={campaign.id} className="p-3 bg-brand-charcoal/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-brand-text-primary text-sm">{campaign.name}</h4>
                            {getStatusBadge(campaign.status)}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-brand-text-secondary">{campaign.applications}/{campaign.needed} applicants</span>
                            <div className="w-20 h-1 bg-brand-border rounded-full">
                              <div
                                className="h-1 bg-brand-red rounded-full"
                                style={{ width: `${(campaign.applications / campaign.needed) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mobile Content - Insights (reusing desktop card) */}
              {activeTab === 'insights' && (
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Volunteer Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <h4 className="font-medium text-brand-text-primary mb-3">Volunteer Distribution by Role</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Event Coordination</span>
                            <span className="text-brand-text-primary">35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Technical Support</span>
                            <span className="text-brand-text-primary">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Registration</span>
                            <span className="text-brand-text-primary">20%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Security</span>
                            <span className="text-brand-text-primary">20%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-brand-text-primary mb-3">Monthly Trends</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">New Volunteers</span>
                            <span className="text-green-400">+12%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Retention Rate</span>
                            <span className="text-green-400">89%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Avg Hours/Month</span>
                            <span className="text-brand-text-primary">24.5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Satisfaction Score</span>
                            <span className="text-green-400">4.2/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mobile Content - Incidents (reusing desktop card) */}
              {activeTab === 'incidents' && (
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Incident Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-brand-text-primary mb-2">No Active Incidents</h3>
                      <p className="text-brand-text-secondary">All volunteer incidents have been resolved.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Desktop Tabs */
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg">
                <TabsTrigger value="roster">
                  <Users className="w-4 h-4 mr-2" />
                  Roster
                </TabsTrigger>
                <TabsTrigger value="campaigns">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Campaigns
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="incidents">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Incidents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="roster" className="mt-6">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Volunteer Roster</CardTitle>
                      <Button size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Volunteer
                      </Button>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
                        <Input placeholder="Search volunteers..." className="pl-10" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sampleVolunteers.map((volunteer) => (
                        <div key={volunteer.id} className="flex items-center justify-between p-4 bg-brand-charcoal/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {volunteer.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-brand-text-primary">{volunteer.name}</p>
                              <p className="text-sm text-brand-text-secondary">{volunteer.email}</p>
                              <p className="text-sm text-brand-text-secondary">{volunteer.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(volunteer.status)}
                            {getComplianceBadge(volunteer.compliance)}
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="campaigns" className="mt-6">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recruitment Campaigns</CardTitle>
                      <Button size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        New Campaign
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sampleCampaigns.map((campaign) => (
                        <div key={campaign.id} className="p-4 bg-brand-charcoal/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-brand-text-primary">{campaign.name}</h4>
                            <Badge className={
                              campaign.status === 'Active' ? 'bg-green-600' :
                              campaign.status === 'Planning' ? 'bg-yellow-600' :
                              'bg-gray-600'
                            }>
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
                            <span>Applications: {campaign.applications}/{campaign.needed}</span>
                            <div className="flex-1 bg-brand-border rounded-full h-2">
                              <div
                                className="bg-brand-red h-2 rounded-full"
                                style={{ width: `${(campaign.applications / campaign.needed) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle>Volunteer Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-brand-text-primary mb-3">Volunteer Distribution by Role</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Event Coordination</span>
                            <span className="text-brand-text-primary">35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Technical Support</span>
                            <span className="text-brand-text-primary">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Registration</span>
                            <span className="text-brand-text-primary">20%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Security</span>
                            <span className="text-brand-text-primary">20%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-brand-text-primary mb-3">Monthly Trends</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">New Volunteers</span>
                            <span className="text-green-400">+12%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Retention Rate</span>
                            <span className="text-green-400">89%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Avg Hours/Month</span>
                            <span className="text-brand-text-primary">24.5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-text-secondary">Satisfaction Score</span>
                            <span className="text-green-400">4.2/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="incidents" className="mt-6">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle>Incident Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-brand-text-primary mb-2">No Active Incidents</h3>
                      <p className="text-brand-text-secondary">All volunteer incidents have been resolved.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Activity Sidebar */}
        <div className={`${isMobile ? 'lg:col-span-3' : 'lg:col-span-1'}`}>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-brand-red" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.slice(0, isMobile ? 3 : 5).map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-brand-charcoal/50 rounded-lg">
                      <ActivityIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getActivityColor(activity.type)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-brand-text-primary">{activity.message}</p>
                        <p className="text-xs text-brand-text-secondary">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-brand-card-bg border-brand-border mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Volunteer
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Create Event Campaign
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="w-4 h-4 mr-2" />
                Send Recognition
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
