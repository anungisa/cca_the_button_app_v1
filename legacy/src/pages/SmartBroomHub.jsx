
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Upload, Settings, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBroomData } from '../components/hooks/useBroomData';
import BroomConnectWizard from '../components/smartbroom/BroomConnectWizard';
import SweepSessionView from '../components/smartbroom/SweepSessionView';
import PurchaseButton from '../components/purchasing/PurchaseButton';
import SponsorShowcase from '../components/home/SponsorShowcase';

export default function SmartBroomHub() {
  const { recentSession, connectBroom, uploadData, isConnected } = useBroomData();
  
  const handleProSubscription = () => {
    return [{
        id: 'smart_broom_pro_monthly',
        name: 'Smart Broom Pro Monthly',
        category: 'smart_broom',
        amount: 999, // $9.99
        subscription: {
            billing_cycle: 'monthly',
            start_date: new Date().toISOString(),
            auto_renew: true,
        },
        metadata: {
            features: ['advanced_analytics', 'coach_feedback_tools']
        }
    }];
  };

  const handleProSuccess = () => {
      alert('Successfully subscribed to Smart Broom Pro!');
      // In a real app, this would refresh user data to show new features
  };

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="space-y-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-text-primary">Smart Broom Hub</h1>
          <p className="text-brand-text-secondary mt-2 max-w-2xl mx-auto">
            Connect your Smart Broom to track, analyze, and improve your sweeping performance.
          </p>
        </div>

        {!isConnected && <BroomConnectWizard onConnect={connectBroom} />}

        {isConnected && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Device Status</CardTitle>
                  <Settings className="w-4 h-4 text-brand-text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">Connected</div>
                  <p className="text-xs text-brand-text-secondary">Ready to sync data</p>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Last Session</CardTitle>
                  <BarChart className="w-4 h-4 text-brand-text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {recentSession ? `${recentSession.overallScore}/100` : 'N/A'}
                  </div>
                  <p className="text-xs text-brand-text-secondary">
                    {recentSession ? new Date(recentSession.date).toLocaleDateString() : 'No recent sessions'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Sync Data</CardTitle>
                  <Upload className="w-4 h-4 text-brand-text-secondary" />
                </CardHeader>
                <CardContent>
                  <Button onClick={uploadData} className="w-full">Upload New Session</Button>
                </CardContent>
              </Card>
            </motion.div>

            {recentSession && <SweepSessionView session={recentSession} />}
            
            <div className="mt-12">
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" />
                            Upgrade to Smart Broom Pro
                        </CardTitle>
                        <p className="text-brand-text-secondary">Unlock advanced analytics and coaching tools.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Advanced sweeping metrics</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Coach feedback integration</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Video overlay and analysis</li>
                        </ul>
                        <PurchaseButton
                            products={handleProSubscription()}
                            purchaseType="subscription"
                            buttonText="Upgrade for $9.99/month"
                            buttonClassName="w-full bg-blue-600 hover:bg-blue-700"
                            onSuccess={handleProSuccess}
                        />
                    </CardContent>
                </Card>
            </div>
          </>
        )}
      </div>
      
      {/* Proud Partners Section */}
      <div className="mt-16 border-t border-brand-border/20 pt-12">
        <SponsorShowcase />
      </div>
    </div>
  );
}
