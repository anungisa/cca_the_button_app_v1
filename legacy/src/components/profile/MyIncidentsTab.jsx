
import React, { useState, useEffect } from 'react';
import { Incident } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const statusColors = {
  new: 'bg-blue-600',
  open: 'bg-green-600',
  in_progress: 'bg-yellow-600 text-yellow-950',
  on_hold: 'bg-gray-500',
  escalated: 'bg-orange-600',
  resolved: 'bg-purple-600',
  closed: 'bg-gray-700',
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export default function MyIncidentsTab({ user }) {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      loadIncidents();
    }
  }, [user]);

  const loadIncidents = async () => {
    setIsLoading(true);
    try {
      const userIncidents = await Incident.filter({ created_by: user.email }, '-updated_date', 10);
      setIncidents(userIncidents || []);
    } catch (error) {
      console.error('Error loading user incidents:', error);
      setIncidents([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-brand-card-bg border-brand-border mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-text-primary">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            My Inquiries &amp; Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center p-8 text-brand-text-secondary">Loading your inquiries...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-card-bg border-brand-border mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-text-primary">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          My Inquiries &amp; Incidents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {incidents.length > 0 ? (
          <ul className="space-y-3">
            {incidents.map((incidentItem) => (
              <li key={incidentItem.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-brand-charcoal rounded-md gap-2">
                <div>
                  <p className="font-semibold text-brand-text-primary">{incidentItem.title}</p>
                  <p className="text-sm text-brand-text-secondary">
                    Last Updated: {formatDate(incidentItem.updated_date)}
                  </p>
                </div>
                <Badge className={`${statusColors[incidentItem.status] || 'bg-gray-500'} text-white capitalize`}>
                  {incidentItem.status.replace('_', ' ')}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-brand-text-secondary py-8">
            <p>You have not submitted any inquiries or incidents.</p>
            <p className="text-sm mt-2">
              If you need assistance, please visit the{' '}
              <Button variant="link" className="p-0 h-auto text-brand-red" asChild>
                <Link to={createPageUrl('HelpCenter')}>Help Center</Link>
              </Button>
              .
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
