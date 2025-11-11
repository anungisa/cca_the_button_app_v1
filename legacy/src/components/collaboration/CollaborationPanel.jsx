import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Activity } from 'lucide-react';
import CommentSystem from './CommentSystem';
import ActivityFeed from './ActivityFeed';
import CollaboratorsList from './CollaboratorsList';

export default function CollaborationPanel({ 
    entityType, 
    entityId, 
    entityTitle,
    showActivityFeed = true,
    showCollaborators = true 
}) {
    const [activeTab, setActiveTab] = useState('comments');

    const tabs = [
        { value: 'comments', label: 'Comments', icon: MessageSquare, component: CommentSystem }
    ];

    if (showActivityFeed) {
        tabs.push({ 
            value: 'activity', 
            label: 'Activity', 
            icon: Activity, 
            component: ActivityFeed 
        });
    }

    if (showCollaborators) {
        tabs.push({ 
            value: 'collaborators', 
            label: 'People', 
            icon: Users, 
            component: CollaboratorsList 
        });
    }

    return (
        <div className="bg-brand-card-bg border border-brand-border rounded-lg p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    {tabs.map(tab => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                {tabs.map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-4">
                        <tab.component 
                            entityType={entityType}
                            entityId={entityId}
                            title={entityTitle}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}