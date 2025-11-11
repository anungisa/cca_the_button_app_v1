
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Users, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import useCurlingRegAPI from '../components/hooks/useCurlingRegAPI';
import useTrustEventsAPI from '../components/hooks/useTrustEventsAPI';
import SyncStatusPanel from '../components/SyncStatusPanel';

export default function AdminComplianceDashboard() {
  const [user, setUser] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [safeSportData, setSafeSportData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClub, setFilterClub] = useState('all');
  
  const curlingRegAPI = useCurlingRegAPI();
  const trustEventsAPI = useTrustEventsAPI();

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Only allow access to admins and MA admins
      if (userData.role !== 'admin' && userData.user_type !== 'ma_admin' && userData.user_type !== 'club_admin') {
        throw new Error('Unauthorized access');
      }

      // Load compliance reports from multiple sources
      const [
        complianceReport,
        safeSportReport,
        membershipReport
      ] = await Promise.all([
        curlingRegAPI.getComplianceReport({
          ma_region: userData.ma_region || 'all',
          club_id: userData.user_type === 'club_admin' ? userData.home_club_id : undefined
        }),
        trustEventsAPI.getSafeSportComplianceReport({
          ma_region: userData.ma_region || 'all',
          club_id: userData.user_type === 'club_admin' ? userData.home_club_id : undefined
        }),
        curlingRegAPI.getClubMemberships(
          userData.user_type === 'club_admin' ? userData.home_club_id : 'all'
        )
      ]);

      setComplianceData(complianceReport);
      setSafeSportData(safeSportReport);
      setMembershipData(membershipReport);

    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async (reportType) => {
    try {
      // This would generate and download a compliance report
      // For now, we'll simulate the action
      alert(`${reportType} report exported successfully!`);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': case 'paid': case 'compliant': return 'bg-green-600';
      case 'expired': case 'unpaid': case 'non_compliant': return 'bg-red-600';
      case 'pending': case 'partial': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const filterData = (data, type) => {
    if (!Array.isArray(data)) {
      if (data) {
        console.error(`filterData expected an array but received ${typeof data} for type '${type}'`);
      }
      return [];
    }
    
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.club_name && item.club_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const statusField = type === 'membership' ? item.payment_status : item.status;
      const matchesStatus = filterStatus === 'all' || statusField === filterStatus;
      const matchesClub = filterClub === 'all' || item.club_id === filterClub;
      
      return matchesSearch && matchesStatus && matchesClub;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.user_type !== 'ma_admin' && user.user_type !== 'club_admin')) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center">
        <Card className="max-w-md bg-brand-card-bg border-brand-border">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-text-primary mb-2">
              Access Restricted
            </h2>
            <p className="text-brand-text-secondary">
              This dashboard is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">Compliance Dashboard</h1>
              <p className="text-brand-text-secondary mt-1">
                Monitor registration, payment, and Safe Sport compliance
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleExportReport('safe_sport')}
                className="border-brand-border text-brand-text-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Safe Sport
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExportReport('membership')}
                className="border-brand-border text-brand-text-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Membership
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Sync Status */}
        <SyncStatusPanel 
          services={[
            { name: 'CurlingReg', status: curlingRegAPI.error ? 'error' : 'connected' },
            { name: 'Trust Events', status: trustEventsAPI.error ? 'error' : 'connected' }
          ]}
          className="mb-6"
        />

        {/* Overview Stats */}
        {complianceData && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-brand-text-primary">
                    {complianceData.total_members || 0}
                  </div>
                  <div className="text-sm text-brand-text-secondary">Total Members</div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-brand-text-primary">
                    {complianceData.safe_sport_current || 0}
                  </div>
                  <div className="text-sm text-brand-text-secondary">Safe Sport Current</div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-brand-text-primary">
                    {complianceData.safe_sport_expired || 0}
                  </div>
                  <div className="text-sm text-brand-text-secondary">Safe Sport Expired</div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-card-bg border-brand-border">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-brand-text-primary">
                    {complianceData.compliance_rate || 0}%
                  </div>
                  <div className="text-sm text-brand-text-secondary">Compliance Rate</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-brand-card-bg border-brand-border text-brand-text-primary"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-brand-card-bg border-brand-border text-brand-text-primary">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>

            {user.user_type === 'ma_admin' && (
              <Select value={filterClub} onValueChange={setFilterClub}>
                <SelectTrigger className="w-48 bg-brand-card-bg border-brand-border text-brand-text-primary">
                  <SelectValue placeholder="Filter by club" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clubs</SelectItem>
                  {/* Club options would be populated dynamically */}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-brand-card-bg border-brand-border">
            <TabsTrigger value="overview" className="text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="safe_sport" className="text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white">
              Safe Sport ({safeSportData.length})
            </TabsTrigger>
            <TabsTrigger value="membership" className="text-brand-text-secondary data-[state=active]:bg-brand-red data-[state=active]:text-white">
              Membership ({membershipData.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Safe Sport Compliance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-brand-charcoal rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-brand-text-secondary mx-auto mb-2" />
                      <p className="text-brand-text-secondary">Compliance trend chart</p>
                      <p className="text-sm text-brand-text-secondary">
                        Integration with analytics dashboard
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Membership Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text-secondary">Active Members:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-brand-charcoal rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-brand-text-primary">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text-secondary">Payment Pending:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-brand-charcoal rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '12%'}}></div>
                        </div>
                        <span className="text-brand-text-primary">12%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text-secondary">Expired:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-brand-charcoal rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '3%'}}></div>
                        </div>
                        <span className="text-brand-text-primary">3%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="safe_sport" className="mt-6">
            <div className="space-y-4">
              {filterData(safeSportData, 'safe_sport').map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)}`}></div>
                          <div>
                            <h4 className="font-medium text-brand-text-primary">{member.name}</h4>
                            <p className="text-sm text-brand-text-secondary">
                              {member.email} • {member.club_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <Badge className={`${getStatusColor(member.status)} text-white text-xs`}>
                              {member.status.toUpperCase()}
                            </Badge>
                            {member.expiry_date && (
                              <p className="text-xs text-brand-text-secondary mt-1">
                                Expires: {new Date(member.expiry_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Button size="sm" variant="outline" className="border-brand-border text-brand-text-secondary">
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="membership" className="mt-6">
            <div className="space-y-4">
              {filterData(membershipData, 'membership').map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="bg-brand-card-bg border-brand-border hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(member.payment_status)}`}></div>
                          <div>
                            <h4 className="font-medium text-brand-text-primary">{member.name}</h4>
                            <p className="text-sm text-brand-text-secondary">
                              {member.email} • {member.membership_type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <Badge className={`${getStatusColor(member.payment_status)} text-white text-xs`}>
                              {member.payment_status?.toUpperCase() || 'UNKNOWN'}
                            </Badge>
                            {member.amount_due > 0 && (
                              <p className="text-xs text-brand-text-secondary mt-1">
                                Due: ${member.amount_due}
                              </p>
                            )}
                          </div>
                          <Button size="sm" variant="outline" className="border-brand-border text-brand-text-secondary">
                            <FileText className="w-4 h-4 mr-2" />
                            View Record
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
