import React from 'react';
import UserFlowTester from '../components/tests/UserFlowTester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTube, AlertTriangle } from 'lucide-react';

export default function FlowTesting() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TestTube className="w-8 h-8 text-brand-red" />
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Phase 1 Flow Testing</h1>
          <p className="text-brand-text-secondary">
            Validate user experience improvements and critical journeys
          </p>
        </div>
      </div>

      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Testing Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-brand-charcoal/30 rounded-lg">
              <h3 className="font-semibold text-brand-text-primary">Navigation</h3>
              <p className="text-sm text-brand-text-secondary mt-1">
                Simplified nav structure, mobile responsiveness
              </p>
            </div>
            <div className="text-center p-4 bg-brand-charcoal/30 rounded-lg">
              <h3 className="font-semibold text-brand-text-primary">Core Flows</h3>
              <p className="text-sm text-brand-text-secondary mt-1">
                Club discovery, event engagement, performance tracking
              </p>
            </div>
            <div className="text-center p-4 bg-brand-charcoal/30 rounded-lg">
              <h3 className="font-semibold text-brand-text-primary">Mobile UX</h3>
              <p className="text-sm text-brand-text-secondary mt-1">
                Touch interactions, responsive design, performance
              </p>
            </div>
          </div>
          
          <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-amber-300 mb-2">Phase 1 Testing Focus</h4>
            <ul className="text-sm text-amber-200 space-y-1">
              <li>• Simplified navigation structure works correctly</li>
              <li>• Critical bugs are resolved (components, dependencies)</li>
              <li>• Mobile experience is functional and intuitive</li>
              <li>• Core user journeys complete successfully</li>
              <li>• Performance improvements are effective</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <UserFlowTester />
    </div>
  );
}