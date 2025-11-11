import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, CheckCircle, XCircle, Loader2, 
  RefreshCw, Activity, Info 
} from 'lucide-react';
import { User } from '@/api/entities';
import { Club } from '@/api/entities';
import { Event } from '@/api/entities';

export default function SupabaseHealthCheck() {
  const [status, setStatus] = useState('checking');
  const [details, setDetails] = useState({});
  const [isChecking, setIsChecking] = useState(false);

  const checkConnectivity = async () => {
    setIsChecking(true);
    setStatus('checking');
    
    const results = {
      timestamp: new Date().toISOString(),
      checks: {}
    };

    try {
      // Test 1: User entity read
      try {
        const users = await User.list('', 1);
        results.checks.userRead = {
          status: 'success',
          count: users.length,
          message: 'Successfully read User entity'
        };
      } catch (error) {
        results.checks.userRead = {
          status: 'error',
          error: error.message
        };
      }

      // Test 2: Club entity read
      try {
        const clubs = await Club.list('', 1);
        results.checks.clubRead = {
          status: 'success',
          count: clubs.length,
          message: 'Successfully read Club entity'
        };
      } catch (error) {
        results.checks.clubRead = {
          status: 'error',
          error: error.message
        };
      }

      // Test 3: Event entity read
      try {
        const events = await Event.list('', 1);
        results.checks.eventRead = {
          status: 'success',
          count: events.length,
          message: 'Successfully read Event entity'
        };
      } catch (error) {
        results.checks.eventRead = {
          status: 'error',
          error: error.message
        };
      }

      // Test 4: Write test (create and delete a test record)
      try {
        const testClub = await Club.create({
          name: 'CONNECTIVITY_TEST_DELETE_ME',
          location: { city: 'Test', province: 'Test' },
          ma_region: 'TEST',
          status: 'inactive'
        });
        
        await Club.delete(testClub.id);
        
        results.checks.write = {
          status: 'success',
          message: 'Successfully created and deleted test record'
        };
      } catch (error) {
        results.checks.write = {
          status: 'error',
          error: error.message
        };
      }

      // Test 5: Current user
      try {
        const currentUser = await User.me();
        results.checks.authentication = {
          status: 'success',
          user: currentUser.email,
          role: currentUser.role,
          message: 'Successfully authenticated user'
        };
      } catch (error) {
        results.checks.authentication = {
          status: 'error',
          error: error.message
        };
      }

      // Determine overall status
      const allChecks = Object.values(results.checks);
      const failedChecks = allChecks.filter(c => c.status === 'error');
      
      if (failedChecks.length === 0) {
        setStatus('connected');
        results.overall = 'All systems operational';
      } else if (failedChecks.length < allChecks.length) {
        setStatus('degraded');
        results.overall = `${failedChecks.length} of ${allChecks.length} checks failed`;
      } else {
        setStatus('error');
        results.overall = 'Database connection failed';
      }

      setDetails(results);

    } catch (error) {
      setStatus('error');
      setDetails({
        overall: 'Critical error during health check',
        error: error.message
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-brand-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'degraded':
        return <Activity className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Loader2 className="w-6 h-6 animate-spin text-brand-text-secondary" />;
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-400" />
            Supabase Connectivity
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnectivity}
            disabled={isChecking}
          >
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Recheck
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 bg-brand-charcoal rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(status)}
            <div>
              <div className={`font-semibold ${getStatusColor(status)}`}>
                {status === 'connected' && 'Connected'}
                {status === 'degraded' && 'Degraded Performance'}
                {status === 'error' && 'Connection Failed'}
                {status === 'checking' && 'Checking...'}
              </div>
              <div className="text-sm text-brand-text-secondary">
                {details.overall || 'Running connectivity tests...'}
              </div>
            </div>
          </div>
          <Badge className={
            status === 'connected' ? 'bg-green-500/20 text-green-400' :
            status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
            status === 'error' ? 'bg-red-500/20 text-red-400' :
            'bg-brand-border text-brand-text-secondary'
          }>
            {status.toUpperCase()}
          </Badge>
        </div>

        {/* Individual Check Results */}
        {details.checks && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-brand-text-primary">
              Detailed Checks
            </h4>
            
            {Object.entries(details.checks).map(([checkName, result]) => (
              <div 
                key={checkName}
                className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded border border-brand-border"
              >
                <div className="flex items-center gap-2">
                  {result.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium text-brand-text-primary capitalize">
                    {checkName.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <div className="text-right">
                  {result.message && (
                    <div className="text-xs text-brand-text-secondary">
                      {result.message}
                    </div>
                  )}
                  {result.error && (
                    <div className="text-xs text-red-400">
                      {result.error}
                    </div>
                  )}
                  {result.count !== undefined && (
                    <div className="text-xs text-brand-text-secondary">
                      {result.count} record(s)
                    </div>
                  )}
                  {result.user && (
                    <div className="text-xs text-brand-text-secondary">
                      {result.user} ({result.role})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connection Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Architecture:</strong> The Button → base44 Platform → Supabase (PostgreSQL)
            <br />
            <strong>Connection:</strong> Managed automatically through base44 entity system
            <br />
            <strong>Last Check:</strong> {details.timestamp ? new Date(details.timestamp).toLocaleString() : 'Never'}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}