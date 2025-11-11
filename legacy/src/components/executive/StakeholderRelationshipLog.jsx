import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users,
  Building,
  Crown,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { StakeholderEngagement } from '@/api/entities';
import { useToast } from '@/components/hooks/use-toast';
import { cn } from '../utils/cn';

// Stakeholder Form Component (for Add/Edit Dialog)
const StakeholderForm = ({ stakeholder, onSave, onCancel }) => {
  const [formData, setFormData] = useState(stakeholder || {
    contact_name: '',
    organization: '',
    role: '',
    stakeholder_type: 'ma_executive',
    ma_region: 'ON',
    engagement_level: 'neutral',
    influence_level: 'medium',
    last_contact_date: new Date().toISOString().split('T')[0],
    next_followup_date: '',
    contact_info: { email: '', phone: '' },
    key_concerns: [],
    assigned_to: ''
  });

  useEffect(() => {
    if (stakeholder) {
      setFormData({
        ...stakeholder,
        last_contact_date: stakeholder.last_contact_date ? new Date(stakeholder.last_contact_date).toISOString().split('T')[0] : '',
        next_followup_date: stakeholder.next_followup_date ? new Date(stakeholder.next_followup_date).toISOString().split('T')[0] : '',
      });
    }
  }, [stakeholder]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact_info: { ...prev.contact_info, [field]: value }
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Contact Name" value={formData.contact_name} onChange={(e) => handleChange('contact_name', e.target.value)} required />
        <Input placeholder="Organization" value={formData.organization} onChange={(e) => handleChange('organization', e.target.value)} />
        <Input placeholder="Role/Title" value={formData.role} onChange={(e) => handleChange('role', e.target.value)} />
        <Select value={formData.stakeholder_type} onValueChange={(value) => handleChange('stakeholder_type', value)}>
          <SelectTrigger><SelectValue placeholder="Stakeholder Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ma_executive">MA Executive</SelectItem>
            <SelectItem value="club_president">Club President</SelectItem>
            <SelectItem value="technical_lead">Technical Lead</SelectItem>
            <SelectItem value="volunteer_coordinator">Volunteer Coordinator</SelectItem>
            <SelectItem value="board_member">Board Member</SelectItem>
            <SelectItem value="sponsor_contact">Sponsor Contact</SelectItem>
            <SelectItem value="media_contact">Media Contact</SelectItem>
            <SelectItem value="government_liaison">Government Liaison</SelectItem>
          </SelectContent>
        </Select>
        <Select value={formData.ma_region} onValueChange={(value) => handleChange('ma_region', value)}>
          <SelectTrigger><SelectValue placeholder="Region" /></SelectTrigger>
          <SelectContent>
            {canadianProvincesAndTerritories.map(p => <SelectItem key={p.abbreviation} value={p.abbreviation}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={formData.engagement_level} onValueChange={(value) => handleChange('engagement_level', value)}>
          <SelectTrigger><SelectValue placeholder="Engagement Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="champion">Champion</SelectItem>
            <SelectItem value="supportive">Supportive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="skeptical">Skeptical</SelectItem>
            <SelectItem value="resistant">Resistant</SelectItem>
          </SelectContent>
        </Select>
        <Select value={formData.influence_level} onValueChange={(value) => handleChange('influence_level', value)}>
          <SelectTrigger><SelectValue placeholder="Influence Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Email" type="email" value={formData.contact_info.email || ''} onChange={(e) => handleContactInfoChange('email', e.target.value)} />
        <Input placeholder="Phone" value={formData.contact_info.phone || ''} onChange={(e) => handleContactInfoChange('phone', e.target.value)} />
        <div>
          <label className="text-sm text-brand-text-secondary">Last Contact Date</label>
          <Input type="date" value={formData.last_contact_date} onChange={(e) => handleChange('last_contact_date', e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-brand-text-secondary">Next Follow-up Date</label>
          <Input type="date" value={formData.next_followup_date} onChange={(e) => handleChange('next_followup_date', e.target.value)} />
        </div>
      </div>
      <Textarea placeholder="Key Concerns (comma-separated)" value={(formData.key_concerns || []).join(', ')} onChange={(e) => handleChange('key_concerns', e.target.value.split(',').map(s => s.trim()))} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{stakeholder ? 'Save Changes' : 'Add Stakeholder'}</Button>
      </div>
    </form>
  );
};

export default function StakeholderRelationshipLog() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [stakeholders, setStakeholders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState(null);

  const loadStakeholders = async () => {
    setIsLoading(true);
    try {
      const data = await StakeholderEngagement.list('-created_date'); 
      setStakeholders(data);
    } catch (error) {
      console.error("Failed to load stakeholder data:", error);
      toast({
        title: "Error",
        description: "Failed to load stakeholder data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStakeholders();
  }, []);

  const handleSaveStakeholder = async (formData) => {
    try {
      const payload = { 
        ...formData, 
        key_concerns: Array.isArray(formData.key_concerns) 
          ? formData.key_concerns 
          : formData.key_concerns.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingStakeholder) {
        await StakeholderEngagement.update(editingStakeholder.id, payload);
        toast({ title: "Success", description: "Stakeholder updated." });
      } else {
        await StakeholderEngagement.create(payload);
        toast({ title: "Success", description: "Stakeholder added." });
      }
      setIsFormOpen(false);
      setEditingStakeholder(null);
      loadStakeholders(); // Refresh list
    } catch (error) {
      console.error("Error saving stakeholder:", error);
      toast({
        title: "Error",
        description: "Could not save stakeholder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setEditingStakeholder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (stakeholder) => {
    setEditingStakeholder(stakeholder);
    setIsFormOpen(true);
  };

  const getEngagementBadge = (level) => {
    const config = {
      champion: { color: 'bg-green-600', text: 'Champion', icon: CheckCircle },
      supportive: { color: 'bg-blue-600', text: 'Supportive', icon: TrendingUp },
      neutral: { color: 'bg-gray-600', text: 'Neutral', icon: MessageCircle },
      skeptical: { color: 'bg-yellow-600', text: 'Skeptical', icon: AlertTriangle },
      resistant: { color: 'bg-red-600', text: 'Resistant', icon: AlertTriangle }
    };

    const { color, text, icon: IconComponent } = config[level] || config.neutral;
    return (
      <Badge className={`${color} text-white flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  const getInfluenceBadge = (level) => {
    const config = {
      high: { color: 'bg-red-600', text: 'High Impact' },
      medium: { color: 'bg-yellow-600', text: 'Medium Impact' },
      low: { color: 'bg-gray-600', text: 'Low Impact' }
    };

    const { color, text } = config[level] || config.medium;
    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  const getStakeholderTypeIcon = (type) => {
    const icons = {
      ma_executive: Crown,
      club_president: Building,
      technical_lead: Users,
      volunteer_coordinator: Users,
      board_member: Crown,
      sponsor_contact: Building,
      media_contact: MessageCircle,
      government_liaison: Building
    };
    return icons[type] || Users;
  };

  const filteredStakeholders = stakeholders.filter(stakeholder => {
    const matchesSearch = (stakeholder.contact_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (stakeholder.organization || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || stakeholder.ma_region === selectedRegion;
    const matchesType = selectedType === 'all' || stakeholder.stakeholder_type === selectedType;
    return matchesSearch && matchesRegion && matchesType;
  });

  const EngagementOverview = () => {
    const engagementStats = {
      champions: stakeholders.filter(s => s.engagement_level === 'champion').length,
      supportive: stakeholders.filter(s => s.engagement_level === 'supportive').length,
      neutral: stakeholders.filter(s => s.engagement_level === 'neutral').length,
      skeptical: stakeholders.filter(s => s.engagement_level === 'skeptical').length,
      high_influence: stakeholders.filter(s => s.influence_level === 'high').length,
      overdue_followups: stakeholders.filter(s => 
        s.next_followup_date && new Date(s.next_followup_date) < new Date()
      ).length
    };

    const regionalBreakdown = canadianProvincesAndTerritories.map(province => {
      const regionStakeholders = stakeholders.filter(s => s.ma_region === province.abbreviation);
      return {
        region: province.abbreviation,
        region_name: province.name,
        total: regionStakeholders.length,
        champions: regionStakeholders.filter(s => s.engagement_level === 'champion').length,
        high_influence: regionStakeholders.filter(s => s.influence_level === 'high').length,
        engagement_score: regionStakeholders.length > 0 ? 
          Math.round((regionStakeholders.filter(s => ['champion', 'supportive'].includes(s.engagement_level)).length / regionStakeholders.length) * 100) : 0
      };
    });

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{engagementStats.champions}</div>
              <div className="text-sm text-brand-text-secondary">Champions</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{engagementStats.supportive}</div>
              <div className="text-sm text-brand-text-secondary">Supportive</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{engagementStats.neutral}</div>
              <div className="text-sm text-brand-text-secondary">Neutral</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{engagementStats.skeptical}</div>
              <div className="text-sm text-brand-text-secondary">Skeptical</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <Crown className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{engagementStats.high_influence}</div>
              <div className="text-sm text-brand-text-secondary">High Influence</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-text-primary">{engagementStats.overdue_followups}</div>
              <div className="text-sm text-brand-text-secondary">Overdue</div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Engagement Breakdown */}
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Regional Engagement Overview</CardTitle>
            <p className="text-sm text-brand-text-secondary">
              Stakeholder engagement levels across all provinces and territories
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {regionalBreakdown.map((region) => (
                <div key={region.region} className="p-3 bg-brand-charcoal rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-brand-text-primary">{region.region}</span>
                    <Badge variant="outline">{region.total} contacts</Badge>
                  </div>
                  <div className="text-xs text-brand-text-secondary mb-2">
                    {region.region_name}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-text-secondary">Champions:</span>
                    <span className="text-green-500 font-medium">{region.champions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-text-secondary">High Influence:</span>
                    <span className="text-red-500 font-medium">{region.high_influence}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-text-secondary">Engagement:</span>
                    <span className="text-brand-text-primary font-medium">{region.engagement_score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const StakeholderList = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <Input
                placeholder="Search stakeholders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {canadianProvincesAndTerritories.map((province) => (
                  <SelectItem key={province.abbreviation} value={province.abbreviation}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ma_executive">MA Executive</SelectItem>
                <SelectItem value="club_president">Club President</SelectItem>
                <SelectItem value="technical_lead">Technical Lead</SelectItem>
                <SelectItem value="volunteer_coordinator">Volunteer Coordinator</SelectItem>
                <SelectItem value="board_member">Board Member</SelectItem>
                <SelectItem value="sponsor_contact">Sponsor Contact</SelectItem>
                <SelectItem value="media_contact">Media Contact</SelectItem>
                <SelectItem value="government_liaison">Government Liaison</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stakeholder Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStakeholders.map((stakeholder) => {
          const IconComponent = getStakeholderTypeIcon(stakeholder.stakeholder_type);
          const isOverdue = stakeholder.next_followup_date && new Date(stakeholder.next_followup_date) < new Date();
          
          return (
            <Card key={stakeholder.id} className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-brand-red" />
                    <div>
                      <CardTitle className="text-base">{stakeholder.contact_name}</CardTitle>
                      <p className="text-sm text-brand-text-secondary">{stakeholder.organization}</p>
                      <p className="text-xs text-brand-text-secondary">{stakeholder.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{stakeholder.ma_region}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {getEngagementBadge(stakeholder.engagement_level)}
                  {getInfluenceBadge(stakeholder.influence_level)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-brand-text-secondary">Last Contact</div>
                    <div className="text-brand-text-primary">
                      {stakeholder.last_contact_date ? new Date(stakeholder.last_contact_date).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-brand-text-secondary">Next Follow-up</div>
                    <div className={cn(
                      "font-medium",
                      isOverdue ? "text-red-500" : "text-brand-text-primary"
                    )}>
                      {stakeholder.next_followup_date ? new Date(stakeholder.next_followup_date).toLocaleDateString() : 'N/A'}
                      {isOverdue && <span className="ml-1">⚠️</span>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-brand-text-secondary">Contact Info</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-brand-text-secondary" />
                    <span className="text-brand-text-primary truncate">{stakeholder.contact_info?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-brand-text-secondary" />
                    <span className="text-brand-text-primary">{stakeholder.contact_info?.phone || 'N/A'}</span>
                  </div>
                </div>

                {stakeholder.key_concerns && stakeholder.key_concerns.length > 0 && stakeholder.key_concerns[0] && (
                  <div className="space-y-2">
                    <div className="text-sm text-brand-text-secondary">Key Concerns</div>
                    <div className="flex flex-wrap gap-1">
                      {stakeholder.key_concerns.map((concern, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-brand-border">
                  <Button as="a" href={`mailto:${stakeholder.contact_info?.email}`} size="sm" variant="outline" className="flex-1" disabled={!stakeholder.contact_info?.email}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(stakeholder)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredStakeholders.length === 0 && !isLoading && (
          <p className="text-brand-text-secondary col-span-full text-center">No stakeholders found matching your criteria.</p>
        )}
      </div>
    </div>
  );
  
  const RelationshipInsights = () => {
    const engagementData = useMemo(() => {
        const counts = stakeholders.reduce((acc, s) => {
            acc[s.engagement_level] = (acc[s.engagement_level] || 0) + 1;
            return acc;
        }, {});
        const order = ['champion', 'supportive', 'neutral', 'skeptical', 'resistant'];
        return order.map(level => ({ 
          name: level.charAt(0).toUpperCase() + level.slice(1), 
          value: counts[level] || 0 
        })).filter(item => item.value > 0);
    }, [stakeholders]);

    const influenceData = useMemo(() => {
        const counts = stakeholders.reduce((acc, s) => {
            acc[s.influence_level] = (acc[s.influence_level] || 0) + 1;
            return acc;
        }, {});
        const order = ['high', 'medium', 'low'];
        return order.map(level => ({
          name: level.charAt(0).toUpperCase() + level.slice(1),
          value: counts[level] || 0
        })).filter(item => item.value > 0);
    }, [stakeholders]);

    const regionalEngagement = useMemo(() => {
        return canadianProvincesAndTerritories.map(province => {
            const regionStakeholders = stakeholders.filter(s => s.ma_region === province.abbreviation);
            const score = regionStakeholders.length > 0 ?
                Math.round(regionStakeholders.reduce((acc, s) => {
                    const levelScores = { champion: 5, supportive: 4, neutral: 3, skeptical: 2, resistant: 1 };
                    return acc + (levelScores[s.engagement_level] || 3);
                }, 0) / regionStakeholders.length * 20) : 0; // Scale to 0-100
            return { name: province.abbreviation, engagementScore: score };
        }).sort((a, b) => b.engagementScore - a.engagementScore);
    }, [stakeholders]);
    
    const overdueFollowups = useMemo(() => stakeholders.filter(s => s.next_followup_date && new Date(s.next_followup_date) < new Date()), [stakeholders]);

    const ENGAGEMENT_COLORS = ['#10B981', '#3B82F6', '#6B7280', '#F59E0B', '#EF4444'];
    const INFLUENCE_COLORS = ['#EF4444', '#F59E0B', '#6B7280'];

    if (stakeholders.length === 0 && !isLoading) {
      return (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              No Stakeholder Data
            </h3>
            <p className="text-brand-text-secondary">
              Add some stakeholders to see insights and analytics here.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle>Engagement Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={engagementData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                {engagementData.map((entry, index) => <Cell key={`cell-engagement-${index}`} fill={ENGAGEMENT_COLORS[index % ENGAGEMENT_COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle>Influence Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={influenceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                {influenceData.map((entry, index) => <Cell key={`cell-influence-${index}`} fill={INFLUENCE_COLORS[index % INFLUENCE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle>Engagement Score by Region</CardTitle>
                    <p className="text-sm text-brand-text-secondary">Score from 0 (lowest) to 100 (highest engagement)</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={regionalEngagement} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="engagementScore" name="Engagement Score" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle>Overdue Follow-ups ({overdueFollowups.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {overdueFollowups.length > 0 ? overdueFollowups.map(s => (
                            <div key={s.id} className="flex justify-between items-center p-2 bg-brand-charcoal rounded-md">
                                <div>
                                    <p className="font-medium text-brand-text-primary">{s.contact_name}</p>
                                    <p className="text-sm text-brand-text-secondary">{s.organization} ({s.ma_region})</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-red-500">Due: {new Date(s.next_followup_date).toLocaleDateString()}</p>
                                    <Button size="sm" variant="outline" className="mt-1" onClick={() => handleEdit(s)}>Log Contact</Button>
                                </div>
                            </div>
                        )) : <p className="text-brand-text-secondary text-center">No overdue follow-ups. Great work!</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  };

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
          <Users className="w-6 h-6 text-brand-red" />
          <div>
            <h3 className="text-xl font-bold text-brand-text-primary">Stakeholder Relationship Log</h3>
            <p className="text-sm text-brand-text-secondary">
              Track and manage key relationships across all regions
            </p>
          </div>
        </div>
        <Button className="bg-brand-red hover:bg-red-700" onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Stakeholder
        </Button>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px] bg-brand-card-bg border-brand-border overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingStakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}</DialogTitle>
          </DialogHeader>
          <StakeholderForm
            stakeholder={editingStakeholder}
            onSave={handleSaveStakeholder}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingStakeholder(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-brand-card-bg">
          <TabsTrigger value="overview">Engagement Overview</TabsTrigger>
          <TabsTrigger value="directory">Stakeholder Directory</TabsTrigger>
          <TabsTrigger value="insights">Relationship Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <EngagementOverview />
        </TabsContent>

        <TabsContent value="directory" className="mt-6">
          <StakeholderList />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <RelationshipInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
}