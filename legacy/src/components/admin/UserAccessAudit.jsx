import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Search } from 'lucide-react';
import { User as UserEntity } from '@/api/entities';
import { timeSince } from '../utils/timeSince'; // We'll create this utility

const UserAccessAudit = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const userRoles = ['admin', 'staff', 'ma_admin', 'coach', 'devops', 'curler', 'fan'];

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await UserEntity.list('-created_date', 500); // Get latest 500 users
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-600',
      devops: 'bg-indigo-600',
      staff: 'bg-blue-600',
      ma_admin: 'bg-purple-600',
      coach: 'bg-green-600',
    };
    return (
      <Badge className={`${colors[role] || 'bg-gray-500'} text-white capitalize`}>{role}</Badge>
    );
  };
  
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" /> User Access Audit
        </CardTitle>
        <p className="text-brand-text-secondary">Review user roles, permissions, and last activity.</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <Input 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-brand-charcoal"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] bg-brand-charcoal">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {userRoles.map(role => <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div className="border border-brand-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center">Loading users...</TableCell></TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium text-brand-text-primary">{user.full_name}</div>
                      <div className="text-sm text-brand-text-secondary">{user.email}</div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{user.user_type}</Badge></TableCell>
                    <TableCell>{user.last_login ? timeSince(user.last_login) : 'Never'}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'default' : 'destructive'} className={user.is_active ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center">No users found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAccessAudit;