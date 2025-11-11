import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Volunteer } from '@/api/entities';
import { VolunteerCampaign } from '@/api/entities';
import { SafeSportCompletion } from '@/api/entities';
import { Incident } from '@/api/entities';
import { Users, UserPlus, Search, Filter, AlertTriangle, CheckCircle, Clock, Send, QrCode, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

const VolunteerRoster = ({ event, volunteers, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState('all');

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || volunteer.events?.some(e => 
      e.event_id === event.id && e.status === statusFilter
    );
    
    let matchesCompliance = true;
    if (complianceFilter !== 'all') {
      const compliance = volunteer.compliance;
      if (complianceFilter === 'compliant') {
        matchesCompliance = compliance?.respect_in_sport === 'compliant' && 
                           compliance?.background_check === 'compliant';
      } else if (complianceFilter === 'pending') {
        matchesCompliance = compliance?.respect_in_sport === 'pending' || 
                           compliance?.background_check === 'pending';
      }
    }
    
    return matchesSearch && matchesStatus && matchesCompliance;
  });

  const getComplianceStatus = (volunteer) => {
    const compliance = volunteer.compliance || {};
    if (compliance.respect_in_sport === 'compliant' && compliance.background_check === 'compliant') {
      return { status: 'compliant', color: 'bg-green-600' };
    } else if (compliance.respect_in_sport === 'expired' || compliance.background_check === 'expired') {
      return { status: 'expired', color: 'bg-red-600' };
    } else {
      return { status: 'pending', color: 'bg-yellow-600' };
    }
  };

  const getVolunteerRole = (volunteer, eventId) => {
    const eventRole = volunteer.events?.find(e => e.event_id === eventId);
    return eventRole?.role || 'General Volunteer';
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Event Volunteers ({filteredVolunteers.length})</CardTitle>
          <div className="flex gap-2">
            <Button size="sm">
              <QrCode className="w-4 h-4 mr-2" />
              Check-in
            </Button>
            <Button size="sm">
              <Send className="w-4 h-4 mr-2" />
              Notify All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
            <Input
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="checked_in">Checked In</SelectItem>
            </SelectContent>
          </Select>
          <Select value={complianceFilter} onValueChange={setComplianceFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Compliance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="compliant">Compliant</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Volunteer List */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Volunteer</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVolunteers.map(volunteer => {
              const compliance = getComplianceStatus(volunteer);
              const role = getVolunteerRole(volunteer, event.id);
              
              return (
                <TableRow key={volunteer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-brand-text-primary">{volunteer.full_name}</p>
                      <p className="text-sm text-brand-text-secondary">{volunteer.ma_region}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{volunteer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${compliance.color} text-white`}>
                      {compliance.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-600 text-white">
                      Confirmed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Message</Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredVolunteers.length === 0 && (
          <div className="text-center py-8 text-brand-text-secondary">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No volunteers match your search criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const RecruitmentCampaigns = ({ event, onRefresh }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const allCampaigns = await VolunteerCampaign.list('-created_date');
      const eventCampaigns = allCampaigns.filter(c => c.event_name === event.name);
      setCampaigns(eventCampaigns);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CreateCampaignModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      target_region: event.venue?.city || '',
      roles_needed: [],
      start_date: '',
      end_date: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        await VolunteerCampaign.create({
          ...formData,
          event_name: event.name,
          status: 'planning'
        });

        setShowCreateModal(false);
        loadCampaigns();
      } catch (error) {
        console.error('Failed to create campaign:', error);
        alert('Failed to create recruitment campaign');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Recruitment Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={`${event.name} Volunteers`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Region</label>
              <Input
                value={formData.target_region}
                onChange={(e) => setFormData({...formData, target_region: e.target.value})}
                placeholder="Geographic region"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Roles Needed</label>
              <Textarea
                value={formData.roles_needed.join(', ')}
                onChange={(e) => setFormData({...formData, roles_needed: e.target.value.split(', ')})}
                placeholder="Event staff, Scorekeepers, Ice crew, etc."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
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
        <div className="flex items-center justify-between">
          <CardTitle>Recruitment Campaigns</CardTitle>
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="p-4 bg-brand-charcoal rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-brand-text-primary">{campaign.name}</h4>
                    <p className="text-sm text-brand-text-secondary">{campaign.target_region}</p>
                  </div>
                  <Badge className={campaign.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-brand-text-secondary">
                    {campaign.applications_received || 0} applications received
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">View Form</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No recruitment campaigns yet</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create First Campaign
            </Button>
          </div>
        )}
        <CreateCampaignModal />
      </CardContent>
    </Card>
  );
};

const ComplianceOverview = ({ volunteers, event }) => {
  const [complianceStats, setComplianceStats] = useState({
    total: 0,
    compliant: 0,
    pending: 0,
    expired: 0
  });

  useEffect(() => {
    calculateCompliance();
  }, [volunteers]);

  const calculateCompliance = () => {
    let compliant = 0;
    let pending = 0;
    let expired = 0;

    volunteers.forEach(volunteer => {
      const compliance = volunteer.compliance || {};
      if (compliance.respect_in_sport === 'compliant' && compliance.background_check === 'compliant') {
        compliant++;
      } else if (compliance.respect_in_sport === 'expired' || compliance.background_check === 'expired') {
        expired++;
      } else {
        pending++;
      }
    });

    setComplianceStats({
      total: volunteers.length,
      compliant,
      pending,
      expired
    });
  };

  const ComplianceCard = ({ title, count, total, color, icon: Icon }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-brand-text-primary">{count}</p>
              <p className="text-sm font-medium text-brand-text-primary">{title}</p>
            </div>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
          <div className="space-y-2">
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-brand-text-secondary">{percentage}% of volunteers</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ComplianceCard
        title="Total Volunteers"
        count={complianceStats.total}
        total={complianceStats.total}
        color="text-blue-400"
        icon={Users}
      />
      <ComplianceCard
        title="Compliant"
        count={complianceStats.compliant}
        total={complianceStats.total}
        color="text-green-400"
        icon={CheckCircle}
      />
      <ComplianceCard
        title="Pending"
        count={complianceStats.pending}
        total={complianceStats.total}
        color="text-yellow-400"
        icon={Clock}
      />
      <ComplianceCard
        title="Expired/Issues"
        count={complianceStats.expired}
        total={complianceStats.total}
        color="text-red-400"
        icon={AlertTriangle}
      />
    </div>
  );
};

export default function VolunteerCommandCenter({ event }) {
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (event) {
      loadVolunteers();
    }
  }, [event]);

  const loadVolunteers = async () => {
    try {
      const allVolunteers = await Volunteer.list();
      // Filter volunteers for this event or region
      const eventVolunteers = allVolunteers.filter(v => 
        v.ma_region === event.venue?.province ||
        v.events?.some(e => e.event_name?.includes(event.name.split(' ')[0]))
      );
      
      setVolunteers(eventVolunteers);
    } catch (error) {
      console.error('Failed to load volunteers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadVolunteers();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Volunteer Command Center</h2>
          <p className="text-brand-text-secondary">Manage volunteers and recruitment for {event.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            Compliance Report
          </Button>
        </div>
      </div>

      <ComplianceOverview volunteers={volunteers} event={event} />

      <Tabs defaultValue="roster" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-brand-card-bg border-brand-border">
          <TabsTrigger value="roster">Volunteer Roster</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="roster" className="mt-6">
          <VolunteerRoster event={event} volunteers={volunteers} onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="recruitment" className="mt-6">
          <RecruitmentCampaigns event={event} onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Detailed Compliance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-brand-text-secondary">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Advanced Compliance Management</h3>
                <p>Track training completion, background checks, and policy acknowledgments.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Volunteer Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-brand-text-secondary">
                <Send className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Communication Hub</h3>
                <p>Send updates, reminders, and important information to volunteers.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}