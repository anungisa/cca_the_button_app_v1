
import React from 'react';
import { Shield, FileText, LifeBuoy, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import PublicIncidentForm from '@/components/incident-management/PublicIncidentForm';

const InfoCard = ({ icon: Icon, title, description, buttonText, href }) => (
  <Card className="bg-brand-card-bg border-brand-border">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
      <div className="p-3 bg-brand-red/20 rounded-md">
        <Icon className="w-6 h-6 text-brand-red" />
      </div>
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </CardHeader>
    {buttonText && href && (
      <CardContent>
        <Button asChild variant="outline">
          <Link to={createPageUrl(href)}>{buttonText}</Link>
        </Button>
      </CardContent>
    )}
  </Card>
);

export default function SafeSportPublicPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-6">
      <div className="text-center space-y-2">
        <Shield className="mx-auto w-16 h-16 text-brand-red" />
        <h1 className="text-4xl font-bold tracking-tight">Safe Sport</h1>
        <p className="text-lg text-brand-text-secondary">
          Fostering a curling environment that is safe, welcoming, and inclusive for all participants.
        </p>
      </div>

      <Card className="bg-brand-charcoal border-brand-border">
        <CardHeader>
          <CardTitle className="text-2xl">Report an Incident</CardTitle>
          <CardDescription>
            If you have witnessed or been subject to a violation of our Safe Sport policies, please use this form to submit a confidential report. Your privacy and safety are our top priorities. You may submit anonymously.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PublicIncidentForm />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Resources & Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard 
            icon={FileText}
            title="Our Policies"
            description="Review the official policies and code of conduct that govern our community."
            buttonText="View Policies"
            href="SafeSportHub" // Staff can see the full hub, users will see what they have access to. A dedicated policy page would be better in the future.
          />
          <InfoCard 
            icon={LifeBuoy}
            title="Support Services"
            description="Access resources for mental health and victim support."
            buttonText="Get Help"
            href="HelpCenter"
          />
        </div>
      </div>
    </div>
  );
}
