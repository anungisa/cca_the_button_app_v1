import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MilestoneCard({ milestone, isCompleted, isLocked, onStart }) {
  const cardVariants = {
    locked: 'bg-brand-charcoal border-brand-border/50 text-brand-text-secondary',
    completed: 'bg-green-500/10 border-green-500/30 text-brand-text-primary',
    available: 'bg-brand-card-bg border-brand-border hover:border-brand-red/50 transition-colors'
  };

  const status = isCompleted ? 'completed' : isLocked ? 'locked' : 'available';
  const IconComponent = milestone.icon;

  return (
    <motion.div
      whileHover={status === 'available' ? { y: -4 } : {}}
      className="h-full"
    >
      <Card className={`h-full flex flex-col ${cardVariants[status]}`}>
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-charcoal flex items-center justify-center">
              <IconComponent className={`w-5 h-5 ${isCompleted ? 'text-green-400' : 'text-brand-red'}`} />
            </div>
            <Badge variant="outline" className={`text-xs ${isCompleted ? 'border-green-400/50 bg-green-900/20 text-green-300' : 'border-brand-border'}`}>
              {milestone.difficulty}
            </Badge>
          </div>

          <h4 className="font-bold text-brand-text-primary mt-1">{milestone.title}</h4>
          <p className="text-xs text-brand-text-secondary flex-grow mt-1">{milestone.description}</p>
          
          <div className="mt-3 text-xs text-brand-text-secondary">
            Requirement: <span className="font-medium text-brand-text-primary">{milestone.requirement}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-brand-border/50 flex-grow flex flex-col justify-end">
            {isCompleted ? (
              <div className="text-center text-green-400 font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Milestone Complete!</span>
              </div>
            ) : isLocked ? (
              <div className="text-center text-brand-text-secondary font-medium text-sm flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Locked</span>
              </div>
            ) : (
              <Button
                onClick={() => onStart(milestone)}
                className="w-full bg-brand-red hover:bg-red-700"
              >
                Start Milestone <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            <div className={`mt-2 text-center text-xs font-bold flex items-center justify-center gap-1 ${isCompleted ? 'text-green-400' : 'text-amber-400'}`}>
              <Zap className="w-3 h-3" /> +{milestone.xp_reward} XP
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}