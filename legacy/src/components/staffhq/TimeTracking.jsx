import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, Pause, Square, Clock, Calendar, Timer, Plus, Edit2, Trash2, CheckCircle2
} from 'lucide-react';
import { useXP } from '../XPContext';
import { TimeEntry } from '@/api/entities';
import { Task } from '@/api/entities';
import { Project } from '@/api/entities';

const ActiveTimer = ({ onStop, isRunning, startTime, description, setDescription }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - new Date(startTime).getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Timer className="w-5 h-5 animate-pulse" />
          Active Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-brand-text-primary mb-2">
            {formatTime(elapsed)}
          </div>
          <p className="text-sm text-brand-text-secondary">Time elapsed</p>
        </div>
        
        <Textarea
          placeholder="What are you working on?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        
        <div className="flex gap-2">
          <Button onClick={onStop} variant="destructive" className="flex-1">
            <Square className="w-4 h-4 mr-2" />
            Stop & Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const TimeEntryForm = ({ entry, onSave, onCancel, tasks = [], projects = [] }) => {
  const [formData, setFormData] = useState({
    description: '',
    task_id: '',
    project_id: '',
    duration_minutes: 60,
    is_billable: false,
    ...entry
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry ? 'Edit Time Entry' : 'Log Time Manually'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Description of work performed"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={formData.task_id}
              onValueChange={(value) => setFormData({ ...formData, task_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Task (Optional)" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map(task => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={formData.project_id}
              onValueChange={(value) => setFormData({ ...formData, project_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Project (Optional)" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              min="1"
              required
            />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="billable"
                checked={formData.is_billable}
                onChange={(e) => setFormData({ ...formData, is_billable: e.target.checked })}
              />
              <label htmlFor="billable" className="text-sm text-brand-text-primary">
                Billable time
              </label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {entry ? 'Update Entry' : 'Log Time'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function TimeTracking() {
  const { user } = useXP();
  const [timeEntries, setTimeEntries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState(null);
  const [timerDescription, setTimerDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [entriesData, tasksData, projectsData] = await Promise.all([
        TimeEntry.filter({ user_id: user.id }, '-start_time', 50),
        Task.filter({ assigned_to: user.id, status: ['todo', 'in_progress'] }),
        Project.filter({ team_members: user.id, status: ['planning', 'active'] })
      ]);
      
      setTimeEntries(entriesData || []);
      setTasks(tasksData || []);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error loading time tracking data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimerStartTime(new Date().toISOString());
    setTimerDescription('');
  };

  const stopTimer = async () => {
    if (!timerStartTime) return;
    
    const endTime = new Date();
    const startTime = new Date(timerStartTime);
    const durationMinutes = Math.round((endTime - startTime) / 60000);
    
    try {
      await TimeEntry.create({
        user_id: user.id,
        description: timerDescription || 'Timer session',
        start_time: timerStartTime,
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes,
        status: 'submitted'
      });
      
      setIsTimerRunning(false);
      setTimerStartTime(null);
      setTimerDescription('');
      loadData();
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  };

  const handleSaveEntry = async (entryData) => {
    try {
      if (editingEntry) {
        await TimeEntry.update(editingEntry.id, entryData);
      } else {
        await TimeEntry.create({
          ...entryData,
          user_id: user.id,
          start_time: new Date().toISOString(),
          status: 'submitted'
        });
      }
      
      setShowForm(false);
      setEditingEntry(null);
      loadData();
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      try {
        await TimeEntry.delete(entryId);
        loadData();
      } catch (error) {
        console.error('Error deleting time entry:', error);
      }
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'secondary',
      submitted: 'default',
      approved: 'success',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Clock className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isTimerRunning ? (
          <ActiveTimer
            onStop={stopTimer}
            isRunning={isTimerRunning}
            startTime={timerStartTime}
            description={timerDescription}
            setDescription={setTimerDescription}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Time Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-brand-text-secondary">Track your time in real-time</p>
              <Button onClick={startTimer} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Time Manually
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Manual Entry Form */}
      {showForm && (
        <TimeEntryForm
          entry={editingEntry}
          onSave={handleSaveEntry}
          onCancel={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
          tasks={tasks}
          projects={projects}
        />
      )}

      {/* Recent Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {timeEntries.length === 0 ? (
            <div className="text-center py-8 text-brand-text-secondary">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No time entries yet. Start your first timer!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.description}
                      {entry.is_billable && (
                        <Badge variant="outline" className="ml-2 text-xs">Billable</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDuration(entry.duration_minutes)}</TableCell>
                    <TableCell>
                      {new Date(entry.start_time).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingEntry(entry);
                            setShowForm(true);
                          }}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}