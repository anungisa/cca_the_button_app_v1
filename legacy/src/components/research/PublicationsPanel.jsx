import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

const publications = [
  {
    title: 'Diversity in Curling: A 2024 National Study',
    author: 'Dr. Jane Smith, University of Toronto',
    date: '2024-05-15',
    url: '#'
  },
  {
    title: 'The Economic Impact of Youth Curling Programs',
    author: 'Dr. John Doe, Carleton University',
    date: '2023-11-20',
    url: '#'
  },
  {
    title: 'Trends in Club Membership and Retention',
    author: 'Curling Canada Research Division',
    date: '2023-09-01',
    url: '#'
  }
];

export default function PublicationsPanel() {
  return (
    <Card className="bg-brand-card-bg border-brand-border h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-brand-red" />
          <span>DEI & Research Publications</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-brand-charcoal/50 rounded-md">
              <div>
                <h4 className="font-semibold text-brand-text-primary">{pub.title}</h4>
                <p className="text-sm text-brand-text-secondary">{pub.author} - {pub.date}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2 sm:mt-0" onClick={() => window.open(pub.url, '_blank')}>
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}