import React from 'react';
import SelfServeAnalytics from '../components/analytics/SelfServeAnalytics';

export default function SelfServeAnalyticsPage() {
  return (
    <div className="min-h-screen bg-brand-charcoal p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <SelfServeAnalytics />
      </div>
    </div>
  );
}