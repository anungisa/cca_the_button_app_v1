import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Search } from 'lucide-react';

// Mock collaborators - in real app this would be determined by entity relationships
const getMockCollaborators = () => [
    {
        id: '1',
        full_name: 'Sarah Johnson',
        email: 'sarah.j@curling.ca',
        role: 'Project Lead',
        user_type: 'staff',
        last_active: new Date(Date.now() - 30 * 60 * 1000) // 30 mins ago
    },
    {
        id: '2',
        full_name: 'Mike Chen',
        email: 'mike.c@curling.ca',
        role: 'Developer',
        user_type: 'staff',
        last_active: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
        id: '3',
        full_name: 'Lisa Wang',
        email: 'lisa.w@curling.ca',
        role: 'Reviewer',
        user_type: 'staff',
        last_active: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    }
];

function CollaboratorItem({ collaborator }) {
    const isOnline = Date.now() - collaborator.last_active.getTime() < 5 * 60 * 1000; // 5 mins

    return (
        <div className="flex items-center justify-between p-3 bg-brand-card-bg border border-brand-border rounded-lg">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${collaborator.email}.png`} />
                        <AvatarFallback>{collaborator.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                </div>
                <div>
                    <p className="font-medium text-brand-text-primary text-sm">
                        {collaborator.full_name}
                    </p>
                    <p className="text-xs text-brand-text-secondary">
                        {collaborator.role}
                    </p>
                </div>
            </div>
            <Badge variant="outline" className="text-xs">
                {isOnline ? 'Online' : 'Offline'}
            </Badge>
        </div>
    );
}

export default function CollaboratorsList({ entityType, entityId }) {
    const [collaborators, setCollaborators] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading collaborators
        setTimeout(() => {
            setCollaborators(getMockCollaborators());
            setIsLoading(false);
        }, 300);
    }, [entityType, entityId]);

    const filteredCollaborators = collaborators.filter(collaborator =>
        collaborator.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collaborator.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <div className="text-center py-4">Loading collaborators...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-text-secondary" />
                    <h3 className="font-semibold text-brand-text-primary">
                        Collaborators ({collaborators.length})
                    </h3>
                </div>
                <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <Input
                    placeholder="Search collaborators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="space-y-2">
                {filteredCollaborators.length === 0 ? (
                    <div className="text-center py-8 text-brand-text-secondary">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No collaborators found</p>
                    </div>
                ) : (
                    filteredCollaborators.map(collaborator => (
                        <CollaboratorItem key={collaborator.id} collaborator={collaborator} />
                    ))
                )}
            </div>
        </div>
    );
}