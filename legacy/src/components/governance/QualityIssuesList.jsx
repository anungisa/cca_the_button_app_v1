import React, { useState } from 'react';
import { DataQualityIssue } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { CheckCircle, AlertTriangle, XCircle, Eye } from 'lucide-react';

export default function QualityIssuesList({ issues, onRefresh }) {
  const { toast } = useToast();
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const filteredIssues = selectedSeverity === 'all'
    ? issues
    : issues.filter(i => i.severity === selectedSeverity);

  const handleResolve = async (issueId) => {
    try {
      await DataQualityIssue.update(issueId, {
        status: 'resolved',
        resolved_date: new Date().toISOString()
      });
      toast({
        title: "Issue Resolved",
        description: "Data quality issue marked as resolved."
      });
      onRefresh();
    } catch (error) {
      console.error('Error resolving issue:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resolve issue."
      });
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Open Data Quality Issues</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedSeverity === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSeverity('all')}
            >
              All ({issues.length})
            </Button>
            <Button
              variant={selectedSeverity === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSeverity('critical')}
              className={selectedSeverity === 'critical' ? 'bg-red-500' : ''}
            >
              Critical
            </Button>
            <Button
              variant={selectedSeverity === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSeverity('high')}
              className={selectedSeverity === 'high' ? 'bg-orange-500' : ''}
            >
              High
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div key={issue.id} className="p-4 bg-brand-charcoal/30 rounded-lg border border-brand-border">
                <div className="flex items-start gap-3">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-brand-text-primary">{issue.rule_name}</h4>
                        <p className="text-sm text-brand-text-secondary">{issue.entity_type} → {issue.field_name}</p>
                      </div>
                      <Badge className={
                        issue.severity === 'critical' ? 'bg-red-500' :
                        issue.severity === 'high' ? 'bg-orange-500' :
                        issue.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }>
                        {issue.severity}
                      </Badge>
                    </div>

                    <p className="text-sm text-brand-text-secondary mb-3">{issue.issue_description}</p>

                    {issue.current_value && (
                      <div className="text-xs text-brand-text-secondary mb-3">
                        <p><strong>Current Value:</strong> {issue.current_value}</p>
                        {issue.expected_value && <p><strong>Expected:</strong> {issue.expected_value}</p>}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleResolve(issue.id)} className="bg-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Record
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <p className="text-brand-text-secondary">
                {selectedSeverity === 'all' 
                  ? 'No open data quality issues. Great work!' 
                  : `No ${selectedSeverity} severity issues.`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}