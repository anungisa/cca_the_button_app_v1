import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users, Search, Mail, Edit, Trash2, UserPlus, Loader2 } from 'lucide-react';
import UserEditModal from './UserEditModal';
import { useToast } from "@/components/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const userData = await User.list('-created_date', 100); // Fetch up to 100 users
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.full_name?.toLowerCase().includes(lowercasedTerm) ||
      user.email?.toLowerCase().includes(lowercasedTerm) ||
      user.user_type?.toLowerCase().includes(lowercasedTerm) ||
      user.role?.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleInviteUser = () => {
    setSelectedUser(null); // No user selected means it's an invitation
    setIsModalOpen(true);
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user? They will no longer be able to log in.')) {
      try {
        await User.update(userId, { is_active: false });
        toast({
          title: "User Deactivated",
          description: "The user has been successfully deactivated.",
        });
        loadUsers();
      } catch (error) {
        console.error('Failed to deactivate user:', error);
        toast({
          variant: "destructive",
          title: "Deactivation Failed",
          description: "Could not deactivate the user. Please try again.",
        });
      }
    }
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    loadUsers(); // Refresh user list after save
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">Inactive</Badge>
    );
  };

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-text-primary">All Users</h2>
            <Button onClick={handleInviteUser} className="bg-brand-red hover:bg-red-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite User
            </Button>
        </div>
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-brand-charcoal border-brand-border text-brand-text-primary"
                />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-28" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>System Role</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium text-brand-text-primary">{user.full_name || 'N/A'}</div>
                          <div className="text-sm text-brand-text-secondary">{user.email}</div>
                        </TableCell>
                        <TableCell className="text-brand-text-secondary capitalize">{user.role}</TableCell>
                        <TableCell className="text-brand-text-secondary capitalize">{user.user_type?.replace(/_/g, ' ')}</TableCell>
                        <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                        <TableCell className="text-brand-text-secondary">
                          {user.created_date ? format(new Date(user.created_date), 'MMM d, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.is_active && (
                            <Button variant="ghost" size="icon" onClick={() => handleDeactivateUser(user.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-brand-text-secondary">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {isModalOpen && (
          <UserEditModal
            user={selectedUser}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleModalSave}
          />
        )}
    </div>
  );
}