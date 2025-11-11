import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const preferenceDetails = {
    task_assigned: { label: 'Task Assignments', description: 'When a task is assigned to you.' },
    approval_request: { label: 'Approval Requests', description: 'When an item requires your approval.' },
    compliance_due: { label: 'Compliance Alerts', description: 'For upcoming or overdue compliance items.' },
    case_assigned: { label: 'Case Assignments', description: 'When an incident case is assigned to you.' },
    mention: { label: 'Mentions', description: 'When you are @mentioned in a comment.' },
    general_announcement: { label: 'Announcements', description: 'General announcements from Staff HQ.' },
    events: { label: 'Event Updates', description: 'News about upcoming events.' },
    club_updates: { label: 'Club News', description: 'Updates from your home club.' },
    ma_communications: { label: 'MA Communications', description: 'News from your Member Association.' },
    donation_updates: { label: 'Donation Updates', description: 'Updates on fundraising campaigns.' },
};

export default function NotificationSettings() {
    const { toast } = useToast();
    const [preferences, setPreferences] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadPreferences = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentUser = await User.me();
            const defaultPrefs = Object.keys(preferenceDetails).reduce((acc, key) => {
                acc[key] = true; // Default to true if not set
                return acc;
            }, {});
            setPreferences(currentUser.notification_preferences || defaultPrefs);
        } catch (error) {
            console.error("Failed to load user preferences:", error);
            toast({
                title: "Error",
                description: "Could not load your notification preferences.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadPreferences();
    }, [loadPreferences]);

    const handleToggle = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await User.updateMyUserData({ notification_preferences: preferences });
            toast({
                title: "Success",
                description: "Your notification preferences have been saved.",
            });
        } catch (error) {
            console.error("Failed to save preferences:", error);
            toast({
                title: "Error",
                description: "Could not save your preferences. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you are notified about activities across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {Object.entries(preferenceDetails).map(([key, { label, description }]) => (
                        <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-brand-card-bg border border-brand-border">
                            <div>
                                <Label htmlFor={key} className="font-medium">{label}</Label>
                                <p className="text-sm text-brand-text-secondary">{description}</p>
                            </div>
                            <Switch
                                id={key}
                                checked={preferences[key] || false}
                                onCheckedChange={() => handleToggle(key)}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Preferences
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}