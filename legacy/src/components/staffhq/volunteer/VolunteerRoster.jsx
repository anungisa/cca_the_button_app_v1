import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volunteer } from '@/api/entities';
import { Search, Filter, Download, UserPlus, Eye } from 'lucide-react';
import VolunteerDetailView from './VolunteerDetailView';

const VolunteerRoster = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVolunteers();
  }, []);

  useEffect(() => {
    filterVolunteers();
  }, [volunteers, searchTerm, regionFilter, complianceFilter]);

  const loadVolunteers = async () => {
    setIsLoading(true);
    try {
      const data = await Volunteer.list('-last_active_date', 100);
      setVolunteers(data || []);
    } catch (error) {
      console.error('Error loading volunteers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVolunteers = () => {
    let filtered = volunteers;

    if (searchTerm) {
      filtered = filtered.filter(volunteer => 
        volunteer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (regionFilter !== 'all') {
      filtered = filtered.filter(volunteer => volunteer.ma_region === regionFilter);
    }

    if (complianceFilter !== 'all') {
      filtered = filtered.filter(volunteer => {
        const compliance = volunteer.compliance || {};
        if (complianceFilter === 'compliant') {
          return compliance.respect_in_sport === 'compliant' && 
                 compliance.policy_signed === 'compliant' && 
                 compliance.background_check === 'compliant';
        } else if (complianceFilter === 'pending') {
          return compliance.respect_in_sport === 'pending' || 
                 compliance.policy_signed === 'pending' || 
                 compliance.background_check === 'pending';
        } else if (complianceFilter === 'expired') {
          return compliance.respect_in_sport === 'expired' || 
                 compliance.policy_signed === 'expired' || 
                 compliance.background_check === 'expired';
        }
        return true;
      });
    }

    setFilteredVolunteers(filtered);
  };

  const getComplianceStatus = (volunteer) => {
    const compliance = volunteer.compliance || {};
    const statuses = [
      compliance.respect_in_sport,
      compliance.policy_signed,
      compliance.background_check
    ];

    if (statuses.every(status => status === 'compliant')) return 'compliant';
    if (statuses.some(status => status === 'expired')) return 'expired';
    if (statuses.some(status => status === 'pending')) return 'pending';
    return 'unknown';
  };

  const getComplianceBadge = (status) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-600 text-white">Compliant</Badge>;
      case 'expired':
        return <Badge className="bg-red-600 text-white">Expired</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600 text-yellow-950">Pending</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white">Unknown</Badge>;
    }
  };

  if (selectedVolunteer) {
    return (
      <VolunteerDetailView 
        volunteer={selectedVolunteer} 
        onBack={() => setSelectedVolunteer(null)}
        onUpdate={loadVolunteers}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">Volunteer Roster</h3>
          <p className="text-brand-text-secondary">Manage volunteer records and compliance status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-brand-border">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-brand-red hover:bg-red-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search volunteers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border"
              />
            </div>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="BC">British Columbia</SelectItem>
                <SelectItem value="AB">Alberta</SelectItem>
                <SelectItem value="SK">Saskatchewan</SelectItem>
                <SelectItem value="MB">Manitoba</SelectItem>
                <SelectItem value="ON">Ontario</SelectItem>
                <SelectItem value="QC">Quebec</SelectItem>
                <SelectItem value="NB">New Brunswick</SelectItem>
                <SelectItem value="NS">Nova Scotia</SelectItem>
                <SelectItem value="PE">Prince Edward Island</SelectItem>
                <SelectItem value="NL">Newfoundland & Labrador</SelectItem>
                <SelectItem value="YT">Yukon</SelectItem>
                <SelectItem value="NT">Northwest Territories</SelectItem>
                <SelectItem value="NU">Nunavut</SelectItem>
              </SelectContent>
            </Select>
            <Select value={complianceFilter} onValueChange={setComplianceFilter}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Filter by compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Compliance</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Volunteer List */}
      {isLoading ? (
        <div className="text-center p-8">
          <p className="text-brand-text-secondary">Loading volunteers...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredVolunteers.map((volunteer) => {
            const complianceStatus = getComplianceStatus(volunteer);
            return (
              <Card key={volunteer.id} className="bg-brand-card-bg border-brand-border hover:border-brand-red/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-brand-text-primary">{volunteer.full_name}</h4>
                        {getComplianceBadge(complianceStatus)}
                      </div>
                      <p className="text-sm text-brand-text-secondary mb-1">{volunteer.email}</p>
                      <p className="text-sm text-brand-text-secondary">
                        Region: {volunteer.ma_region} | 
                        Events: {volunteer.events?.length || 0} | 
                        XP: {volunteer.xp_stats?.total_xp || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-brand-border">
                        {volunteer.source_system}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVolunteer(volunteer)}
                        className="border-brand-border"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredVolunteers.length === 0 && !isLoading && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <p className="text-brand-text-secondary">No volunteers found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VolunteerRoster;