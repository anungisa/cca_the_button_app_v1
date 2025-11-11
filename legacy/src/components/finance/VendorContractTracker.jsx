import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '../ui/StandardizedComponents';

export default function VendorContractTracker({ contracts }) {
  if (!contracts || contracts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendor Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-text-secondary">No vendor contracts to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Contract Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.vendor_name}</TableCell>
                <TableCell>{contract.contract_title}</TableCell>
                <TableCell><StatusBadge status={contract.status} /></TableCell>
                <TableCell>{contract.end_date}</TableCell>
                <TableCell>${contract.contract_value.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}