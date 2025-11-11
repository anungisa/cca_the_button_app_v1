import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SafeSportPolicy } from '@/api/entities';
import { 
  FileText, 
  Download, 
  Eye, 
  PlusCircle, 
  Search, 
  Calendar,
  Users,
  Shield,
  Archive,
  Edit,
  History
} from 'lucide-react';
import { motion } from 'framer-motion';

const PolicyGovernanceBinder = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');

  const policyTypes = ['all', 'conduct_standard', 'abuse_prevention', 'inclusion', 'governance', 'legal_compliance'];
  const statuses = ['all', 'draft', 'review', 'approved', 'active', 'archived'];
  const audiences = ['all', 'athletes', 'coaches', 'officials', 'volunteers', 'staff', 'board', 'parents', 'clubs', 'mas'];

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setIsLoading(true);
    try {
      const allPolicies = await SafeSportPolicy.list();
      setPolicies(allPolicies);
      setFilteredPolicies(allPolicies);
    } catch (error) {
      console.error("Error loading policies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let tempPolicies = [...policies];

    if (searchTerm) {
      tempPolicies = tempPolicies.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      tempPolicies = tempPolicies.filter(p => p.policy_type === typeFilter);
    }

    if (statusFilter !== 'all') {
      tempPolicies = tempPolicies.filter(p => p.status === statusFilter);
    }

    if (audienceFilter !== 'all') {
      tempPolicies = tempPolicies.filter(p => p.target_audience.includes(audienceFilter));
    }

    setFilteredPolicies(tempPolicies);
  }, [searchTerm, typeFilter, statusFilter, audienceFilter, policies]);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      review: 'bg-yellow-500',
      approved: 'bg-blue-500',
      active: 'bg-green-500',
      archived: 'bg-gray-400'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPolicyTypeIcon = (type) => {
    switch (type) {
      case 'conduct_standard':
        return <Shield className="w-4 h-4" />;
      case 'abuse_prevention':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'inclusion':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'governance':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'legal_compliance':
        return <Archive className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Policy & Governance Binder</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Bundle
            </Button>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Policy
            </Button>
          </div>
        </div>
        <p className="text-brand-text-secondary">
          Centralized repository for all Safe Sport policies, standards, and governance documents.
        </p>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <Input 
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-brand-charcoal border-brand-border"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-brand-charcoal border-brand-border">
              <SelectValue placeholder="Policy Type" />
            </SelectTrigger>
            <SelectContent>
              {policyTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type === 'all' ? 'All Types' : type.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-brand-charcoal border-brand-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status === 'all' ? 'All Statuses' : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={audienceFilter} onValueChange={setAudienceFilter}>
            <SelectTrigger className="bg-brand-charcoal border-brand-border">
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent>
              {audiences.map(audience => (
                <SelectItem key={audience} value={audience} className="capitalize">
                  {audience === 'all' ? 'All Audiences' : audience}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Policy List */}
        {isLoading ? (
          <div className="text-center py-8 text-brand-text-secondary">Loading policies...</div>
        ) : (
          <div className="space-y-4">
            {filteredPolicies.length > 0 ? filteredPolicies.map((policy, index) => (
              <motion.div
                key={policy.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-brand-charcoal border-brand-border/50 hover:border-brand-red/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex-shrink-0">
                        {getPolicyTypeIcon(policy.policy_type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-brand-text-primary">{policy.title}</h4>
                            <p className="text-sm text-brand-text-secondary">Version {policy.version}</p>
                          </div>
                          <Badge className={`${getStatusColor(policy.status)} text-white capitalize`}>
                            {policy.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-text-secondary">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Effective: {formatDate(policy.effective_date)}</span>
                          </div>
                          {policy.expiry_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Expires: {formatDate(policy.expiry_date)}</span>
                            </div>
                          )}
                          {policy.compliance_mandatory && (
                            <Badge variant="outline" className="text-xs">Mandatory</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {policy.target_audience?.slice(0, 3).map(audience => (
                            <Badge key={audience} variant="secondary" className="text-xs capitalize">
                              {audience}
                            </Badge>
                          ))}
                          {policy.target_audience?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{policy.target_audience.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <History className="w-4 h-4 mr-1" />
                          History
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open(policy.document_url, '_blank')}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-brand-text-secondary">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No policies found for the selected filters.</p>
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create First Policy
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyGovernanceBinder;