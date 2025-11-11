import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

const sampleData = [
  { name: 'Jan', retention: 65, new_members: 30 },
  { name: 'Feb', retention: 68, new_members: 45 },
  { name: 'Mar', retention: 72, new_members: 40 },
  { name: 'Apr', retention: 70, new_members: 55 },
  { name: 'May', retention: 75, new_members: 60 },
  { name: 'Jun', retention: 78, new_members: 50 },
];

const PredictiveAnalyticsShowcase = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-red" />
            Membership Retention Forecast
          </CardTitle>
          <CardDescription>
            Predictive model forecasting member retention rates over the next quarter based on current engagement data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                <Legend />
                <Line type="monotone" dataKey="retention" name="Retention (%)" stroke="#e53e3e" strokeWidth={2} />
                <Line type="monotone" dataKey="new_members" name="New Members" stroke="#4299e1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              At-Risk Club Identification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-brand-text-secondary">AI analysis has identified the following clubs showing early indicators of potential financial or membership distress.</p>
            <div className="p-3 bg-brand-charcoal/50 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary">Rockwood Curling Club</h4>
              <p className="text-sm text-brand-text-secondary">Reason: Declining youth enrollment, low survey participation.</p>
              <Badge variant="outline" className="mt-2 text-yellow-400 border-yellow-400/50">High Risk</Badge>
            </div>
            <div className="p-3 bg-brand-charcoal/50 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary">Maple Leaf Curling Center</h4>
              <p className="text-sm text-brand-text-secondary">Reason: High member count but low engagement on the platform.</p>
              <Badge variant="outline" className="mt-2 text-amber-400 border-amber-400/50">Medium Risk</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-400" />
              Emerging Talent Spotlight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-brand-text-secondary">Performance data suggests these U18 athletes are showing exceptional progress and potential.</p>
            <div className="p-3 bg-brand-charcoal/50 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary">Jessica Thompson</h4>
              <p className="text-sm text-brand-text-secondary">Insight: Highest draw accuracy improvement rate in region.</p>
            </div>
            <div className="p-3 bg-brand-charcoal/50 rounded-lg">
              <h4 className="font-semibold text-brand-text-primary">Michael Chen</h4>
              <p className="text-sm text-brand-text-secondary">Insight: Top-tier SmartBroom pressure consistency.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsShowcase;