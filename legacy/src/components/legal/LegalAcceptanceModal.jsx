import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Shield, AlertTriangle } from 'lucide-react';
import { User } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function LegalAcceptanceModal({ isOpen, onAccept, userRole = 'user' }) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!hasAcceptedTerms || !hasAcceptedPrivacy) return;
    
    setIsSubmitting(true);
    try {
      await User.updateMyUserData({ has_accepted_terms: true });
      onAccept && onAccept();
    } catch (error) {
      console.error('Error updating terms acceptance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = hasAcceptedTerms && hasAcceptedPrivacy;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-text-primary">
            <FileText className="w-6 h-6 text-brand-red" />
            Legal Agreement Required
          </CardTitle>
          <p className="text-brand-text-secondary">
            Please review and accept our Terms of Service and Privacy Policy to continue using The Button.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warning for external users */}
          {['board_member', 'sponsor_contact', 'club_president'].includes(userRole) && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-400">External Access Notice</h4>
                  <p className="text-sm text-brand-text-secondary mt-1">
                    As an external user with special access, you agree to additional confidentiality 
                    and security requirements as outlined in your access agreement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Terms of Service */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={hasAcceptedTerms}
                onCheckedChange={setHasAcceptedTerms}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-brand-text-primary"
              >
                I agree to the{' '}
                <Link 
                  to={createPageUrl('TermsOfService')} 
                  className="text-brand-red hover:underline"
                  target="_blank"
                >
                  Terms of Service
                </Link>
              </label>
            </div>
            <ScrollArea className="h-32 w-full border border-brand-border rounded-md p-3 bg-brand-charcoal/50">
              <div className="text-sm text-brand-text-secondary space-y-2">
                <p><strong>Key Terms Summary:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Use The Button for legitimate curling activities only</li>
                  <li>Maintain account security and accurate information</li>
                  <li>Comply with Safe Sport and community standards</li>
                  <li>Respect intellectual property and user privacy</li>
                  <li>Subscription fees are non-refundable except as required by law</li>
                </ul>
              </div>
            </ScrollArea>
          </div>

          {/* Privacy Policy */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy"
                checked={hasAcceptedPrivacy}
                onCheckedChange={setHasAcceptedPrivacy}
              />
              <label
                htmlFor="privacy"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-brand-text-primary"
              >
                I agree to the{' '}
                <Link 
                  to={createPageUrl('PrivacyPolicy')} 
                  className="text-brand-red hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            <ScrollArea className="h-32 w-full border border-brand-border rounded-md p-3 bg-brand-charcoal/50">
              <div className="text-sm text-brand-text-secondary space-y-2">
                <p><strong>Privacy Summary:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>We collect personal information to provide curling services</li>
                  <li>Data may be shared with Member Associations and affiliated clubs</li>
                  <li>You can control communication preferences and data sharing</li>
                  <li>We implement strong security measures to protect your information</li>
                  <li>You have rights to access, update, or delete your data</li>
                </ul>
              </div>
            </ScrollArea>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-400">Safe Sport Commitment</h4>
                <p className="text-sm text-brand-text-secondary mt-1">
                  By using The Button, you commit to maintaining a safe, inclusive environment 
                  for all participants in accordance with Curling Canada's Safe Sport policies.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button
            onClick={handleAccept}
            disabled={!canSubmit || isSubmitting}
            className="bg-brand-red hover:bg-red-700"
          >
            {isSubmitting ? 'Processing...' : 'Accept and Continue'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}