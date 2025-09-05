import { useState, useEffect, useCallback, useRef } from 'react';
import { recordingService, recordingUtils } from '../services/recording';

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingType, setRecordingType] = useState('audio');
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [deviceCapabilities, setDeviceCapabilities] = useState({});
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  /**
   * Check if recording is supported
   */
  const isSupported = recordingService.isSupported();

  /**
   * Start recording
   */
  const startRecording = useCallback(async (type = 'audio', options = {}) => {
    if (isRecording) {
      throw new Error('Recording already in progress');
    }

    setError(null);
    setRecordingType(type);

    try {
      await recordingService.startRecording(type, options);
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);
      }, 1000);

      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isRecording]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(async () => {
    if (!isRecording) {
      throw new Error('No recording in progress');
    }

    try {
      const result = await recordingService.stopRecording();
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setIsRecording(false);
      setRecordingTime(0);
      startTimeRef.current = null;

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isRecording]);

  /**
   * Pause recording
   */
  const pauseRecording = useCallback(() => {
    if (!isRecording) return false;

    const success = recordingService.pauseRecording();
    if (success && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return success;
  }, [isRecording]);

  /**
   * Resume recording
   */
  const resumeRecording = useCallback(() => {
    const success = recordingService.resumeRecording();
    if (success && !timerRef.current) {
      // Resume timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);
      }, 1000);
    }
    return success;
  }, []);

  /**
   * Get current recording state
   */
  const getRecordingState = useCallback(() => {
    return recordingService.getState();
  }, []);

  /**
   * Check permissions
   */
  const checkPermissions = useCallback(async () => {
    try {
      const perms = await recordingService.checkPermissions();
      setPermissions(perms);
      return perms;
    } catch (err) {
      console.error('Error checking permissions:', err);
      return {};
    }
  }, []);

  /**
   * Get device capabilities
   */
  const getDeviceCapabilities = useCallback(async () => {
    try {
      const capabilities = await recordingService.getDeviceCapabilities();
      setDeviceCapabilities(capabilities);
      return capabilities;
    } catch (err) {
      console.error('Error getting device capabilities:', err);
      return {};
    }
  }, []);

  /**
   * Convert recording to file
   */
  const convertToFile = useCallback((blob, filename) => {
    return recordingService.blobToFile(blob, filename);
  }, []);

  /**
   * Generate filename for recording
   */
  const generateFilename = useCallback((type, timestamp) => {
    return recordingUtils.generateFilename(type, timestamp);
  }, []);

  /**
   * Format recording duration
   */
  const formatDuration = useCallback((seconds) => {
    return recordingUtils.formatDuration(seconds);
  }, []);

  /**
   * Format file size
   */
  const formatFileSize = useCallback((bytes) => {
    return recordingUtils.formatFileSize(bytes);
  }, []);

  /**
   * Validate recording
   */
  const validateRecording = useCallback((blob, maxSizeMB) => {
    return recordingUtils.validateRecording(blob, maxSizeMB);
  }, []);

  // Initialize permissions and capabilities on mount
  useEffect(() => {
    if (isSupported) {
      checkPermissions();
      getDeviceCapabilities();
    }
  }, [isSupported, checkPermissions, getDeviceCapabilities]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (isRecording) {
        recordingService.cleanup();
      }
    };
  }, [isRecording]);

  return {
    // State
    isRecording,
    recordingTime,
    recordingType,
    error,
    permissions,
    deviceCapabilities,
    isSupported,

    // Actions
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    setRecordingType,

    // Utilities
    getRecordingState,
    checkPermissions,
    getDeviceCapabilities,
    convertToFile,
    generateFilename,
    formatDuration,
    formatFileSize,
    validateRecording,

    // Clear error
    clearError: () => setError(null)
  };
};
