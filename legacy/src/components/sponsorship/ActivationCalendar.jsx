import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { SponsorContract } from '@/api/entities';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ActivationCalendar() {
  const [activations, setActivations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchActivations = async () => {
      try {
        const contracts = await SponsorContract.filter({ status: 'active' });
        const allDeliverables = (contracts || []).flatMap(contract => 
          (contract.deliverables || []).map(d => ({
            ...d,
            sponsor_name: contract.sponsor_name,
            due_date: new Date(d.due_date)
          }))
        ).filter(d => d.due_date);
        setActivations(allDeliverables);
      } catch (error) {
        console.error("Failed to load activations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivations();
  }, []);

  const renderDayContent = (day) => {
    const dayActivations = activations.filter(a => format(a.due_date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    if (dayActivations.length === 0) return null;

    return (
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-red"></div>
    );
  };

  const selectedDayActivations = activations.filter(a => format(a.due_date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

  if (isLoading) {
    return <div className="text-center py-8">Loading activation calendar...</div>;
  }
  
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Sponsor Activation Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border border-brand-border"
              components={{
                DayContent: ({ date }) => renderDayContent(date)
              }}
            />
          </div>
          <div>
            <h4 className="font-semibold text-brand-text-primary mb-3">
              Activations for {format(date, 'MMMM d, yyyy')}
            </h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDayActivations.length > 0 ? (
                selectedDayActivations.map(activation => (
                  <div key={activation.id} className="p-3 bg-brand-charcoal rounded-md">
                    <p className="font-medium text-brand-text-primary">{activation.name}</p>
                    <p className="text-sm text-brand-text-secondary">{activation.sponsor_name}</p>
                    <Badge variant="outline" className={`mt-2 text-xs ${activation.status === 'Completed' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                      {activation.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-brand-text-secondary text-center py-8">No activations due.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}