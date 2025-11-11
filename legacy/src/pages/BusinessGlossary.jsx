
import React, { useState, useEffect } from 'react';
import { BusinessGlossaryTerm } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen, Search, Plus, Edit, CheckCircle, Clock,
  Archive, Filter, TrendingUp, Database, Users,
  Tag, GitBranch, Shield, AlertTriangle, Calendar,
  DollarSign, Trophy
} from 'lucide-react';
import { usePermissions } from '../components/hooks/usePermissions';
import { useToast } from '@/components/hooks/use-toast';
import CreateGlossaryTermModal from '../components/governance/CreateGlossaryTermModal';
import GlossaryTermDetail from '../components/governance/GlossaryTermDetail';

export default function BusinessGlossary() {
  const { permissions } = usePermissions();
  const { toast } = useToast();
  const [terms, setTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  useEffect(() => {
    filterTerms();
  }, [searchTerm, selectedCategory, selectedStatus, terms]);

  const loadTerms = async () => {
    setIsLoading(true);
    try {
      const data = await BusinessGlossaryTerm.list('-updated_date', 500);
      setTerms(data || []);
    } catch (error) {
      console.error('Error loading glossary terms:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load business glossary."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTerms = () => {
    let filtered = [...terms];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(term =>
        term.term_name.toLowerCase().includes(search) ||
        term.definition.toLowerCase().includes(search) ||
        term.aliases?.some(alias => alias.toLowerCase().includes(search))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(term => term.status === selectedStatus);
    }

    setFilteredTerms(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'review': return 'bg-yellow-500/20 text-yellow-400';
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'deprecated': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      membership: Users,
      events: Calendar,
      finance: DollarSign,
      high_performance: Trophy,
      operations: Database,
      marketing: TrendingUp,
      governance: Shield,
      technical: Database
    };
    return icons[category] || BookOpen;
  };

  const stats = {
    total: terms.length,
    approved: terms.filter(t => t.status === 'approved').length,
    review: terms.filter(t => t.status === 'review').length,
    draft: terms.filter(t => t.status === 'draft').length
  };

  if (!permissions?.canAccessPlatformSettings) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">
          You don't have permission to access the Business Glossary.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            Business Glossary
          </h1>
          <p className="text-brand-text-secondary mt-1">
            Official definitions and data standards for Curling Canada (N7: Data Management & Governance)
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-brand-red">
          <Plus className="w-4 h-4 mr-2" />
          Add Term
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Terms</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Approved</p>
                <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">In Review</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.review}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Drafts</p>
                <p className="text-2xl font-bold text-gray-400">{stats.draft}</p>
              </div>
              <Edit className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <Input
                  placeholder="Search terms, definitions, or aliases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-brand-charcoal border border-brand-border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="membership">Membership</option>
                <option value="events">Events</option>
                <option value="finance">Finance</option>
                <option value="high_performance">High Performance</option>
                <option value="operations">Operations</option>
                <option value="marketing">Marketing</option>
                <option value="governance">Governance</option>
                <option value="technical">Technical</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-brand-charcoal border border-brand-border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="review">In Review</option>
                <option value="draft">Draft</option>
                <option value="deprecated">Deprecated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Notice */}
      <Alert className="border-purple-500/50 bg-purple-500/10">
        <Database className="h-4 w-4 text-purple-400" />
        <AlertDescription className="text-brand-text-secondary">
          <strong>CRM Integration:</strong> HubSpot has been selected as the unified CRM platform. 
          Business glossary terms will sync to HubSpot custom properties for consistent data definitions.
        </AlertDescription>
      </Alert>

      {/* Terms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="bg-brand-card-bg border-brand-border animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-brand-border rounded mb-3"></div>
                <div className="h-3 bg-brand-border rounded mb-2"></div>
                <div className="h-3 bg-brand-border rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredTerms.length > 0 ? (
          filteredTerms.map((term) => {
            const CategoryIcon = getCategoryIcon(term.category);
            return (
              <Card
                key={term.id}
                className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTerm(term)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-5 h-5 text-blue-400" />
                      <CardTitle className="text-base">{term.term_name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(term.status)}>
                      {term.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-brand-text-secondary line-clamp-3 mb-3">
                    {term.definition}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline">{term.category}</Badge>
                    <span className="text-brand-text-secondary">
                      v{term.version} • {term.owner_department}
                    </span>
                  </div>

                  {term.aliases && term.aliases.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {term.aliases.slice(0, 3).map((alias, idx) => (
                        <Badge key={idx} className="bg-gray-500/20 text-gray-400 text-xs">
                          {alias}
                        </Badge>
                      ))}
                      {term.aliases.length > 3 && (
                        <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                          +{term.aliases.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-brand-text-secondary opacity-50" />
            <p className="text-brand-text-secondary">
              {searchTerm ? 'No terms match your search' : 'No glossary terms yet. Add your first term to get started.'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateGlossaryTermModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            loadTerms();
          }}
        />
      )}

      {selectedTerm && (
        <GlossaryTermDetail
          term={selectedTerm}
          isOpen={!!selectedTerm}
          onClose={() => {
            setSelectedTerm(null);
            loadTerms();
          }}
        />
      )}
    </div>
  );
}
