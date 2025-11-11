import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Share2, Check, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CompletionModal({ milestone, isOpen, onClose, onShare }) {
  const navigate = useNavigate();

  if (!isOpen || !milestone) return null;

  const handleViewCollection = () => {
    navigate(createPageUrl('Profile?tab=collection'));
    onClose();
  };

  const IconComponent = milestone.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-card-bg border-brand-border text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">Milestone Complete!</DialogTitle>
        </DialogHeader>
        <motion.div 
          className="flex flex-col items-center text-center p-6"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center mb-4">
            <IconComponent className="w-12 h-12 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
          <p className="text-brand-text-secondary mb-4">{milestone.description}</p>
          <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 px-4 py-2 text-lg">
            <Zap className="w-5 h-5 mr-2" />
            +{milestone.xp_reward} XP Earned
          </Badge>
        </motion.div>
        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={() => onShare(milestone)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Achievement
          </Button>
          <Button onClick={handleViewCollection} className="bg-brand-red hover:bg-red-700">
            <Eye className="w-4 h-4 mr-2" />
            View My Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}