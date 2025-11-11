import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VolunteerCampaign } from '@/api/entities';
import { Plus, Search, Eye, QrCode, Users } from 'lucide-react';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchTerm, statusFilter]);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await VolunteerCampaign.list('-created_date', 50);
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCampaigns = () => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.event_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    setFilteredCampaigns(filtered);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      planning: 'bg-blue-600',
      active: 'bg-green-600',
      completed: 'bg-purple-600',
      closed: 'bg-gray-600'
    };

    return (
      <Badge className={`${statusColors[status] || 'bg-gray-600'} text-white capitalize`}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">Volunteer Intake Campaigns</h3>
          <p className="text-brand-text-secondary">Manage recruitment campaigns and applications</p>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaign List */}
      {isLoading ? (
        <div className="text-center p-8">
          <p className="text-brand-text-secondary">Loading campaigns...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-brand-card-bg border-brand-border hover:border-brand-red/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-brand-text-primary text-lg">{campaign.name}</h4>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-brand-text-secondary mb-2">Event: {campaign.event_name}</p>
                    <p className="text-sm text-brand-text-secondary">
                      Region: {campaign.target_region} | Applications: {campaign.applications_received || 0}
                    </p>
                    {campaign.roles_needed && (
                      <div className="mt-2">
                        <p className="text-xs text-brand-text-secondary mb-1">Roles Needed:</p>
                        <div className="flex flex-wrap gap-1">
                          {campaign.roles_needed.map((role, index) => (
                            <Badge key={index} variant="outline" className="border-brand-border text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-brand-border">
                      <Users className="w-3 h-3 mr-1" />
                      {campaign.applications_received || 0}
                    </Badge>
                    {campaign.qr_code_url && (
                      <Button variant="outline" size="sm" className="border-brand-border">
                        <QrCode className="w-4 h-4 mr-2" />
                        QR Code
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="border-brand-border">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
                {(campaign.start_date || campaign.end_date) && (
                  <div className="mt-4 pt-4 border-t border-brand-border">
                    <p className="text-xs text-brand-text-secondary">
                      {campaign.start_date && `Start: ${new Date(campaign.start_date).toLocaleDateString()}`}
                      {campaign.start_date && campaign.end_date && ' • '}
                      {campaign.end_date && `End: ${new Date(campaign.end_date).toLocaleDateString()}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCampaigns.length === 0 && !isLoading && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <p className="text-brand-text-secondary mb-4">No volunteer campaigns found.</p>
            <Button className="bg-brand-red hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Create First Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignManager;