import React, { useState, useEffect } from 'react';
import { Patch } from '@/api/entities';
import { User } from '@/api/entities';
import { useXP } from '../components/XPContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, CheckCircle, XCircle, Loader2, QrCode, Keyboard } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import { useErrorHandler } from '../components/utils/errorHandler';

export default function PatchScanner() {
    const { awardPoints } = useXP();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [manualCode, setManualCode] = useState('');
    
    const { toast } = useToast();
    const handleError = useErrorHandler(toast);

    const handleManualScan = async () => {
        if (!manualCode.trim()) {
            setError('Please enter a patch code.');
            return;
        }
        await processScan(manualCode.trim());
    };

    const processScan = async (qrCodeId) => {
        if (!qrCodeId || isLoading) return;
        
        setIsLoading(true);
        setError(null);

        try {
            const user = await User.me();
            if (!user) {
                throw new Error("You must be logged in to scan patches.");
            }

            const existingPatches = await Patch.filter({ qr_code_id: qrCodeId, claimed_by_user_id: user.id });
            if (existingPatches.length > 0) {
                throw new Error("You have already claimed this patch.");
            }

            const patchToClaimQuery = await Patch.filter({ qr_code_id: qrCodeId, inventory_status: 'available' });
            if (patchToClaimQuery.length === 0) {
                throw new Error("Patch not found or has already been claimed.");
            }
            
            const patch = patchToClaimQuery[0];

            await Patch.update(patch.id, {
                claimed_by_user_id: user.id,
                inventory_status: 'claimed',
                claimed_timestamp: new Date().toISOString()
            });
            
            await awardPoints(patch.xp_value, 'patch_scan', `Scanned: ${patch.name}`, patch.id);
            
            toast({
                title: "Patch Claimed!",
                description: `Successfully claimed "${patch.name}" for +${patch.xp_value} XP.`,
                action: <CheckCircle className="text-green-500" />
            });
            
            setManualCode('');
        } catch (err) {
            setError(err.message);
            handleError(err, { context: 'PatchScanner.processScan' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-brand-card-bg border-brand-border text-brand-text-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <QrCode className="text-brand-red" />
                        Patch Scanner
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-brand-text-secondary">
                            Enter the code found on your patch to claim it.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="manual-code" className="text-sm font-medium">Patch Code</label>
                        <Input
                            id="manual-code"
                            placeholder="e.g., BRIER2025-OPENING"
                            value={manualCode}
                            onChange={(e) => {
                                setManualCode(e.target.value);
                                if (error) setError(null);
                            }}
                            className="bg-brand-charcoal border-brand-border"
                        />
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 text-red-400">
                            <XCircle className="w-4 h-4" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <Button 
                        onClick={handleManualScan} 
                        className="w-full bg-brand-red hover:bg-red-700"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Claiming...
                            </>
                        ) : (
                            'Claim Patch'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}