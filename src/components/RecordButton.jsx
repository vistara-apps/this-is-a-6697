import React, { useState, useEffect } from 'react';
import { Video, Square, Mic } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const RecordButton = () => {
  const { state, startRecording, stopRecording, addIncident } = useApp();
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingType, setRecordingType] = useState('audio'); // 'audio' or 'video'

  useEffect(() => {
    let interval;
    if (state.isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [state.isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordToggle = async () => {
    if (state.isRecording) {
      // Stop recording
      stopRecording();
      
      // Create incident report
      const incident = {
        reportId: `incident_${Date.now()}`,
        userId: state.user?.userId,
        timestamp: new Date().toISOString(),
        location: state.location,
        interactionType: 'recorded_interaction',
        scriptUsed: null,
        recordingUrl: `mock_recording_${Date.now()}.${recordingType === 'video' ? 'mp4' : 'wav'}`,
        summary: `${recordingType} recording - ${formatTime(recordingTime)}`,
        createdAt: new Date().toISOString(),
        duration: recordingTime,
        type: recordingType
      };
      
      addIncident(incident);
      
      // Show success message
      alert(`Recording saved successfully! Duration: ${formatTime(recordingTime)}`);
    } else {
      // Start recording
      try {
        // In a real app, you would request media permissions here
        if (recordingType === 'video') {
          // await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } else {
          // await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        startRecording();
      } catch (error) {
        alert('Unable to access camera/microphone. Please check permissions.');
      }
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Record</h3>
      
      {/* Recording Type Toggle */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setRecordingType('audio')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            recordingType === 'audio'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
          }`}
          disabled={state.isRecording}
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
          disabled={state.isRecording}
        >
          Video
        </button>
      </div>

      {/* Recording Status */}
      {state.isRecording && (
        <div className="flex items-center justify-center space-x-2 mb-4 p-3 bg-red-50 rounded-md">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-700 font-medium">Recording: {formatTime(recordingTime)}</span>
        </div>
      )}

      {/* Record Button */}
      <button
        onClick={handleRecordToggle}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
          state.isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-accent hover:bg-green-600 text-white'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          {state.isRecording ? (
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
        Tap to {state.isRecording ? 'stop' : 'start'} recording your interaction.
        {!state.isRecording && ' Recording will be saved to your incidents.'}
      </p>
    </div>
  );
};

export default RecordButton;