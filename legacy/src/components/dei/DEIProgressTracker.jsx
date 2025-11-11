import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DEIProgressTracker({ completedResources, totalResources }) {
  const progressPercent = totalResources > 0 ? (completedResources / totalResources) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-text-primary">Your DEI Journey</h3>
              <p className="text-purple-300">Building an inclusive curling community</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-brand-text-secondary">
              <span>Progress</span>
              <span className="text-brand-text-primary font-medium">{completedResources} / {totalResources} completed</span>
            </div>
            <Progress value={progressPercent} className="w-full h-2 bg-brand-charcoal/50 [&>div]:bg-purple-400" />
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{completedResources}</div>
                <div className="text-xs text-brand-text-secondary">Resources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(progressPercent)}%
                </div>
                <div className="text-xs text-brand-text-secondary">Complete</div>
              </div>
              <div className="text-center">
                 <div className="text-2xl font-bold text-purple-400 flex items-center justify-center">
                    {completedResources >= 3 ? <Star className="text-yellow-400" /> : Math.max(0, 3 - completedResources)}
                 </div>
                <div className="text-xs text-brand-text-secondary">To Next Badge</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}