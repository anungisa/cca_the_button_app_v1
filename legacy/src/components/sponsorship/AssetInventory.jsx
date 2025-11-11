import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { canadianProvincesAndTerritories } from '../utils/provinces';

const generateSampleAssets = () => {
    const categories = ["in_ice", "on_site_branding", "digital_media", "broadcast_integration", "hospitality"];
    const nationalAssets = [
        { id: 'asset-nat-1', asset_name: 'National TV Commercial Spot', category: 'broadcast_integration', base_value: 150000, ma_region: null },
        { id: 'asset-nat-2', asset_name: 'Brier Patch on Sheet', category: 'in_ice', base_value: 200000, ma_region: null },
        { id: 'asset-nat-3', asset_name: 'Homepage Banner Ad', category: 'digital_media', base_value: 25000, ma_region: null },
    ];
    
    // Generate fewer regional assets to keep it manageable
    const regionalAssets = canadianProvincesAndTerritories.slice(0, 3).flatMap(p => ([
        { id: `asset-${p.abbreviation}-1`, asset_name: `${p.name} Championship Program Ad`, category: 'on_site_branding', base_value: 5000, ma_region: p.abbreviation },
        { id: `asset-${p.abbreviation}-2`, asset_name: `${p.name} Website Sponsor Logo`, category: 'digital_media', base_value: 2500, ma_region: p.abbreviation },
    ]));
    
    return [...nationalAssets, ...regionalAssets];
};

export default function AssetInventory({ selectedRegion }) {
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        setAssets(generateSampleAssets());
    }, []);

    const filteredAssets = useMemo(() => {
        if (selectedRegion === 'all') return assets;
        return assets.filter(a => !a.ma_region || a.ma_region === selectedRegion);
    }, [selectedRegion, assets]);

    const groupedAssets = useMemo(() => {
        return filteredAssets.reduce((acc, asset) => {
            const { category } = asset;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(asset);
            return acc;
        }, {});
    }, [filteredAssets]);

    const getCategoryTitle = (category) => {
        return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (Object.keys(groupedAssets).length === 0) {
        return (
            <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-12 text-center text-brand-text-secondary">
                    <p>No sponsorship assets found for the selected region.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {Object.entries(groupedAssets).map(([category, assetsInCategory]) => (
                <Card key={category} className="bg-brand-card-bg border-brand-border">
                    <CardHeader>
                        <CardTitle>{getCategoryTitle(category)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {assetsInCategory.map(asset => (
                                <div key={asset.id} className="p-4 bg-brand-charcoal/30 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-brand-text-primary text-sm leading-tight">{asset.asset_name}</h4>
                                        <Badge variant="outline" className="ml-2">{asset.ma_region || 'National'}</Badge>
                                    </div>
                                    <p className="text-lg font-bold text-green-400 mt-2">${asset.base_value.toLocaleString()}</p>
                                    <p className="text-xs text-brand-text-secondary">Rate Card Value</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}