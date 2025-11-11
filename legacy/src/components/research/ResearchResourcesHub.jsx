import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResearchResource } from '@/api/entities';
import { Database, Plus, Eye, Download, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function ResearchResourcesHub() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const sampleResources = [
    { id: 'rr_001', title: 'Data Use Agreement Template', category: 'data_use_forms', resource_type: 'template', last_updated: '2024-01-20T10:00:00Z', is_public: false, download_count: 45 },
    { id: 'rr_002', title: 'Ethics Board Submission Guide', category: 'ethics_templates', resource_type: 'document', last_updated: '2023-11-15T14:30:00Z', is_public: true, download_count: 128 },
    { id: 'rr_003', title: 'Anonymous Survey Best Practices', category: 'training_materials', resource_type: 'presentation', last_updated: '2024-02-10T11:00:00Z', is_public: true, download_count: 98 },
  ];

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const data = await ResearchResource.list();
      setResources(data.length > 0 ? data : sampleResources);
    } catch (error) {
      console.error('Failed to load research resources:', error);
      setResources(sampleResources);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter(res => {
      const searchMatch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = categoryFilter === 'all' || res.category === categoryFilter;
      return searchMatch && categoryMatch;
  });

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-brand-red"/>Internal Research Resources</CardTitle>
        <Button><Plus className="w-4 h-4 mr-2"/>New Resource</Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input placeholder="Search resources..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-56"><SelectValue placeholder="Filter by category..."/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="data_use_forms">Data Use Forms</SelectItem>
                    <SelectItem value="ethics_templates">Ethics Templates</SelectItem>
                    <SelectItem value="training_materials">Training Materials</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? ([...Array(3)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan="6"><div className="h-8 bg-brand-charcoal/50 rounded animate-pulse" /></TableCell></TableRow>
            ))) : filteredResources.map(res => (
              <TableRow key={res.id}>
                <TableCell className="font-medium text-brand-text-primary">{res.title}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{(res.category || '').replace(/_/g, ' ')}</Badge></TableCell>
                <TableCell className="capitalize">{res.resource_type}</TableCell>
                <TableCell>{res.last_updated ? format(new Date(res.last_updated), 'MMM d, yyyy') : 'N/A'}</TableCell>
                <TableCell>{res.download_count}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}