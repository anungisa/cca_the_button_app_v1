
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Heart, DollarSign } from 'lucide-react';

export default function YourImpactCard({ donationsMade = 0, kudosSent = 0 }) {
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg border-brand-border">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <User className="w-5 h-5" />
          Your FTLOC Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around text-center">
          <div>
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-6 h-6 text-green-300" />
              <span className="text-3xl font-bold">{donationsMade}</span>
            </div>
            <p className="text-xs opacity-90 mt-1">Donations Made</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-red-300" />
              <span className="text-3xl font-bold">{kudosSent}</span>
            </div>
            <p className="text-xs opacity-90 mt-1">Kudos Sent</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
