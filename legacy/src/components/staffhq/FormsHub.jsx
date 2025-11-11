
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Plus, FileText, Search, Filter, MoreVertical,
  Edit, Copy, Archive, Trash2, Eye, Download,
  Users, Globe, Clock, CheckCircle, AlertCircle,
  BarChart3, TrendingUp, Settings, Loader2
} from 'lucide-react';
import { FormDefinition, FormSubmission } from '@/api/entities';
import FormBuilder from '../forms/FormBuilder';
import FormSubmissionPortal from '../forms/FormSubmissionPortal';
import FormAnalytics from '../forms/FormAnalytics';
import { motion, AnimatePresence } from 'framer-motion';

export default function FormsHub() {
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('forms');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [editingFormId, setEditingFormId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadForms(), loadSubmissions()]);
    loadAnalytics();
    setLoading(false);
  }

  const loadForms = async () => {
    try {
      const formsData = await FormDefinition.list('-created_date', 50);
      setForms(formsData || []);
    } catch (error) {
      console.error('Error loading forms:', error);
      setForms([]);
    }
  };

  const loadSubmissions = async () => {
    try {
      const submissionsData = await FormSubmission.list('-created_date', 100);
      setSubmissions(submissionsData || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setSubmissions([]);
    }
  };

  useEffect(() => {
    if (submissions.length > 0) {
      loadAnalytics();
    }
  }, [submissions]);

  const loadAnalytics = () => {
    try {
      const totalSubmissions = submissions.length;
      const pendingSubmissions = submissions.filter(s => s.status === 'submitted').length;
      const approvedSubmissions = submissions.filter(s => s.status === 'approved').length;

      setAnalytics({
        totalSubmissions,
        pendingSubmissions,
        approvedSubmissions,
        avgCompletionTime: 15.5 // Dummy data
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleCreateForm = () => {
    setEditingFormId(null);
    setShowFormBuilder(true);
  };

  const handleEditForm = (formId) => {
    setEditingFormId(formId);
    setShowFormBuilder(true);
  };

  const handleFormSaved = async (formData) => {
    try {
      if (editingFormId) {
        // Update existing form
        const updatedForm = await FormDefinition.update(editingFormId, formData);
        setForms(prevForms => prevForms.map(form =>
          form.id === editingFormId ? updatedForm : form
        ));
      } else {
        // Create new form
        const newForm = await FormDefinition.create(formData);
        setForms(prevForms => [newForm, ...prevForms]);
      }
      setShowFormBuilder(false);
      setEditingFormId(null);
      // Re-fetch all forms to ensure data consistency with backend, especially for new forms
      // or if there are complex backend interactions that might not be fully reflected in the returned object.
      loadForms();
    } catch (error) {
      console.error("Failed to save form:", error);
      alert("There was an error saving the form. Please try again.");
    }
  };

  const handleDuplicateForm = async (form) => {
    try {
      const duplicatedForm = { ...form };
      delete duplicatedForm.id; // remove id to create a new one
      duplicatedForm.title = `${form.title} (Copy)`;
      duplicatedForm.status = 'draft';

      await FormDefinition.create(duplicatedForm);
      loadForms();
    } catch (error) {
      console.error('Error duplicating form:', error);
    }
  };

  const handleArchiveForm = async (formId) => {
    try {
      await FormDefinition.update(formId, { status: 'archived' });
      loadForms();
    } catch (error) {
      console.error('Error archiving form:', error);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        await FormDefinition.delete(formId);
        loadForms();
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  const filteredForms = forms.filter(form => {
    const titleMatch = form.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const descMatch = form.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const categoryMatch = selectedCategory === 'all' || form.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || form.status === selectedStatus;
    return (titleMatch || descMatch) && categoryMatch && statusMatch;
  });

  const filteredSubmissions = submissions.filter(submission => {
    const titleMatch = submission.form_title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const submitterMatch = submission.submitter_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const statusMatch = selectedStatus === 'all' || submission.status === selectedStatus;
    return (titleMatch || submitterMatch) && statusMatch;
  });

  const FormCard = ({ form }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-shadow bg-brand-card-bg border-brand-border flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-base leading-tight text-brand-text-primary">{form.title || 'Untitled Form'}</CardTitle>
            </div>
            <Badge variant={form.status === 'active' ? 'default' : 'secondary'} className="ml-2 whitespace-nowrap">
                {form.status || 'draft'}
            </Badge>
          </div>
           {form.description && (
            <p className="text-xs text-brand-text-secondary line-clamp-2 pt-1">
              {form.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 text-xs text-brand-text-secondary border-t border-b border-brand-border py-2 my-2">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{form.fields?.length || 0} fields</span>
                </div>
                <div className="flex items-center gap-1">
                  {form.permissions?.is_public ? (
                    <Globe className="w-3 h-3" />
                  ) : (
                    <Users className="w-3 h-3" />
                  )}
                  <span>{form.permissions?.is_public ? 'Public' : 'Internal'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  <span>{form.analytics?.submission_count || 0} submissions</span>
                </div>
              </div>
            <div className="flex items-center justify-between text-xs text-brand-text-secondary">
              <span>Category: <span className="font-medium capitalize text-brand-text-primary">{form.category?.replace('_', ' ') || 'General'}</span></span>
              <span>Updated: <span className="font-medium text-brand-text-primary">{form.updated_date ? new Date(form.updated_date).toLocaleDateString() : 'N/A'}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleEditForm(form.id)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleDuplicateForm(form)}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const SubmissionCard = ({ submission }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-shadow bg-brand-card-bg border-brand-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg leading-tight text-brand-text-primary">{submission.form_title || 'Form Submission'}</CardTitle>
              <p className="text-sm text-brand-text-secondary">
                Submitted by: {submission.submitter_name || submission.submitter_email || 'Anonymous'}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge variant={
                submission.status === 'approved' ? 'default' :
                submission.status === 'rejected' ? 'destructive' : 'secondary'
              }>
                {submission.status || 'pending'}
              </Badge>
              <Badge variant="outline">
                ID: {submission.id?.slice(-6) || 'N/A'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{submission.completion_time_minutes || 0}m to complete</span>
              </div>
              {submission.ma_region && (
                <div className="flex items-center gap-1">
                  <span>{submission.ma_region}</span>
                </div>
              )}
              {submission.files?.length > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{submission.files.length} file(s)</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Review
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-brand-border">
            <div className="flex items-center justify-between text-xs text-brand-text-secondary">
              <span>Priority: {submission.priority || 'Normal'}</span>
              <span>Submitted: {submission.created_date ? new Date(submission.created_date).toLocaleDateString() : 'Recently'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (showFormBuilder) {
    return (
      <FormBuilder
        formId={editingFormId}
        onSave={handleFormSaved}
        onCancel={() => setShowFormBuilder(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Forms Hub</h1>
            <p className="text-brand-text-secondary">
              Create, manage, and track forms for internal and external use
            </p>
          </div>
        </div>
        <Button onClick={handleCreateForm} className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Forms</p>
                <p className="text-2xl font-bold text-brand-text-primary">{forms.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Submissions</p>
                <p className="text-2xl font-bold text-brand-text-primary">{analytics.totalSubmissions || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Pending Review</p>
                <p className="text-2xl font-bold text-brand-text-primary">{analytics.pendingSubmissions || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Avg. Completion</p>
                <p className="text-2xl font-bold text-brand-text-primary">{analytics.avgCompletionTime || 0}m</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          {/* Filters */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
                    <Input
                      placeholder="Search forms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="sponsorship">Sponsorship</SelectItem>
                    <SelectItem value="club_operations">Club Operations</SelectItem>
                    <SelectItem value="event_ops">Event Operations</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="safe_sport">Safe Sport</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Forms Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-brand-red mx-auto mb-4" />
              <p className="text-brand-text-secondary">Loading forms...</p>
            </div>
          ) : filteredForms.length === 0 ? (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No Forms Found</h3>
                <p className="text-brand-text-secondary mb-6">
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'No forms match your search criteria.'
                    : 'Get started by creating your first form.'
                  }
                </p>
                <Button onClick={handleCreateForm} className="bg-brand-red hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Form
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredForms.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          {/* Filters */}
          <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
                    <Input
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-brand-red mx-auto mb-4" />
              <p className="text-brand-text-secondary">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No Submissions Found</h3>
                <p className="text-brand-text-secondary">
                  {searchTerm || selectedStatus !== 'all'
                    ? 'No submissions match your search criteria.'
                    : 'No submissions have been received yet.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredSubmissions.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FormAnalytics forms={forms} submissions={submissions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
