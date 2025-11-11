import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function RealTimeNotifications({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 z-50">
      <Card className="bg-brand-card-bg border-brand-border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-brand-text-primary">
            <Bell className="w-4 h-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-brand-text-secondary py-4">
            No new notifications
          </div>
        </CardContent>
      </Card>
    </div>
  );
}