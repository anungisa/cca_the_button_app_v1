import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { User } from '@/api/entities';
import { formatEnumString } from '../utils/formatters';

const ExternalAccessGate = ({ children, requiredRole, fallbackMessage }) => {
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [needsTermsAcceptance, setNeedsTermsAcceptance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [requiredRole]);

  const checkAccess = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      // Enhanced access logic: check multiple role fields and admin override
      const userHasRole = userData.external_access_role === requiredRole || 
                         userData.user_type === 'sponsor_contact' ||
                         userData.role === 'admin' ||
                         userData.user_type === 'staff' ||
                         userData.user_type === 'devops';
      
      if (userHasRole) {
        // For admin/staff, skip terms acceptance
        if (userData.role === 'admin' || userData.user_type === 'staff' || userData.user_type === 'devops') {
          setHasAccess(true);
        } else if (!userData.has_accepted_terms) {
          setNeedsTermsAcceptance(true);
          setHasAccess(false);
        } else {
          setHasAccess(true);
        }
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    try {
      await User.updateMyUserData({ has_accepted_terms: true });
      setNeedsTermsAcceptance(false);
      setHasAccess(true);
    } catch (error) {
      console.error('Error accepting terms:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-text-secondary">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (needsTermsAcceptance) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
        <Card className="max-w-2xl bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-brand-red" />
              Terms of Use Agreement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Agreement Required</AlertTitle>
              <AlertDescription>
                Before accessing this portal, you must accept the terms of use for {formatEnumString(requiredRole)} access.
              </AlertDescription>
            </Alert>

            <div className="bg-brand-charcoal p-4 rounded-lg max-h-64 overflow-y-auto">
              <h3 className="font-semibold text-brand-text-primary mb-3">Terms of Use - {formatEnumString(requiredRole).toUpperCase()}</h3>
              <div className="text-sm text-brand-text-secondary space-y-2">
                <p>By accessing this portal, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Use the information only for legitimate business purposes</li>
                  <li>Maintain confidentiality of sensitive organizational data</li>
                  <li>Not share your access credentials with others</li>
                  <li>Report any security concerns immediately</li>
                  <li>Comply with all applicable privacy and data protection laws</li>
                </ul>
                <p className="mt-4">
                  This access is provided for your role as a {formatEnumString(requiredRole)} and may be revoked at any time.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleAcceptTerms}
                className="bg-brand-red hover:bg-red-700 flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Terms & Continue
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="border-brand-border"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
        <Card className="max-w-md bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-text-primary mb-2">Access Restricted</h2>
            <p className="text-brand-text-secondary mb-6">
              {fallbackMessage || `You need ${formatEnumString(requiredRole)} access to view this content.`}
            </p>
            
            {user && (
              <div className="space-y-3">
                <div className="bg-brand-charcoal p-3 rounded-lg">
                  <p className="text-sm text-brand-text-secondary">Current Role:</p>
                  <Badge className="bg-blue-600 text-white capitalize">
                    {user.external_access_role === 'none' || !user.external_access_role ? 'Standard User' : formatEnumString(user.external_access_role)}
                  </Badge>
                  <div className="mt-2">
                    <p className="text-xs text-brand-text-secondary">User Type: {formatEnumString(user.user_type)}</p>
                    <p className="text-xs text-brand-text-secondary">System Role: {user.role || 'user'}</p>
                  </div>
                </div>
                <p className="text-xs text-brand-text-secondary">
                  Contact your administrator if you believe you should have access to this area.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
};

export default ExternalAccessGate;