import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SurveySubmission, Club } from '@/api/entities';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MARegionInsightsPanel = ({ maRegion }) => {
  const [submissions, setSubmissions] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [submissionData, clubData] = await Promise.all([
          SurveySubmission.filter({ ma_region: maRegion, year: new Date().getFullYear() }),
          Club.filter({ ma_region: maRegion })
        ]);
        setSubmissions(submissionData);
        setClubs(clubData);
      } catch (error) {
        console.error("Failed to load MA region insights:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [maRegion]);

  const aggregateData = submissions.map(sub => ({
    name: clubs.find(c => c.id === sub.club_id)?.name || 'Unknown Club',
    ...sub.survey_data.revenue,
    ...sub.survey_data.membership
  }));

  const handleClubChange = (clubId) => {
    const clubSubmission = submissions.find(sub => sub.club_id === clubId);
    setSelectedClub(clubSubmission);
  };

  if (isLoading) return <div>Loading insights...</div>;

  return (
    <div className="space-y-6">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle>Regional Comparison: {maRegion}</CardTitle>
          <Select onValueChange={handleClubChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Compare a specific club..." />
            </SelectTrigger>
            <SelectContent>
              {clubs.map(club => (
                <SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={aggregateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="membership_fees" stackId="a" fill="#8884d8" name="Membership Fees" />
              <Bar dataKey="ice_rental" stackId="a" fill="#82ca9d" name="Ice Rental" />
              <Bar dataKey="events_fundraising" stackId="a" fill="#ffc658" name="Events/Fundraising" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {selectedClub && (
        <Card className="bg-brand-card-bg border-brand-border">
          <CardHeader>
            <CardTitle>Details for {clubs.find(c => c.id === selectedClub.club_id)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs">{JSON.stringify(selectedClub.survey_data, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MARegionInsightsPanel;