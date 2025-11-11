import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormDefinition } from '@/api/entities';
import { Loader2 } from 'lucide-react';
import { get, set } from 'lodash';

const renderField = (field, formData, handleInputChange) => {
  const value = get(formData, field.id) || '';

  const fieldWrapper = (children) => (
    <div key={field.id} className="mb-4">
      <Label htmlFor={field.id} className="text-sm font-medium text-brand-text-primary">
        {field.label}
        {field.required && <span className="text-brand-red">*</span>}
      </Label>
      {field.helper_text && <p className="text-xs text-brand-text-secondary mb-1">{field.helper_text}</p>}
      {children}
    </div>
  );

  switch (field.type) {
    case 'section_header':
      return (
        <div key={field.id} className="pt-6 pb-2 border-b border-brand-border">
          <h3 className="text-lg font-semibold text-brand-text-primary">{field.label}</h3>
          {field.description && <p className="text-sm text-brand-text-secondary">{field.description}</p>}
        </div>
      );
    case 'text':
    case 'email':
    case 'phone':
      return fieldWrapper(
        <Input
          id={field.id}
          type={field.type === 'phone' ? 'tel' : field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          required={field.required}
        />
      );
    case 'number':
      return fieldWrapper(
        <Input
          id={field.id}
          type="number"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => handleInputChange(field.id, e.target.value === '' ? '' : Number(e.target.value))}
          required={field.required}
        />
      );
    case 'textarea':
      return fieldWrapper(
        <Textarea
          id={field.id}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          required={field.required}
        />
      );
    case 'dropdown':
      return fieldWrapper(
        <Select value={value} onValueChange={(val) => handleInputChange(field.id, val)} required={field.required}>
          <SelectTrigger id={field.id}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {(field.options || []).map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'radio':
      return fieldWrapper(
        <RadioGroup id={field.id} value={value} onValueChange={(val) => handleInputChange(field.id, val)} className="mt-2">
          {(field.options || []).map(opt => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={`${field.id}-${opt.value}`} />
              <Label htmlFor={`${field.id}-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    case 'checkbox':
        return fieldWrapper(
            <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                    id={field.id}
                    checked={!!value}
                    onCheckedChange={(checked) => handleInputChange(field.id, checked)}
                />
                <Label htmlFor={field.id} className="font-normal">{field.label}</Label>
            </div>
        );
    default:
      return null;
  }
};

export default function FormRenderer({ formId, onFormSubmit, initialData = {}, submitButtonText = "Submit", onCancel }) {
  const [formDef, setFormDef] = useState(null);
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormDef = async () => {
      setIsLoading(true);
      try {
        const definitions = await FormDefinition.list();
        const definition = definitions.find(d => d.id === formId);
        setFormDef(definition);
      } catch (error) {
        console.error("Error fetching form definition:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormDef();
  }, [formId]);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (fieldId, value) => {
    const newFormData = { ...formData };
    set(newFormData, fieldId, value);
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>;
  }

  if (!formDef) {
    return <div className="text-center p-8 text-brand-text-secondary">Form not found.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>{formDef.title}</CardTitle>
          {formDef.description && <p className="text-brand-text-secondary">{formDef.description}</p>}
        </CardHeader>
        <CardContent>
          {(formDef.fields || []).map(field => renderField(field, formData, handleInputChange))}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-end gap-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" className="bg-brand-red hover:bg-brand-red/90">{submitButtonText}</Button>
      </div>
    </form>
  );
}