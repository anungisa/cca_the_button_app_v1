import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, User, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { canadianProvincesAndTerritories, getProvinceNameByAbbreviation } from '../utils/provinces';
import { formatDistanceToNow } from 'date-fns';

const generateSampleInnovationRequests = () => {
    const requests = [];
    const categories = ['ai_use_case', 'gamification', 'tracking_technology', 'data_visualization', 'mobile_app', 'integration'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    const statuses = ['submitted', 'reviewed', 'approved', 'in_progress', 'completed', 'rejected'];

    // National innovation requests
    requests.push(
        {
            id: 'innov-nat-1',
            title: 'AI-Powered Performance Analytics',
            category: 'ai_use_case',
            priority: 'high',
            status: 'in_progress',
            submitted_by: 'HP Director',
            ma_region: null,
            created_date: '2024-07-15T10:00:00Z',
            description: 'Develop AI models to analyze curling performance data'
        },
        {
            id: 'innov-nat-2',
            title: 'Mobile App Gamification Enhancement',
            category: 'gamification',
            priority: 'medium',
            status: 'approved',
            submitted_by: 'Fan Engagement Team',
            ma_region: null,
            created_date: '2024-08-01T14:30:00Z',
            description: 'Add new gamification features to improve fan engagement'
        }
    );

    // Regional innovation requests
    canadianProvincesAndTerritories.forEach(province => {
        if (Math.random() > 0.7) { // Not every province has requests
            requests.push({
                id: `innov-${province.abbreviation}-1`,
                title: `${province.name} Club Data Dashboard`,
                category: 'data_visualization',
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                submitted_by: `${province.abbreviation} Technical Lead`,
                ma_region: province.abbreviation,
                created_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
                description: `Custom dashboard for ${province.name} club analytics`
            });
        }
    });

    return requests;
};

export default function InnovationRequestsLog({ selectedRegion }) {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setRequests(generateSampleInnovationRequests());
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredRequests = useMemo(() => {
        if (selectedRegion === 'all') return requests;
        return requests.filter(r => !r.ma_region || r.ma_region === selectedRegion);
    }, [selectedRegion, requests]);

    const getPriorityColor = (priority) => {
        const config = {
            low: 'bg-gray-500',
            medium: 'bg-yellow-600',
            high: 'bg-orange-600',
            critical: 'bg-red-600'
        };
        return config[priority] || 'bg-gray-500';
    };

    const getStatusColor = (status) => {
        const config = {
            submitted: 'bg-blue-500',
            reviewed: 'bg-yellow-500',
            approved: 'bg-green-500',
            in_progress: 'bg-purple-500',
            completed: 'bg-green-600',
            rejected: 'bg-red-500'
        };
        return config[status] || 'bg-gray-500';
    };

    const statusCounts = useMemo(() => {
        return filteredRequests.reduce((acc, req) => {
            acc[req.status] = (acc[req.status] || 0) + 1;
            return acc;
        }, {});
    }, [filteredRequests]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-brand-card-bg border border-brand-border rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-brand-text-secondary">Total Requests</p>
                                <p className="text-2xl font-bold text-brand-text-primary">{filteredRequests.length}</p>
                            </div>
                            <Lightbulb className="w-6 h-6 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-brand-text-secondary">In Progress</p>
                                <p className="text-2xl font-bold text-brand-text-primary">{statusCounts.in_progress || 0}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-brand-text-secondary">Completed</p>
                                <p className="text-2xl font-bold text-brand-text-primary">{statusCounts.completed || 0}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-brand-card-bg border-brand-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-brand-text-secondary">High Priority</p>
                                <p className="text-2xl font-bold text-brand-text-primary">
                                    {filteredRequests.filter(r => ['high', 'critical'].includes(r.priority)).length}
                                </p>
                            </div>
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Requests List */}
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle>Innovation Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredRequests.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).map(request => (
                            <div key={request.id} className="flex items-center justify-between p-4 bg-brand-charcoal/30 rounded-lg">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-2 rounded-md ${getStatusColor(request.status)}/20`}>
                                        <Lightbulb className={`w-5 h-5 text-${getStatusColor(request.status).replace('bg-', '').replace('-600', '-400').replace('-500', '-400')}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-brand-text-primary">{request.title}</h4>
                                        <p className="text-sm text-brand-text-secondary mb-2">{request.description}</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="w-3 h-3" />
                                            <span className="text-brand-text-secondary">
                                                {request.submitted_by} • {formatDistanceToNow(new Date(request.created_date), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline">{request.ma_region || 'National'}</Badge>
                                    <Badge className={`${getPriorityColor(request.priority)} text-white capitalize`}>
                                        {request.priority}
                                    </Badge>
                                    <Badge className={`${getStatusColor(request.status)} text-white capitalize`}>
                                        {request.status.replace('_', ' ')}
                                    </Badge>
                                    <Button size="sm" variant="outline">
                                        View
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredRequests.length === 0 && (
                        <div className="text-center py-12">
                            <Lightbulb className="w-16 h-16 mx-auto mb-4 text-brand-text-secondary opacity-50" />
                            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">
                                No Innovation Requests
                            </h3>
                            <p className="text-brand-text-secondary">
                                {selectedRegion === 'all' 
                                    ? 'No innovation requests found.'
                                    : `No innovation requests found for ${getProvinceNameByAbbreviation(selectedRegion)}.`
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}