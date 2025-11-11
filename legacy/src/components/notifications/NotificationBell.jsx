import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import NotificationFeed from './NotificationFeed';
import { Notification } from '@/api/entities';
import { useXP } from '../XPContext';

export default function NotificationBell() {
    const { user } = useXP();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            // Only fetch if user exists and has an id
            if (!user || !user.id) return;
            
            try {
                const unreadNotifs = await Notification.filter({ user_id: user.id, is_read: false });
                setUnreadCount(unreadNotifs.length);
            } catch (error) {
                console.warn("Could not fetch notification count", error);
            }
        };

        fetchUnreadCount();
        
        // Only set up interval if user exists
        if (user && user.id) {
            const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
            return () => clearInterval(interval);
        }
    }, [user]);

    // Don't render notification bell if no user
    if (!user || !user.id) {
        return null;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <NotificationFeed />
            </PopoverContent>
        </Popover>
    );
}