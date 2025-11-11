import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Handshake } from 'lucide-react';

export default function VolunteeringTab({ user }) {
  if (!user) return null;

  const interests = user.volunteer_interests || [];
  
  // Mock data for history until a live source is available
  const history = user.volunteer_history || [];

  return (
    <Card className="bg-brand-card-bg border-brand-border h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Handshake className="w-5 h-5 text-purple-400" />
          Volunteering
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(interests.length === 0 && history.length === 0) ? (
          <div className="text-center text-brand-text-secondary py-8">
            <p>No volunteering information available.</p>
            <Button variant="link" className="mt-2">Update Interests</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {interests.length > 0 && (
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">My Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <Badge key={index} className="bg-purple-900/50 text-purple-300">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
            {history.length > 0 && (
              <div>
                <h4 className="font-semibold text-brand-text-primary mb-2">My History</h4>
                <ul className="space-y-3">
                  {history.map((item) => (
                    <li key={item.id} className="text-sm flex justify-between items-center p-2 bg-brand-charcoal rounded">
                      <span>{item.event}: <span className="text-brand-text-secondary">{item.role}</span></span>
                      <span className="font-medium text-brand-text-primary">{item.hours} hrs</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}