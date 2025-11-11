import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Target, 
  Clock, 
  CheckCircle,
  Navigation,
  Award
} from 'lucide-react';

export default function GeoChallenge({ challenge, userLocation, onComplete }) {
  const [userProgress, setUserProgress] = useState(0);
  const [isInRange, setIsInRange] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // Calculate if user is within range of any target location
    if (userLocation && challenge.target_locations) {
      const inRange = challenge.target_locations.some(location => {
        const distance = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude,
          location.latitude, 
          location.longitude
        );
        return distance <= location.radius_meters;
      });
      setIsInRange(inRange);
    }

    // Calculate time remaining
    if (challenge.end_date) {
      const now = new Date();
      const endDate = new Date(challenge.end_date);
      const timeDiff = endDate - now;
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeRemaining(`${days}d ${hours}h remaining`);
      } else {
        setTimeRemaining('Expired');
      }
    }
  }, [userLocation, challenge]);

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

  const handleCheckIn = () => {
    if (isInRange) {
      setUserProgress(prev => Math.min(prev + 1, challenge.requirements.visits_needed));
      if (userProgress + 1 >= challenge.requirements.visits_needed) {
        onComplete(challenge);
      }
    }
  };

  const getChallengeTypeIcon = (type) => {
    switch (type) {
      case 'club_checkin': return MapPin;
      case 'event_attendance': return Target;
      case 'multi_location': return Navigation;
      default: return MapPin;
    }
  };

  const ChallengeIcon = getChallengeTypeIcon(challenge.challenge_type);
  const isCompleted = userProgress >= challenge.requirements.visits_needed;
  const progressPercentage = (userProgress / challenge.requirements.visits_needed) * 100;

  return (
    <Card className={`${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'} transition-all duration-300`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <ChallengeIcon className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{challenge.name}</CardTitle>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-amber-100 text-amber-800 mb-1">
              {challenge.rewards.curl_points} points
            </Badge>
            {timeRemaining && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {timeRemaining}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              {userProgress}/{challenge.requirements.visits_needed} visits
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Target Locations */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Target Locations</h4>
          <div className="space-y-2">
            {challenge.target_locations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{location.location_name}</span>
                </div>
                {/* You could add a "Navigate" button here */}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <Award className="w-4 h-4" />
              Challenge Completed!
            </div>
          ) : (
            <Button 
              onClick={handleCheckIn}
              disabled={!isInRange || timeRemaining === 'Expired'}
              className={`w-full ${
                isInRange 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isInRange ? 'Check In Here' : 'Move closer to check in'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}