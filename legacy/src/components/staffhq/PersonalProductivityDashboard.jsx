import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, CheckSquare, Calendar, FolderKanban } from 'lucide-react';
import MyTasks from '../staffhq/TaskManagement';
import MyApprovalsQueue from '../staffhq/MyApprovalsQueue';
// Assume PersonalCalendar and MyProjects components exist or will be created.
// For now, using placeholders.
const PersonalCalendar = () => <div className="p-4 bg-brand-card-bg rounded-lg">Calendar View Placeholder</div>;
const MyProjects = () => <div className="p-4 bg-brand-card-bg rounded-lg">My Projects Placeholder</div>;


export default function PersonalProductivityDashboard() {
    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold">My Workspace</h1>
             <Tabs defaultValue="tasks" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="tasks"><ListTodo className="w-4 h-4 mr-2" />My Tasks</TabsTrigger>
                    <TabsTrigger value="approvals"><CheckSquare className="w-4 h-4 mr-2" />My Approvals</TabsTrigger>
                    <TabsTrigger value="calendar"><Calendar className="w-4 h-4 mr-2" />My Calendar</TabsTrigger>
                    <TabsTrigger value="projects"><FolderKanban className="w-4 h-4 mr-2" />My Projects</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks" className="mt-6">
                    <MyTasks />
                </TabsContent>
                <TabsContent value="approvals" className="mt-6">
                    <MyApprovalsQueue />
                </TabsContent>
                 <TabsContent value="calendar" className="mt-6">
                    <PersonalCalendar />
                </TabsContent>
                 <TabsContent value="projects" className="mt-6">
                    <MyProjects />
                </TabsContent>
            </Tabs>
        </div>
    );
}