
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Task } from '@/api/entities';

export default function TaskStatusByDepartmentChart() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const taskData = await Task.list();
        // Assuming Task.list() returns a flat array of task objects,
        // each with a 'department' field (string name) and 'status' field.
        setTasks(taskData || []);
      } catch (error) {
        console.error("Failed to load tasks:", error);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);

  const chartData = useMemo(() => {
    if (isLoading || !tasks || tasks.length === 0) {
      return [];
    }
    
    // Process the flat list of tasks to extract department task statistics
    const departmentStats = {};
    
    tasks.forEach(task => {
      const departmentName = task.department; // Assuming 'department' property holds the department name
      if (!departmentName) {
        // Skip tasks without a specified department
        return; 
      }

      if (!departmentStats[departmentName]) {
        departmentStats[departmentName] = {
          department: departmentName,
          not_started: 0,
          in_progress: 0,
          completed: 0,
          total: 0
        };
      }
      
      const status = task.status || 'not_started'; // Default to 'not_started' if status is missing
      if (departmentStats[departmentName][status] !== undefined) {
          departmentStats[departmentName][status]++;
      } else {
          // Handle unexpected status values by incrementing a generic 'other' or 'not_started' if preferred
          // For now, let's just default to not_started for unknown statuses
          departmentStats[departmentName].not_started++; 
      }
      departmentStats[departmentName].total++;
    });

    return Object.values(departmentStats);
  }, [tasks, isLoading]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, item) => sum + item.value, 0);
      return (
        <div className="bg-brand-card-bg border border-brand-border p-3 rounded-lg shadow-lg">
          <p className="text-brand-text-primary font-medium mb-2">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.dataKey.replace('_', ' ').toUpperCase()}: {item.value}
            </p>
          ))}
          <p className="text-brand-text-secondary text-sm border-t pt-1 mt-1">
            Total: {total} tasks
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="text-brand-text-primary">Task Status by Department</CardTitle>
          <p className="text-sm text-brand-text-secondary">
            Loading task breakdown...
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-brand-text-secondary">
            Loading data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="text-brand-text-primary">Task Status by Department</CardTitle>
        <p className="text-sm text-brand-text-secondary">
          Breakdown of task completion across all departments
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="department" 
                  stroke="#9ca3af"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                <Bar dataKey="in_progress" stackId="a" fill="#f59e0b" name="In Progress" />
                <Bar dataKey="not_started" stackId="a" fill="#94a3b8" name="Not Started" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-brand-text-secondary">
              No task data available for departments.
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">
              {chartData.reduce((sum, dept) => sum + dept.completed, 0)}
            </div>
            <div className="text-xs text-brand-text-secondary">Completed Tasks</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">
              {chartData.reduce((sum, dept) => sum + dept.in_progress, 0)}
            </div>
            <div className="text-xs text-brand-text-secondary">In Progress</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-400">
              {chartData.reduce((sum, dept) => sum + dept.not_started, 0)}
            </div>
            <div className="text-xs text-brand-text-secondary">Not Started</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
