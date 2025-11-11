import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useXP } from '../XPContext';
import { QrCode, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatchScanPanel() {
  const { awardPoints } = useXP();
  const [qrCode, setQrCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!qrCode) {
      setError('Please enter a QR code.');
      return;
    }
    setIsLoading(true);
    setError('');
    setScanResult(null);

    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // MOCK LOGIC: Simulate scanning logic without database access
    if (qrCode === 'INVALID') {
      setError('Invalid or expired patch code.');
      setScanResult('error');
    } else if (qrCode === 'ALREADY_SCANNED') {
      setError('This patch has already been scanned.');
      setScanResult('error');
    } else {
      // Simulate successful scan
      const pointsAwarded = 100;
      await awardPoints(pointsAwarded, 'patch_scan', `Scanned patch: ${qrCode}`);
      setScanResult('success');
      setQrCode(''); // Clear input on success
    }

    setIsLoading(false);
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-blue-400" />
          Scan a Patch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-brand-text-secondary">
          Found a patch at an event? Enter the code here to claim your XP.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter Patch Code"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            className="bg-brand-charcoal border-brand-border"
          />
          <Button onClick={handleScan} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Claim'}
          </Button>
        </div>

        {scanResult === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-400"
          >
            <CheckCircle className="w-5 h-5" />
            <p>Success! +100 XP awarded.</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400"
          >
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}