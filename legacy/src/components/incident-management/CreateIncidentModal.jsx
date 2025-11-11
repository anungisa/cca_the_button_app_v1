
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Clock, Zap } from 'lucide-react';
import { Incident } from '@/api/entities';
import { AIClassificationEngine } from './AIClassificationEngine';
import { WorkflowEngine } from '../utils/WorkflowEngine';
import { useToast } from '../hooks/use-toast';
import { triggerWorkflows } from '@/api/functions';

// SLA Configuration based on priority
const slaConfig = {
  critical: {
    response: '1 hour',
    resolution: '24 hours',
    color: 'text-red-400',
    icon: Zap,
    description: 'Immediate action required'
  },
  high: {
    response: '4 hours',
    resolution: '3 days',
    color: 'text-orange-400',
    icon: AlertTriangle,
    description: 'Urgent attention needed'
  },
  medium: {
    response: '24 hours',
    resolution: '1 week',
    color: 'text-yellow-400',
    icon: Clock,
    description: 'Standard timeline'
  },
  low: {
    response: '72 hours',
    resolution: '2 weeks',
    color: 'text-green-400',
    icon: Clock,
    description: 'Non-urgent'
  }
};

// Intelligent routing rules based on category and keywords
const routingRules = {
  safe_sport: {
    department: 'safe_sport',
    priority: 'high',
    escalation: 1,
    keywords: ['harassment', 'abuse', 'discrimination', 'misconduct', 'safety']
  },
  technical_issue: {
    department: 'tech',
    priority: 'medium',
    keywords: ['login', 'password', 'bug', 'error', 'system', 'app']
  },
  club_support: {
    department: 'club_services',
    priority: 'medium',
    keywords: ['club', 'membership', 'registration', 'support']
  },
  volunteer_issue: {
    department: 'events',
    priority: 'medium',
    keywords: ['volunteer', 'event', 'no-show', 'training']
  },
  compliance: {
    department: 'governance',
    priority: 'high',
    keywords: ['compliance', 'audit', 'policy', 'violation']
  }
};

