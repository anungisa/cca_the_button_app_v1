import React, { useState, useEffect } from 'react';
import { Patch } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

const rarityStyles = {
    common: 'border-gray-500/30',
    uncommon: 'border-green-500/50',
    rare: 'border-blue-500/60',
    epic: 'border-purple-500/70',
    legendary: 'border-amber-500/80',
};

const PatchItem = ({ patch, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative"
        >
            <Card className={`bg-white/10 backdrop-blur-sm border-2 ${rarityStyles[patch.rarity]} p-3 aspect-square flex flex-col items-center justify-center text-center hover:bg-white/15 transition-all duration-300`}>
                <img src={patch.image_url} alt={patch.name} className="w-20 h-20 object-contain mb-2"/>
                <h4 className="text-sm font-semibold text-brand-text-primary leading-tight">{patch.name}</h4>
                <p className="text-xs text-brand-text-secondary mt-1">
                    {new Date(patch.claimed_timestamp).toLocaleDateString()}
                </p>
            </Card>
        </motion.div>
    );
};

export default function PatchCollection({ user }) {
  const [patches, setPatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPatches = async () => {
      if (!user) {
          setIsLoading(false);
          return;
      };
      try {
        const collectedPatches = await Patch.filter({ claimed_by_user_id: user.id }, '-claimed_timestamp');
        setPatches(collectedPatches);
      } catch (error) {
        console.error("Failed to load user's patch collection:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPatches();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (patches.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-8 text-center">
            <Ticket className="w-12 h-12 mx-auto text-brand-text-secondary mb-4" />
            <h3 className="text-xl font-semibold text-brand-text-primary">Your Patch Collection is Empty</h3>
            <p className="text-brand-text-secondary mt-2">
              Start scanning QR codes at events to build your collection and earn XP!
            </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {patches.map((patch, index) => (
        <PatchItem key={patch.id} patch={patch} index={index} />
      ))}
    </div>
  );
}