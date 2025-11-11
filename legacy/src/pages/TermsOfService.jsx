import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, Users, AlertTriangle, Gavel, Star } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-brand-red mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-brand-text-primary mb-4">Terms of Service</h1>
          <p className="text-xl text-brand-text-secondary">
            Your agreement to use The Button platform
          </p>
          <Badge variant="outline" className="mt-4">
            Last updated: January 2025
          </Badge>
        </div>

        <div className="space-y-8">
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary">
                By accessing or using The Button platform, you agree to be bound by these Terms of Service 
                and our Privacy Policy. If you disagree with any part of these terms, you may not access 
                the service. These terms apply to all users, including visitors, registered users, and 
                premium subscribers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                Use of the Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Permitted Use</h4>
                <p className="text-brand-text-secondary">
                  The Button is provided for legitimate curling-related activities including connecting 
                  with clubs, tracking performance, participating in events, and engaging with the 
                  Canadian curling community.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Account Responsibility</h4>
                <p className="text-brand-text-secondary">
                  You are responsible for maintaining the confidentiality of your account and password. 
                  You agree to accept responsibility for all activities that occur under your account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Age Requirements</h4>
                <p className="text-brand-text-secondary">
                  Users must be at least 13 years old to create an account. Users under 18 require 
                  parental consent for certain features and must comply with our Youth Safety policies.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary mb-4">
                You agree not to engage in any of the following activities:
              </p>
              <ul className="list-disc list-inside text-brand-text-secondary space-y-2">
                <li>Violating any laws, regulations, or third-party rights</li>
                <li>Harassment, bullying, or discriminatory behavior toward other users</li>
                <li>Sharing false, misleading, or inappropriate content</li>
                <li>Attempting to gain unauthorized access to our systems or other users' accounts</li>
                <li>Using the platform for commercial purposes without explicit permission</li>
                <li>Interfering with the proper operation of the platform</li>
                <li>Creating multiple accounts to circumvent restrictions</li>
                <li>Sharing copyrighted material without proper authorization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-purple-400" />
                Payment and Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Subscription Services</h4>
                <p className="text-brand-text-secondary">
                  Paid subscriptions (Fan Pass, Curling+) are billed in advance on a monthly or annual basis. 
                  Subscriptions automatically renew unless cancelled before the renewal date.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Refund Policy</h4>
                <p className="text-brand-text-secondary">
                  Refunds are provided in accordance with Canadian consumer protection laws. 
                  Contact us within 14 days for refund requests. Some digital content may not be eligible 
                  for refunds once accessed.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">Price Changes</h4>
                <p className="text-brand-text-secondary">
                  We reserve the right to modify subscription pricing with 30 days notice. 
                  Existing subscribers will be notified before any price changes take effect.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Safe Sport and Community Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-brand-text-secondary">
                The Button is committed to maintaining a safe and inclusive environment for all participants:
              </p>
              <ul className="list-disc list-inside text-brand-text-secondary space-y-2">
                <li>All users must comply with Curling Canada's Safe Sport policies</li>
                <li>Report any inappropriate behavior using our incident reporting system</li>
                <li>Respect the diversity and inclusion values of the curling community</li>
                <li>Coaches and officials must maintain appropriate certifications</li>
                <li>Youth participants have additional protections and supervised access</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary">
                The Button platform is provided "as is" without warranties of any kind. Curling Canada 
                and its partners are not liable for any indirect, incidental, or consequential damages 
                arising from your use of the service. Our total liability is limited to the amount 
                you paid for the service in the preceding 12 months.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary">
                We may update these Terms of Service from time to time. We will notify users of any 
                material changes via email or platform notification. Your continued use of The Button 
                after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text-secondary mb-4">
                Questions about these Terms of Service? Contact us:
              </p>
              <div className="space-y-2 text-brand-text-secondary">
                <p><strong>Email:</strong> legal@curling.ca</p>
                <p><strong>Mail:</strong> Curling Canada Legal Department<br />
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