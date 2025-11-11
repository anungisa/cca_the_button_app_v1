import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Plus, Trash2, Edit2 } from 'lucide-react';
import { FormDefinition } from '@/api/entities';

// Simple field component without drag and drop
const FieldEditor = ({ field, onFieldChange, onRemoveField }) => {
  return (
    <div className="p-4 bg-brand-charcoal rounded-lg border border-brand-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Field Label"
              value={field.label || ''}
              onChange={(e) => onFieldChange(field.id, 'label', e.target.value)}
            />
            <Select
              value={field.type || 'text'}
              onValueChange={(value) => onFieldChange(field.id, 'type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Field Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="radio">Radio Buttons</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Placeholder text (optional)"
            value={field.placeholder || ''}
            onChange={(e) => onFieldChange(field.id, 'placeholder', e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${field.id}`}
              checked={field.required || false}
              onChange={(e) => onFieldChange(field.id, 'required', e.target.checked)}
              className="rounded border-brand-border"
            />
            <label htmlFor={`required-${field.id}`} className="text-sm text-brand-text-secondary">
              Required field
            </label>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onRemoveField(field.id)}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default function FormBuilder({ formId, onSave, onCancel }) {
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: 'general',
    status: 'draft',
    fields: [],
    created_by: 'current_user'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadFormData();
  }, [formId]);

  const loadFormData = async () => {
    if (formId) {
      setIsLoading(true);
      try {
        // Since we can't use FormDefinition.get(), we'll get from the list
        const forms = await FormDefinition.list();
        const formData = forms.find(f => f.id === formId);
        
        if (formData) {
          setForm({
            title: formData.title || '',
            description: formData.description || '',
            category: formData.category || 'general',
            status: formData.status || 'draft',
            fields: formData.fields || [],
            created_by: formData.created_by || 'current_user'
          });
        } else {
          console.warn('Form not found');
          setForm({ 
            title: 'Form Not Found', 
            description: '', 
            category: 'general',
            status: 'draft',
            fields: [],
            created_by: 'current_user'
          });
        }
      } catch (error) {
        console.error("Failed to fetch form:", error);
        setForm({ 
          title: 'Error Loading Form', 
          description: '', 
          category: 'general',
          status: 'draft',
          fields: [],
          created_by: 'current_user'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setForm({ 
        title: '', 
        description: '', 
        category: 'general',
        status: 'draft',
        fields: [],
        created_by: 'current_user'
      });
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Form title is required.");
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(form);
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (fieldId, prop, value) => {
    setForm(prevForm => ({
      ...prevForm,
      fields: (prevForm.fields || []).map(f => 
        f.id === fieldId ? { ...f, [prop]: value } : f
      )
    }));
  };
  
  const addField = () => {
    const newField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      label: '',
      type: 'text',
      placeholder: '',
      required: false,
      order: (form.fields || []).length
    };
    setForm(prevForm => ({ 
      ...prevForm, 
      fields: [...(prevForm.fields || []), newField] 
    }));
  };

  const removeField = (fieldId) => {
    setForm(prevForm => ({
      ...prevForm,
      fields: (prevForm.fields || []).filter(f => f.id !== fieldId)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-red mx-auto mb-4" />
          <p className="text-brand-text-secondary">Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-text-primary">
              {formId ? 'Edit Form' : 'Create New Form'}
            </h1>
            <p className="text-brand-text-secondary">
              Build and customize your form fields and settings.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-brand-red hover:bg-red-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Form'
            )}
          </Button>
        </div>
      </div>
      
      {/* Main Builder Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Form Settings */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-brand-text-secondary block mb-2">
                  Form Title *
                </label>
                <Input
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter form title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-brand-text-secondary block mb-2">
                  Description
                </label>
                <Textarea
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your form"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-brand-text-secondary block mb-2">
                  Category
                </label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="sponsorship">Sponsorship</SelectItem>
                    <SelectItem value="club_operations">Club Operations</SelectItem>
                    <SelectItem value="event_ops">Event Operations</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="safe_sport">Safe Sport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-brand-text-secondary block mb-2">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Field Builder */}
        <div className="lg:col-span-2">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Form Fields ({(form.fields || []).length})</CardTitle>
              <Button size="sm" onClick={addField}>
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </CardHeader>
            <CardContent>
              {form.fields && form.fields.length > 0 ? (
                <div className="space-y-4">
                  {form.fields.map((field, index) => (
                    <div key={field.id} className="relative">
                      <div className="absolute -left-2 top-4 w-6 h-6 bg-brand-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <FieldEditor
                        field={field}
                        onFieldChange={handleFieldChange}
                        onRemoveField={removeField}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-brand-border rounded-lg">
                  <Edit2 className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                  <p className="text-brand-text-secondary mb-4">No fields yet. Click "Add Field" to get started.</p>
                  <Button onClick={addField} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Field
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}