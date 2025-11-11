
import React, { useState, useEffect } from 'react';
import { EventPlanTemplate } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Edit, Trash2, LayoutTemplate, Pencil, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Added Badge component import
import { format } from 'date-fns'; // Added date-fns format import

export default function EventTemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const data = await EventPlanTemplate.list();
        setTemplates(data || []); // Handle null/undefined data gracefully
      } catch (error) {
        console.error("Failed to load event plan templates:", error);
        setTemplates([]); // Ensure templates is an empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, []);

  if (isLoading) {
    return <div className="h-64 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Event Plan Templates</CardTitle>
        <Button><Plus className="w-4 h-4 mr-2"/>Create Template</Button>
      </CardHeader>
      <CardContent>
        {templates.length === 0 ? (
          <div className="text-center py-12 text-brand-text-secondary">
            <LayoutTemplate className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-text-primary mb-2">No Templates Found</h3>
            <p className="text-sm">Create your first event plan template to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Departments</TableHead> {/* Updated header */}
                <TableHead>Last Updated</TableHead> {/* New header */}
                <TableHead>Status</TableHead> {/* New header */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.template_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.event_type}</Badge> {/* Changed to Badge */}
                  </TableCell>
                  <TableCell>{template.departments?.length || 0}</TableCell> {/* Changed to show department count */}
                  <TableCell>
                    {template.last_updated ? format(new Date(template.last_updated), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={template.is_active ? 'success' : 'destructive'}> {/* New status cell with Badge */}
                      {template.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Pencil className="w-4 h-4" /></Button> {/* Changed icon and size */}
                      <Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button> {/* Changed icon and size */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
