import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Globe, Flag, Users, Calendar, MapPin, Plane, FileText, MessageSquare, Trophy, Handshake, Mail, Phone, Eye, Edit, Plus, Loader2, AlertTriangle
} from 'lucide-react';

// Import Entities
import { WCFInitiative } from '@/api/entities';
import { GlobalPartnership } from '@/api/entities';
import { InternationalEvent } from '@/api/entities';
import { Delegation } from '@/api/entities';

// Detail Modals
const PartnershipDetailsModal = ({ partnership }) => (
  <DialogContent className="sm:max-w-[600px] bg-brand-card-bg border-brand-border">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-brand-text-primary">
        <Flag className="w-5 h-5" />
        {partnership.organization}
      </DialogTitle>
    </DialogHeader>
    <div className="space-y-4 py-4 text-brand-text-secondary">
      <p><strong>Country:</strong> {partnership.country}</p>
      <p><strong>Partnership Type:</strong> <Badge variant="outline">{partnership.partnership_type}</Badge></p>
      <p><strong>Status:</strong> {partnership.status}</p>
      <p><strong>Established:</strong> {new Date(partnership.established_date).toLocaleDateString()}</p>
      <p><strong>Next Review:</strong> {new Date(partnership.next_review_date).toLocaleDateString()}</p>
      <div className="pt-2 border-t border-brand-border">
        <h4 className="font-semibold text-brand-text-primary mb-2">Contact Info</h4>
        <p>{partnership.contact_info.name}, {partnership.contact_info.role}</p>
        <p><Mail className="w-4 h-4 inline mr-2" />{partnership.contact_info.email}</p>
        <p><Phone className="w-4 h-4 inline mr-2" />{partnership.contact_info.phone}</p>
      </div>
    </div>
  </DialogContent>
);


export default function InternationalRelationsHub() {
  const [activeTab, setActiveTab] = useState('wcf_relations');
  const [wcfInitiatives, setWcfInitiatives] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [events, setEvents] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [initiativesData, partnershipsData, eventsData, delegationsData] = await Promise.all([
          WCFInitiative.list(),
          GlobalPartnership.list(),
          InternationalEvent.list(),
          Delegation.list()
        ]);
        setWcfInitiatives(initiativesData);
        setPartnerships(partnershipsData);
        setEvents(eventsData);
        setDelegations(delegationsData);
      } catch (err) {
        console.error("Failed to load international relations data:", err);
        setError("Could not load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const internationalStats = [
    { title: 'Global Partners', value: partnerships.length, change: 'Across 6 continents', icon: Handshake, color: 'text-blue-400' },
    { title: 'Active Delegations', value: delegations.length, change: `For ${events.filter(e => e.status === 'upcoming').length} events`, icon: Users, color: 'text-green-400' },
    { title: 'International Events', value: events.length, change: `${events.filter(e => e.status === 'upcoming').length} upcoming`, icon: Trophy, color: 'text-purple-400' },
    { title: 'WCF Initiatives', value: wcfInitiatives.length, change: `${wcfInitiatives.filter(i => i.priority === 'high').length} high priority`, icon: Globe, color: 'text-orange-400' }
  ];

  const getStatusBadge = (status) => {
    const config = {
      active: { color: 'bg-green-600', text: 'Active' },
      upcoming: { color: 'bg-blue-600', text: 'Upcoming' },
      completed: { color: 'bg-gray-600', text: 'Completed' },
      planning: { color: 'bg-yellow-600', text: 'Planning' },
      preparing: { color: 'bg-orange-600', text: 'Preparing' },
      in_progress: { color: 'bg-blue-500', text: 'In Progress' }
    };
    const { color, text } = config[status] || { color: 'bg-gray-500', text: status };
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const config = {
      high: { color: 'bg-red-600', text: 'High Priority' },
      medium: { color: 'bg-yellow-600', text: 'Medium Priority' },
      low: { color: 'bg-green-600', text: 'Low Priority' }
    };
    const { color, text } = config[priority] || { color: 'bg-gray-500', text: priority };
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const getValueRating = (rating) => {
    const stars = '★'.repeat(rating === 'high' ? 3 : rating === 'medium' ? 2 : 1);
    const color = rating === 'high' ? 'text-yellow-400' : rating === 'medium' ? 'text-yellow-500' : 'text-yellow-600';
    return <span className={color}>{stars}</span>;
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }
    if (error) {
      return <div className="text-center py-12 text-red-500"><AlertTriangle className="mx-auto w-8 h-8 mb-2" />{error}</div>;
    }
    
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="wcf_relations">WCF Relations</TabsTrigger>
          <TabsTrigger value="partnerships">Global Partners</TabsTrigger>
          <TabsTrigger value="events">International Events</TabsTrigger>
          <TabsTrigger value="delegations">Delegations</TabsTrigger>
        </TabsList>

        <TabsContent value="wcf_relations" className="mt-6">
          <div className="space-y-4">
            {wcfInitiatives.map((relation) => (
              <Card key={relation.id} className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-brand-text-primary">{relation.initiative_name}</CardTitle>
                      <p className="text-sm text-brand-text-secondary mt-1">Role: {relation.our_role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(relation.status)}
                      {getPriorityBadge(relation.priority)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1" />View Details</Button>
                    <Button size="sm" variant="outline"><Edit className="w-4 h-4 mr-1" />Update</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="partnerships" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {partnerships.map((partnership) => (
              <Card key={partnership.id} className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-brand-text-primary flex items-center gap-2">
                        <Flag className="w-5 h-5" />
                        {partnership.organization}
                      </CardTitle>
                      <p className="text-sm text-brand-text-secondary">{partnership.country}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getValueRating(partnership.value_rating)}
                      {getStatusBadge(partnership.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                   <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                           <Button size="sm" variant="outline" className="flex-1"><Eye className="w-4 h-4 mr-1" />View</Button>
                        </DialogTrigger>
                        <PartnershipDetailsModal partnership={partnership} />
                      </Dialog>
                      <Button size="sm" variant="outline" className="flex-1"><MessageSquare className="w-4 h-4 mr-1" />Contact</Button>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-brand-text-primary flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        {event.event_name}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-brand-text-secondary">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(event.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{event.event_type}</Badge>
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="delegations" className="mt-6">
          <div className="space-y-4">
            {delegations.map((delegation) => (
              <Card key={delegation.id} className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-brand-text-primary flex items-center gap-2">
                        <Plane className="w-5 h-5" />
                        {delegation.event_name}
                      </CardTitle>
                    </div>
                    {getStatusBadge(delegation.status)}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">International Relations Hub</h2>
            <p className="text-brand-text-secondary">Managing global partnerships, WCF relations, and international curling affairs</p>
          </div>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          New Initiative
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {internationalStats.map((stat, index) => (
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
      
      {renderContent()}
    </div>
  );
}