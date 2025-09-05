import React, { useState, useEffect } from 'react';
import { Video, Square, Mic, AlertCircle, Upload } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useRecording } from '../hooks/useRecording';
import { supabaseService } from '../services/supabase';

const RecordButton = () => {
  const { state, addIncident } = useApp();
  const {
    isRecording,
    recordingTime,
    recordingType,
    error,
    isSupported,
    startRecording: startRealRecording,
    stopRecording: stopRealRecording,
    setRecordingType,
    formatDuration,
    generateFilename,
    clearError
  } = useRecording();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleRecordToggle = async () => {
    if (isRecording) {
      // Stop recording
      try {
        const result = await stopRealRecording();
        
        // Create incident report
        const incident = {
          reportId: `incident_${Date.now()}`,
          userId: state.user?.userId,
          timestamp: new Date().toISOString(),
          location: state.location,
          interactionType: 'recorded_interaction',
          scriptUsed: null,
          recordingUrl: null, // Will be set after upload
          summary: `${recordingType} recording - ${formatDuration(recordingTime)}`,
          createdAt: new Date().toISOString(),
          duration: recordingTime,
          type: recordingType,
          fileSize: result.metadata.size,
          mimeType: result.metadata.mimeType
        };

        // Upload recording if user is authenticated
        if (state.user && !state.user.isAnonymous && result.blob) {
          try {
            setUploading(true);
            setUploadProgress(0);
            
            const filename = generateFilename(recordingType, new Date());
            const file = new File([result.blob], `${filename}.webm`, {
              type: result.metadata.mimeType
            });

            // Simulate upload progress
            const progressInterval = setInterval(() => {
              setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const uploadResult = await supabaseService.uploadRecording(file, filename);
            
            clearInterval(progressInterval);
            setUploadProgress(100);

            if (uploadResult.data) {
              incident.recordingUrl = uploadResult.data.publicUrl;
            }
          } catch (uploadError) {
            console.error('Upload failed:', uploadError);
            // Continue with local storage even if upload fails
          } finally {
            setUploading(false);
            setUploadProgress(0);
          }
        } else {
          // For anonymous users or when upload fails, store locally
          incident.recordingUrl = result.url; // Local blob URL
          incident.localRecording = true;
        }
        
        await addIncident(incident);
        
        // Show success message
        alert(`Recording saved successfully! Duration: ${formatDuration(recordingTime)}`);
      } catch (error) {
        console.error('Failed to stop recording:', error);
        alert(`Failed to save recording: ${error.message}`);
      }
    } else {
      // Start recording
      try {
        clearError();
        await startRealRecording(recordingType);
      } catch (error) {
        console.error('Failed to start recording:', error);
        alert(`Unable to start recording: ${error.message}`);
      }
    }
  };

  // Show unsupported message if recording is not available
  if (!isSupported) {
    return (
      <div className="bg-surface rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Record</h3>
        <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-yellow-800 font-medium">Recording Not Supported</p>
            <p className="text-yellow-700 text-sm">Your browser doesn't support media recording.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg shadow-card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Record</h3>
      
      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-md mb-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div className="flex-1">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Recording Type Toggle */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setRecordingType('audio')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            recordingType === 'audio'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
          }`}
          disabled={isRecording || uploading}
        >
          Audio
        </button>
        <button
          onClick={() => setRecordingType('video')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            recordingType === 'video'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
          }`}
          disabled={isRecording || uploading}
        >
          Video
        </button>
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 mb-4 p-3 bg-red-50 rounded-md">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-700 font-medium">Recording: {formatDuration(recordingTime)}</span>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center space-x-2 mb-2">
            <Upload className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 text-sm font-medium">Uploading recording...</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-blue-700 text-xs mt-1">{uploadProgress}% complete</p>
        </div>
      )}

      {/* Record Button */}
      <button
        onClick={handleRecordToggle}
        disabled={uploading}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
          uploading
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-accent hover:bg-green-600 text-white'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          {uploading ? (
            <>
              <Upload className="h-6 w-6 animate-pulse" />
              <span>Uploading...</span>
            </>
          ) : isRecording ? (
            <>
              <Square className="h-6 w-6" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              {recordingType === 'video' ? (
                <Video className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
              <span>Start {recordingType === 'video' ? 'Video' : 'Audio'}</span>
            </>
          )}
        </div>
      </button>

      <p className="text-xs text-text-secondary mt-3 text-center">
        {uploading 
          ? 'Please wait while your recording is being uploaded...'
          : isRecording 
          ? 'Tap to stop recording your interaction.'
          : 'Tap to start recording your interaction. Recording will be saved to your incidents.'
        }
      </p>

      {/* Offline Notice */}
      {!state.isOnline && (
        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
          <p className="text-orange-800 text-xs text-center">
            You're offline. Recordings will be saved locally and uploaded when you're back online.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordButton;
