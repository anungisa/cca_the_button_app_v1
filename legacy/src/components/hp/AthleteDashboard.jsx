
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Activity, Calendar, Shield } from 'lucide-react';

const AthleteDashboard = ({ user, isAdminView = false }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <Target className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">
            {isAdminView ? 'Athlete Analytics Overview' : 'Athlete Dashboard'}
          </h1>
          <p className="text-brand-text-secondary">
            {isAdminView ? 'Viewing sample athlete performance hub.' : `Your performance hub, ${user.full_name}.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">Overall Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">87%</p>
            <p className="text-xs text-green-400">+2% from last week</p>
          </CardContent>
        </Card>
        {/* Other stat cards would go here */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brand-text-secondary">Recent drill logs and game reports will be displayed here.</p>
            {/* Placeholder for activity feed */}
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Coach Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brand-text-secondary">Latest feedback from your coaches will appear here.</p>
            {/* Placeholder for coach feedback */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AthleteDashboard;
