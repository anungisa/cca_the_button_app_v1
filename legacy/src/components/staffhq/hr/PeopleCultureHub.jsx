import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, HeartHandshake, BarChart2, Briefcase, GraduationCap, FileLock } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

// Lazy load the components for each tab
const StaffDirectory = React.lazy(() => import('./StaffDirectory'));
const OnboardingTracker = React.lazy(() => import('./OnboardingTracker'));
const PolicyLibrary = React.lazy(() => import('./PolicyLibrary'));
const DEIMetricsDashboard = React.lazy(() => import('./DEIMetricsDashboard'));
const EmployeeFeedbackHub = React.lazy(() => import('./EmployeeFeedbackHub'));
const LearningDevelopmentHub = React.lazy(() => import('./LearningDevelopmentHub'));
const SecureDocsVault = React.lazy(() => import('./SecureDocsVault'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
    </div>
);

export default function PeopleCultureHub() {
    const { permissions } = usePermissions();
    const [activeTab, setActiveTab] = useState('directory');

    if (!permissions.canAccessPeopleCultureHub) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Access Restricted</h3>
                    <p className="text-brand-text-secondary">You do not have permission to view the People & Culture Hub.</p>
                </CardContent>
            </Card>
        );
    }
    
    const tabs = [
        { value: 'directory', label: 'Directory', icon: Users, component: <StaffDirectory /> },
        { value: 'onboarding', label: 'Onboarding', icon: Briefcase, component: <OnboardingTracker /> },
        { value: 'policies', label: 'Policies', icon: BookOpen, component: <PolicyLibrary /> },
        { value: 'dei', label: 'DE&I', icon: HeartHandshake, component: <DEIMetricsDashboard /> },
        { value: 'feedback', label: 'Feedback', icon: BarChart2, component: <EmployeeFeedbackHub /> },
        { value: 'learning', label: 'L&D', icon: GraduationCap, component: <LearningDevelopmentHub /> },
        { value: 'documents', label: 'Secure Docs', icon: FileLock, component: <SecureDocsVault /> },
    ];

    return (
        <div className="space-y-6">
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-brand-red" />
                        People & Culture Hub
                    </CardTitle>
                    <p className="text-brand-text-secondary">Manage staff, policies, and internal culture initiatives.</p>
                </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-7 bg-brand-card-bg border-brand-border">
                    {tabs.map(tab => (
                        <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabs.map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-6">
                        <Suspense fallback={<LoadingFallback />}>
                            {tab.component}
                        </Suspense>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}