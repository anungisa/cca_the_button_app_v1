import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Search, Download, ShieldCheck, BookUser, Filter, Users as UsersIcon } from 'lucide-react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const engagementData = [
  { month: 'Jan', events: 0, volunteer_hours: 2, donations: 150 },
  { month: 'Feb', events: 1, volunteer_hours: 0, donations: 0 },
  { month: 'Mar', events: 1, volunteer_hours: 8, donations: 200 },
  { month: 'Apr', events: 0, volunteer_hours: 0, donations: 0 },
  { month: 'May', events: 0, volunteer_hours: 4, donations: 75 },
  { month: 'Jun', events: 2, volunteer_hours: 0, donations: 300 },
];

const skillDistribution = [
  { name: 'Beginner', value: 35, count: 1540 },
  { name: 'Intermediate', value: 40, count: 1760 },
  { name: 'Advanced', value: 20, count: 880 },
  { name: 'Competitive', value: 5, count: 220 },
];

const COLORS = ['#ED1C24', '#82ca9d', '#8884d8', '#ffc658'];

export default function CurlerDataHub() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ 
    safeSport: 'all', 
    skillLevel: 'all', 
    coaching: 'all',
    userType: 'all'
  });
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (currentUser.user_type !== 'ma_admin') {
          setIsLoading(false);
          return;
        }
        
        const membersData = await User.filter({ ma_region: currentUser.ma_region });
        setMembers(membersData);
        setFilteredMembers(membersData);

      } catch (error) {
        console.error("Error loading curler data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.curling_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.safeSport !== 'all') {
      filtered = filtered.filter(m => m.safe_sport_status === filters.safeSport);
    }
    
    if (filters.skillLevel !== 'all') {
      filtered = filtered.filter(m => m.skill_level === filters.skillLevel);
    }

    if (filters.coaching !== 'all') {
      filtered = filtered.filter(m => m.coaching_status === filters.coaching);
    }

    if (filters.userType !== 'all') {
      filtered = filtered.filter(m => m.user_type === filters.userType);
    }

    setFilteredMembers(filtered);
  }, [searchTerm, filters, members]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const getSafeSportStatus = (status) => {
    switch(status) {
      case 'current': return { color: 'bg-green-100 text-green-800', text: 'Current' };
      case 'expired': return { color: 'bg-red-100 text-red-800', text: 'Expired' };
      case 'pending': return { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
      default: return { color: 'bg-gray-100 text-gray-800', text: 'N/A' };
    }
  };

  const getCoachingStatus = (status) => {
    switch(status) {
      case 'certified': return { color: 'bg-blue-100 text-blue-800', text: 'Certified' };
      case 'in_training': return { color: 'bg-purple-100 text-purple-800', text: 'In Training' };
      default: return null;
    }
  };
  
  const getSkillLevelColor = (level) => {
    switch(level) {
        case 'competitive': return 'bg-red-100 text-red-800';
        case 'advanced': return 'bg-yellow-100 text-yellow-800';
        case 'intermediate': return 'bg-green-100 text-green-800';
        case 'beginner': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  }

  const exportSelectedData = () => {
    const selectedMemberData = members.filter(m => selectedMembers.includes(m.id));
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Curling ID,Safe Sport Status,Skill Level,User Type,Phone\n" +
      selectedMemberData.map(member => 
        `${member.full_name || ''},${member.email || ''},${member.curling_id || ''},${member.safe_sport_status || ''},${member.skill_level || ''},${member.user_type || ''},${member.phone || ''}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${user?.ma_region}_selected_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Curling ID,Safe Sport Status,Skill Level,User Type,Phone\n" +
      filteredMembers.map(member => 
        `${member.full_name || ''},${member.email || ''},${member.curling_id || ''},${member.safe_sport_status || ''},${member.skill_level || ''},${member.user_type || ''},${member.phone || ''}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${user?.ma_region}_all_filtered_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading member data...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'ma_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-red-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">You must be logged in as an MA Admin to view this page.</p>
             {!user ? (
               <Button onClick={() => User.login()} className="bg-brand-red hover:bg-red-700">Sign In</Button>
            ) : (
               <Button asChild variant="outline"><Link to={createPageUrl("Home")}>Go to Homepage</Link></Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-charcoal uppercase">Curler Data Hub</h1>
          <p className="text-gray-600 mt-1">Manage and analyze member data for {user.ma_region}.</p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Member Engagement Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{width: '100%', height: 250}}>
                <ResponsiveContainer>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }} 
                      labelStyle={{ color: '#fff' }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="events" stroke="#ED1C24" activeDot={{ r: 8 }} name="Events Attended" />
                    <Line type="monotone" dataKey="volunteer_hours" stroke="#82ca9d" name="Volunteer Hours" />
                    <Line type="monotone" dataKey="donations" stroke="#8884d8" name="Donations ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{width: '100%', height: 250}}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={skillDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {skillDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Search and Filters Row */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search by name, email, or Curling ID..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <Select value={filters.safeSport} onValueChange={(v) => handleFilterChange('safeSport', v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Safe Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Safe Sport</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="not_required">Not Required</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.skillLevel} onValueChange={(v) => handleFilterChange('skillLevel', v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Skill Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="competitive">Competitive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.userType} onValueChange={(v) => handleFilterChange('userType', v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="curler">Curler</SelectItem>
                      <SelectItem value="fan">Fan</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="donor">Donor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    {filteredMembers.length} members found
                    {selectedMembers.length > 0 && (
                      <span className="ml-2 text-brand-red font-medium">
                        ({selectedMembers.length} selected)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedMembers.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={exportSelectedData}
                      className="text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Selected ({selectedMembers.length})
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={exportAllData}
                    className="text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Filtered
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              Member Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers(filteredMembers.map(m => m.id));
                        } else {
                          setSelectedMembers([]);
                        }
                      }}
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Skill & Type</TableHead>
                  <TableHead>Compliance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => {
                    const safeSport = getSafeSportStatus(member.safe_sport_status);
                    const coaching = getCoachingStatus(member.coaching_status);
                    const skill = getSkillLevelColor(member.skill_level);
                    
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <input 
                            type="checkbox" 
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => handleSelectMember(member.id)}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.full_name}</div>
                            {member.curling_id && (
                              <div className="text-xs text-gray-500">ID: {member.curling_id}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{member.email}</div>
                            {member.phone && (
                              <div className="text-xs text-gray-500">{member.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {member.skill_level && (
                              <Badge className={`${skill} hover:${skill} capitalize text-xs`}>
                                {member.skill_level}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs capitalize">
                              {member.user_type?.replace('_', ' ') || 'Fan'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge className={`${safeSport.color} hover:${safeSport.color} text-xs`}>
                              <ShieldCheck className="w-3 h-3 mr-1"/>
                              {safeSport.text}
                            </Badge>
                            {coaching && (
                              <Badge className={`${coaching.color} hover:${coaching.color} text-xs`}>
                                <BookUser className="w-3 h-3 mr-1"/>
                                {coaching.text}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <div className="flex flex-col items-center justify-center">
                        <Filter className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No members match the current filters.</p>
                        <p className="text-sm text-gray-400">Try adjusting your search criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}