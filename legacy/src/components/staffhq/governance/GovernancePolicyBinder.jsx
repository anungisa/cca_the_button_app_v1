import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GovernancePolicy } from '@/api/entities';
import { BookOpen, Search, Plus, Eye, Download, AlertCircle } from 'lucide-react';

const GovernancePolicyBinder = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

  useEffect(() => {
    filterPolicies();
  }, [policies, searchTerm, typeFilter, statusFilter]);

  const loadPolicies = async () => {
    setIsLoading(true);
    try {
      const data = await GovernancePolicy.list('-effective_date', 100);
      setPolicies(data || []);
    } catch (error) {
      console.error('Error loading policies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPolicies = () => {
    let filtered = policies;

    if (searchTerm) {
      filtered = filtered.filter(policy => 
        policy.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(policy => policy.policy_type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(policy => policy.approval_status === statusFilter);
    }

    setFilteredPolicies(filtered);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      draft: 'bg-yellow-600 text-yellow-950',
      review: 'bg-blue-600',
      board_approval: 'bg-purple-600',
      approved: 'bg-green-600',
      archived: 'bg-gray-600'
    };

    return (
      <Badge className={`${statusColors[status] || 'bg-gray-600'} text-white capitalize`}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (policy) => {
    const today = new Date();
    const reviewDate = policy.next_review_date ? new Date(policy.next_review_date) : null;
    const expiryDate = policy.expiry_date ? new Date(policy.expiry_date) : null;

    if (expiryDate && expiryDate < today) {
      return <Badge className="bg-red-600 text-white">Expired</Badge>;
    }
    if (reviewDate && reviewDate < today) {
      return <Badge className="bg-orange-600 text-white">Review Due</Badge>;
    }
    if (reviewDate && (reviewDate - today) / (1000 * 60 * 60 * 24) <= 30) {
      return <Badge className="bg-yellow-600 text-yellow-950">Review Soon</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">Policy Binder</h3>
          <p className="text-brand-text-secondary">Centralized governance policies and procedures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-brand-border">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button className="bg-brand-red hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">{policies.length}</p>
            <p className="text-sm text-brand-text-secondary">Total Policies</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">
              {policies.filter(p => {
                const reviewDate = p.next_review_date ? new Date(p.next_review_date) : null;
                return reviewDate && reviewDate < new Date();
              }).length}
            </p>
            <p className="text-sm text-brand-text-secondary">Review Due</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">
              {policies.filter(p => {
                const expiryDate = p.expiry_date ? new Date(p.expiry_date) : null;
                return expiryDate && expiryDate < new Date();
              }).length}
            </p>
            <p className="text-sm text-brand-text-secondary">Expired</p>
          </CardContent>
        </Card>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-text-primary">
              {policies.filter(p => p.approval_status === 'approved').length}
            </p>
            <p className="text-sm text-brand-text-secondary">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-charcoal border-brand-border"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="board_governance">Board Governance</SelectItem>
                <SelectItem value="committee_procedures">Committee Procedures</SelectItem>
                <SelectItem value="conflict_of_interest">Conflict of Interest</SelectItem>
                <SelectItem value="dei_framework">DEI Framework</SelectItem>
                <SelectItem value="compliance_standard">Compliance Standard</SelectItem>
                <SelectItem value="operational_policy">Operational Policy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-brand-charcoal border-brand-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="board_approval">Board Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Policy List */}
      {isLoading ? (
        <div className="text-center p-8">
          <p className="text-brand-text-secondary">Loading policies...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPolicies.map((policy) => {
            const priorityBadge = getPriorityBadge(policy);
            return (
              <Card key={policy.id} className="bg-brand-card-bg border-brand-border hover:border-brand-red/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-brand-text-primary text-lg">{policy.title}</h4>
                        {getStatusBadge(policy.approval_status)}
                        {priorityBadge}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-brand-text-secondary mb-2">
                        <span>Version: {policy.version}</span>
                        <span>Effective: {new Date(policy.effective_date).toLocaleDateString()}</span>
                        {policy.next_review_date && (
                          <span>Next Review: {new Date(policy.next_review_date).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="border-brand-border capitalize">
                          {policy.policy_type.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="border-brand-border capitalize">
                          {policy.policy_category.replace('_', ' ')}
                        </Badge>
                      </div>
                      {policy.compliance_requirements && policy.compliance_requirements.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {policy.compliance_requirements.map((req, index) => (
                            <Badge key={index} className="bg-purple-600 text-white text-xs uppercase">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="border-brand-border">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="border-brand-border">
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

      {filteredPolicies.length === 0 && !isLoading && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <p className="text-brand-text-secondary mb-4">No policies found matching your criteria.</p>
            <Button className="bg-brand-red hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Create First Policy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GovernancePolicyBinder;