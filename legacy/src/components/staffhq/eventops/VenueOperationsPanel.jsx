import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Snowflake, Truck, Shield, Wrench, Map, Users } from 'lucide-react';

export default function VenueOperationsPanel() {
  const venueSystems = [
    { name: 'Ice Plant 1', status: 'optimal', temp: '-5.2°C', humidity: '40%' },
    { name: 'Ice Plant 2', status: 'optimal', temp: '-5.1°C', humidity: '41%' },
    { name: 'HVAC - Arena Bowl', status: 'active', temp: '16.5°C', humidity: '45%' },
    { name: 'HVAC - Concourse', status: 'active', temp: '20.0°C', humidity: '50%' },
  ];

  const logistics = [
    { task: 'Morning Deliveries', status: 'complete', time: '08:00 EST' },
    { task: 'Team Transportation', status: 'on_schedule', details: 'Bus #3 en route' },
    { task: 'Broadcast Equipment Setup', status: 'complete', details: 'All cameras operational' },
  ];
  
  const StatusBadge = ({ status }) => {
    const config = {
      optimal: { color: 'bg-green-600' },
      active: { color: 'bg-blue-600' },
      on_schedule: { color: 'bg-green-600' },
      complete: { color: 'bg-gray-600' },
    };
    const { color } = config[status] || { color: 'bg-gray-500' };
    return <Badge className={`${color} text-white`}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-6">
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader><CardTitle className="flex items-center gap-2"><Map className="w-6 h-6 text-brand-red" />Venue Operations</CardTitle></CardHeader>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader><CardTitle className="flex items-center gap-2"><Snowflake className="w-5 h-5"/>Ice & Climate Control</CardTitle></CardHeader>
                <CardContent>
                    {venueSystems.map(system => (
                        <div key={system.name} className="flex items-center justify-between p-3 mb-2 bg-brand-charcoal rounded-lg">
                            <p className="font-medium">{system.name}</p>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-brand-text-secondary">{system.temp} / {system.humidity}</span>
                                <StatusBadge status={system.status} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5"/>Logistics & Transport</CardTitle></CardHeader>
                <CardContent>
                    {logistics.map(item => (
                         <div key={item.task} className="flex items-center justify-between p-3 mb-2 bg-brand-charcoal rounded-lg">
                            <div>
                                <p className="font-medium">{item.task}</p>
                                {item.details && <p className="text-sm text-brand-text-secondary">{item.details}</p>}
                            </div>
                             <StatusBadge status={item.status} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader><CardTitle>Operational Teams</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2"><Shield className="w-6 h-6"/>Security Team</Button>
                <Button variant="outline" className="h-20 flex-col gap-2"><Wrench className="w-6 h-6"/>Facilities Mgmt</Button>
                <Button variant="outline" className="h-20 flex-col gap-2"><Users className="w-6 h-6"/>Guest Services</Button>
                <Button variant="outline" className="h-20 flex-col gap-2"><Thermometer className="w-6 h-6"/>Ice Technicians</Button>
            </CardContent>
        </Card>
    </div>
  );
}