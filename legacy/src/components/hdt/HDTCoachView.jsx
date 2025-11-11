import React, { useState, useEffect } from 'react';
import { HitDrawTap, User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  CheckCircle2, 
  Download, 
  Upload,
  Award,
  TrendingUp,
  Search,
  FileText
} from 'lucide-react';

export default function HDTCoachView({ user }) {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        // Get all HDT scores in coach's region/club
        const scores = await HitDrawTap.filter({ ma_region: user.ma_region });
        
        // Group by user and get latest scores
        const userScores = {};
        scores.forEach(score => {
          if (!userScores[score.user_id] || new Date(score.submission_date) > new Date(userScores[score.user_id].submission_date)) {
            userScores[score.user_id] = score;
          }
        });
        
        // Get user details
        const userIds = Object.keys(userScores);
        const users = await User.filter({ id: userIds });
        
        const participantData = users.map(participant => ({
          ...participant,
          latestScore: userScores[participant.id],
          totalAttempts: scores.filter(s => s.user_id === participant.id).length
        }));
        
        setParticipants(participantData);
      } catch (error) {
        console.error('Error loading participants:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadParticipants();
  }, [user.ma_region]);

  const handleVerifyScore = async (participantId, scoreId) => {
    try {
      await HitDrawTap.update(scoreId, { coach_verified: true });
      
      // Update local state
      setParticipants(prev => prev.map(p => 
        p.id === participantId 
          ? { ...p, latestScore: { ...p.latestScore, coach_verified: true } }
          : p
      ));
      
      alert('Score verified successfully!');
    } catch (error) {
      console.error('Error verifying score:', error);
    }
  };

  const exportParticipantData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Age Division,Latest Score,Total Attempts,Verified,Club\n" +
      participants.map(p => 
        `${p.full_name},${p.latestScore?.age_division || 'N/A'},${p.latestScore?.totals.grand_total || 0},${p.totalAttempts},${p.latestScore?.coach_verified ? 'Yes' : 'No'},${p.club_name || 'N/A'}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hdt_participants_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredParticipants = participants.filter(participant => {
    const nameMatch = participant.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const clubMatch = selectedClub === 'all' || participant.club_name === selectedClub;
    return nameMatch && clubMatch;
  });

  const uniqueClubs = [...new Set(participants.map(p => p.club_name).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Coach Tools Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Coach Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-charcoal">{participants.length}</div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-charcoal">
                {participants.filter(p => p.latestScore?.coach_verified).length}
              </div>
              <div className="text-sm text-gray-600">Verified Scores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-charcoal">
                {participants.reduce((sum, p) => sum + p.totalAttempts, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-charcoal">
                {Math.round(participants.reduce((sum, p) => sum + (p.latestScore?.totals.grand_total || 0), 0) / participants.length) || 0}
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={exportParticipantData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Scoresheets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by club" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clubs</SelectItem>
                {uniqueClubs.map((club) => (
                  <SelectItem key={club} value={club}>
                    {club}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Participant Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-24 h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredParticipants.length > 0 ? (
            <div className="space-y-4">
              {filteredParticipants.map((participant) => (
                <div key={participant.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-brand-charcoal">
                          {participant.full_name}
                        </h3>
                        {participant.latestScore?.coach_verified && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          Age: {participant.latestScore?.age_division || 'N/A'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Club: {participant.club_name || 'N/A'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Attempts: {participant.totalAttempts}
                        </Badge>
                      </div>
                      
                      {participant.latestScore && (
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-brand-charcoal">
                              {participant.latestScore.totals.grand_total}
                            </div>
                            <div className="text-gray-600">Total Score</div>
                          </div>
                          <div>
                            <div className="font-medium text-brand-charcoal">
                              {participant.latestScore.totals.hit_total}
                            </div>
                            <div className="text-gray-600">Hit</div>
                          </div>
                          <div>
                            <div className="font-medium text-brand-charcoal">
                              {participant.latestScore.totals.draw_total}
                            </div>
                            <div className="text-gray-600">Draw</div>
                          </div>
                          <div>
                            <div className="font-medium text-brand-charcoal">
                              {participant.latestScore.totals.tap_total}
                            </div>
                            <div className="text-gray-600">Tap</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {participant.latestScore && !participant.latestScore.coach_verified && (
                        <Button
                          size="sm"
                          onClick={() => handleVerifyScore(participant.id, participant.latestScore.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Verify
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View History
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-brand-charcoal mb-2">No Participants Found</h3>
              <p className="text-gray-500">
                No HDT participants match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-brand-charcoal mb-2">Import Scores</h4>
              <div className="flex gap-4">
                <Input type="file" accept=".csv" className="flex-1" />
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Upload a CSV file with participant scores. 
                <a href="#" className="text-brand-red hover:underline ml-1">Download template</a>
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-brand-charcoal mb-2">Award Recognition</h4>
              <div className="flex gap-4">
                <Select>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select participants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-10">Top 10 Performers</SelectItem>
                    <SelectItem value="most-improved">Most Improved</SelectItem>
                    <SelectItem value="all">All Participants</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-brand-red hover:bg-red-700">
                  <Award className="w-4 h-4 mr-2" />
                  Award Points
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}