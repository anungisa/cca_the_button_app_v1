import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Clock, Award, Plus, Search, Filter } from 'lucide-react';

const mockTrainingPaths = [
  {
    id: 'respect_in_sport',
    name: 'Respect in Sport',
    type: 'mandatory',
    target_roles: ['coach', 'official', 'volunteer'],
    duration: 90,
    expiry_months: 36,
    completion_rate: 87,
    enrolled: 1234,
    completed: 1074,
    status: 'active'
  },
  {
    id: 'nccp_coaching',
    name: 'NCCP Coaching Certification',
    type: 'role_specific',
    target_roles: ['coach'],
    duration: 240,
    expiry_months: 60,
    completion_rate: 78,
    enrolled: 567,
    completed: 442,
    status: 'active'
  },
  {
    id: 'concussion_awareness',
    name: 'Concussion Awareness',
    type: 'mandatory',
    target_roles: ['coach', 'staff', 'volunteer'],
    duration: 45,
    expiry_months: 24,
    completion_rate: 92,
    enrolled: 2145,
    completed: 1973,
    status: 'active'
  },
  {
    id: 'mental_health_first_aid',
    name: 'Mental Health First Aid',
    type: 'optional',
    target_roles: ['coach', 'volunteer', 'staff'],
    duration: 180,
    expiry_months: 36,
    completion_rate: 64,
    enrolled: 324,
    completed: 207,
    status: 'active'
  }
];

export default function EducationPathwaysManager() {
  const [trainingPaths, setTrainingPaths] = useState(mockTrainingPaths);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedPath, setSelectedPath] = useState(null);

  const filteredPaths = trainingPaths.filter(path => {
    const matchesSearch = path.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || path.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'mandatory': return 'bg-red-100 text-red-800';
      case 'role_specific': return 'bg-blue-100 text-blue-800';
      case 'optional': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionColor = (rate) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary">Education Pathways Manager</h3>
          <p className="text-brand-text-secondary">Create and manage certification tracks for all roles</p>
        </div>
        <Button className="bg-brand-red hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Pathway
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
          <Input
            placeholder="Search training pathways..."
            className="pl-9 bg-brand-card-bg border-brand-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-48 bg-brand-card-bg border-brand-border">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="mandatory">Mandatory</SelectItem>
            <SelectItem value="role_specific">Role Specific</SelectItem>
            <SelectItem value="optional">Optional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Training Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPaths.map((path) => (
          <Card key={path.id} className="bg-brand-card-bg border-brand-border hover:border-brand-red transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{path.name}</CardTitle>
                <Badge className={getTypeColor(path.type)}>
                  {path.type.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Completion Stats */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-secondary">Completion Rate</span>
                  <span className={`font-semibold ${getCompletionColor(path.completion_rate)}`}>
                    {path.completion_rate}%
                  </span>
                </div>
                <div className="w-full bg-brand-charcoal rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      path.completion_rate >= 90 ? 'bg-green-400' :
                      path.completion_rate >= 80 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${path.completion_rate}%` }}
                  ></div>
                </div>
              </div>

              {/* Enrollment Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-brand-text-secondary">Enrolled</p>
                  <p className="font-semibold text-brand-text-primary">{path.enrolled.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-brand-text-secondary">Completed</p>
                  <p className="font-semibold text-brand-text-primary">{path.completed.toLocaleString()}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-text-secondary" />
                  <span className="text-brand-text-secondary">{path.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-text-secondary" />
                  <span className="text-brand-text-secondary">Valid for {path.expiry_months} months</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-text-secondary" />
                  <span className="text-brand-text-secondary">{path.target_roles.join(', ')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Edit Pathway
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Pathways</p>
                <p className="text-2xl font-bold text-brand-text-primary">{trainingPaths.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Total Enrolled</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {trainingPaths.reduce((sum, path) => sum + path.enrolled, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Avg. Completion</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {Math.round(trainingPaths.reduce((sum, path) => sum + path.completion_rate, 0) / trainingPaths.length)}%
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-card-bg border-brand-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-secondary">Mandatory Paths</p>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {trainingPaths.filter(p => p.type === 'mandatory').length}
                </p>
              </div>
              <Filter className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}