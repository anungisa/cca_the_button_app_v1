
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Bot, Zap, Database, UserCheck, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrustPillar = ({ icon: Icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-brand-card-bg rounded-lg flex items-center justify-center flex-shrink-0 border border-brand-border">
      <Icon className="w-6 h-6 text-brand-red" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-brand-text-primary mb-1">{title}</h3>
      <p className="text-brand-text-secondary leading-relaxed">{children}</p>
    </div>
  </div>
);

export default function TrustCenter() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
      <div className="text-center">
        <Shield className="w-16 h-16 text-brand-red mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-brand-text-primary">The Button Trust Center</h1>
        <p className="text-lg text-brand-text-secondary mt-2">
          Your privacy, security, and trust are the foundation of our community.
        </p>
      </div>

      <Card className="bg-brand-card-bg/50 border-brand-border">
        <CardHeader>
          <CardTitle>Our Commitment to You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TrustPillar icon={UserCheck} title="You Are in Control">
            You own your data. You decide how it's used. Our platform provides granular consent controls, available anytime in your profile's privacy settings. You can also request an export of your data at any time.
          </TrustPillar>
          <TrustPillar icon={Zap} title="Understanding Your Journey XP">
            Journey XP is our way of recognizing your engagement with the curling community. Points are awarded for activities like watching streams, volunteering, or participating in discussions. This system is designed to be fun and transparent, not to track you invasively.
          </TrustPillar>
          <TrustPillar icon={Bot} title="Our Use of AI">
            Our AI assistant, Slider, is here to enhance your experience by providing helpful guidance. All interactions are opt-in and governed by our privacy policy. We do not use your private conversations to train models without your explicit, separate consent.
          </TrustPillar>
          <TrustPillar icon={Users} title="Sponsors & Partners">
            Our partners, like PointsBet, help fund the platform and provide unique experiences. We only share anonymized, aggregate data with partners for reporting. We will never share your personal information without your direct consent.
          </TrustPillar>
           <TrustPillar icon={Database} title="Data Security">
            We employ industry-standard security measures to protect your information. All data is encrypted in transit and at rest. We conduct regular security audits to ensure the integrity of our platform.
          </TrustPillar>
        </CardContent>
      </Card>

       <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-text-primary">Have Questions?</h2>
        <p className="text-brand-text-secondary mt-2">
          For any questions about our privacy practices or your data, please reach out.
        </p>
        <Button asChild variant="outline" className="mt-4">
            <a href="mailto:privacy@curling.ca" className="bg-brand-charcoal border-brand-border hover:bg-brand-border">
                <Mail className="mr-2 h-4 w-4" /> Contact Privacy Team
            </a>
        </Button>
      </div>
    </div>
  );
}
