import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonalProductivityDashboard from './PersonalProductivityDashboard';
import ProductivityAssistant from '../ai/ProductivityAssistant';

export default function ProductivityDashboard() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Productivity Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductivityAssistant />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Productivity Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalProductivityDashboard />
        </CardContent>
      </Card>
    </div>
  );
}