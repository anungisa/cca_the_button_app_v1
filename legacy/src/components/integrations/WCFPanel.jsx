import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Globe, Trophy, Flag, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function WCFPanel() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      title: 'WCF Integration',
      description: 'WCF data integration coming soon. This will sync world rankings and international event data.'
    });
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-red" />
            WCF World Rankings
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync WCF Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-text-primary mb-2">
              WCF Integration Coming Soon
            </h3>
            <p className="text-brand-text-secondary max-w-md mx-auto">
              World Curling Federation rankings and international event data will be available here once the integration is complete.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}