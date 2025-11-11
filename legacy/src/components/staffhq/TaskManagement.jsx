import React, { useState, useEffect } from 'react';
import { Task } from '@/api/entities';
import { useXP } from '@/components/XPContext';
import { Loader2, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// This is a simplified task management view for "My Workspace"
export default function MyTasks() {
  const { user } = useXP();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('open');

  useEffect(() => {
    const loadTasks = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      try {
        const data = await Task.filter({ assigned_to: user.email });
        setTasks(data);
        setFilteredTasks(data.filter(t => statusFilter === 'all' || (statusFilter === 'open' && ['todo', 'in_progress'].includes(t.status)) || t.status === statusFilter));
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, [user]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else if (statusFilter === 'open') {
        setFilteredTasks(tasks.filter(t => ['todo', 'in_progress'].includes(t.status)));
    } else {
        setFilteredTasks(tasks.filter(t => t.status === statusFilter));
    }
  }, [statusFilter, tasks]);

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-600';
    if (priority === 'urgent') return 'bg-purple-600';
    if (priority === 'medium') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Tasks</CardTitle>
        <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-text-secondary"/>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                </SelectContent>
            </Select>
            <Button><Plus className="w-4 h-4 mr-2" /> New Task</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto"/> : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Due Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTasks.map(task => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell><Badge variant="outline">{task.status.replace('_', ' ')}</Badge></TableCell>
                            <TableCell><Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge></TableCell>
                            <TableCell>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )}
      </CardContent>
    </Card>
  );
}