/**
 * CurlingOS Geofencing Service - Location-based compliance and features
 * Used for PointsBet compliance, event check-ins, and location-based XP
 */

export class GeofencingService {
  static SUPPORTED_REGIONS = {
    ON: 'Ontario',
    AB: 'Alberta',
    BC: 'British Columbia',
    SK: 'Saskatchewan',
    MB: 'Manitoba',
    QC: 'Quebec',
    NB: 'New Brunswick',
    NS: 'Nova Scotia',
    PE: 'Prince Edward Island',
    NL: 'Newfoundland and Labrador',
    YT: 'Yukon',
    NT: 'Northwest Territories',
    NU: 'Nunavut'
  };

  static GAMBLING_RESTRICTED_REGIONS = ['ON', 'QC']; // Example restrictions

  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static async reverseGeocode(latitude, longitude) {
    try {
      // In a real implementation, this would use a geocoding service
      // For demo purposes, we'll use a mock response
      const mockResponse = {
        province: 'ON',
        city: 'Toronto',
        country: 'Canada',
        isCanada: true
      };
      
      return mockResponse;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  }

  static async checkGamblingEligibility(location = null) {
    try {
      const userLocation = location || await this.getCurrentLocation();
      const geoData = await this.reverseGeocode(userLocation.latitude, userLocation.longitude);
      
      if (!geoData || !geoData.isCanada) {
        return {
          eligible: false,
          reason: 'Gambling features are only available in Canada',
          location: geoData
        };
      }

      if (this.GAMBLING_RESTRICTED_REGIONS.includes(geoData.province)) {
        return {
          eligible: false,
          reason: `Gambling features are restricted in ${this.SUPPORTED_REGIONS[geoData.province]}`,
          location: geoData
        };
      }

      return {
        eligible: true,
        location: geoData
      };
    } catch (error) {
      return {
        eligible: false,
        reason: 'Unable to verify location for gambling compliance',
        error: error.message
      };
    }
  }

  static async checkEventProximity(eventLocation, userLocation = null, radiusKm = 5) {
    try {
      const location = userLocation || await this.getCurrentLocation();
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        eventLocation.latitude,
        eventLocation.longitude
      );

      return {
        withinRange: distance <= radiusKm,
        distance: distance,
        location: location
      };
    } catch (error) {
      return {
        withinRange: false,
        error: error.message
      };
    }
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  static async logLocationEvent(userId, eventType, location, metadata = {}) {
    // Log location-based events for audit and compliance
    const logEntry = {
      user_id: userId,
      event_type: eventType,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy
      },
      metadata: metadata,
      timestamp: new Date().toISOString()
    };

    console.log('Location Event:', logEntry);
    // In a real implementation, this would be saved to an audit log
  }
}