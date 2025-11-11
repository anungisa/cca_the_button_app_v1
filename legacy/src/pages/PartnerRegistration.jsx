import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { APIEcosystemService } from '../components/services/APIEcosystemService';

export default function PartnerRegistration() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        contactEmail: '',
        description: '',
        useCase: '',
        requestedAPIs: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [error, setError] = useState(null);

    const apiOptions = [
        { id: 'clubs', label: 'Club Data API' },
        { id: 'events', label: 'Event & Scoring API' },
        { id: 'incidents', label: 'Incident Reporting API' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (apiId) => {
        setFormData(prev => {
            const newApis = prev.requestedAPIs.includes(apiId)
                ? prev.requestedAPIs.filter(id => id !== apiId)
                : [...prev.requestedAPIs, apiId];
            return { ...prev, requestedAPIs: newApis };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSubmissionResult(null);

        try {
            const result = await APIEcosystemService.registerPartnerApp(formData);
            setSubmissionResult(result);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submissionResult) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-brand-text-primary">Application Submitted!</h1>
                <p className="mt-2 text-brand-text-secondary">{submissionResult.message}</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8">
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle>Partner API Registration</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Application Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Application Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="useCase">Primary Use Case</Label>
                            <Textarea id="useCase" name="useCase" value={formData.useCase} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-3">
                            <Label>Requested APIs</Label>
                            <div className="space-y-2">
                                {apiOptions.map(api => (
                                    <div key={api.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`api-${api.id}`}
                                            checked={formData.requestedAPIs.includes(api.id)}
                                            onCheckedChange={() => handleCheckboxChange(api.id)}
                                        />
                                        <Label htmlFor={`api-${api.id}`}>{api.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            Submit Application
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}