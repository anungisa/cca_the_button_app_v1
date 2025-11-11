
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Users,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Search,
  Plus,
  Eye,
  Edit2,
  MessageSquare,
  Clock,
  FileCheck2,
  Send
} from 'lucide-react';
import { Club } from '@/api/entities';
import { SurveySubmission } from '@/api/entities';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePermissions } from '../hooks/usePermissions';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getSeasonInfo } from '../utils/season';
import ClubAnalyticsDashboard from './ClubAnalyticsDashboard';
import SupportCases from './SupportCases';
import { canadianProvincesAndTerritories } from '../utils/provinces';

// New imports for expanded functionality
const ClubOnboardingTracker = React.lazy(() => import('./clubs/ClubOnboardingTracker'));
const ClubCommunicationCenter = React.lazy(() => import('./clubs/ClubCommunicationCenter'));
const ClubBenchmarking = React.lazy(() => import('./clubs/ClubBenchmarking'));

export default function ClubServicesHub() {
  const { permissions } = usePermissions();
  const [activeTab, setActiveTab] = useState('overview');
  const [clubs, setClubs] = useState([]);
  const [clubMetrics, setClubMetrics] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const clubStats = [
    { title: 'Total Clubs', value: '247', change: '+12 this season', icon: Building2, color: 'text-blue-400' },
    { title: 'Active Members', value: '18,592', change: '+8.5% growth', icon: Users, color: 'text-green-400' },
    { title: 'At Risk Clubs', value: '15', change: '3 need attention', icon: AlertTriangle, color: 'text-orange-400' },
    { title: 'Survey Complete', value: '78%', change: '192/247 submitted', icon: CheckCircle, color: 'text-purple-400' }
  ];

  const initialClubsData = [
    {
      id: '1',
      name: 'Thunder Bay Curling Club',
      ma_region: 'ON',
      status: 'active',
      membership_count: 156,
      youth_member_percentage: 18,
      location: { city: 'Thunder Bay', province: 'ON' },
      contact_info: { email: 'info@tbcurling.ca', phone: '807-555-0123' },
      last_survey: '2024-01-15',
      survey_status: 'completed',
      compliance_score: 92,
      engagement_level: 'high'
    },
    {
      id: '2',
      name: 'Calgary Curling Club',
      ma_region: 'AB',
      status: 'active',
      membership_count: 284,
      youth_member_percentage: 24,
      location: { city: 'Calgary', province: 'AB' },
      contact_info: { email: 'admin@calgarycurling.ca', phone: '403-555-0156' },
      last_survey: '2024-01-20',
      survey_status: 'completed',
      compliance_score: 96,
      engagement_level: 'high'
    },
    {
      id: '3',
      name: 'Halifax Mayflower Club',
      ma_region: 'NS',
      status: 'active',
      membership_count: 89,
      youth_member_percentage: 12,
      location: { city: 'Halifax', province: 'NS' },
      contact_info: { email: 'contact@halifaxcurling.ca', phone: '902-555-0187' },
      last_survey: null,
      survey_status: 'pending',
      compliance_score: 78,
      engagement_level: 'medium'
    }
  ];

  useEffect(() => {
    loadClubData();
  }, []);

  const loadClubData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const clubsData = await Club.list();
      const submissionsData = await SurveySubmission.list({ year: new Date().getFullYear() });
      const { endDate: seasonEndDate } = getSeasonInfo();

      if (clubsData && clubsData.length > 0) {
        const mergedClubs = clubsData.map(club => {
          const safeClub = {
            id: club.id,
            name: club.name || 'Unknown Club',
            ma_region: club.ma_region || 'N/A',
            status: club.status || 'active',
            membership_count: club.membership_count || 0,
            youth_member_percentage: club.youth_member_percentage || 0,
            location: {
              city: club.location?.city || 'Unknown',
              province: club.location?.province || club.ma_region || 'N/A'
            },
            contact_info: {
              email: club.contact_info?.email || 'No email provided',
              phone: club.contact_info?.phone || 'No phone provided'
            },
            compliance_score: club.compliance_score || Math.floor(Math.random() * (98 - 75 + 1)) + 75,
            engagement_level: club.engagement_level || (['high', 'medium', 'low'][Math.floor(Math.random() * 3)])
          };

          const submission = submissionsData.find(s => s.club_id === club.id);
          let survey_status = 'pending';
          if (submission) {
            survey_status = submission.is_complete ? 'completed' : 'in_progress';
          }
          if (new Date() > seasonEndDate && survey_status === 'pending') {
            survey_status = 'overdue';
          }

          safeClub.last_survey = submission ? submission.submission_date || submission.last_saved : null;
          safeClub.survey_status = survey_status;

          return safeClub;
        });

        setClubs(mergedClubs);
      } else {
        setClubs(initialClubsData);
      }

      setClubMetrics([]);
      setSurveys(submissionsData || []);
    } catch (error) {
      console.error('Error loading club data:', error);
      setError('Failed to load club data');
      setClubs(initialClubsData);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClubs = clubs.filter(club => {
    if (!club) return false;
    
    const matchesSearch = club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || club.ma_region === selectedRegion;
    const matchesStatus = selectedStatus === 'all' || club.status === selectedStatus;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-600', text: 'Active' },
      at_risk: { color: 'bg-orange-600', text: 'At Risk' },
      inactive: { color: 'bg-red-600', text: 'Inactive' },
      pilot: { color: 'bg-blue-600', text: 'Pilot' }
    };

    const config = statusConfig[status] || statusConfig.active;
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>;
  };

  const getSurveyStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-600', text: 'Completed', icon: CheckCircle },
      pending: { color: 'bg-yellow-600', text: 'Pending', icon: Clock },
      in_progress: { color: 'bg-blue-600', text: 'In Progress', icon: Clock },
      overdue: { color: 'bg-red-600', text: 'Overdue', icon: AlertTriangle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <config.icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const ClubCard = ({ club }) => {
    if (!club) return null;

    return (
      <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg text-brand-text-primary">{club.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-brand-text-secondary" />
                <span className="text-sm text-brand-text-secondary">
                  {club.location?.city}, {club.location?.province}
                </span>
              </div>
            </div>
            {getStatusBadge(club.status)}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-brand-text-secondary">Members</div>
              <div className="font-semibold text-brand-text-primary">{club.membership_count || 0}</div>
            </div>
            <div>
              <div className="text-brand-text-secondary">Youth %</div>
              <div className="font-semibold text-brand-text-primary">{club.youth_member_percentage || 0}%</div>
            </div>
            <div>
              <div className="text-brand-text-secondary">Compliance</div>
              <div className="font-semibold text-brand-text-primary">{club.compliance_score || 0}%</div>
            </div>
            <div>
              <div className="text-brand-text-secondary">Survey</div>
              {getSurveyStatusBadge(club.survey_status)}
            </div>
          </div>

          <div className="border-t border-brand-border pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-brand-text-secondary" />
              <span className="text-sm text-brand-text-secondary truncate">
                {club.contact_info?.email || 'No email provided'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-text-secondary" />
              <span className="text-sm text-brand-text-secondary">
                {club.contact_info?.phone || 'No phone provided'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-1" />
              Contact
            </Button>
            <Button size="sm" variant="outline">
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!permissions.canAccessStaffHQ) {
    return (
      <div className="p-8 text-center">
        <Building2 className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
        <h2 className="text-xl font-bold text-brand-text-primary mb-2">Access Restricted</h2>
        <p className="text-brand-text-secondary">You don't have permission to access Club Services.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-brand-card-bg rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-brand-card-bg rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-brand-card-bg rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-brand-text-primary mb-2">Error Loading Clubs</h2>
        <p className="text-brand-text-secondary mb-4">{error}</p>
        <Button onClick={loadClubData} className="bg-brand-red hover:bg-red-700">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">Club Services Hub</h2>
            <p className="text-brand-text-secondary">Manage club relationships, support, and development</p>
          </div>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Club
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {clubStats.map((stat, index) => (
          <Card key={index} className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-text-secondary">{stat.title}</p>
                  <p className="text-2xl font-bold text-brand-text-primary">{stat.value}</p>
                  <p className="text-xs text-brand-text-secondary">{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="directory">Club Directory</TabsTrigger>
          <TabsTrigger value="survey">Club Survey</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="benchmarking">Benchmarking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="support">Support Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Priority Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div>
                      <p className="font-medium text-orange-800">15 clubs need attention</p>
                      <p className="text-sm text-orange-600">Below membership threshold</p>
                    </div>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium text-blue-800">Survey follow-ups</p>
                      <p className="text-sm text-blue-600">55 clubs pending response</p>
                    </div>
                    <Button size="sm" variant="outline">Contact</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium text-green-800">Success stories</p>
                      <p className="text-sm text-green-600">12 clubs showing growth</p>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Regional Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {canadianProvincesAndTerritories.map((province) => (
                    <div key={province.abbreviation} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-text-primary">{province.abbreviation}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-brand-border rounded-full h-2">
                          <div className="bg-brand-red h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                        </div>
                        <span className="text-sm text-brand-text-secondary w-8">{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="directory" className="mt-6">
          <Card className="bg-brand-card-bg border-brand-border mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <Input
                    placeholder="Search clubs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {canadianProvincesAndTerritories.map((province) => (
                        <SelectItem key={province.abbreviation} value={province.abbreviation}>
                            {province.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="at_risk">At Risk</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No clubs found</h3>
                <p className="text-brand-text-secondary">
                  {searchTerm || selectedRegion !== 'all' || selectedStatus !== 'all' 
                    ? 'Try adjusting your search filters' 
                    : 'No clubs are currently registered in the system'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="survey" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-base">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-text-primary">78%</div>
                <p className="text-sm text-brand-text-secondary">192 of 247 clubs completed</p>
              </CardContent>
            </Card>
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-base">Pending Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-400">40</div>
                <p className="text-sm text-brand-text-secondary">Awaiting response</p>
              </CardContent>
            </Card>
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle className="text-base">Overdue Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">15</div>
                <p className="text-sm text-brand-text-secondary">Reminders sent</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Survey Status by Club</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-border">
                  <thead className="bg-brand-charcoal">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Club Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">MA Region</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Last Submitted</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-brand-card-bg divide-y divide-brand-border">
                    {clubs.map((club) => (
                      <tr key={club.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text-primary">{club.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">{club.ma_region}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getSurveyStatusBadge(club.survey_status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">{club.last_survey ? new Date(club.last_survey).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2 justify-end">
                            <Button asChild variant="outline" size="sm">
                              <Link to={createPageUrl(`ClubSurvey?clubId=${club.id}`)}>
                                <FileCheck2 className="w-4 h-4 mr-1"/>
                                {club.survey_status === 'completed' ? 'View' : 'Complete'}
                              </Link>
                            </Button>
                            {club.survey_status !== 'completed' && (
                              <Button variant="outline" size="sm">
                                <Send className="w-4 h-4 mr-1"/>
                                Reminder
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="mt-6">
          <React.Suspense fallback={<div className="p-8 text-center text-brand-text-secondary">Loading onboarding tracker...</div>}>
            <ClubOnboardingTracker clubs={clubs} selectedRegion={selectedRegion} />
          </React.Suspense>
        </TabsContent>

        <TabsContent value="communications" className="mt-6">
          <React.Suspense fallback={<div className="p-8 text-center text-brand-text-secondary">Loading communication center...</div>}>
            <ClubCommunicationCenter clubs={filteredClubs} selectedRegion={selectedRegion} />
          </React.Suspense>
        </TabsContent>

        <TabsContent value="benchmarking" className="mt-6">
          <React.Suspense fallback={<div className="p-8 text-center text-brand-text-secondary">Loading benchmarking data...</div>}>
            <ClubBenchmarking clubs={filteredClubs} selectedRegion={selectedRegion} />
          </React.Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <ClubAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <SupportCases />
        </TabsContent>
      </Tabs>
    </div>
  );
}
