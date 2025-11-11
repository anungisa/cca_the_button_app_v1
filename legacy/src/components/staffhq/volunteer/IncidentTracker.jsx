import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VolunteerIncident } from '@/api/entities/VolunteerIncident';
import { AlertTriangle, Plus, Search, Filter, Eye, FileText } from 'lucide-react';

const IncidentTracker = () => {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    filterIncidents();
  }, [incidents, searchTerm, categoryFilter, statusFilter]);

  const loadIncidents = async () => {
    setIsLoading(true);
    try {
      const data = await VolunteerIncident.list('-incident_date', 100);
      setIncidents(data || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterIncidents = () => {
    let filtered = incidents;

    if (searchTerm) {
      filtered = filtered.filter(incident => 
        incident.volunteer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(incident => incident.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }

    setFilteredIncidents(filtered);
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      misconduct: 'bg-red-600',
      injury: 'bg-orange-600',
      absenteeism: 'bg-yellow-600 text-yellow-950',
      positive_feedback: 'bg-green-600',
      other: 'bg-gray-600'
    };

    return (
      <Badge className={`${categoryColors[category] || 'bg-gray-600'} text-white capitalize`}>
        {category.replace('_', ' ')}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      reported: 'bg-blue-600',
      reviewing: 'bg-yellow-600 text-yellow-950',
      resolved: 'bg-green-600',
      archived: 'bg-gray-600'
    };

    return (
      <Badge className={`${statusColors[status] || 'bg-gray-600'} text-white capitalize`}>
        {status}
      </Badge>
    );
  };

  const CreateIncidentModal = () => {
    const [formData, setFormData] = useState({
      volunteer_name: '',
      event_name: '',
      incident_date: '',
      category: 'other',
      description: '',
      reported_by: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await VolunteerIncident.create(formData);
        loadIncidents();
        setShowCreateModal(false);
        setFormData({
          volunteer_name: '',
          event_name: '',
          incident_date: '',
          category: 'other',
          description: '',
          reported_by: ''
        });
      } catch (error) {
        console.error('Error creating incident:', error);
      }
    };

    return (
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogTrigger asChild>
          <Button className="bg-brand-red hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Report Incident
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-brand-card-bg border-brand-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-brand-text-primary">Report Volunteer Incident</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-brand-text-secondary mb-2 block">
                  Volunteer Name
                </label>
                <Input
                  required
                  value={formData.volunteer_name}
                  onChange={(e) => setFormData({...formData, volunteer_name: e.target.value})}
                  className="bg-brand-charcoal border-brand-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-text-secondary mb-2 block">
                  Event Name
                </label>
                <Input
                  required
                  value={formData.event_name}
                  onChange={(e) => setFormData({...formData, event_name: e.target.value})}
                  className="bg-brand-charcoal border-brand-border"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-brand-text-secondary mb-2 block">
                  Incident Date
                </label>
                <Input
                  type="date"
                  required
                  value={formData.incident_date}
                  onChange={(e) => setFormData({...formData, incident_date: e.target.value})}
                  className="bg-brand-charcoal border-brand-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-text-secondary mb-2 block">
                  Category
                </label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-brand-charcoal border-brand-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="misconduct">Misconduct</SelectItem>
                    <SelectItem value="injury">Injury</SelectItem>
                    <SelectItem value="absenteeism">Absenteeism</SelectItem>
                    <SelectItem value="positive_feedback">Positive Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-secondary mb-2 block">
                Description
              </label>
              <Textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-brand-charcoal border-brand-border"
                placeholder="Provide detailed description of the incident..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-secondary mb-2 block">
                Reported By
              </label>
              <Input
                required
                value={formData.reported_by}
                onChange={(e) => setFormData({...formData, reported_by: e.target.value})}
                className="bg-brand-charcoal border-brand-border"
                placeholder="Your name"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-red hover:bg-red-700">
                Submit Report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Incident Tracker
          </h3>
          <p className="text-brand-text-secondary">Track and manage volunteer incidents and feedback</p>
        </div>
        <CreateIncidentModal />
      </div>

      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="misconduct">Misconduct</SelectItem>
                <SelectItem value="injury">Injury</SelectItem>
                <SelectItem value="absenteeism">Absenteeism</SelectItem>
                <SelectItem value="positive_feedback">Positive Feedback</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incident List */}
      {isLoading ? (
        <div className="text-center p-8">
          <p className="text-brand-text-secondary">Loading incidents...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredIncidents.map((incident) => (
            <Card key={incident.id} className="bg-brand-card-bg border-brand-border hover:border-brand-red/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-brand-text-primary">{incident.volunteer_name}</h4>
                      {getCategoryBadge(incident.category)}
                      {getStatusBadge(incident.status)}
                    </div>
                    <p className="text-brand-text-secondary mb-2">Event: {incident.event_name}</p>
                    <p className="text-sm text-brand-text-secondary mb-2">
                      Date: {new Date(incident.incident_date).toLocaleDateString()} | 
                      Reported by: {incident.reported_by}
                    </p>
                    <p className="text-sm text-brand-text-primary line-clamp-2">
                      {incident.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIncident(incident)}
                      className="border-brand-border"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredIncidents.length === 0 && !isLoading && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <p className="text-brand-text-secondary mb-4">No incidents found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="bg-brand-card-bg border-brand-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-brand-text-primary">Incident Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary">Volunteer</label>
                  <p className="text-brand-text-primary">{selectedIncident.volunteer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary">Event</label>
                  <p className="text-brand-text-primary">{selectedIncident.event_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary">Date</label>
                  <p className="text-brand-text-primary">
                    {new Date(selectedIncident.incident_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary">Reported By</label>
                  <p className="text-brand-text-primary">{selectedIncident.reported_by}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {getCategoryBadge(selectedIncident.category)}
                {getStatusBadge(selectedIncident.status)}
              </div>
              <div>
                <label className="text-sm font-medium text-brand-text-secondary mb-2 block">Description</label>
                <div className="p-3 bg-brand-charcoal rounded-lg">
                  <p className="text-brand-text-primary whitespace-pre-wrap">
                    {selectedIncident.description}
                  </p>
                </div>
              </div>
              {selectedIncident.resolution && (
                <div>
                  <label className="text-sm font-medium text-brand-text-secondary mb-2 block">Resolution</label>
                  <div className="p-3 bg-brand-charcoal rounded-lg">
                    <p className="text-brand-text-primary whitespace-pre-wrap">
                      {selectedIncident.resolution}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default IncidentTracker;