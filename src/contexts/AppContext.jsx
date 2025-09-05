import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  location: null,
  currentLocation: 'Detecting location...',
  incidents: [],
  isRecording: false,
  subscriptionStatus: 'free', // free, basic, premium
  selectedScenario: null,
  scripts: {},
  loading: false,
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload, currentLocation: action.payload.name };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'ADD_INCIDENT':
      return { ...state, incidents: [action.payload, ...state.incidents] };
    case 'SET_SUBSCRIPTION':
      return { ...state, subscriptionStatus: action.payload };
    case 'SET_SCENARIO':
      return { ...state, selectedScenario: action.payload };
    case 'SET_SCRIPTS':
      return { ...state, scripts: { ...state.scripts, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Mock location detection
  useEffect(() => {
    const detectLocation = async () => {
      // Simulate location detection
      setTimeout(() => {
        dispatch({
          type: 'SET_LOCATION',
          payload: {
            name: 'California, USA',
            state: 'CA',
            lat: 37.7749,
            lng: -122.4194
          }
        });
      }, 2000);
    };

    detectLocation();
  }, []);

  // Mock user data
  useEffect(() => {
    dispatch({
      type: 'SET_USER',
      payload: {
        userId: 'user123',
        createdAt: new Date().toISOString(),
        subscriptionStatus: 'free',
        preferredLanguage: 'en'
      }
    });
  }, []);

  const value = {
    state,
    dispatch,
    // Helper functions
    startRecording: () => dispatch({ type: 'SET_RECORDING', payload: true }),
    stopRecording: () => dispatch({ type: 'SET_RECORDING', payload: false }),
    addIncident: (incident) => dispatch({ type: 'ADD_INCIDENT', payload: incident }),
    setSubscription: (status) => dispatch({ type: 'SET_SUBSCRIPTION', payload: status }),
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