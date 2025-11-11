import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Award, Shield, Heart, Handshake, AlertTriangle, FileText } from 'lucide-react';
import { LoyaltyProgram } from '@/api/entities';
import { Donation } from '@/api/entities';
import { Volunteer } from '@/api/entities';
import { Incident } from '@/api/entities';
import EngagementTimeline from './EngagementTimeline';

const C360Dashboard = ({ user }) => {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const [loyalty, donationData, volunteerData, incidentData] = await Promise.all([
          LoyaltyProgram.filter({ user_id: user.id }),
          Donation.filter({ donor_email: user.email }),
          Volunteer.filter({ email: user.email }),
          Incident.filter({ related_user_id: user.id })
        ]);

        setLoyaltyData(loyalty[0] || null);
        setDonations(donationData);
        setVolunteerHistory(volunteerData);
        setIncidents(incidentData);

      } catch (error) {
        console.error('Failed to load C360 data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  if (isLoading) {
    return <p>Loading unified profile...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <CardTitle className="text-2xl">{user.full_name}</CardTitle>
              <p className="text-brand-text-secondary">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{user.user_type || 'User'}</Badge>
                {user.home_club_name && <Badge variant="outline">{user.home_club_name}</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Tier</CardTitle>
            <Award className="w-4 h-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {loyaltyData?.tier?.replace('_', ' ') || 'N/A'}
            </div>
            <p className="text-xs text-brand-text-secondary">
              {loyaltyData?.curl_points || 0} CurlPoints
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Safe Sport</CardTitle>
            <Shield className="w-4 h-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${user.safe_sport_status === 'current' ? 'text-green-400' : 'text-red-400'}`}>
              {user.safe_sport_status?.replace('_', ' ') || 'N/A'}
            </div>
            <p className="text-xs text-brand-text-secondary">
              Expiry: {user.safe_sport_expiry || 'N/A'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <Heart className="w-4 h-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalDonated.toLocaleString()}
            </div>
            <p className="text-xs text-brand-text-secondary">
              From {donations.length} donations
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
            <AlertTriangle className="w-4 h-4 text-brand-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed').length}
            </div>
            <p className="text-xs text-brand-text-secondary">
              {incidents.length} total cases
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Engagement Timeline */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Engagement Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <EngagementTimeline userId={user.id} />
        </CardContent>
      </Card>
      
      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Volunteer History</CardTitle>
          </CardHeader>
          <CardContent>
            {volunteerHistory.length > 0 ? (
              <ul className="space-y-2">
                {volunteerHistory[0].events?.map((event, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium text-brand-text-primary">{event.event_name}:</span>
                    <span className="text-brand-text-secondary"> {event.role}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-brand-text-secondary">No volunteer history found.</p>}
          </CardContent>
        </Card>
        
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
          </CardHeader>
          <CardContent>
            {donations.length > 0 ? (
              <ul className="space-y-2">
                {donations.map(donation => (
                  <li key={donation.id} className="text-sm flex justify-between">
                    <div>
                      <span className="font-medium text-brand-text-primary">${donation.amount}</span>
                      <span className="text-brand-text-secondary"> to {donation.category}</span>
                    </div>
                    <span className="text-xs text-brand-text-secondary">{new Date(donation.created_date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-brand-text-secondary">No donations found.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default C360Dashboard;