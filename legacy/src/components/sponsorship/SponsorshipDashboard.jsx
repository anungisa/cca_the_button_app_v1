import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, CheckCircle, BarChart2 } from 'lucide-react';
import { canadianProvincesAndTerritories } from '../utils/provinces';

const generateSampleDeals = () => {
    const stages = ["prospect", "proposal_sent", "negotiation", "contracted", "lost"];
    const tiers = ["National", "Presenting", "Supporting", "Official Supplier"];
    let deals = [];
    canadianProvincesAndTerritories.forEach(p => {
        for(let i = 0; i < 3; i++) {
            deals.push({
                id: `deal-${p.abbreviation}-${i}`,
                deal_name: `Partnership ${p.abbreviation} ${i+1}`,
                company_name: `Local Corp ${i+1}`,
                deal_value: Math.floor(Math.random() * 80000) + 20000,
                stage: stages[Math.floor(Math.random() * stages.length)],
                tier: tiers[Math.floor(Math.random() * tiers.length)],
                ma_region: p.abbreviation
            });
        }
    });
    deals.push({ 
      id: 'deal-nat-1', 
      deal_name: 'National Broadcast Partner', 
      company_name: 'National Media Inc.', 
      deal_value: 500000, 
      stage: 'negotiation', 
      tier: 'National',
      ma_region: null 
    });
    return deals;
};

const MetricCard = ({ title, value, change, icon: Icon }) => (
    <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-text-secondary">{title}</CardTitle>
            <Icon className="h-4 w-4 text-brand-text-secondary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-brand-text-primary">{value}</div>
            <p className="text-xs text-green-500">{change}</p>
        </CardContent>
    </Card>
);

export default function SponsorshipDashboard({ selectedRegion }) {
    const deals = useMemo(generateSampleDeals, []);

    const filteredDeals = useMemo(() => {
        if (selectedRegion === 'all') return deals;
        return deals.filter(d => !d.ma_region || d.ma_region === selectedRegion);
    }, [selectedRegion, deals]);

    const stages = [
        { key: "prospect", title: "Prospect" },
        { key: "proposal_sent", title: "Proposal" },
        { key: "negotiation", title: "Negotiation" },
        { key: "contracted", title: "Contracted" },
    ];

    const analytics = useMemo(() => {
        if (!filteredDeals.length) return null;

        const contractedDeals = filteredDeals.filter(d => d.stage === 'contracted');
        const lostDeals = filteredDeals.filter(d => d.stage === 'lost');
        const totalClosed = contractedDeals.length + lostDeals.length;

        const pipelineByStage = stages.map(stage => ({
            name: stage.title,
            value: filteredDeals.filter(d => d.stage === stage.key).reduce((sum, d) => sum + d.deal_value, 0)
        })).filter(s => s.value > 0);
        
        const dealsByTier = filteredDeals.filter(d => d.stage === 'contracted').reduce((acc, deal) => {
            const tier = deal.tier || 'Other';
            if(!acc[tier]) acc[tier] = { name: tier, value: 0 };
            acc[tier].value += 1;
            return acc;
        }, {});

        return {
            totalPipelineValue: filteredDeals.filter(d => !['lost', 'contracted'].includes(d.stage)).reduce((sum, d) => sum + d.deal_value, 0),
            closedWonValue: contractedDeals.reduce((sum, d) => sum + d.deal_value, 0),
            conversionRate: totalClosed > 0 ? (contractedDeals.length / totalClosed * 100) : 0,
            averageDealSize: contractedDeals.length > 0 ? (contractedDeals.reduce((sum, d) => sum + d.deal_value, 0) / contractedDeals.length) : 0,
            pipelineByStage,
            dealsByTier: Object.values(dealsByTier)
        };
    }, [filteredDeals]);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (!analytics) {
        return (
            <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-12 text-center text-brand-text-secondary">
                    <BarChart2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-brand-text-primary mb-2">No Sponsorship Data</h3>
                    <p>There is no sponsorship data to display for the selected region.</p>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Active Pipeline Value" value={`$${(analytics.totalPipelineValue / 1000).toFixed(0)}K`} change="+15% this quarter" icon={TrendingUp} />
                <MetricCard title="Closed Won Value (YTD)" value={`$${(analytics.closedWonValue / 1000).toFixed(0)}K`} change="+22% vs last year" icon={CheckCircle} />
                <MetricCard title="Conversion Rate" value={`${analytics.conversionRate.toFixed(1)}%`} change="+2.5% this quarter" icon={Target} />
                <MetricCard title="Average Deal Size" value={`$${(analytics.averageDealSize / 1000).toFixed(1)}K`} change="-3% this quarter" icon={Users} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3 bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle>Pipeline Value by Stage</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.pipelineByStage} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" tickFormatter={(value) => `$${value/1000}K`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#262626', border: '1px solid #404040', color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2 bg-brand-card-bg border-brand-border">
                    <CardHeader><CardTitle>Contracted Deals by Tier</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.dealsByTier}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {analytics.dealsByTier.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#262626', border: '1px solid #404040', color: '#fff' }}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}