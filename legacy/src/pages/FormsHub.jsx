import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, BarChart3, Settings, Inbox, Archive, Eye } from 'lucide-react';
import { FormDefinition, FormSubmission } from '@/api/entities';
import { User } from '@/api/entities';
import FormBuilder from '@/components/forms/FormBuilder';
import FormSubmissionPortal from '@/components/forms/FormSubmissionPortal';
import FormAnalytics from '@/components/forms/FormAnalytics';
import FormWorkflowEngine from '@/components/forms/FormWorkflowEngine';
import FormTemplateLibrary from '@/components/forms/FormTemplateLibrary';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const FormManagementPanel = ({ onCreateNew, onEditForm }) => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setIsLoading(true);
    try {
      const formData = await FormDefinition.list('-created_date', 50);
      setForms(formData || []);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
        <p className="text-brand-text-secondary mt-2">Loading forms...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-brand-text-primary">Active Forms</h3>
        <Button onClick={onCreateNew} className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map(form => (
          <Card key={form.id} className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base text-brand-text-primary">{form.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(form.status)}>
                  {form.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {form.category?.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-brand-text-secondary mb-4 line-clamp-2">
                {form.description || 'No description'}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditForm(form)}
                  className="flex-1"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Link to={createPageUrl(`Form?formId=${form.id}`)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-brand-text-muted mt-3">
                {form.analytics?.submission_count || 0} submissions
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SubmissionsPanel = ({ onViewSubmission }) => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const data = await FormSubmission.list('-created_date', 100);
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubmissions = filterStatus === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filterStatus);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      submitted: 'bg-blue-500',
      in_review: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      reopened: 'bg-orange-500',
      archived: 'bg-gray-600'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
        <p className="text-brand-text-secondary mt-2">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
          className={filterStatus === 'all' ? 'bg-brand-red' : ''}
        >
          All ({submissions.length})
        </Button>
        {['submitted', 'in_review', 'approved', 'rejected'].map(status => {
          const count = submissions.filter(s => s.status === status).length;
          return (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-brand-red' : ''}
            >
              {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({count})
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map(submission => (
            <Card key={submission.id} className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-brand-text-primary mb-1">
                      {submission.form_title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-brand-text-secondary mb-2">
                      <span>{submission.submitter_name}</span>
                      <span>•</span>
                      <span>{new Date(submission.created_date).toLocaleDateString()}</span>
                    </div>
                    <Badge className={`${getStatusColor(submission.status)} text-white`}>
                      {submission.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewSubmission(submission)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-brand-text-secondary">
            <Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No submissions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function FormsHub() {
  const [activeTab, setActiveTab] = useState('forms');
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleCreateNew = () => {
    setEditingForm(null);
    setShowBuilder(true);
  };

  const handleEditForm = (form) => {
    setEditingForm(form);
    setShowBuilder(true);
  };

  const handleSaveForm = async (formData) => {
    try {
      if (editingForm) {
        await FormDefinition.update(editingForm.id, formData);
      } else {
        await FormDefinition.create(formData);
      }
      setShowBuilder(false);
      setEditingForm(null);
      // Refresh the forms list
      setActiveTab('forms');
    } catch (error) {
      console.error('Error saving form:', error);
      throw error;
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setActiveTab('workflow');
  };

  const handleStatusChange = (newStatus) => {
    // Refresh submissions list
    setSelectedSubmission(null);
    setActiveTab('submissions');
  };

  if (showBuilder) {
    return (
      <FormBuilder
        formId={editingForm?.id}
        onSave={handleSaveForm}
        onCancel={() => {
          setShowBuilder(false);
          setEditingForm(null);
        }}
      />
    );
  }

  const tabs = [
    { id: 'forms', label: 'Form Management', icon: FileText, component: <FormManagementPanel onCreateNew={handleCreateNew} onEditForm={handleEditForm} /> },
    { id: 'submissions', label: 'Submissions', icon: Inbox, component: <SubmissionsPanel onViewSubmission={handleViewSubmission} /> },
    { id: 'templates', label: 'Templates', icon: Archive, component: <FormTemplateLibrary onCreateFromTemplate={handleSaveForm} /> },
    { 
      id: 'workflow', 
      label: 'Workflow', 
      icon: Settings, 
      component: selectedSubmission && currentUser ? (
        <FormWorkflowEngine 
          submissionId={selectedSubmission.id}
          currentUser={currentUser}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="text-center py-12 text-brand-text-secondary">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a submission from the Submissions tab to review it here</p>
        </div>
      )
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, component: <FormAnalytics /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-brand-red" />
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Forms Hub</h2>
          <p className="text-brand-text-secondary">Create, manage, and analyze forms across the organization.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}