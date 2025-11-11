import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Save, Send, Upload, Download, Check, AlertCircle, 
  FileText, Clock, Users, Globe
} from 'lucide-react';
import { FormDefinition, FormSubmission } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { User } from '@/api/entities';
import { motion, AnimatePresence } from 'framer-motion';

export default function FormSubmissionPortal({ formId, isPublic = false, onSubmissionComplete }) {
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    loadForm();
    if (!isPublic) {
      loadUser();
    }
  }, [formId, isPublic]);

  useEffect(() => {
    // Calculate progress
    if (form) {
      const requiredFields = form.fields.filter(field => field.required);
      const completedFields = requiredFields.filter(field => {
        const value = formData[field.id];
        return value && value.toString().trim() !== '';
      });
      setProgress(requiredFields.length > 0 ? (completedFields.length / requiredFields.length) * 100 : 0);
    }
  }, [formData, form]);

  const loadForm = async () => {
    try {
      const formData = await FormDefinition.get(formId);
      if (formData.status !== 'active') {
        throw new Error('Form is not currently active');
      }
      setForm(formData);
      
      // Load saved draft if exists
      const savedDraft = localStorage.getItem(`form_draft_${formId}`);
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
        setIsDraft(true);
      }
    } catch (error) {
      console.error('Error loading form:', error);
      setErrors({ form: 'Unable to load form. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      // User not logged in - this is okay for public forms
      console.log('User not authenticated');
    }
  };

  const updateFormData = (fieldId, value) => {
    setFormData(prev => {
      const updated = { ...prev, [fieldId]: value };
      // Auto-save draft every few seconds
      setTimeout(() => {
        localStorage.setItem(`form_draft_${formId}`, JSON.stringify(updated));
      }, 1000);
      return updated;
    });
    
    // Clear field error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (fieldId, file) => {
    try {
      const uploadResult = await UploadFile({ file });
      setFiles(prev => ({
        ...prev,
        [fieldId]: {
          file_name: file.name,
          file_url: uploadResult.file_url,
          file_size: file.size,
          mime_type: file.type
        }
      }));
      updateFormData(fieldId, uploadResult.file_url);
    } catch (error) {
      console.error('File upload error:', error);
      setErrors(prev => ({
        ...prev,
        [fieldId]: 'Failed to upload file'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    form.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.id];
        if (!value || value.toString().trim() === '') {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
      
      // Validate specific field types
      const value = formData[field.id];
      if (value) {
        switch (field.type) {
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              newErrors[field.id] = 'Please enter a valid email address';
            }
            break;
          case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
              newErrors[field.id] = 'Please enter a valid phone number';
            }
            break;
          case 'number':
            const numValue = Number(value);
            if (isNaN(numValue)) {
              newErrors[field.id] = 'Please enter a valid number';
            } else {
              if (field.validation?.min_value && numValue < field.validation.min_value) {
                newErrors[field.id] = `Value must be at least ${field.validation.min_value}`;
              }
              if (field.validation?.max_value && numValue > field.validation.max_value) {
                newErrors[field.id] = `Value must be no more than ${field.validation.max_value}`;
              }
            }
            break;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDraft = () => {
    localStorage.setItem(`form_draft_${formId}`, JSON.stringify(formData));
    setIsDraft(true);
  };

  const submitForm = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const submission = {
        form_id: formId,
        form_title: form.title,
        form_version: form.version,
        submission_data: formData,
        submitter_id: user?.id || null,
        submitter_email: formData.email || user?.email || '',
        submitter_name: formData.name || user?.full_name || '',
        status: 'submitted',
        files: Object.values(files),
        ma_region: formData.ma_region || user?.ma_region || '',
        club_id: formData.club_id || user?.home_club_id || '',
        completion_time_minutes: Math.round((Date.now() - startTime) / 60000)
      };
      
      const result = await FormSubmission.create(submission);
      setSubmissionId(result.id);
      
      // Clear draft
      localStorage.removeItem(`form_draft_${formId}`);
      
      setShowConfirmation(true);
      
      if (onSubmissionComplete) {
        onSubmissionComplete(result);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ form: 'Failed to submit form. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const shouldShowField = (field) => {
    if (!field.conditional_logic) return true;
    
    const condition = field.conditional_logic.show_if;
    const dependentValue = formData[condition.field_id];
    
    switch (condition.operator) {
      case 'equals':
        return dependentValue === condition.value;
      case 'not_equals':
        return dependentValue !== condition.value;
      case 'contains':
        return dependentValue && dependentValue.includes(condition.value);
      case 'greater_than':
        return Number(dependentValue) > Number(condition.value);
      case 'less_than':
        return Number(dependentValue) < Number(condition.value);
      default:
        return true;
    }
  };

  const renderField = (field) => {
    if (!shouldShowField(field)) return null;
    
    const value = formData[field.id] || '';
    const hasError = errors[field.id];
    
    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-2"
      >
        {field.type === 'section_header' && (
          <div className="border-b border-brand-border pb-2 mb-4">
            <h3 className="text-lg font-semibold text-brand-text-primary">{field.label}</h3>
            {field.helper_text && (
              <p className="text-sm text-brand-text-secondary mt-1">{field.helper_text}</p>
            )}
          </div>
        )}
        
        {field.type === 'html_content' && (
          <div className="p-4 bg-brand-card-bg rounded-lg border">
            <div dangerouslySetInnerHTML={{ __html: field.label }} />
          </div>
        )}
        
        {field.type !== 'section_header' && field.type !== 'html_content' && (
          <>
            <Label className="font-medium text-brand-text-primary">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {field.type === 'text' && (
              <Input
                value={value}
                onChange={(e) => updateFormData(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={hasError ? 'border-red-500' : ''}
              />
            )}
            
            {field.type === 'textarea' && (
              <Textarea
                value={value}
                onChange={(e) => updateFormData(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`h-24 ${hasError ? 'border-red-500' : ''}`}
              />
            )}
            
            {field.type === 'number' && (
              <Input
                type="number"
                value={value}
                onChange={(e) => updateFormData(field.id, e.target.value)}
                placeholder={field.placeholder}
                min={field.validation?.min_value}
                max={field.validation?.max_value}
                className={hasError ? 'border-red-500' : ''}
              />
            )}
            
            {field.type === 'email' && (
              <Input
                type="email"
                value={value}
                onChange={(e) => updateFormData(field.id, e.target.value)}
                placeholder={field.placeholder || 'email@example.com'}
                className={hasError ? 'border-red-500' : ''}
              />
            )}
            
            {field.type === 'phone' && (
              <Input
                type="tel"
                value={value}
                onChange={(e) => updateFormData(field.id, e.target.value)}
                placeholder={field.placeholder || '(555) 123-4567'}
                className={hasError ? 'border-red-500' : ''}
              />
            )}
            
            {field.type === 'date' && (
              <Input
                type="date"
                value={value}
                onChange={(e) => updateFormData(field.id, e.target.value)}
                className={hasError ? 'border-red-500' : ''}
              />
            )}
            
            {field.type === 'dropdown' && (
              <Select
                value={value}
                onValueChange={(selectedValue) => updateFormData(field.id, selectedValue)}
              >
                <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                  <SelectValue placeholder={field.placeholder || 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {field.type === 'radio' && (
              <RadioGroup
                value={value}
                onValueChange={(selectedValue) => updateFormData(field.id, selectedValue)}
                className="space-y-2"
              >
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                    <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {field.type === 'checkbox' && (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.id}-${option.value}`}
                      checked={Array.isArray(value) ? value.includes(option.value) : false}
                      onCheckedChange={(checked) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        const newValues = checked
                          ? [...currentValues, option.value]
                          : currentValues.filter(v => v !== option.value);
                        updateFormData(field.id, newValues);
                      }}
                    />
                    <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            )}
            
            {field.type === 'file_upload' && (
              <div className="space-y-2">
                <div className="border-2 border-dashed border-brand-border rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleFileUpload(field.id, file);
                      }
                    }}
                    className="hidden"
                    id={`file-${field.id}`}
                    accept={field.validation?.file_types?.join(',')}
                  />
                  <Label htmlFor={`file-${field.id}`} className="cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-brand-text-secondary" />
                    <p className="text-sm text-brand-text-secondary">
                      {field.placeholder || 'Click to upload or drag and drop'}
                    </p>
                  </Label>
                </div>
                
                {files[field.id] && (
                  <div className="flex items-center gap-2 p-2 bg-brand-card-bg rounded">
                    <FileText className="w-4 h-4 text-brand-text-secondary" />
                    <span className="text-sm text-brand-text-primary">{files[field.id].file_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(files[field.id].file_size / 1024)} KB
                    </Badge>
                  </div>
                )}
              </div>
            )}
            
            {field.type === 'signature' && (
              <div className="border border-brand-border rounded-lg p-4 h-32 flex items-center justify-center">
                <p className="text-sm text-brand-text-secondary">
                  Digital signature functionality would be implemented here
                </p>
              </div>
            )}
            
            {field.helper_text && (
              <p className="text-xs text-brand-text-secondary">{field.helper_text}</p>
            )}
            
            {hasError && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{hasError}</span>
              </div>
            )}
          </>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p className="text-brand-text-secondary">Loading form...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Form Not Available</h3>
            <p className="text-brand-text-secondary">
              {errors.form || 'This form is no longer available or has been moved.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startTime = Date.now();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Form Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{form.title}</CardTitle>
              {form.description && (
                <p className="text-brand-text-secondary mt-2">{form.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {form.permissions.is_public && (
                <Badge className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Public
                </Badge>
              )}
              <Badge variant="outline">
                {form.category.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          
          {progress > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-brand-text-secondary">Progress</span>
                <span className="text-brand-text-primary">{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {isDraft && (
            <Alert className="mt-4">
              <Clock className="w-4 h-4" />
              <AlertDescription>
                You have a saved draft. Your progress is automatically saved as you type.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
      </Card>

      {/* Form Fields */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <AnimatePresence>
            {form.fields
              .sort((a, b) => a.order - b.order)
              .map(renderField)}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={saveDraft}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={submitForm}
              disabled={submitting}
              className="flex-1 bg-brand-red hover:bg-red-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </div>
          
          {Object.keys(errors).length > 0 && (
            <Alert className="mt-4 border-red-500 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Please fix the errors above before submitting.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-6 h-6 text-green-500" />
              Form Submitted Successfully
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-brand-text-secondary">
              Thank you for your submission. We have received your form and will review it shortly.
            </p>
            
            <div className="p-4 bg-brand-card-bg rounded-lg">
              <p className="text-sm font-medium text-brand-text-primary">Submission Details:</p>
              <p className="text-sm text-brand-text-secondary">
                Submission ID: <span className="font-mono">{submissionId}</span>
              </p>
              <p className="text-sm text-brand-text-secondary">
                Submitted: {new Date().toLocaleString()}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Generate and download PDF receipt
                  window.print();
                }}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}