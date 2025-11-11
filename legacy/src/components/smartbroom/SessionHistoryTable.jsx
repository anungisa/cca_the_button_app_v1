
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockHistory = [
    { id: 1, date: '2024-07-21', duration: '25 mins', score: 88 },
    { id: 2, date: '2024-07-19', duration: '30 mins', score: 85 },
    { id: 3, date: '2024-07-18', duration: '20 mins', score: 92 },
]

export default function SessionHistoryTable({ userId }) {
  // In a real implementation, you would fetch session history for the user.
  // For now, this is a placeholder with mock data.

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Session History
        </CardTitle>
      </CardHeader>
      <CardContent>
         <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Overall Score</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHistory.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>{session.duration}</TableCell>
                  <TableCell>{session.score}</TableCell>
                  <TableCell className="text-right">
                    <button className="text-brand-red text-sm font-medium">View</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </CardContent>
    </Card>
  );
}
