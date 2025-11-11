import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { HRPolicy } from '@/api/entities';
import { StaffProfile } from '@/api/entities';
import { PolicyAcknowledgment } from '@/api/entities';

export default function PolicyComplianceChart() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [policiesData, staffData, acksData] = await Promise.all([
          HRPolicy.filter({ is_active: true, requires_acknowledgment: true }),
          StaffProfile.filter({ is_active: true }),
          PolicyAcknowledgment.list(),
        ]);

        const policies = policiesData || [];
        const staff = staffData || [];
        const acks = acksData || [];

        const policyCompliance = policies.map(policy => {
          const requiredAcks = staff.filter(s =>
            (policy.department || []).includes('all') || (policy.department || []).includes(s.department)
          );
          
          const completedAcks = acks.filter(a => a.policy_id === policy.id && a.policy_version === policy.version);
          
          const compliance = requiredAcks.length > 0 ? (completedAcks.length / requiredAcks.length) * 100 : 100;
          
          return {
            title: policy.title,
            compliance: Math.round(compliance),
            version: policy.version,
            required: requiredAcks.length,
            completed: completedAcks.length,
          };
        });
        
        setData(policyCompliance);
      } catch (error) {
        console.error("Failed to load policy compliance data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <div className="h-64 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Policy Compliance</CardTitle>
        <CardDescription>HR policy acknowledgment status across active staff.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-brand-text-secondary py-8">No active policies require acknowledgment.</p>
        ) : (
          <ul className="space-y-4 max-h-80 overflow-y-auto">
            {data.map((item, index) => (
              <li key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-brand-text-primary">{item.title} (v{item.version})</span>
                  <span className="text-sm font-bold text-brand-text-primary">{item.compliance}%</span>
                </div>
                <Progress value={item.compliance} className="h-2" />
                <p className="text-xs text-brand-text-secondary mt-1 text-right">
                  {item.completed} of {item.required} acknowledged
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}