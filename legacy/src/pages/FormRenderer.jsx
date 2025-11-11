import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormDefinition } from '@/api/entities';
import { FormSubmission } from '@/api/entities';
import { useLocation } from 'react-router-dom';
import { User } from '@/api/entities';
import { Loader2 } from 'lucide-react';

const renderField = (field, register, errors) => {
    const fieldProps = register(field.id, { required: field.required });
    
    switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'date':
            return <Input type={field.type} placeholder={field.placeholder} {...fieldProps} />;
        case 'textarea':
            return <Textarea placeholder={field.placeholder} {...fieldProps} />;
        case 'dropdown':
            return (
                <Select onValueChange={(value) => fieldProps.onChange({ target: { name: field.id, value } })}>
                    <SelectTrigger><SelectValue placeholder={field.placeholder || "Select an option"} /></SelectTrigger>
                    <SelectContent>
                        {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            );
        case 'checkbox':
            return (
              <div className="flex items-center space-x-2">
                <Checkbox id={field.id} {...fieldProps} />
                <Label htmlFor={field.id}>{field.label}</Label>
              </div>
            );
        // Add other field types like file_upload, signature here
        default:
            return <p className="text-red-500">Unsupported field type: {field.type}</p>;
    }
};

export default function FormRenderer() {
    const [formDef, setFormDef] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const formId = params.get('formId');
        if (formId) {
            loadForm(formId);
        } else {
            setIsLoading(false);
        }
        
        User.me().then(setUser).catch(() => setUser(null));
    }, [location.search]);

    const loadForm = async (id) => {
        setIsLoading(true);
        try {
            const definition = await FormDefinition.get(id);
            setFormDef(definition);
        } catch (error) {
            console.error("Failed to load form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await FormSubmission.create({
                form_id: formDef.id,
                form_title: formDef.title,
                form_version: formDef.version,
                submission_data: data,
                submitter_id: user?.id,
                submitter_email: user?.email,
                submitter_name: user?.full_name,
            });
            setSubmissionSuccess(true);
        } catch (error) {
            console.error("Form submission failed:", error);
            alert('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-brand-charcoal"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }
    
    if (!formDef) {
        return <div className="text-center p-8 text-brand-text-secondary">Form not found.</div>;
    }
    
    if (submissionSuccess) {
      return (
        <div className="flex justify-center items-center h-screen bg-brand-charcoal">
          <Card className="max-w-lg w-full bg-brand-card-bg border-brand-border text-center">
            <CardHeader>
              <CardTitle>Thank You!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-primary">Your submission for "{formDef.title}" has been received.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
        <div className="min-h-screen bg-brand-charcoal py-12 px-4">
            <Card className="max-w-2xl mx-auto bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle className="text-3xl text-brand-text-primary">{formDef.title}</CardTitle>
                    {formDef.description && <CardDescription>{formDef.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {formDef.fields.map(field => (
                            <div key={field.id} className="space-y-2">
                               {field.type !== 'checkbox' && <Label htmlFor={field.id} className="text-brand-text-primary">{field.label} {field.required && '*'}</Label>}
                                {renderField(field, register, errors)}
                                {errors[field.id] && <p className="text-red-500 text-sm">This field is required.</p>}
                            </div>
                        ))}
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-red hover:bg-red-700">
                            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : 'Submit'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}