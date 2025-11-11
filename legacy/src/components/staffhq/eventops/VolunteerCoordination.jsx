import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Mail, Phone, Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock volunteer data structure
const mockVolunteers = [
  {
    id: 'vol_001',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 123-4567',
    role: 'Event Coordinator',
    events: ['Brier 2024', 'Scotties 2024'],
    hours: 24,
    status: 'active',
    skills: ['Event Management', 'Registration', 'VIP Services']
  },
  {
    id: 'vol_002',
    name: 'Mike Thompson',
    email: 'mike.t@email.com',
    phone: '(555) 987-6543',
    role: 'Technical Support',
    events: ['World Championships 2024'],
    hours: 16,
    status: 'active',
    skills: ['AV Setup', 'Live Streaming', 'Equipment']
  },
  {
    id: 'vol_003',
    name: 'Lisa Chen',
    email: 'lisa.c@email.com',
    phone: '(555) 456-7890',
    role: 'Registration',
    events: ['Provincial Championships'],
    hours: 12,
    status: 'inactive',
    skills: ['Customer Service', 'Data Entry', 'Problem Solving']
  }
];

const mockOpportunities = [
  {
    id: 'opp_001',
    title: 'Event Registration Coordinator',
    event: 'Canadian Championship 2025',
    date: '2025-03-15',
    location: 'Halifax, NS',
    volunteers_needed: 5,
    volunteers_assigned: 2,
    description: 'Help with athlete registration and check-in processes',
    skills_required: ['Customer Service', 'Organization']
  },
  {
    id: 'opp_002',
    title: 'Media Support Volunteer',
    event: 'Provincial Playdowns',
    date: '2025-02-20',
    location: 'Toronto, ON',
    volunteers_needed: 3,
    volunteers_assigned: 1,
    description: 'Assist with media operations and interview coordination',
    skills_required: ['Communication', 'Technical Skills']
  }
];

const VolunteerCard = ({ volunteer }) => (
  <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-brand-text-primary">{volunteer.name}</h4>
          <p className="text-sm text-brand-text-secondary">{volunteer.role}</p>
        </div>
        <Badge className={volunteer.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
          {volunteer.status}
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <Mail className="w-4 h-4" />
          {volunteer.email}
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <Phone className="w-4 h-4" />
          {volunteer.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <Clock className="w-4 h-4" />
          {volunteer.hours} hours contributed
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium text-brand-text-secondary mb-1">Skills:</p>
        <div className="flex flex-wrap gap-1">
          {volunteer.skills.map(skill => (
            <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium text-brand-text-secondary mb-1">Recent Events:</p>
        <div className="flex flex-wrap gap-1">
          {volunteer.events.map(event => (
            <Badge key={event} className="text-xs bg-blue-600">{event}</Badge>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const OpportunityCard = ({ opportunity }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-brand-text-primary">{opportunity.title}</h4>
        <Badge className="bg-purple-600">
          {opportunity.volunteers_assigned}/{opportunity.volunteers_needed} filled
        </Badge>
      </div>
      
      <p className="text-sm text-brand-text-secondary mb-3">{opportunity.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <Calendar className="w-4 h-4" />
          {opportunity.event} - {new Date(opportunity.date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <MapPin className="w-4 h-4" />
          {opportunity.location}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-brand-text-secondary mb-1">Skills Needed:</p>
        <div className="flex flex-wrap gap-1">
          {opportunity.skills_required.map(skill => (
            <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
          ))}
        </div>
      </div>

      <Button className="w-full" size="sm">Assign Volunteers</Button>
    </CardContent>
  </Card>
);

export default function VolunteerCoordination() {
  const [volunteers, setVolunteers] = useState(mockVolunteers);
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [activeTab, setActiveTab] = useState('volunteers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVolunteers = volunteers.filter(vol => {
    const matchesSearch = vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vol.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vol.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vol.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">Volunteer Management</h3>
          <p className="text-brand-text-secondary">Coordinate volunteers for events and track contributions.</p>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Volunteer
        </Button>
      </div>

      <div className="flex gap-4 bg-brand-card-bg p-1 rounded-lg">
        <Button
          variant={activeTab === 'volunteers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('volunteers')}
          className="flex-1"
        >
          <Users className="w-4 h-4 mr-2" />
          Volunteers ({volunteers.length})
        </Button>
        <Button
          variant={activeTab === 'opportunities' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('opportunities')}
          className="flex-1"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Opportunities ({opportunities.length})
        </Button>
      </div>

      {activeTab === 'volunteers' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <Input
                placeholder="Search volunteers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-brand-charcoal border-brand-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map(volunteer => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} />
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'opportunities' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map(opportunity => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}