
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, DollarSign, Users } from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const generateSampleDonations = () => {
    let donations = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    canadianProvincesAndTerritories.forEach(p => {
        months.forEach(month => {
            donations.push({
                ma_region: p.abbreviation,
                month,
                amount: Math.floor(Math.random() * 5000) + 1000,
                donors: Math.floor(Math.random() * 50) + 10
            });
        });
    });
    // Add national level donations
    months.forEach(month => {
        donations.push({
            ma_region: null,
            month,
            amount: Math.floor(Math.random() * 20000) + 5000,
            donors: Math.floor(Math.random() * 200) + 50
        });
    });
    return donations;
};

export default function FTLOCDashboard({ selectedRegion }) {
    const allDonations = useMemo(generateSampleDonations, []);

    const filteredDonations = useMemo(() => {
        if (selectedRegion === 'all') return allDonations;
        // For regional view, include both regional and national (null) data
        return allDonations.filter(d => d.ma_region === selectedRegion || d.ma_region === null);
    }, [selectedRegion, allDonations]);

    const analytics = useMemo(() => {
        const totalDonations = filteredDonations.reduce((acc, curr) => acc + curr.amount, 0);
        const totalDonors = filteredDonations.reduce((acc, curr) => acc + curr.donors, 0);
        
        const monthlyData = filteredDonations.reduce((acc, curr) => {
            if (!acc[curr.month]) {
                acc[curr.month] = { month: curr.month, donations: 0 };
            }
            acc[curr.month].donations += curr.amount;
            return acc;
        }, {});

        return {
            totalDonations,
            totalDonors,
            avgDonation: totalDonors > 0 ? totalDonations / totalDonors : 0,
            monthlyChartData: Object.values(monthlyData).sort((a,b) => new Date(`2024-${a.month}-01`) - new Date(`2024-${b.month}-01`)),
        };
    }, [filteredDonations]);

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="text-red-500" />
                    For the Love of Curling (FTLOC) Dashboard
                </CardTitle>
                <p className="text-brand-text-secondary">Viewing data for: {selectedRegion === 'all' ? 'National' : getProvinceNameByAbbreviation(selectedRegion)}</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-brand-charcoal rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-400 mb-2" />
                        <p className="text-sm text-brand-text-secondary">Total Donations</p>
                        <p className="text-2xl font-bold">${analytics.totalDonations.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-brand-charcoal rounded-lg">
                        <Users className="w-6 h-6 text-blue-400 mb-2" />
                        <p className="text-sm text-brand-text-secondary">Unique Donors</p>
                        <p className="text-2xl font-bold">{analytics.totalDonors.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-brand-charcoal rounded-lg">
                        <Heart className="w-6 h-6 text-red-400 mb-2" />
                        <p className="text-sm text-brand-text-secondary">Average Donation</p>
                        <p className="text-2xl font-bold">${analytics.avgDonation.toFixed(2)}</p>
                    </div>
                </div>

                <CardTitle className="text-lg mb-4">Donation Trends</CardTitle>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.monthlyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="month" stroke="#888" />
                        <YAxis stroke="#888" tickFormatter={(value) => `$${(value/1000)}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="donations" stroke="#34D399" strokeWidth={2} name="Donations ($)" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
