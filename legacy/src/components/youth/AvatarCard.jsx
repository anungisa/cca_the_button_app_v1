import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useXP } from '../XPContext';
import { Award, Flame, Star } from 'lucide-react';

export default function AvatarCard({ user, streakData }) {
    const { loyaltyData } = useXP();

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                            {user?.full_name?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-brand-text-primary">{user?.full_name}</h3>
                        <p className="text-brand-text-secondary">{loyaltyData?.tier.replace('_', ' ')}</p>
                    </div>
                </div>
                <div className="mt-4 flex justify-around items-center text-center">
                    <div>
                        <p className="text-2xl font-bold">{loyaltyData?.curl_points || 0}</p>
                        <p className="text-xs text-brand-text-secondary">CurlPoints</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold flex items-center justify-center gap-1">
                          <Flame className="text-orange-500"/>
                          {streakData?.currentStreak || 0}
                        </p>
                        <p className="text-xs text-brand-text-secondary">Day Streak</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold flex items-center justify-center gap-1">
                          <Award className="text-amber-400"/>
                          {loyaltyData?.badges?.length || 0}
                        </p>
                        <p className="text-xs text-brand-text-secondary">Badges</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}