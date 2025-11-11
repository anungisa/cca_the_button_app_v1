import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BookOpen,
  Users,
  FileText,
  ExternalLink,
  Plus,
  Search,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';

const generateSamplePartnerships = () => {
  const universities = [
    'University of British Columbia', 'University of Calgary', 'University of Alberta',
    'University of Saskatchewan', 'University of Manitoba', 'Western University',
    'University of Toronto', 'Queen\'s University', 'McGill University',
    'Université Laval', 'University of New Brunswick', 'Dalhousie University'
  ];
  
  const researchAreas = [
    'concussion_study', 'youth_retention', 'biomechanics', 'performance_analysis',
    'fan_behavior', 'injury_prevention', 'other'
  ];
  
  const stages = ['proposed', 'irb_review', 'data_collection', 'analysis', 'published', 'completed'];
  const outputTypes = ['whitepaper', 'presentation', 'app_prototype', 'journal_article', 'conference_talk', 'dataset'];

  return universities.map((uni, index) => ({
    id: `partnership-${index}`,
    project_name: `${researchAreas[index % researchAreas.length].replace(/_/g, ' ')} Research Project`,
    partner_institution: uni,
    partner_contact: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][index % 5]}`,
    internal_lead: ['Sarah Chen', 'Michael Rodriguez', 'Dr. Emma Wilson'][index % 3],
    research_area: researchAreas[index % researchAreas.length],
    stage: stages[index % stages.length],
    start_date: `2024-0${(index % 6) + 1}-01`,
    end_date: `2024-${String((index % 6) + 7).padStart(2, '0')}-01`,
    funding_amount: Math.floor(Math.random() * 100000) + 25000,
    output_type: [outputTypes[index % outputTypes.length]],
    regional_focus: index % 3 === 0 ? canadianProvincesAndTerritories[index % canadianProvincesAndTerritories.length].abbreviation : null,
    deliverables: [
      {
        name: 'Interim Report',
        type: 'whitepaper',
        completion_date: `2024-0${(index % 6) + 3}-15`,
        url: '#'
      }
    ],
    ethics_approval: {
      required: index % 2 === 0,
      status: ['pending', 'approved', 'not_required'][index % 3],
      approval_date: index % 3 === 1 ? `2024-0${(index % 6) + 1}-15` : null
    },
    data_sharing_agreement: index % 3 === 0,
    notes: 'Partnership progressing well with regular monthly check-ins scheduled.'
  }));
};

const PartnershipCard = ({ partnership, selectedRegion }) => {
  // Filter partnerships based on regional focus
  const isRelevant = selectedRegion === 'all' || 
                    !partnership.regional_focus || 
                    partnership.regional_focus === selectedRegion;

  if (!isRelevant) return null;

  const getStatusBadge = (stage) => {
    const config = {
      proposed: { color: 'bg-gray-500', text: 'Proposed' },
      irb_review: { color: 'bg-yellow-500', text: 'IRB Review' },
      data_collection: { color: 'bg-blue-500', text: 'Data Collection' },
      analysis: { color: 'bg-purple-500', text: 'Analysis' },
      published: { color: 'bg-green-500', text: 'Published' },
      completed: { color: 'bg-green-600', text: 'Completed' }
    };
    const { color, text } = config[stage] || { color: 'bg-gray-500', text: 'Unknown' };
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const getEthicsStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'not_required': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{partnership.project_name}</CardTitle>
            <p className="text-sm text-brand-text-secondary mt-1">
              {partnership.partner_institution}
            </p>
            <p className="text-xs text-brand-text-secondary">
              Lead: {partnership.internal_lead} • Contact: {partnership.partner_contact}
            </p>
          </div>
          {getStatusBadge(partnership.stage)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-text-secondary" />
            <span>{partnership.start_date} to {partnership.end_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-text-secondary" />
            <span>${partnership.funding_amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-brand-text-secondary">Research Area:</span>
            <Badge variant="outline" className="capitalize">
              {partnership.research_area.replace(/_/g, ' ')}
            </Badge>
          </div>
          
          {partnership.regional_focus && (
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-secondary">Regional Focus:</span>
              <Badge variant="secondary">
                {getProvinceNameByAbbreviation(partnership.regional_focus)}
              </Badge>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-brand-text-secondary">Ethics Approval:</span>
            <div className="flex items-center gap-2">
              {getEthicsStatusIcon(partnership.ethics_approval.status)}
              <span className="capitalize">{partnership.ethics_approval.status.replace(/_/g, ' ')}</span>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-brand-text-secondary">Data Sharing:</span>
            <span className={partnership.data_sharing_agreement ? 'text-green-500' : 'text-gray-500'}>
              {partnership.data_sharing_agreement ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {partnership.deliverables.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-brand-text-secondary">Recent Deliverables:</p>
            {partnership.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-brand-charcoal rounded">
                <span>{deliverable.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{deliverable.type}</Badge>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-brand-border">
          <Button size="sm" variant="outline">
            <FileText className="w-4 h-4 mr-1" />
            View Details
          </Button>
          <Button size="sm" variant="outline">
            <Users className="w-4 h-4 mr-1" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PartnershipSummary = ({ partnerships, selectedRegion }) => {
  const filteredPartnerships = useMemo(() => {
    if (selectedRegion === 'all') return partnerships;
    return partnerships.filter(p => 
      !p.regional_focus || p.regional_focus === selectedRegion
    );
  }, [partnerships, selectedRegion]);

  const stats = useMemo(() => {
    const totalFunding = filteredPartnerships.reduce((sum, p) => sum + p.funding_amount, 0);
    const activeProjects = filteredPartnerships.filter(p => 
      ['data_collection', 'analysis'].includes(p.stage)
    ).length;
    const completedProjects = filteredPartnerships.filter(p => 
      ['published', 'completed'].includes(p.stage)
    ).length;
    const pendingEthics = filteredPartnerships.filter(p => 
      p.ethics_approval.status === 'pending'
    ).length;

    return { totalFunding, activeProjects, completedProjects, pendingEthics };
  }, [filteredPartnerships]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4 text-center">
          <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-brand-text-primary">
            ${stats.totalFunding.toLocaleString()}
          </p>
          <p className="text-sm text-brand-text-secondary">Total Funding</p>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4 text-center">
          <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-brand-text-primary">{stats.activeProjects}</p>
          <p className="text-sm text-brand-text-secondary">Active Projects</p>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-brand-text-primary">{stats.completedProjects}</p>
          <p className="text-sm text-brand-text-secondary">Completed</p>
        </CardContent>
      </Card>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4 text-center">
          <AlertCircle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-brand-text-primary">{stats.pendingEthics}</p>
          <p className="text-sm text-brand-text-secondary">Pending Ethics</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ResearchPartnerships({ selectedRegion }) {
  const [partnerships, setPartnerships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [researchAreaFilter, setResearchAreaFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadPartnerships = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from ResearchPartnership entity
        setPartnerships(generateSamplePartnerships());
      } catch (error) {
        console.error('Error loading research partnerships:', error);
        setPartnerships(generateSamplePartnerships());
      } finally {
        setIsLoading(false);
      }
    };
    loadPartnerships();
  }, []);

  const filteredPartnerships = useMemo(() => {
    let filtered = partnerships;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.partner_institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.partner_contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stageFilter !== 'all') {
      filtered = filtered.filter(p => p.stage === stageFilter);
    }

    if (researchAreaFilter !== 'all') {
      filtered = filtered.filter(p => p.research_area === researchAreaFilter);
    }

    return filtered;
  }, [partnerships, searchTerm, stageFilter, researchAreaFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-500" />
          <div>
            <h3 className="text-xl font-bold text-brand-text-primary">Research Partnerships</h3>
            <p className="text-brand-text-secondary">
              Academic collaborations and research projects
              {selectedRegion !== 'all' && ` - ${getProvinceNameByAbbreviation(selectedRegion)} Focus`}
            </p>
          </div>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          New Partnership
        </Button>
      </div>

      <PartnershipSummary partnerships={partnerships} selectedRegion={selectedRegion} />

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Filter Partnerships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search partnerships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="proposed">Proposed</SelectItem>
                <SelectItem value="irb_review">IRB Review</SelectItem>
                <SelectItem value="data_collection">Data Collection</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={researchAreaFilter} onValueChange={setResearchAreaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by research area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Research Areas</SelectItem>
                <SelectItem value="concussion_study">Concussion Study</SelectItem>
                <SelectItem value="youth_retention">Youth Retention</SelectItem>
                <SelectItem value="biomechanics">Biomechanics</SelectItem>
                <SelectItem value="performance_analysis">Performance Analysis</SelectItem>
                <SelectItem value="fan_behavior">Fan Behavior</SelectItem>
                <SelectItem value="injury_prevention">Injury Prevention</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPartnerships.map(partnership => (
          <PartnershipCard
            key={partnership.id}
            partnership={partnership}
            selectedRegion={selectedRegion}
          />
        ))}
      </div>

      {filteredPartnerships.length === 0 && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No partnerships found</h3>
            <p className="text-brand-text-secondary">
              {searchTerm || stageFilter !== 'all' || researchAreaFilter !== 'all'
                ? 'No partnerships match your current filters.'
                : 'No research partnerships have been established yet.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}