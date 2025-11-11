import React, { useState, useEffect } from 'react';
import { Patch } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Puzzle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PatchHighlights() {
    const [patches, setPatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPatches = async () => {
            setIsLoading(true);
            try {
                // Fetch rare or epic patches to highlight
                const featuredPatches = await Patch.filter({ rarity: { $in: ['epic', 'legendary'] } }, '-created_date', 5);
                setPatches(featuredPatches);
            } catch (error) {
                console.error("Failed to fetch patch highlights:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatches();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <Card className="bg-brand-card-bg border-brand-border h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Puzzle /> Featured Patches</CardTitle>
            </CardHeader>
            <CardContent>
                {patches.length > 0 ? (
                    <div className="space-y-3">
                        {patches.map(patch => (
                            <div key={patch.id} className="flex items-center gap-3">
                                <img src={patch.image_url} alt={patch.name} className="w-12 h-12 rounded-md object-cover bg-brand-charcoal"/>
                                <div>
                                    <h4 className="font-semibold">{patch.name}</h4>
                                    <Badge variant="secondary" className={
                                        patch.rarity === 'epic' ? 'bg-purple-600' : 'bg-amber-500'
                                    }>{patch.rarity}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-brand-text-secondary">No featured patches available right now.</p>
                )}
            </CardContent>
        </Card>
    );
}