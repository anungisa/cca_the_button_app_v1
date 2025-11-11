import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlusAccessModal({ isOpen, onClose, event }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-brand-text-primary">Unlock Premium Content</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-brand-text-secondary">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {event && (
                <div className="p-4 bg-brand-charcoal rounded-lg">
                  <h4 className="font-semibold text-brand-text-primary mb-2">{event.name}</h4>
                  <p className="text-sm text-brand-text-secondary">{event.description}</p>
                  {event.ppv_price && (
                    <Badge className="mt-2 bg-green-600 text-white">
                      ${event.ppv_price} PPV
                    </Badge>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold text-brand-text-primary">Choose Your Access:</h3>
                
                <div className="space-y-3">
                  <div className="p-4 border border-brand-border rounded-lg hover:border-brand-red transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-brand-text-primary">Single Event Pass</h4>
                      <Badge className="bg-blue-600 text-white">${event?.ppv_price || 9.99}</Badge>
                    </div>
                    <p className="text-sm text-brand-text-secondary">Watch this event only</p>
                  </div>

                  <div className="p-4 border-2 border-amber-500 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-brand-text-primary flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        Curling+ Monthly
                      </h4>
                      <Badge className="bg-amber-500 text-white">$14.99/mo</Badge>
                    </div>
                    <p className="text-sm text-brand-text-secondary mb-3">
                      Unlimited access to all streams, replays, and exclusive content
                    </p>
                    <ul className="text-xs text-brand-text-secondary space-y-1">
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-400" />
                        All live events
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-400" />
                        Full replay library
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-400" />
                        Exclusive interviews
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-400" />
                        Multi-camera angles
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={onClose} variant="outline" className="flex-1 border-brand-border text-brand-text-secondary">
                    Maybe Later
                  </Button>
                  <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}