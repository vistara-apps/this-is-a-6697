import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { locationService } from '../services/location';
import { supabaseService, authService } from '../services/supabase';
import { openaiService, fallbackScripts } from '../services/openai';
import { stripeService } from '../services/stripe';
import { getJurisdictionData } from '../data/jurisdictions';

const AppContext = createContext();

const initialState = {
  user: null,
  location: null,
  currentLocation: 'Detecting location...',
  jurisdictionData: null,
  incidents: [],
  isRecording: false,
  subscriptionStatus: 'free', // free, basic, premium
  selectedScenario: null,
  scripts: {},
  language: 'en', // en, es
  loading: false,
  error: null,
  isOnline: navigator.onLine,
  permissions: {
    location: 'prompt',
    camera: 'prompt',
    microphone: 'prompt'
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOCATION':
      return { 
        ...state, 
        location: action.payload, 
        currentLocation: action.payload.name || action.payload.fullAddress || 'Unknown Location'
      };
    case 'SET_JURISDICTION_DATA':
      return { ...state, jurisdictionData: action.payload };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'ADD_INCIDENT':
      return { ...state, incidents: [action.payload, ...state.incidents] };
    case 'UPDATE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(incident =>
          incident.reportId === action.payload.reportId
            ? { ...incident, ...action.payload.updates }
            : incident
        )
      };
    case 'DELETE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.filter(incident => incident.reportId !== action.payload)
      };
    case 'SET_INCIDENTS':
      return { ...state, incidents: action.payload };
    case 'SET_SUBSCRIPTION':
      return { ...state, subscriptionStatus: action.payload };
    case 'SET_SCENARIO':
      return { ...state, selectedScenario: action.payload };
    case 'SET_SCRIPTS':
      return { ...state, scripts: { ...state.scripts, ...action.payload } };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'SET_PERMISSIONS':
      return { ...state, permissions: { ...state.permissions, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Real location detection
  useEffect(() => {
    const detectLocation = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const locationData = await locationService.getCurrentLocation();
        dispatch({ type: 'SET_LOCATION', payload: locationData });
        
        // Get jurisdiction data for the detected location
        if (locationData.state) {
          const jurisdictionData = getJurisdictionData(locationData.state, state.language);
          dispatch({ type: 'SET_JURISDICTION_DATA', payload: jurisdictionData });
        }
      } catch (error) {
        console.error('Location detection failed:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        
        // Fallback to default location
        dispatch({
          type: 'SET_LOCATION',
          payload: {
            name: 'Unknown Location',
            state: 'CA',
            lat: null,
            lng: null
          }
        });
        
        // Set default jurisdiction data
        const defaultJurisdiction = getJurisdictionData('DEFAULT', state.language);
        dispatch({ type: 'SET_JURISDICTION_DATA', payload: defaultJurisdiction });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    detectLocation();
  }, [state.language]);

  // Initialize user authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: user } = await authService.getCurrentUser();
        
        if (user) {
          // User is authenticated, get their data from Supabase
          const { data: userData } = await supabaseService.getUser(user.id);
          
          if (userData) {
            dispatch({ type: 'SET_USER', payload: userData });
            dispatch({ type: 'SET_SUBSCRIPTION', payload: userData.subscriptionStatus || 'free' });
            dispatch({ type: 'SET_LANGUAGE', payload: userData.preferredLanguage || 'en' });
            
            // Load user's incidents
            const { data: incidents } = await supabaseService.getUserIncidents(user.id);
            if (incidents) {
              dispatch({ type: 'SET_INCIDENTS', payload: incidents });
            }
          }
        } else {
          // Create anonymous user
          const anonymousUser = {
            userId: `anon_${Date.now()}`,
            createdAt: new Date().toISOString(),
            subscriptionStatus: 'free',
            preferredLanguage: 'en',
            isAnonymous: true
          };
          
          dispatch({ type: 'SET_USER', payload: anonymousUser });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        
        // Fallback to anonymous user
        const anonymousUser = {
          userId: `anon_${Date.now()}`,
          createdAt: new Date().toISOString(),
          subscriptionStatus: 'free',
          preferredLanguage: 'en',
          isAnonymous: true
        };
        
        dispatch({ type: 'SET_USER', payload: anonymousUser });
      }
    };

    initializeAuth();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enhanced helper functions
  const value = {
    state,
    dispatch,
    
    // Location functions
    updateLocation: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const locationData = await locationService.getCurrentLocation();
        dispatch({ type: 'SET_LOCATION', payload: locationData });
        
        if (locationData.state) {
          const jurisdictionData = getJurisdictionData(locationData.state, state.language);
          dispatch({ type: 'SET_JURISDICTION_DATA', payload: jurisdictionData });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    // Recording functions
    startRecording: () => dispatch({ type: 'SET_RECORDING', payload: true }),
    stopRecording: () => dispatch({ type: 'SET_RECORDING', payload: false }),

    // Incident functions
    addIncident: async (incident) => {
      dispatch({ type: 'ADD_INCIDENT', payload: incident });
      
      // Save to Supabase if user is authenticated
      if (state.user && !state.user.isAnonymous) {
        try {
          await supabaseService.createIncident(incident);
        } catch (error) {
          console.error('Failed to save incident to database:', error);
        }
      }
    },

    updateIncident: async (reportId, updates) => {
      dispatch({ type: 'UPDATE_INCIDENT', payload: { reportId, updates } });
      
      // Update in Supabase if user is authenticated
      if (state.user && !state.user.isAnonymous) {
        try {
          await supabaseService.updateIncident(reportId, updates);
        } catch (error) {
          console.error('Failed to update incident in database:', error);
        }
      }
    },

    deleteIncident: async (reportId) => {
      dispatch({ type: 'DELETE_INCIDENT', payload: reportId });
      
      // Delete from Supabase if user is authenticated
      if (state.user && !state.user.isAnonymous) {
        try {
          await supabaseService.deleteIncident(reportId);
        } catch (error) {
          console.error('Failed to delete incident from database:', error);
        }
      }
    },

    // Script functions
    generateScript: async (scenario, customContext = '') => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const jurisdiction = state.location?.state || 'CA';
        const { script, error } = await openaiService.generateScript(
          scenario,
          jurisdiction,
          state.language,
          customContext
        );

        if (error) {
          // Fallback to predefined scripts
          const fallbackScript = fallbackScripts[scenario]?.[state.language] || 
                                fallbackScripts[scenario]?.en ||
                                'Script not available';
          
          dispatch({
            type: 'SET_SCRIPTS',
            payload: { [scenario]: fallbackScript }
          });
          
          return fallbackScript;
        }

        dispatch({
          type: 'SET_SCRIPTS',
          payload: { [scenario]: script }
        });

        return script;
      } catch (error) {
        console.error('Script generation failed:', error);
        
        // Fallback to predefined scripts
        const fallbackScript = fallbackScripts[scenario]?.[state.language] || 
                              fallbackScripts[scenario]?.en ||
                              'Script not available';
        
        dispatch({
          type: 'SET_SCRIPTS',
          payload: { [scenario]: fallbackScript }
        });
        
        return fallbackScript;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    // Subscription functions
    setSubscription: (status) => dispatch({ type: 'SET_SUBSCRIPTION', payload: status }),
    
    upgradeSubscription: async (planId) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const result = await stripeService.createSubscription(planId, {
          email: state.user?.email,
          userId: state.user?.userId
        });

        if (result.success) {
          dispatch({ type: 'SET_SUBSCRIPTION', payload: planId });
          
          // Update user in database
          if (state.user && !state.user.isAnonymous) {
            await supabaseService.updateUser(state.user.userId, {
              subscriptionStatus: planId,
              stripeSubscriptionId: result.subscriptionId
            });
          }
          
          return result;
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    // Language functions
    setLanguage: (language) => {
      dispatch({ type: 'SET_LANGUAGE', payload: language });
      
      // Update jurisdiction data with new language
      if (state.location?.state) {
        const jurisdictionData = getJurisdictionData(state.location.state, language);
        dispatch({ type: 'SET_JURISDICTION_DATA', payload: jurisdictionData });
      }
      
      // Update user preference in database
      if (state.user && !state.user.isAnonymous) {
        supabaseService.updateUser(state.user.userId, { preferredLanguage: language })
          .catch(error => console.error('Failed to update language preference:', error));
      }
    },

    // Utility functions
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error })
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
