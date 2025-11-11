import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock,
  UserCheck,
  Calendar,
  ListChecks
} from 'lucide-react';
import { useSafeSportStatus } from '../hooks/useSafeSportStatus';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function SafeSportStatusCard({ showActions = true }) {
  const { user, status, isLoading, getRoleRequirements } = useSafeSportStatus();

  if (isLoading) {
    return (
      <Card className="animate-pulse bg-brand-card-bg border-brand-border">
        <CardContent className="p-6">
          <div className="h-6 bg-brand-charcoal rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-brand-charcoal rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!user || !status) {
    return null;
  }

  const getStatusInfo = () => {
    switch(status.status) {
      case 'current':
        return { 
          color: 'green', 
          Icon: ShieldCheck, 
          text: 'Compliant',
          message: 'All your Safe Sport requirements are up to date. Thank you!',
          bgColor: 'bg-green-900/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-300'
        };
      case 'pending':
        return { 
          color: 'yellow', 
          Icon: Clock, 
          text: 'Pending Review',
          message: 'Your submission is under review. This may take a few business days.',
          bgColor: 'bg-yellow-900/20',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-300'
        };
      case 'expired':
        return { 
          color: 'red', 
          Icon: AlertTriangle, 
          text: 'Expired',
          message: 'Your certification has expired. Please renew to remain compliant.',
          bgColor: 'bg-red-900/20',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-300'
        };
      default:
        return { 
          color: 'gray', 
          Icon: UserCheck, 
          text: 'Action Required',
          message: 'Please complete the required courses to become compliant.',
          bgColor: 'bg-gray-900/20',
          borderColor: 'border-gray-500/30',
          textColor: 'text-gray-300'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const requirements = getRoleRequirements(user.user_type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor} border bg-brand-card-bg`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${statusInfo.textColor}`}>
            <statusInfo.Icon className="w-6 h-6" />
            Safe Sport Status: {statusInfo.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm ${statusInfo.textColor}`}>{statusInfo.message}</p>
          
          {status.expiry && (
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <Calendar className="w-4 h-4" />
              <span>Expires: {format(new Date(status.expiry), 'MMMM d, yyyy')}</span>
            </div>
          )}

          <div className="p-4 bg-brand-charcoal/50 rounded-lg border border-brand-border">
              <h4 className="font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                  <ListChecks className="w-5 h-5" />
                  Your Requirements ({user.user_type?.replace('_', ' ') || 'Curler'})
              </h4>
              <ul className="space-y-1 text-sm text-brand-text-secondary list-disc list-inside">
                  {requirements.map((req, i) => <li key={i}>{req}</li>)}
              </ul>
          </div>
          
          {showActions && status.status !== 'current' && (
            <Button 
              className="bg-brand-red hover:bg-red-700"
              onClick={() => { /* Navigate to courses tab or page */ }}
            >
              Complete Courses
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}