import React, { useState, useEffect } from 'react';
import { MediaContact } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function MediaContactsDB() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      const data = await MediaContact.list();
      setContacts(data);
      setIsLoading(false);
    };
    loadContacts();
  }, []);

  const filteredContacts = contacts.filter(c => 
    c.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.outlet_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-brand-text-primary">Media Contacts</h3>
        <div className="flex gap-2">
          <Input 
            placeholder="Search contacts..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead>Beat</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Region</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map(contact => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.contact_name}</TableCell>
              <TableCell>{contact.outlet_name}</TableCell>
              <TableCell><Badge variant="outline">{contact.beat.replace(/_/g, ' ')}</Badge></TableCell>
              <TableCell>{contact.contact_email}</TableCell>
              <TableCell>{contact.region}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}