import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartHorizontal, Users, GitCommit } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { canadianProvincesAndTerritories } from '../utils/provinces';

const generateSampleProgramData = () => {
    let data = [];
    const focusAreas = ["youth", "gender_equity", "indigenous", "newcomers", "adaptive"];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    canadianProvincesAndTerritories.forEach(p => {
        focusAreas.forEach(focus => {
            let participantCount = Math.floor(Math.random() * 50) + 10;
            data.push({
                ma_region: p.abbreviation,
                focus_area: focus,
                participants: participantCount,
            });
            months.forEach(month => {
                data.push({
                    ma_region: p.abbreviation,
                    month: month,
                    monthly_participants: Math.floor(Math.random() * participantCount/2) + 5
                });
            });
        });
    });
    return data;
};

export default function CommunityAnalyticsDashboard({ selectedRegion }) {
    const allData = useMemo(generateSampleProgramData, []);

    const analytics = useMemo(() => {
        const filteredData = selectedRegion === 'all' 
            ? allData 
            : allData.filter(d => d.ma_region === selectedRegion);

        const focusBreakdown = filteredData.reduce((acc, item) => {
            if (item.focus_area) {
                if (!acc[item.focus_area]) {
                    acc[item.focus_area] = { name: item.focus_area.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value: 0 };
                }
                acc[item.focus_area].value += item.participants;
            }
            return acc;
        }, {});

        const monthlyTrend = filteredData.reduce((acc, item) => {
            if (item.month) {
                if (!acc[item.month]) {
                    acc[item.month] = { name: item.month, participants: 0 };
                }
                acc[item.month].participants += item.monthly_participants;
            }
            return acc;
        }, {});
        
        return {
            focusBreakdown: Object.values(focusBreakdown),
            monthlyTrend: Object.values(monthlyTrend).sort((a,b) => new Date(`2024-${a.name}-01`) - new Date(`2024-${b.name}-01`)),
        };
    }, [selectedRegion, allData]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChartHorizontal className="text-indigo-500" />
                    Community Engagement Analytics
                </CardTitle>
                <p className="text-brand-text-secondary">Viewing data for: {selectedRegion === 'all' ? 'National' : getProvinceNameByAbbreviation(selectedRegion)}</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-brand-text-primary">Participation by Focus Area</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={analytics.focusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
                                    {analytics.focusBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-4 text-brand-text-primary">Monthly Participation Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                                <Legend />
                                <Line type="monotone" dataKey="participants" stroke="#82ca9d" name="Participants" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}