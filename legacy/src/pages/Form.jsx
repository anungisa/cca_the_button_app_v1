import React, { useEffect, useState } from 'react';
import FormSubmissionPortal from '../components/forms/FormSubmissionPortal';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function FormPage() {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('id');
  const submissionId = searchParams.get('submissionId');

  if (!formId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-lg bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              Form Not Specified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brand-text-secondary">
              No form ID was provided. Please check the link and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal py-12">
      <FormSubmissionPortal formId={formId} submissionId={submissionId} />
    </div>
  );
}