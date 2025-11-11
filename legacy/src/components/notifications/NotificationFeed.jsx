import React, { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/api/entities';
import { useXP } from '../XPContext';
import NotificationItem from './NotificationItem';
import { Button } from '@/components/ui/button';
import { CheckCheck, Loader2 } from 'lucide-react';

export default function NotificationFeed() {
    const { user } = useXP();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadNotifications = useCallback(async () => {
        // Only load if user exists
        if (!user || !user.id) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const notifs = await Notification.filter(
                { user_id: user.id },
                '-created_date',
                20
            );
            setNotifications(notifs);
        } catch (error) {
            console.error("Error loading notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const markAsRead = async (notificationId) => {
        try {
            await Notification.update(notificationId, { is_read: true });
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        if (!user || !user.id) return;

        try {
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
            await Promise.all(unreadIds.map(id => Notification.update(id, { is_read: true })));
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    if (!user || !user.id) {
        return (
            <div className="w-80 p-4 bg-brand-card-bg border border-brand-border rounded-lg">
                <p className="text-center text-brand-text-secondary text-sm">
                    Please sign in to view notifications
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-80 p-4 bg-brand-card-bg border border-brand-border rounded-lg flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
            </div>
        );
    }

    return (
        <div className="w-80 bg-brand-card-bg border border-brand-border rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-brand-border">
                <h3 className="font-semibold text-brand-text-primary">Notifications</h3>
                {notifications.some(n => !n.is_read) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-brand-red hover:text-brand-red/80"
                    >
                        <CheckCheck className="w-4 h-4 mr-1" />
                        Mark all read
                    </Button>
                )}
            </div>

            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-brand-text-secondary">
                        No notifications yet
                    </div>
                ) : (
                    notifications.map(notif => (
                        <NotificationItem
                            key={notif.id}
                            notification={notif}
                            onMarkAsRead={markAsRead}
                        />
                    ))
                )}
            </div>
        </div>
    );
}