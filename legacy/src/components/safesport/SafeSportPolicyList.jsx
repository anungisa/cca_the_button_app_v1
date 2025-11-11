import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckSquare } from 'lucide-react';
import { useSafeSportStatus } from '../hooks/useSafeSportStatus';
import { motion } from 'framer-motion';

const policies = [
  { name: 'Code of Conduct & Ethics', url: '#' },
  { name: 'Screening Policy', url: '#' },
  { name: 'Discipline & Complaints Policy', url: '#' },
  { name: 'Rowan\'s Law (Concussion Safety)', url: '#' }
];

export default function SafeSportPolicyList() {
  const { markPoliciesAsRead, isLoading } = useSafeSportStatus();

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          {policies.map((policy, index) => (
            <motion.div 
              key={policy.name} 
              className="flex items-center justify-between p-3 bg-brand-charcoal/50 border border-brand-border rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-brand-red" />
                <span className="font-medium text-brand-text-primary">{policy.name}</span>
              </div>
              <Button asChild variant="outline" size="sm" className="border-brand-border text-brand-text-secondary hover:bg-brand-red hover:text-white">
                <a href={policy.url} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  View PDF
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="text-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
           <Button onClick={markPoliciesAsRead} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
             <CheckSquare className="w-4 h-4 mr-2" />
             I have read and understood these policies (+100 XP)
           </Button>
           <p className="text-xs text-brand-text-secondary mt-2">
             Earn the "Informed Curler" badge for acknowledging the policies.
           </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}