export default function CreateIncidentModal({ isOpen, onClose, onIncidentCreated }) {
  const { toast } = useToast();
  const [incident, setIncident] = useState({
    title: '',
    description: '',
    category: '',
    sub_category: '',
    priority: 'medium',
    severity: 'level_1',
    ma_region: '',
    club_id: '',
    club_name: '',
    related_user_id: '',
    related_event_id: '',
    source: 'internal_report',
    is_confidential: false,
    assigned_department: 'none'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [predictedRouting, setPredictedRouting] = useState(null);

  // Intelligent routing prediction
  const predictRouting = (category, description, title) => {
    const rule = routingRules[category];
    if (!rule) return null;

    const text = `${title} ${description}`.toLowerCase();
    const keywordMatches = rule.keywords.filter(keyword => text.includes(keyword));

    let suggestedPriority = rule.priority;

    // Escalate priority if critical keywords are found
    if (keywordMatches.length > 0) {
      if (keywordMatches.some(k => ['harassment', 'abuse', 'safety', 'critical'].includes(k))) {
        suggestedPriority = 'critical';
      } else if (keywordMatches.some(k => ['urgent', 'down', 'broken'].includes(k))) {
        suggestedPriority = 'high';
      }
    }

    return {
      department: rule.department,
      priority: suggestedPriority,
      escalation: rule.escalation || 0,
      confidence: Math.min(90, 60 + (keywordMatches.length * 10))
    };
  };

  const handleInputChange = (field, value) => {
    const newData = { ...incident, [field]: value };
    setIncident(newData);

    // Update routing prediction
    if (field === 'category' || field === 'description' || field === 'title') {
      const prediction = predictRouting(newData.category, newData.description, newData.title);
      setPredictedRouting(prediction);

      // Auto-apply routing suggestions
      if (prediction) {
        setIncident(prev => ({
          ...prev,
          assigned_department: prediction.department,
          priority: prediction.priority
        }));
      }
    }
  };

  const calculateDueDate = (priority) => {
    const now = new Date();
    const config = slaConfig[priority];

    if (!config) return null;

    // Extract hours from response time
    const responseHours = config.response.includes('hour') ?
      parseInt(config.response) :
      parseInt(config.response) * 24;

    const dueDate = new Date(now.getTime() + (responseHours * 60 * 60 * 1000));
    return dueDate.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setIncident({
      title: '',
      description: '',
      category: '',
      sub_category: '',
      priority: 'medium',
      severity: 'level_1',
      ma_region: '',
      club_id: '',
      club_name: '',
      related_user_id: '',
      related_event_id: '',
      source: 'internal_report',
      is_confidential: false,
      assigned_department: 'none'
    });
    setPredictedRouting(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!incident.title || !incident.category) {
      toast({ title: "Error", description: "Title and Category are required.", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const newIncident = await Incident.create(incident);
      toast({ title: "Success", description: "Incident created successfully." });
      
      // Trigger workflow engine using new function
      triggerWorkflows({
        entityName: 'Incident',
        operation: 'create',
        entityData: newIncident
      });

      onIncidentCreated(newIncident);
      resetForm();
      onClose();

    } catch (err) {
      console.error('Failed to create incident:', err);
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedSLA = slaConfig[incident.priority];
  const SLAIcon = selectedSLA?.icon || Clock;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-brand-card-bg border-brand-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-red" />
            Create New Incident
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={incident.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief description of the incident"
                className="bg-brand-charcoal border-brand-border"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={incident.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the incident"
                rows={4}
                className="bg-brand-charcoal border-brand-border"
                required
              />
            </div>
          </div>

          {/* Category and Classification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={incident.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="bg-brand-charcoal border-brand-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general_inquiry">General Inquiry</SelectItem>
                  <SelectItem value="club_support">Club Support</SelectItem>
                  <SelectItem value="ma_inquiry">MA Inquiry</SelectItem>
                  <SelectItem value="safe_sport">Safe Sport</SelectItem>
                  <SelectItem value="technical_issue">Technical Issue</SelectItem>
                  <SelectItem value="volunteer_issue">Volunteer Issue</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sub_category">Sub-Category</Label>
              <Input
                id="sub_category"
                value={incident.sub_category}
                onChange={(e) => handleInputChange('sub_category', e.target.value)}
                placeholder="More specific category"
                className="bg-brand-charcoal border-brand-border"
              />
            </div>
          </div>

          {/* Priority and SLA Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select value={incident.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger className="bg-brand-charcoal border-brand-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedSLA && (
              <div>
                <Label>SLA Expectations</Label>
                <Card className="bg-brand-charcoal/50 border-brand-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <SLAIcon className={`w-4 h-4 ${selectedSLA.color}`} />
                      <span className="font-medium">{selectedSLA.description}</span>
                    </div>
                    <div className="text-sm text-brand-text-secondary">
                      <p>Response: {selectedSLA.response}</p>
                      <p>Resolution: {selectedSLA.resolution}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Routing Prediction */}
          {predictedRouting && (
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-blue-300">
                    AI Routing Suggestion ({predictedRouting.confidence}% confidence)
                  </Badge>
                </div>
                <p className="text-sm text-blue-200">
                  This incident will be automatically assigned to: <strong>{predictedRouting.department}</strong>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Additional Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ma_region">MA Region</Label>
              <Input
                id="ma_region"
                value={incident.ma_region}
                onChange={(e) => handleInputChange('ma_region', e.target.value)}
                placeholder="e.g., ON, AB, BC"
                className="bg-brand-charcoal border-brand-border"
              />
            </div>

            <div>
              <Label htmlFor="club_name">Club Name</Label>
              <Input
                id="club_name"
                value={incident.club_name}
                onChange={(e) => handleInputChange('club_name', e.target.value)}
                placeholder="Related club (if applicable)"
                className="bg-brand-charcoal border-brand-border"
              />
            </div>
          </div>

          {/* Confidentiality */}
          <div className="flex items-center space-x-2">
            <Switch
              id="confidential"
              checked={incident.is_confidential}
              onCheckedChange={(checked) => handleInputChange('is_confidential', checked)}
            />
            <Label htmlFor="confidential" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Mark as Confidential
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-brand-red hover:bg-red-700">
              {isSaving ? 'Creating...' : 'Create Incident'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
