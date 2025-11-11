import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { LoyaltyProgram } from '@/api/entities';
import { PointTransaction } from '@/api/entities';
import { Donation } from '@/api/entities';
import { ActivityFeed } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Users, TrendingUp, DollarSign, Activity, Mail, Phone, MapPin, Calendar, Trophy, Star, Heart } from 'lucide-react';
import { format } from 'date-fns';
import C360Dashboard from '../components/c360/C360Dashboard';
import EngagementTimeline from '../components/c360/EngagementTimeline';

export default function Constituent360() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      // Search users by name or email
      const users = await User.list('-created_date', 50);
      const filtered = users.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setIsLoading(true);
    
    try {
      // Load comprehensive user data
      const [loyaltyResponse, transactionResponse, donationResponse, activityResponse] = await Promise.allSettled([
        LoyaltyProgram.filter({ user_id: user.id }),
        PointTransaction.filter({ user_id: user.id }, '-created_date', 20),
        Donation.filter({ donor_email: user.email }, '-created_date', 10),
        ActivityFeed.filter({ user_id: user.id }, '-created_date', 15)
      ]);

      setLoyaltyData(loyaltyResponse.status === 'fulfilled' ? loyaltyResponse.value[0] : null);
      setTransactions(transactionResponse.status === 'fulfilled' ? transactionResponse.value : []);
      setDonations(donationResponse.status === 'fulfilled' ? donationResponse.value : []);
      setActivities(activityResponse.status === 'fulfilled' ? activityResponse.value : []);
      
    } catch (error) {
      console.error('Failed to load user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  const getUserTypeDisplay = (userType) => {
    return userType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Fan';
  };

  return (
    <div className="min-h-screen bg-brand-charcoal pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">Constituent 360</h1>
              <p className="text-brand-text-secondary">Unified view of our community members, their engagement, and journey</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-brand-card-bg border-brand-border text-brand-text-primary"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="bg-brand-red hover:bg-red-700">
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card className="bg-brand-card-bg border-brand-border mb-6">
              <CardHeader>
                <CardTitle className="text-brand-text-primary">Search Results ({searchResults.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 hover:bg-brand-charcoal rounded-lg cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.profile_image_url} />
                          <AvatarFallback className="bg-brand-red text-white">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-brand-text-primary">{user.full_name || 'Unknown User'}</p>
                          <p className="text-sm text-brand-text-secondary">{user.email}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {getUserTypeDisplay(user.user_type)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Profile View */}
        {selectedUser && (
          <div className="space-y-6">
            {/* User Header */}
            <Card className="bg-brand-card-bg border-brand-border">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={selectedUser.profile_image_url} />
                      <AvatarFallback className="bg-brand-red text-white text-2xl">
                        {selectedUser.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-brand-text-primary">{selectedUser.full_name || 'Unknown User'}</h2>
                      <p className="text-brand-text-secondary">{selectedUser.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {getUserTypeDisplay(selectedUser.user_type)}
                        </Badge>
                        {selectedUser.role && selectedUser.role !== selectedUser.user_type && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {selectedUser.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    <div className="bg-brand-charcoal p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-brand-text-primary">Loyalty</span>
                      </div>
                      <p className="text-xl font-bold text-brand-text-primary">{loyaltyData?.curl_points || 0}</p>
                      <p className="text-xs text-brand-text-secondary">CurlPoints</p>
                    </div>
                    <div className="bg-brand-charcoal p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-brand-text-primary">Donations</span>
                      </div>
                      <p className="text-xl font-bold text-brand-text-primary">
                        {formatCurrency(donations.reduce((sum, d) => sum + (d.amount || 0), 0))}
                      </p>
                      <p className="text-xs text-brand-text-secondary">{donations.length} donations</p>
                    </div>
                    <div className="bg-brand-charcoal p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-brand-text-primary">Activity</span>
                      </div>
                      <p className="text-xl font-bold text-brand-text-primary">{activities.length}</p>
                      <p className="text-xs text-brand-text-secondary">Recent actions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <C360Dashboard 
                  user={selectedUser}
                  loyaltyData={loyaltyData}
                  transactions={transactions}
                  donations={donations}
                  activities={activities}
                />
              </TabsContent>
              
              <TabsContent value="engagement" className="space-y-6">
                <EngagementTimeline 
                  user={selectedUser}
                  activities={activities}
                  transactions={transactions}
                />
              </TabsContent>
              
              <TabsContent value="transactions" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader>
                      <CardTitle className="text-brand-text-primary">Point Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {transactions.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {transactions.map(transaction => (
                            <div key={transaction.id} className="flex justify-between items-center p-2 bg-brand-charcoal rounded">
                              <div>
                                <p className="text-sm font-medium text-brand-text-primary">{transaction.description}</p>
                                <p className="text-xs text-brand-text-secondary">
                                  {format(new Date(transaction.created_date), 'MMM d, yyyy')}
                                </p>
                              </div>
                              <span className="text-sm font-bold text-brand-text-primary">
                                +{transaction.points_amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-brand-text-secondary py-4">No transactions found</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-brand-card-bg border-brand-border">
                    <CardHeader>
                      <CardTitle className="text-brand-text-primary">Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {donations.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {donations.map(donation => (
                            <div key={donation.id} className="flex justify-between items-center p-2 bg-brand-charcoal rounded">
                              <div>
                                <p className="text-sm font-medium text-brand-text-primary">{donation.category}</p>
                                <p className="text-xs text-brand-text-secondary">
                                  {format(new Date(donation.created_date), 'MMM d, yyyy')}
                                </p>
                              </div>
                              <span className="text-sm font-bold text-green-400">
                                {formatCurrency(donation.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-brand-text-secondary py-4">No donations found</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-brand-card-bg border-brand-border">
                  <CardHeader>
                    <CardTitle className="text-brand-text-primary">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-brand-text-secondary">Full Name</label>
                          <p className="text-brand-text-primary">{selectedUser.full_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-brand-text-secondary">Email</label>
                          <p className="text-brand-text-primary">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-brand-text-secondary">Phone</label>
                          <p className="text-brand-text-primary">{selectedUser.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-brand-text-secondary">Home Club</label>
                          <p className="text-brand-text-primary">{selectedUser.home_club_name || 'Not affiliated'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-brand-text-secondary">User Type</label>
                          <p className="text-brand-text-primary">{getUserTypeDisplay(selectedUser.user_type)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-brand-text-secondary">MA Region</label>
                          <p className="text-brand-text-primary">{selectedUser.ma_region || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-brand-text-secondary">Skill Level</label>
                          <p className="text-brand-text-primary">{selectedUser.skill_level || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-brand-text-secondary">Member Since</label>
                          <p className="text-brand-text-primary">
                            {selectedUser.created_date ? format(new Date(selectedUser.created_date), 'MMMM d, yyyy') : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!selectedUser && searchResults.length === 0 && searchTerm && !isSearching && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">No Results Found</h3>
            <p className="text-brand-text-secondary">Try searching with a different name or email address.</p>
          </div>
        )}

        {!selectedUser && searchResults.length === 0 && !searchTerm && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Search for a Community Member</h3>
            <p className="text-brand-text-secondary">Enter a name or email address to view their complete profile and engagement history.</p>
          </div>
        )}
      </div>
    </div>
  );
}