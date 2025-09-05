import axios from 'axios';

export const locationService = {
  /**
   * Get user's current location using browser geolocation API
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Get location details from coordinates
            const locationData = await this.reverseGeocode(latitude, longitude);
            
            resolve({
              lat: latitude,
              lng: longitude,
              accuracy: position.coords.accuracy,
              ...locationData
            });
          } catch (error) {
            resolve({
              lat: latitude,
              lng: longitude,
              accuracy: position.coords.accuracy,
              name: 'Unknown Location',
              state: 'Unknown',
              country: 'Unknown'
            });
          }
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    });
  },

  /**
   * Convert coordinates to human-readable address
   * Uses multiple fallback services for reliability
   */
  async reverseGeocode(lat, lng) {
    try {
      // Try Google Maps API first if available
      if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        return await this.reverseGeocodeGoogle(lat, lng);
      }
      
      // Fallback to free service
      return await this.reverseGeocodeFree(lat, lng);
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return {
        name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        state: 'Unknown',
        country: 'Unknown',
        city: 'Unknown',
        county: 'Unknown'
      };
    }
  },

  /**
   * Google Maps reverse geocoding (premium)
   */
  async reverseGeocodeGoogle(lat, lng) {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const components = result.address_components;
        
        const getComponent = (types) => {
          const component = components.find(comp => 
            types.some(type => comp.types.includes(type))
          );
          return component ? component.long_name : 'Unknown';
        };

        const state = getComponent(['administrative_area_level_1']);
        const city = getComponent(['locality', 'sublocality']);
        const county = getComponent(['administrative_area_level_2']);
        const country = getComponent(['country']);

        return {
          name: result.formatted_address,
          state: this.getStateAbbreviation(state),
          city,
          county,
          country,
          fullAddress: result.formatted_address
        };
      }
      
      throw new Error('No results from Google Maps');
    } catch (error) {
      console.error('Google Maps geocoding failed:', error);
      throw error;
    }
  },

  /**
   * Free reverse geocoding service (fallback)
   */
  async reverseGeocodeFree(lat, lng) {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );

      const data = response.data;
      
      return {
        name: data.locality || data.city || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        state: this.getStateAbbreviation(data.principalSubdivision || 'Unknown'),
        city: data.city || data.locality || 'Unknown',
        county: data.localityInfo?.administrative?.[0]?.name || 'Unknown',
        country: data.countryName || 'Unknown',
        fullAddress: `${data.locality || data.city || ''}, ${data.principalSubdivision || ''}, ${data.countryName || ''}`
      };
    } catch (error) {
      console.error('Free geocoding service failed:', error);
      throw error;
    }
  },

  /**
   * Convert state names to abbreviations for jurisdiction lookup
   */
  getStateAbbreviation(stateName) {
    const stateMap = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
      'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
      'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
      'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
      'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
      'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
      'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
      'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
      'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
      'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
      'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
    };

    return stateMap[stateName] || stateName;
  },

  /**
   * Get jurisdiction-specific legal information
   */
  async getJurisdictionInfo(state) {
    try {
      // This would typically come from a legal database
      // For now, we'll use a basic lookup with common state variations
      const jurisdictionData = await this.getBasicJurisdictionData(state);
      return jurisdictionData;
    } catch (error) {
      console.error('Failed to get jurisdiction info:', error);
      return this.getDefaultJurisdictionData();
    }
  },

  /**
   * Basic jurisdiction data (would be replaced with real legal database)
   */
  async getBasicJurisdictionData(state) {
    // This is mock data - in production, this would come from a legal database
    const basicRights = [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'You have the right to record police interactions in public'
    ];

    const stateSpecificInfo = {
      'CA': {
        recordingLegal: true,
        stopAndIdentify: false,
        additionalRights: ['Right to record in public spaces', 'Sanctuary state protections']
      },
      'TX': {
        recordingLegal: true,
        stopAndIdentify: true,
        additionalRights: ['Must identify if lawfully arrested', 'Open carry permitted with license']
      },
      'NY': {
        recordingLegal: true,
        stopAndIdentify: false,
        additionalRights: ['Right to record police', 'Stop and frisk limitations']
      },
      'FL': {
        recordingLegal: true,
        stopAndIdentify: false,
        additionalRights: ['Stand your ground law', 'Right to record in public']
      }
    };

    const stateInfo = stateSpecificInfo[state] || stateSpecificInfo['CA'];

    return {
      state,
      rights: basicRights,
      recordingLegal: stateInfo.recordingLegal,
      stopAndIdentify: stateInfo.stopAndIdentify,
      additionalRights: stateInfo.additionalRights,
      lastUpdated: new Date().toISOString()
    };
  },

  /**
   * Default jurisdiction data when state is unknown
   */
  getDefaultJurisdictionData() {
    return {
      state: 'Unknown',
      rights: [
        'You have the right to remain silent',
        'You have the right to refuse consent to searches',
        'You have the right to ask if you are free to leave',
        'You have the right to an attorney'
      ],
      recordingLegal: true,
      stopAndIdentify: false,
      additionalRights: ['Constitutional rights apply nationwide'],
      lastUpdated: new Date().toISOString()
    };
  },

  /**
   * Watch user's location for changes (useful for mobile users)
   */
  watchLocation(callback, errorCallback) {
    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocation not supported'));
      return null;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000 // 5 minutes
    };

    return navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData = await this.reverseGeocode(latitude, longitude);
          
          callback({
            lat: latitude,
            lng: longitude,
            accuracy: position.coords.accuracy,
            ...locationData
          });
        } catch (error) {
          errorCallback(error);
        }
      },
      errorCallback,
      options
    );
  },

  /**
   * Stop watching location
   */
  stopWatchingLocation(watchId) {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
};
