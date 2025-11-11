
import React, { useState, useEffect } from 'react';
import { User, GeoChallenge as GeoChallengeEntity, Club, PointTransaction, LoyaltyProgram } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Target, 
  Award, 
  Navigation, 
  CheckCircle2,
  Clock,
  Zap,
  Trophy,
  Map
} from 'lucide-react';

export default function GeoChallenge() {
  const [user, setUser] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        
        // Load active geo challenges
        const activeChallenges = await GeoChallengeEntity.filter({ is_active: true });
        setChallenges(activeChallenges);
        
        // Request user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              console.log('Location access denied:', error);
            }
          );
        }
        
      } catch (error) {
        console.error('Error loading geo challenges:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const handleCheckIn = async (challenge, location) => {
    if (!userLocation) {
      alert('Location access is required for check-ins');
      return;
    }

    setCheckingIn(challenge.id);
    
    try {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        location.latitude,
        location.longitude
      );
      
      if (distance > location.radius_meters) {
        alert(`You're too far from ${location.location_name}. Get within ${location.radius_meters}m to check in.`);
        return;
      }
      
      // Check if user already completed this challenge
      if (challenge.completed_by.includes(user.id)) {
        alert('You\'ve already completed this challenge!');
        return;
      }
      
      // Award points
      await PointTransaction.create({
        user_id: user.id,
        points_amount: challenge.rewards.curl_points,
        transaction_type: 'bonus',
        description: `Geo Challenge: ${challenge.name}`,
        reference_id: challenge.id,
        source: 'geo_challenge'
      });
      
      // Update loyalty points
      const loyaltyProfiles = await LoyaltyProgram.filter({ user_id: user.id });
      if (loyaltyProfiles.length > 0) {
        const profile = loyaltyProfiles[0];
        await LoyaltyProgram.update(profile.id, {
          curl_points: profile.curl_points + challenge.rewards.curl_points,
          total_earned_points: profile.total_earned_points + challenge.rewards.curl_points
        });
      }
      
      // Update challenge completion
      await GeoChallengeEntity.update(challenge.id, {
        completed_by: [...challenge.completed_by, user.id]
      });
      
      // Update local state
      setChallenges(prev => prev.map(c => 
        c.id === challenge.id 
          ? { ...c, completed_by: [...c.completed_by, user.id] }
          : c
      ));
      
      alert(`Check-in successful! You earned ${challenge.rewards.curl_points} CurlPoints!`);
      
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Check-in failed. Please try again.');
    } finally {
      setCheckingIn(null);
    }
  };

  const getChallengeTypeIcon = (type) => {
    switch (type) {
      case 'club_checkin': return MapPin;
      case 'event_attendance': return Trophy;
      case 'multi_location': return Target;
      case 'zone_visit': return Map;
      default: return MapPin;
    }
  };

  const getChallengeTypeColor = (type) => {
    switch (type) {
      case 'club_checkin': return 'bg-blue-100 text-blue-800';
      case 'event_attendance': return 'bg-amber-100 text-amber-800';
      case 'multi_location': return 'bg-purple-100 text-purple-800';
      case 'zone_visit': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading geo challenges...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Navigation className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-charcoal mb-2">Location Adventures</h2>
            <p className="text-gray-600 mb-6">Sign in to discover geo challenges near you!</p>
            <Button onClick={() => User.login()} className="bg-brand-red hover:bg-red-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-charcoal uppercase">Geo Challenges</h1>
          <p className="text-gray-600 mt-1">
            Explore clubs and events in your area to earn exclusive rewards
          </p>
        </div>

        {/* Location Status */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                userLocation ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <Navigation className={`w-5 h-5 ${
                  userLocation ? 'text-green-600' : 'text-yellow-600'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-brand-charcoal">
                  {userLocation ? 'Location Access Granted' : 'Location Access Needed'}
                </h3>
                <p className="text-sm text-gray-600">
                  {userLocation 
                    ? 'You can now check in to nearby locations'
                    : 'Enable location access to participate in geo challenges'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const TypeIcon = getChallengeTypeIcon(challenge.challenge_type);
            const isCompleted = challenge.completed_by.includes(user.id);
            const userCompletedCount = challenge.target_locations.filter(loc => 
              challenge.completed_by.includes(user.id)
            ).length;
            const progressPercent = (userCompletedCount / challenge.requirements.visits_needed) * 100;
            
            return (
              <Card key={challenge.id} className={`hover:shadow-lg transition-shadow ${
                isCompleted ? 'border-green-400 bg-green-50' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-brand-red" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{challenge.name}</CardTitle>
                        <Badge className={getChallengeTypeColor(challenge.challenge_type)}>
                          {challenge.challenge_type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{challenge.description}</p>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-brand-charcoal">Progress</span>
                      <span className="text-sm text-gray-600">
                        {userCompletedCount}/{challenge.requirements.visits_needed}
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>

                  {/* Rewards */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-brand-charcoal">Rewards</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-amber-100 text-amber-800">
                        <Zap className="w-3 h-3 mr-1" />
                        {challenge.rewards.curl_points} points
                      </Badge>
                      {challenge.rewards.badge_id && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Trophy className="w-3 h-3 mr-1" />
                          Badge
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="space-y-2">
                    {challenge.target_locations.map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="font-medium text-brand-charcoal">
                              {location.location_name}
                            </span>
                          </div>
                        </div>
                        {!isCompleted && userLocation && (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(challenge, location)}
                            disabled={checkingIn === challenge.id}
                            className="bg-brand-red hover:bg-red-700"
                          >
                            {checkingIn === challenge.id ? 'Checking...' : 'Check In'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Time Limit */}
                  {challenge.requirements.time_limit_hours && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Complete within {challenge.requirements.time_limit_hours} hours</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-brand-charcoal mb-2">No Challenges Available</h3>
              <p className="text-gray-500">
                Check back soon for new geo challenges in your area!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
