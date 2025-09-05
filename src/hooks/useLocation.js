import { useState, useEffect, useCallback } from 'react';
import { locationService } from '../services/location';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  /**
   * Get current location once
   */
  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const locationData = await locationService.getCurrentLocation();
      setLocation(locationData);
      return locationData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Start watching location changes
   */
  const startWatching = useCallback(() => {
    if (watchId) {
      console.warn('Already watching location');
      return;
    }

    const id = locationService.watchLocation(
      (locationData) => {
        setLocation(locationData);
        setError(null);
      },
      (err) => {
        setError(err.message);
      }
    );

    setWatchId(id);
    return id;
  }, [watchId]);

  /**
   * Stop watching location changes
   */
  const stopWatching = useCallback(() => {
    if (watchId) {
      locationService.stopWatchingLocation(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  /**
   * Get jurisdiction info for current location
   */
  const getJurisdictionInfo = useCallback(async () => {
    if (!location?.state) {
      throw new Error('Location not available');
    }

    try {
      return await locationService.getJurisdictionInfo(location.state);
    } catch (err) {
      console.error('Failed to get jurisdiction info:', err);
      throw err;
    }
  }, [location]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        locationService.stopWatchingLocation(watchId);
      }
    };
  }, [watchId]);

  return {
    location,
    loading,
    error,
    isWatching: !!watchId,
    getCurrentLocation,
    startWatching,
    stopWatching,
    getJurisdictionInfo
  };
};
