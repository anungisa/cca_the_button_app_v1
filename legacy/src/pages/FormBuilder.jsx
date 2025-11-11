import React, { useState, useEffect } from 'react';
import { FormDefinition } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, GripVertical, Plus, Trash2, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/hooks/use-toast";
import { createPageUrl } from '@/utils';

const FieldEditor = ({ field, index, onUpdate, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) => {
  return (
    <div className="mb-4">
      <div className="p-4 bg-brand-charcoal rounded-lg border border-brand-border/50">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveUp(index)}
              disabled={isFirst}
              className="p-1 h-6 w-6"
            >
              <ArrowUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveDown(index)}
              disabled={isLast}
              className="p-1 h-6 w-6"
            >
              <ArrowDown className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex-grow space-y-2">
            <Input
              placeholder="Field Label"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              className="bg-brand-card-bg border-brand-border"
            />
            <Select value={field.type} onValueChange={(v) => onUpdate(field.id, { type: v })}>
              <SelectTrigger className="bg-brand-card-bg border-brand-border">
                <SelectValue placeholder="Select Field Type"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="file_upload">File Upload</SelectItem>
                <SelectItem value="signature">Signature</SelectItem>
              </SelectContent>
            </Select>
            {(field.type === 'dropdown') && (
              <Input
                placeholder="Options (comma-separated)"
                defaultValue={field.options?.map(o => o.label).join(', ')}
                onBlur={(e) => onUpdate(field.id, { options: e.target.value.split(',').map(o => ({ label: o.trim(), value: o.trim() })) })}
                className="bg-brand-card-bg border-brand-border"
              />
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => onRemove(field.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function FormBuilder() {
  const [form, setForm] = useState({ title: '', description: '', category: 'general', fields: [] });
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formId, setFormId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setFormId(id);
      loadForm(id);
    }
  }, [location.search]);

  const loadForm = async (id) => {
    try {
      const formDef = await FormDefinition.get(id);
      setForm(formDef);
    } catch (error) {
      console.error("Failed to load form:", error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: "Could not load the form definition.",
      });
    }
  };

  const handleAddField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false,
      options: undefined,
    };
    setForm(prev => ({ ...prev, fields: [...prev.fields, newField] }));
  };

  const updateField = (id, updates) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  };

  const removeField = (id) => {
    setForm(prev => ({ ...prev, fields: prev.fields.filter(f => f.id !== id) }));
  };

  const moveFieldUp = (index) => {
    if (index === 0) return;
    setForm(prev => {
      const newFields = [...prev.fields];
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
      return { ...prev, fields: newFields };
    });
  };

  const moveFieldDown = (index) => {
    if (index === form.fields.length - 1) return;
    setForm(prev => {
      const newFields = [...prev.fields];
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      return { ...prev, fields: newFields };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formToSave = {
        ...form,
        fields: form.fields.map(field => {
          if (field.type === 'dropdown' && !Array.isArray(field.options)) {
            return { ...field, options: [{ label: 'Option 1', value: 'Option 1' }] };
          }
          return field;
        })
      };

      if (formId) {
        await FormDefinition.update(formId, formToSave);
        toast({ title: "Form Updated", description: "Your changes have been saved." });
      } else {
        const newForm = await FormDefinition.create(formToSave);
        toast({ title: "Form Created", description: "Your new form has been saved." });
        navigate(createPageUrl(`FormBuilder?id=${newForm.id}`));
      }
    } catch (error) {
      console.error("Failed to save form:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the form. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-brand-charcoal pb-24 md:pb-8 text-brand-text-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Form Builder</h1>
              <p className="text-brand-text-secondary">{formId ? 'Editing an existing form' : 'Creating a new form'}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-brand-red hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Form'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader>
                <CardTitle>Form Fields</CardTitle>
              </CardHeader>
              <CardContent>
                {form.fields.length === 0 && (
                  <div className="text-center py-16 text-brand-text-secondary">
                    <p>Click "Add Field" to start building your form.</p>
                  </div>
                )}
                {form.fields.map((field, index) => (
                  <FieldEditor
                    key={field.id}
                    index={index}
                    field={field}
                    onUpdate={updateField}
                    onRemove={removeField}
                    onMoveUp={moveFieldUp}
                    onMoveDown={moveFieldDown}
                    isFirst={index === 0}
                    isLast={index === form.fields.length - 1}
                  />
                ))}
                <Button variant="outline" onClick={handleAddField} className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader><CardTitle>Form Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-secondary mb-1">Form Title</label>
                  <Input 
                    value={form.title} 
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    className="bg-brand-charcoal border-brand-border"
                    placeholder="e.g., Event Registration"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text-secondary mb-1">Description</label>
                  <Input
                    value={form.description} 
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="bg-brand-charcoal border-brand-border"
                    placeholder="Brief description of the form's purpose"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text-secondary mb-1">Category</label>
                  <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                    <SelectTrigger className="bg-brand-charcoal border-brand-border">
                      <SelectValue placeholder="Select Category"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="sponsorship">Sponsorship</SelectItem>
                      <SelectItem value="club_operations">Club Operations</SelectItem>
                      <SelectItem value="event_ops">Event Ops</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="ftloc">FTLOC</SelectItem>
                      <SelectItem value="safe_sport">Safe Sport</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}