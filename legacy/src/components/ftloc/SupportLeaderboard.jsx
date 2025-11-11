import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const rankColors = {
  1: 'bg-amber-400 text-amber-900',
  2: 'bg-gray-400 text-gray-900',
  3: 'bg-yellow-600 text-yellow-100',
};

export default function SupportLeaderboard({ donors }) {
  // Ensure donors is always an array before trying to map or sort
  const safeDonors = Array.isArray(donors) ? donors : [];

  const sortedDonors = [...safeDonors].sort((a, b) => b.amount - a.amount);

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Top Supporters
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDonors.length > 0 ? (
          <ul className="space-y-3">
            {sortedDonors.map((donor, index) => (
              <motion.li
                key={donor.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-brand-charcoal rounded-md"
              >
                <div className="flex items-center gap-3">
                  <span className={`font-bold w-6 text-center ${rankColors[index + 1] || 'text-brand-text-secondary'}`}>
                    {index + 1}
                  </span>
                  <p className="font-medium text-brand-text-primary">{donor.name}</p>
                </div>
                <Badge className="bg-green-600 text-white flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  ${donor.amount.toLocaleString()}
                </Badge>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-brand-text-secondary py-8">
            <p>Be the first to lead the support board!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}