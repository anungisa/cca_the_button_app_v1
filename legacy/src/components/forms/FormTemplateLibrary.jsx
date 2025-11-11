import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormTemplate, FormDefinition } from '@/api/entities';
import { 
  Search, 
  Plus, 
  Eye, 
  Copy,
  Users,
  Building,
  Calendar,
  DollarSign,
  Shield,
  Heart,
  FileText,
  Briefcase,
  GraduationCap,
  Camera,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * @file FormTemplateLibrary.js
 * @description Comprehensive template library that allows users to browse, preview,
 * and create forms from pre-built templates. Organized by category with search
 * and filtering capabilities.
 */

const categoryIcons = {
  hr: Users,
  club_operations: Building,
  event_ops: Calendar,
  sponsorship: DollarSign,
  safe_sport: Shield,
  community: Heart,
  general: FileText,
  finance: DollarSign,
  coaching: GraduationCap,
  media: Camera
};

const categoryColors = {
  hr: 'bg-blue-100 text-blue-800',
  club_operations: 'bg-green-100 text-green-800',
  event_ops: 'bg-purple-100 text-purple-800',
  sponsorship: 'bg-orange-100 text-orange-800',
  safe_sport: 'bg-red-100 text-red-800',
  community: 'bg-pink-100 text-pink-800',
  general: 'bg-gray-100 text-gray-800',
  finance: 'bg-emerald-100 text-emerald-800',
  coaching: 'bg-indigo-100 text-indigo-800',
  media: 'bg-yellow-100 text-yellow-800'
};

export default function FormTemplateLibrary({ onCreateFromTemplate, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedCategory]);

  const loadTemplates = async () => {
    try {
      const templateData = await FormTemplate.list('-created_date');
      setTemplates(templateData);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  };

  const handleCreateFromTemplate = async (template) => {
    try {
      // Create a new form definition from the template
      const formData = {
        title: `${template.name} - ${new Date().toLocaleDateString()}`,
        description: template.description,
        category: template.category,
        status: 'draft',
        fields: template.template_data.fields || [],
        sections: template.template_data.sections || [],
        workflow: template.template_data.workflow || {},
        permissions: template.template_data.permissions || {
          submit_roles: ['all'],
          review_roles: ['staff'],
          is_public: false
        },
        template_id: template.id,
        created_by: 'current-user' // This would be dynamic
      };

      if (onCreateFromTemplate) {
        onCreateFromTemplate(formData);
      }
    } catch (error) {
      console.error('Error creating form from template:', error);
    }
  };

  const categories = [...new Set(templates.map(t => t.category))];

  const TemplateCard = ({ template }) => {
    const IconComponent = categoryIcons[template.category] || FileText;
    const fieldCount = template.template_data?.fields?.length || 0;
    const hasWorkflow = Boolean(template.template_data?.workflow?.approval_steps?.length);
    const isPublic = template.template_data?.permissions?.is_public;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-all duration-200 h-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-brand-border/50">
                  <IconComponent className="w-5 h-5 text-brand-text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base leading-tight text-brand-text-primary">
                    {template.name}
                  </CardTitle>
                  <Badge className={`mt-1 text-xs ${categoryColors[template.category] || 'bg-gray-100 text-gray-800'}`}>
                    {template.category.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowPreview(true);
                  }}
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-sm text-brand-text-secondary line-clamp-2">
              {template.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-brand-text-secondary">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{fieldCount} fields</span>
              </div>
              {hasWorkflow && (
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Workflow</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{isPublic ? 'Public' : 'Internal'}</span>
              </div>
            </div>

            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-brand-border">
              <div className="flex items-center justify-between text-xs text-brand-text-secondary">
                <span>Used {template.use_count || 0} times</span>
                {template.is_system_template && (
                  <Badge variant="outline" className="text-xs">Official</Badge>
                )}
              </div>
            </div>

            <Button
              className="w-full bg-brand-red hover:bg-red-700"
              onClick={() => handleCreateFromTemplate(template)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Use This Template
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const TemplatePreview = ({ template }) => {
    if (!template) return null;

    const fields = template.template_data?.fields || [];
    const sections = template.template_data?.sections || [];
    const workflow = template.template_data?.workflow || {};

    return (
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-brand-card-bg border-brand-border max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-text-primary">{template.name}</DialogTitle>
            <p className="text-brand-text-secondary">{template.description}</p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-brand-text-primary">Category:</span>
                <Badge className={`ml-2 ${categoryColors[template.category]}`}>
                  {template.category.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-brand-text-primary">Fields:</span>
                <span className="ml-2 text-brand-text-secondary">{fields.length}</span>
              </div>
            </div>

            {sections.length > 0 && (
              <div>
                <h4 className="font-medium text-brand-text-primary mb-2">Sections</h4>
                <div className="space-y-1">
                  {sections.map(section => (
                    <div key={section.id} className="text-sm text-brand-text-secondary">
                      {section.order}. {section.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-brand-text-primary mb-2">Form Fields Preview</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto border border-brand-border rounded p-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="border-l-2 border-brand-red pl-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-brand-text-primary text-sm">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {field.type}
                      </Badge>
                    </div>
                    {field.placeholder && (
                      <p className="text-xs text-brand-text-secondary mt-1">
                        {field.placeholder}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {workflow.approval_steps && (
              <div>
                <h4 className="font-medium text-brand-text-primary mb-2">Approval Workflow</h4>
                <div className="space-y-1">
                  {workflow.approval_steps.map(step => (
                    <div key={step.step_order} className="text-sm text-brand-text-secondary">
                      Step {step.step_order}: {step.approver_role}
                      {step.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-brand-border">
              <Button
                className="bg-brand-red hover:bg-red-700 flex-1"
                onClick={() => {
                  handleCreateFromTemplate(template);
                  setShowPreview(false);
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Create Form from Template
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4" />
        <p className="text-brand-text-secondary">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Form Template Library</h2>
          <p className="text-brand-text-secondary">Choose from pre-built templates to quickly create new forms</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close Library
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No Templates Found</h3>
            <p className="text-brand-text-secondary">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No templates are available at this time.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreview template={selectedTemplate} />
    </div>
  );
}