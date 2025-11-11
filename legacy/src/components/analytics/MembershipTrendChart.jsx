import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MembershipTrendChart({ data }) {
  return (
    <Card className="bg-brand-card-bg border-brand-border col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Membership Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
              <XAxis dataKey="month" stroke="var(--brand-text-secondary)" fontSize={12} />
              <YAxis stroke="var(--brand-text-secondary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--brand-charcoal)',
                  borderColor: 'var(--brand-border)',
                  color: 'var(--brand-text-primary)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="members" fill="var(--brand-red)" name="Total Members" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}