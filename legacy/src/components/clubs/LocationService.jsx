import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Loader2, Navigation, AlertCircle } from 'lucide-react';

const LocationService = ({ onLocationUpdate, clubs }) => {
  const [locationState, setLocationState] = useState({
    isLoading: false,
    hasPermission: false,
    location: null,
    error: null,
    nearbyClubs: []
  });

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Find clubs within radius and sort by distance
  const findNearbyClubs = (userLat, userLon, clubs, maxDistance = 50) => {
    return clubs
      .filter(club => club.location?.latitude && club.location?.longitude)
      .map(club => ({
        ...club,
        distance: calculateDistance(
          userLat, 
          userLon, 
          club.location.latitude, 
          club.location.longitude
        )
      }))
      .filter(club => club.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  };

  // Request user's location
  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser'
      }));
      return;
    }

    setLocationState(prev => ({ ...prev, isLoading: true, error: null }));

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearby = findNearbyClubs(latitude, longitude, clubs);
        
        const newLocationState = {
          isLoading: false,
          hasPermission: true,
          location: { latitude, longitude },
          error: null,
          nearbyClubs: nearby
        };
        
        setLocationState(newLocationState);
        onLocationUpdate?.(newLocationState);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setLocationState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
      },
      options
    );
  };

  // Auto-detect if location was previously granted
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation();
        }
      });
    }
  }, [clubs]);

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  return (
    <div className="space-y-4">
      {/* Location Request Button */}
      {!locationState.hasPermission && !locationState.isLoading && (
        <div className="bg-brand-card-bg border border-brand-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-brand-red" />
              <div>
                <h3 className="font-semibold text-brand-text-primary">Find Clubs Near You</h3>
                <p className="text-sm text-brand-text-secondary">
                  Allow location access to see nearby curling clubs
                </p>
              </div>
            </div>
            <Button 
              onClick={requestLocation}
              className="bg-brand-red hover:bg-red-700"
              disabled={locationState.isLoading}
            >
              {locationState.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <MapPin className="w-4 h-4 mr-2" />
              )}
              Enable Location
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {locationState.isLoading && (
        <div className="bg-brand-card-bg border border-brand-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-brand-red" />
            <span className="text-brand-text-primary">Finding your location...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {locationState.error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <h4 className="font-medium text-red-300">Location Error</h4>
              <p className="text-sm text-red-400">{locationState.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nearby Clubs Display */}
      {locationState.hasPermission && locationState.nearbyClubs.length > 0 && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-green-300">
              {locationState.nearbyClubs.length} Clubs Near You
            </h3>
          </div>
          <div className="space-y-2">
            {locationState.nearbyClubs.slice(0, 3).map(club => (
              <div key={club.id} className="flex items-center justify-between">
                <span className="text-brand-text-primary font-medium">{club.name}</span>
                <Badge className="bg-green-700 text-green-100">
                  {formatDistance(club.distance)}
                </Badge>
              </div>
            ))}
            {locationState.nearbyClubs.length > 3 && (
              <p className="text-sm text-brand-text-secondary">
                +{locationState.nearbyClubs.length - 3} more clubs nearby
              </p>
            )}
          </div>
        </div>
      )}

      {/* No Nearby Clubs */}
      {locationState.hasPermission && locationState.nearbyClubs.length === 0 && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="font-medium text-amber-300">No Nearby Clubs</h4>
              <p className="text-sm text-amber-400">
                No clubs found within 50km. Try browsing all clubs or expanding your search.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationService;