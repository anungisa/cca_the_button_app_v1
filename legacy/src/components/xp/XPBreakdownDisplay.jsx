import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Star, Shield, Gift } from 'lucide-react';

const reasonIcons = {
    'Base Action': <Zap className="w-4 h-4 text-gray-400" />,
    'Tier Multiplier': <Shield className="w-4 h-4 text-blue-400" />,
    'Streak Bonus': <Star className="w-4 h-4 text-yellow-400" />,
    'Milestone Bonus': <Gift className="w-4 h-4 text-purple-400" />,
    'Patch Party Bonus': <Gift className="w-4 h-4 text-red-400" />,
};

const XPBreakdownDisplay = ({ xpResult }) => {
    if (!xpResult) return null;

    const { breakdown, awarded } = xpResult;

    return (
        <div className="w-full bg-brand-charcoal/50 p-4 rounded-lg space-y-3">
            <AnimatePresence>
                {breakdown.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center text-sm"
                    >
                        <div className="flex items-center gap-2">
                            {reasonIcons[item.reason] || <Zap className="w-4 h-4 text-gray-400" />}
                            <span className="text-brand-text-secondary">{item.reason}</span>
                        </div>
                        <span className="font-medium text-brand-text-primary">+{item.points}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
            <div className="border-t border-brand-border pt-3 mt-3 flex justify-between items-center">
                <span className="font-bold text-brand-text-primary text-lg">Total XP Earned</span>
                <span className="font-bold text-amber-400 text-lg">+{awarded}</span>
            </div>
        </div>
    );
};

export default XPBreakdownDisplay;