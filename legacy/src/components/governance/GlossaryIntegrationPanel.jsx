
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen, Search, Plus, Eye, CheckCircle, Clock,
  Tag, Database, Link2, ExternalLink, TrendingUp,
  Filter, ArrowRight, BarChart3
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import CreateGlossaryTermModal from './CreateGlossaryTermModal';
import GlossaryTermDetail from './GlossaryTermDetail';

export default function GlossaryIntegrationPanel({ glossaryTerms, onRefresh }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = !searchTerm ||
      term.term_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: glossaryTerms.length,
    approved: glossaryTerms.filter(t => t.status === 'approved').length,
    review: glossaryTerms.filter(t => t.status === 'review').length,
    coverage: glossaryTerms.length > 0 ? Math.round((glossaryTerms.filter(t => t.data_sources?.length > 0).length / glossaryTerms.length) * 100) : 0
  };

  const getCategoryIcon = (category) => {
    const icons = {
      membership: 'Users',
      events: 'Calendar',
      finance: 'DollarSign',
      high_performance: 'Trophy',
      operations: 'Database',
      marketing: 'TrendingUp',
      governance: 'Shield',
      technical: 'Database'
    };
    return icons[category] || 'BookOpen';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Terms</p>
                <p className="text-2xl font-bold text-brand-text-primary">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-400" />
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
                <p className="text-sm text-brand-text-secondary">Data Coverage</p>
                <p className="text-2xl font-bold text-blue-400">{stats.coverage}%</p>
              </div>
              <Link2 className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Integration Status */}
      <Alert className="border-green-500/50 bg-green-500/10">
        <Database className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-brand-text-secondary">
          <strong>System Integration:</strong> Business glossary terms can be integrated with various operational and analytical systems,
          ensuring consistent data standards and definitions across your organization.
        </AlertDescription>
      </Alert>

      {/* Search and Filter */}
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

              <Button onClick={() => setShowCreateModal(true)} className="bg-brand-red">
                <Plus className="w-4 h-4 mr-2" />
                Add Term
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glossary Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((term) => (
          <Card
            key={term.id}
            className="bg-brand-card-bg border-brand-border hover:border-purple-500/50 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedTerm(term)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <CardTitle className="text-base">{term.term_name}</CardTitle>
                  </div>
                  <Badge className={
                    term.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    term.status === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }>
                    {term.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-brand-text-secondary line-clamp-3 mb-3">
                {term.definition}
              </p>

              <div className="flex items-center justify-between text-xs mb-3">
                <Badge variant="outline">{term.category}</Badge>
                <span className="text-brand-text-secondary">
                  v{term.version} • {term.owner_department}
                </span>
              </div>

              {/* Data Source Mappings */}
              {term.data_sources && term.data_sources.length > 0 && (
                <div className="pt-3 border-t border-brand-border">
                  <p className="text-xs text-brand-text-secondary mb-2 flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    Mapped to {term.data_sources.length} system{term.data_sources.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {term.data_sources.slice(0, 3).map((source, idx) => (
                      <Badge key={idx} className="bg-blue-500/20 text-blue-400 text-xs">
                        {source.system}
                      </Badge>
                    ))}
                    {term.data_sources.length > 3 && (
                      <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                        +{term.data_sources.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Aliases */}
              {term.aliases && term.aliases.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  <Tag className="w-3 h-3 text-brand-text-secondary" />
                  {term.aliases.slice(0, 2).map((alias, idx) => (
                    <Badge key={idx} className="bg-gray-500/20 text-gray-400 text-xs">
                      {alias}
                    </Badge>
                  ))}
                  {term.aliases.length > 2 && (
                    <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                      +{term.aliases.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredTerms.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-brand-text-secondary opacity-50" />
            <p className="text-brand-text-secondary mb-4">
              {searchTerm ? 'No terms match your search' : 'No glossary terms defined yet.'}
            </p>
            <Button onClick={() => setShowCreateModal(true)} className="bg-brand-red">
              <Plus className="w-4 h-4 mr-2" />
              Create First Term
            </Button>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Glossary Impact Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">{stats.coverage}%</div>
              <p className="text-xs text-brand-text-secondary">Data Source Coverage</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {glossaryTerms.filter(t => t.usage_count > 0).length}
              </div>
              <p className="text-xs text-brand-text-secondary">Terms in Active Use</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {glossaryTerms.reduce((sum, t) => sum + (t.data_sources?.length || 0), 0)}
              </div>
              <p className="text-xs text-brand-text-secondary">System Mappings</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {glossaryTerms.filter(t => t.status === 'review').length}
              </div>
              <p className="text-xs text-brand-text-secondary">Pending Review</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <CreateGlossaryTermModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            onRefresh();
          }}
        />
      )}

      {selectedTerm && (
        <GlossaryTermDetail
          term={selectedTerm}
          isOpen={!!selectedTerm}
          onClose={() => {
            setSelectedTerm(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
