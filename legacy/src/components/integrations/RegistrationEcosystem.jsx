import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, RefreshCw, Loader2, CheckCircle, AlertTriangle, 
  ExternalLink, Database, CreditCard, Zap, Building, Calendar 
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function RegistrationEcosystem() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSystem, setActiveSystem] = useState('overview');
  const { toast } = useToast();

  const handleSync = async (system) => {
    setIsSyncing(true);
    toast({
      title: "Coming Soon",
      description: `${system} integration is being developed.`,
    });
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Registration & Membership Ecosystem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-brand-text-secondary">
            Unified integration of CurlingReg (member data), Interpodia (payments), and Uplifter (club operations) - 
            the three systems that power Canadian curling registration and membership.
          </p>

          {/* System Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-indigo-400" />
                <h4 className="font-medium text-brand-text-primary">CurlingReg</h4>
              </div>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Member registrations</li>
                <li>• Digital credentials</li>
                <li>• Wallet IDs (Apple/Google)</li>
                <li>• Membership status</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <h4 className="font-medium text-brand-text-primary">Interpodia</h4>
              </div>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Payment processing</li>
                <li>• Transaction records</li>
                <li>• Registration fees</li>
                <li>• Refund management</li>
              </ul>
            </div>

            <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h4 className="font-medium text-brand-text-primary">Uplifter</h4>
              </div>
              <ul className="text-sm text-brand-text-secondary space-y-1">
                <li>• Club operations</li>
                <li>• Facility bookings</li>
                <li>• Ice scheduling</li>
                <li>• Member management</li>
              </ul>
            </div>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Integration In Development:</strong> The registration ecosystem integration is currently being built. 
              This will provide unified member, payment, and club operations data.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={() => handleSync('Registration Ecosystem')} disabled={isSyncing} className="flex-1">
              {isSyncing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Sync All Systems</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Details Tabs */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>System Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSystem} onValueChange={setActiveSystem}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="curlingreg">CurlingReg</TabsTrigger>
              <TabsTrigger value="interpodia">Interpodia</TabsTrigger>
              <TabsTrigger value="uplifter">Uplifter</TabsTrigger>
            </TabsList>

            <TabsContent value="curlingreg" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Member Sync</div>
                    <div className="text-sm text-brand-text-secondary">
                      Automatic sync of member data to The Button User entity
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Credential Verification</div>
                    <div className="text-sm text-brand-text-secondary">
                      Real-time verification of member credentials and status
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Wallet Integration</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sync digital wallet IDs for Apple/Google Wallet passes
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => window.open('https://curlingreg.com', '_blank')} className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit CurlingReg
              </Button>
            </TabsContent>

            <TabsContent value="interpodia" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Transaction Sync</div>
                    <div className="text-sm text-brand-text-secondary">
                      Automatic sync of payment transactions to FinancialTransaction entity
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Revenue Analytics</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track registration revenue by region, event, and category
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Payment Reconciliation</div>
                    <div className="text-sm text-brand-text-secondary">
                      Match payments to memberships and event registrations
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => window.open('https://interpodia.com', '_blank')} className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Interpodia
              </Button>
            </TabsContent>

            <TabsContent value="uplifter" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Club Operations Sync</div>
                    <div className="text-sm text-brand-text-secondary">
                      Sync club facility data, hours, and operational status
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Booking Integration</div>
                    <div className="text-sm text-brand-text-secondary">
                      Import facility bookings and ice time schedules
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-brand-text-primary">Member Analytics</div>
                    <div className="text-sm text-brand-text-secondary">
                      Track club membership trends and utilization metrics
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => window.open('https://uplifter.com', '_blank')} className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Uplifter
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}