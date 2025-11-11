import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, ExternalLink, ShieldCheck } from 'lucide-react';
import { useSafeSportStatus } from '../hooks/useSafeSportStatus';
import { motion } from 'framer-motion';

const courses = [
  { name: 'CAC Safe Sport Training', url: 'https://safesport.coach.ca/' },
  { name: 'Respect in Sport for Activity Leaders', url: 'https://www.respectgroupinc.com/' },
  { name: 'Commit to Kids for Coaches', url: 'https://commit2kids.ca/' },
];

export default function SafeSportCourseTracker() {
  const { updateUserStatus, isLoading } = useSafeSportStatus();
  const [expiryDate, setExpiryDate] = useState('');

  const handleCompletion = () => {
    if (!expiryDate) {
      alert('Please enter your certification expiry date.');
      return;
    }
    updateUserStatus('current', expiryDate);
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-lg text-brand-text-primary">External Training Courses</h3>
        <p className="text-sm text-brand-text-secondary">
          Complete the required courses on their respective platforms, then return here to update your status.
        </p>

        <div className="space-y-3">
          {courses.map((course, index) => (
            <motion.div 
              key={course.name} 
              className="flex items-center justify-between p-3 bg-brand-charcoal/50 border border-brand-border rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-brand-red" />
                <span className="font-medium text-brand-text-primary">{course.name}</span>
              </div>
              <Button asChild variant="outline" size="sm" className="border-brand-border text-brand-text-secondary hover:bg-brand-red hover:text-white">
                <a href={course.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Course
                </a>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="pt-4 border-t border-brand-border space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="font-semibold text-brand-text-primary">Update Your Compliance Status</h4>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="expiry-date" className="text-brand-text-primary">Certification Expiry Date</Label>
              <Input 
                id="expiry-date"
                type="date" 
                value={expiryDate} 
                onChange={e => setExpiryDate(e.target.value)} 
                className="bg-brand-charcoal border-brand-border text-brand-text-primary"
              />
            </div>
            <Button onClick={handleCompletion} disabled={isLoading || !expiryDate} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Mark as Complete (+200 XP)
            </Button>
          </div>
          <p className="text-xs text-brand-text-secondary text-center">
            Earn the "Cleared to Play" badge upon successful verification.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}