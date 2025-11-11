
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Phone, Users, User, Search, Filter, Briefcase, Building } from 'lucide-react';
import { StaffProfile } from '@/api/entities';
import { User as UserEntity } from '@/api/entities';
import { useDebounce } from '@/components/hooks/useDebounce';
import { useToast } from '@/components/hooks/use-toast';

export default function StaffDirectory() {
    const [staff, setStaff] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ searchTerm: '', department: 'all', employment_type: 'all' });
    const { toast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [staffData, usersData] = await Promise.all([
                    StaffProfile.list('-start_date'),
                    UserEntity.list()
                ]);
                setStaff(staffData || []);
                setUsers(usersData || []);
            } catch (error) {
                console.error("Failed to load staff directory data:", error);
                toast({
                    title: "Error Loading Data",
                    description: "Could not fetch the staff directory. Please try again later.",
                    variant: "destructive",
                });
                setStaff([]);
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [toast]);

    const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

    const filteredAndEnrichedStaff = useMemo(() => {
        const userMap = new Map((users || []).map(user => [user.id, user]));
        
        let filtered = staff || [];

        if (debouncedSearchTerm) {
            filtered = filtered.filter(person => {
                const user = userMap.get(person.user_id);
                const name = user?.full_name || '';
                const email = user?.email || '';
                return name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                       email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                       (person.job_title && person.job_title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
            });
        }

        if (filters.department !== 'all') {
            filtered = filtered.filter(person => person.department === filters.department);
        }

        if (filters.employment_type !== 'all') {
            filtered = filtered.filter(person => person.employment_type === filters.employment_type);
        }

        return filtered.map(person => {
            const user = userMap.get(person.user_id);
            // CRITICAL FIX: Handle cases where the user might not exist for a staff profile
            return {
                ...person,
                full_name: user?.full_name || 'User Not Found',
                email: user?.email || 'N/A',
                profile_image_url: user?.profile_image_url,
                is_user_active: user?.is_active ?? false,
            };
        });
    }, [staff, users, debouncedSearchTerm, filters.department, filters.employment_type]);

    const departmentOptions = useMemo(() => {
        if (!staff) return [];
        return [...new Set(staff.map(s => s.department).filter(Boolean))];
    }, [staff]);

    const employmentTypeOptions = useMemo(() => {
        if (!staff) return [];
        return [...new Set(staff.map(s => s.employment_type).filter(Boolean))];
    }, [staff]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    if (isLoading) {
        return <div className="h-96 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Staff Directory</CardTitle>
                        <CardDescription>Browse and find staff members across the organization.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                         <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-secondary" />
                            <Input
                                placeholder="Search by name, email, title..."
                                value={filters.searchTerm}
                                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-4">
                    <Select value={filters.department} onValueChange={(v) => handleFilterChange('department', v)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                <SelectValue placeholder="All Departments" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departmentOptions.map(dep => <SelectItem key={dep} value={dep}>{dep.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={filters.employment_type} onValueChange={(v) => handleFilterChange('employment_type', v)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <div className="flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                <SelectValue placeholder="All Types" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Employment Types</SelectItem>
                            {employmentTypeOptions.map(type => <SelectItem key={type} value={type}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndEnrichedStaff.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={person.profile_image_url} alt={person.full_name} />
                                                <AvatarFallback>{person.full_name?.charAt(0) || '?'}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-brand-text-primary">{person.full_name}</div>
                                                <div className="text-xs text-brand-text-secondary">{person.employment_type?.replace(/_/g, ' ')}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-brand-text-secondary">{person.job_title}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{person.department?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <a href={`mailto:${person.email}`} className="flex items-center gap-1 text-xs text-brand-text-secondary hover:text-brand-red">
                                                <Mail className="w-3 h-3" /> {person.email}
                                            </a>
                                            {person.phone && (
                                                <span className="flex items-center gap-1 text-xs text-brand-text-secondary">
                                                    <Phone className="w-3 h-3" /> {person.phone}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={person.is_user_active ? 'default' : 'outline'} className={person.is_user_active ? 'bg-green-600' : 'border-red-500 text-red-500'}>
                                            {person.is_user_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredAndEnrichedStaff.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-brand-text-secondary">
                                        No staff members found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
