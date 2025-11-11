import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ExternalLink, User } from 'lucide-react';

const HPMessagesInbox = ({ messages, unreadCount }) => {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Team Messages
            {unreadCount > 0 && (
              <Badge className="bg-red-600 text-white ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="https://app.teamworks.com/messages" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" />
              Full Chat
            </a>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages && messages.length > 0 ? (
          <div className="space-y-3">
            {messages.slice(0, 5).map(message => (
              <div key={message.id} className="p-3 bg-brand-charcoal/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-text-secondary" />
                    <span className="text-sm font-medium text-brand-text-primary">
                      {message.sender_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-brand-border text-brand-text-secondary">
                      {message.channel}
                    </Badge>
                    <span className="text-xs text-brand-text-secondary">
                      {new Date(message.timestamp).toLocaleDateString('en-CA', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-brand-text-secondary line-clamp-2">
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent messages</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HPMessagesInbox;