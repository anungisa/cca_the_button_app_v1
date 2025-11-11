import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatchScanResultModal({ isOpen, onClose, result }) {
  if (!result) return null;

  const { status, patch, message } = result;
  const isSuccess = status === 'success';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border text-brand-text-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            {isSuccess ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500" />
            )}
            {isSuccess ? 'Patch Collected!' : 'Scan Failed'}
          </DialogTitle>
          <DialogDescription className="text-brand-text-secondary">
            {isSuccess ? `You've successfully scanned the "${patch.name}" patch.` : message}
          </DialogDescription>
        </DialogHeader>

        {isSuccess && patch && (
          <motion.div 
            className="text-center p-6 bg-brand-charcoal rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={patch.image_url}
              alt={patch.name}
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-amber-400 shadow-lg mb-4"
            />
            <h3 className="text-xl font-bold text-amber-400">{patch.name}</h3>
            <p className="text-brand-text-secondary mb-4">{patch.description}</p>
            <div className="flex justify-center items-center gap-4">
              <Badge className="bg-amber-400/10 text-amber-400 border-amber-400/20 text-lg px-4 py-2">
                <Zap className="w-5 h-5 mr-2" />
                {patch.xp_value} XP
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 capitalize border-brand-border">
                <Award className="w-5 h-5 mr-2" />
                {patch.rarity}
              </Badge>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} className="bg-brand-red hover:bg-red-700">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}