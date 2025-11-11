import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle } from 'lucide-react';
import { User } from '@/api/entities';

export default function AgeGate({ requiredAge = 18, onVerified, onDenied, feature }) {
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = async () => {
    setError('');
    setIsVerifying(true);

    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);

    if (isNaN(age) || birthYear.length !== 4) {
      setError('Please enter a valid birth year');
      setIsVerifying(false);
      return;
    }

    if (age < requiredAge) {
      // Log age gate denial for compliance
      try {
        const user = await User.me();
        console.log('Age Gate Denial:', {
          user_id: user?.id,
          feature: feature,
          required_age: requiredAge,
          provided_age: age,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to log age gate denial:', error);
      }

      onDenied && onDenied();
      setIsVerifying(false);
      return;
    }

    // Log successful age verification
    try {
      const user = await User.me();
      console.log('Age Gate Success:', {
        user_id: user?.id,
        feature: feature,
        verified_age: age,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log age verification:', error);
    }

    onVerified && onVerified();
    setIsVerifying(false);
  };

  return (
    <Card className="max-w-md mx-auto bg-brand-card-bg border-brand-border">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-brand-text-primary">Age Verification Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-300 font-medium">Age Restricted Feature</p>
              <p className="text-amber-200 text-sm mt-1">
                You must be {requiredAge} years or older to access {feature || 'this feature'}.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text-primary mb-2">
            Birth Year
          </label>
          <Input
            type="number"
            placeholder="e.g., 1990"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="bg-brand-charcoal border-brand-border text-brand-text-primary"
            min="1900"
            max={new Date().getFullYear()}
          />
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onDenied && onDenied()}
            variant="outline"
            className="flex-1 border-brand-border text-brand-text-secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerification}
            disabled={isVerifying || !birthYear}
            className="flex-1 bg-brand-red hover:bg-red-700"
          >
            {isVerifying ? 'Verifying...' : 'Verify Age'}
          </Button>
        </div>

        <p className="text-xs text-brand-text-secondary text-center">
          Your age information is only used for verification and is not stored.
        </p>
      </CardContent>
    </Card>
  );
}