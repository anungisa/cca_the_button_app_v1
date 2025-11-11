import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { timeSince } from '../utils/timeSince';
import { getIcon } from '../utils/getIcon';

export default function NotificationItem({ notification, onMarkAsRead }) {
    const Icon = getIcon(notification.notification_type || 'default');

    const handleNotificationClick = () => {
        if (!notification.is_read) {
            onMarkAsRead(notification.id);
        }
    };
    
    const content = (
        <div 
            className={`flex items-start gap-3 p-3 transition-colors ${notification.is_read ? 'opacity-60' : 'bg-brand-charcoal hover:bg-brand-border/50'}`}
            onClick={handleNotificationClick}
        >
            <div className="mt-1">
                <Icon className="w-5 h-5 text-brand-text-secondary" />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-brand-text-primary text-sm">{notification.title}</p>
                <p className="text-xs text-brand-text-secondary">{notification.message}</p>
                <p className="text-xs text-brand-text-secondary mt-1">{timeSince(new Date(notification.created_date))}</p>
            </div>
            {!notification.is_read && (
                <div className="w-2 h-2 rounded-full bg-brand-red mt-1 flex-shrink-0" />
            )}
        </div>
    );
    
    if (notification.link_to) {
        return (
            <Link to={createPageUrl(notification.link_to)}>
                {content}
            </Link>
        );
    }

    return content;
}