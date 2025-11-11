import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { 
    Users, Briefcase, FileText, Scale, Shield, DollarSign, FlaskConical, Globe, BookOpen, Target, Building, Handshake, PlusCircle, Search, X
} from 'lucide-react';

export default function GlobalSearch({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const searchSources = [
        { name: 'Staff', entity: 'User', icon: Users },
        { name: 'Clubs', entity: 'Club', icon: Building },
        { name: 'Sponsor Deals', entity: 'SponsorDeal', icon: DollarSign },
        { name: 'Legal Cases', entity: 'LegalCase', icon: Scale },
        { name: 'Incidents', entity: 'Incident', icon: Shield },
        { name: 'Policies', entity: 'GovernancePolicy', icon: FileText },
        { name: 'Projects', entity: 'Project', icon: Briefcase },
        { name: 'AI Models', entity: 'AIModel', icon: FlaskConical },
        { name: 'Partnerships', entity: 'ResearchPartnership', icon: Handshake },
        { name: 'Event Plans', entity: 'EventPlan', icon: Target },
        { name: 'Knowledge Articles', entity: 'KnowledgeArticle', icon: BookOpen },
    ];

    useEffect(() => {
        const performSearch = async () => {
            if (query.length < 2) {
                setResults(null);
                return;
            }
            setIsLoading(true);
            
            // Simulate search results with sample data
            const mockResults = searchSources.map(source => ({
                name: source.name,
                icon: source.icon,
                items: query.toLowerCase().includes('test') ? [
                    { id: 1, name: `Test ${source.name} Item 1` },
                    { id: 2, name: `Test ${source.name} Item 2` }
                ] : []
            })).filter(group => group.items.length > 0);

            setTimeout(() => {
                setResults(mockResults);
                setIsLoading(false);
            }, 300);
        };

        const debounceSearch = setTimeout(() => {
            performSearch();
        }, 300);

        return () => clearTimeout(debounceSearch);

    }, [query]);

    const handleItemSelect = (item) => {
        console.log('Selected:', item);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-brand-card-bg border-brand-border max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Global Search
                        <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto">
                            <X className="w-4 h-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <Input 
                        placeholder="Search across all of StaffHQ..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full"
                    />
                    
                    <div className="max-h-96 overflow-y-auto space-y-4">
                        {isLoading && (
                            <div className="text-center py-8 text-brand-text-secondary">
                                Searching...
                            </div>
                        )}
                        
                        {!isLoading && !results && query.length < 2 && (
                            <div className="text-center py-8 text-brand-text-secondary">
                                Type at least 2 characters to search.
                            </div>
                        )}
                        
                        {!isLoading && results && results.length === 0 && query.length >= 2 && (
                            <div className="text-center py-8 text-brand-text-secondary">
                                No results found for "{query}".
                            </div>
                        )}

                        {results && results.map((group) => (
                            <div key={group.name} className="space-y-2">
                                <h3 className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider">
                                    {group.name}
                                </h3>
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleItemSelect(item)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-brand-charcoal/50 transition-colors text-left"
                                        >
                                            <group.icon className="w-4 h-4 text-brand-text-secondary flex-shrink-0" />
                                            <span className="text-brand-text-primary">{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        <div className="border-t border-brand-border pt-4">
                            <h3 className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider mb-2">
                                Quick Actions
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => { console.log('Creating new task'); onClose(); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-brand-charcoal/50 transition-colors text-left"
                                >
                                    <PlusCircle className="w-4 h-4 text-brand-text-secondary flex-shrink-0" />
                                    <span className="text-brand-text-primary">Create New Task</span>
                                </button>
                                <button
                                    onClick={() => { console.log('Creating new project'); onClose(); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-brand-charcoal/50 transition-colors text-left"
                                >
                                    <Briefcase className="w-4 h-4 text-brand-text-secondary flex-shrink-0" />
                                    <span className="text-brand-text-primary">Create New Project</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}