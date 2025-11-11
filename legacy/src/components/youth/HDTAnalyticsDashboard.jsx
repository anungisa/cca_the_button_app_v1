
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';

const generateSampleHDTScores = () => {
    let scores = [];
    const ageDivisions = ["6-7", "8-9", "10-12"];
    canadianProvincesAndTerritories.forEach(p => {
        ageDivisions.forEach(age => {
            scores.push({
                ma_region: p.abbreviation,
                age_division: age,
                hit: Math.floor(Math.random() * 20) + 5, // out of 25
                draw: Math.floor(Math.random() * 20) + 5,
                tap: Math.floor(Math.random() * 20) + 5,
            });
        });
    });
    return scores;
};

export default function HDTAnalyticsDashboard({ selectedRegion }) {
    const allScores = useMemo(generateSampleHDTScores, []);
    
    const analyticsData = useMemo(() => {
        const filteredScores = selectedRegion === 'all' 
            ? allScores 
            : allScores.filter(s => s.ma_region === selectedRegion);

        const dataByAge = filteredScores.reduce((acc, score) => {
            if (!acc[score.age_division]) {
                acc[score.age_division] = { name: score.age_division, count: 0, hit: 0, draw: 0, tap: 0 };
            }
            acc[score.age_division].count++;
            acc[score.age_division].hit += score.hit;
            acc[score.age_division].draw += score.draw;
            acc[score.age_division].tap += score.tap;
            return acc;
        }, {});

        return Object.values(dataByAge).map(d => ({
            name: `Ages ${d.name}`,
            Hit: d.count > 0 ? (d.hit / d.count).toFixed(1) : 0,
            Draw: d.count > 0 ? (d.draw / d.count).toFixed(1) : 0,
            Tap: d.count > 0 ? (d.tap / d.count).toFixed(1) : 0,
        }));
    }, [selectedRegion, allScores]);

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="text-yellow-500" />
                    Hit, Draw, Tap (HDT) Average Scores
                </CardTitle>
                <p className="text-brand-text-secondary">Viewing data for: {selectedRegion === 'all' ? 'National' : getProvinceNameByAbbreviation(selectedRegion)}</p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                             contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                             labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Bar dataKey="Hit" fill="#8884d8" />
                        <Bar dataKey="Draw" fill="#82ca9d" />
                        <Bar dataKey="Tap" fill="#ffc658" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
