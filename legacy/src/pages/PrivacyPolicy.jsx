import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Users, Database, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-brand-red mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-brand-text-primary mb-4">Privacy Policy</h1>
          <p className="text-xl text-brand-text-secondary">
            How we collect, use, and protect your information
          </p>
          <Badge variant="outline" className="mt-4">
            Last updated: January 2025
          </Badge>
        </div>

        <div className="space-y-8">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Personal Information</h4>
                <p className="text-brand-text-secondary">
                  We collect information you provide directly, including your name, email address, 
                  phone number, club affiliation, and curling experience level when you create an account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Usage Data</h4>
                <p className="text-brand-text-secondary">
                  We automatically collect information about your interactions with The Button, 
                  including pages visited, features used, and engagement metrics to improve our services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Performance Data</h4>
                <p className="text-brand-text-secondary">
                  If you use SmartBroom or participate in performance tracking, we collect 
                  technical data about your curling activities with your explicit consent.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-brand-text-secondary space-y-2">
                <li>Provide and improve The Button platform and services</li>
                <li>Personalize your experience and recommend relevant content</li>
                <li>Process transactions and manage subscriptions</li>
                <li>Send important updates about events, clubs, and curling activities</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations and safety requirements</li>
                <li>Conduct research to improve curling programs and facilities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Within the Curling Community</h4>
                <p className="text-brand-text-secondary">
                  We may share basic information (name, club affiliation) with Member Associations 
                  and affiliated clubs for legitimate curling activities and communications.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Service Providers</h4>
                <p className="text-brand-text-secondary">
                  We work with trusted service providers (payment processors, analytics, hosting) 
                  who help us operate The Button. They can only use your information as directed by us.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Legal Requirements</h4>
                <p className="text-brand-text-secondary">
                  We may disclose information when required by law or to protect the safety 
                  and security of our users and the curling community.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Access and Control</h4>
                <p className="text-brand-text-secondary">
                  You can access, update, or delete your personal information through your 
                  profile settings or by contacting us directly.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Communication Preferences</h4>
                <p className="text-brand-text-secondary">
                  You can control what communications you receive from us through your 
                  notification settings in your profile.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Data Portability</h4>
                <p className="text-brand-text-secondary">
                  You can request a copy of your data or ask us to transfer it to another service 
                  where technically feasible.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Security Measures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-brand-text-secondary">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-brand-text-secondary space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and monitoring</li>
                <li>Secure authentication and access controls</li>
                <li>Staff training on data protection best practices</li>
                <li>Incident response procedures for any security events</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary mb-4">
                If you have questions about this Privacy Policy or how we handle your information, 
                please contact us:
              </p>
              <div className="space-y-2 text-brand-text-secondary">
                <p><strong>Email:</strong> privacy@curling.ca</p>
                <p><strong>Mail:</strong> Curling Canada Privacy Office<br />
                1660 Vimont Court, Orleans, ON K4A 4J4</p>
                <p><strong>Phone:</strong> 1-800-550-2875</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}