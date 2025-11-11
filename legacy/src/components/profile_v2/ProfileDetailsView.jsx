import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, MapPin, Star, ShieldCheck } from 'lucide-react';

const DetailItem = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div>
            <p className="text-sm text-brand-text-secondary flex items-center gap-2 mb-1">
                {icon}
                {label}
            </p>
            <p className="font-medium text-brand-text-primary capitalize">{value.replace(/_/g, ' ')}</p>
        </div>
    );
};

export default function ProfileDetailsView({ user }) {
    if (!user) {
        return (
            <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-6 text-center text-brand-text-secondary">
                    User details not available.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle>About You</CardTitle>
                <CardDescription>This is how your profile appears to others.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem icon={<User className="w-4 h-4"/>} label="Full Name" value={user.full_name} />
                    <DetailItem icon={<Phone className="w-4 h-4"/>} label="Phone Number" value={user.phone} />
                    <DetailItem icon={<MapPin className="w-4 h-4"/>} label="Home Club" value={user.home_club_name} />
                    <DetailItem icon={<ShieldCheck className="w-4 h-4"/>} label="Preferred Position" value={user.preferred_position} />
                    <DetailItem icon={<Star className="w-4 h-4"/>} label="Skill Level" value={user.skill_level} />
                </div>
            </CardContent>
        </Card>
    );
}