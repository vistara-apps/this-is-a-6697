export class RecordingService {
  constructor() {
    this.mediaRecorder = null;
    this.stream = null;
    this.chunks = [];
    this.isRecording = false;
    this.recordingType = 'audio'; // 'audio' or 'video'
  }

  /**
   * Check if recording is supported in the current browser
   */
  isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  /**
   * Request permission and start recording
   * @param {string} type - 'audio' or 'video'
   * @param {Object} options - Recording options
   */
  async startRecording(type = 'audio', options = {}) {
    if (!this.isSupported()) {
      throw new Error('Recording is not supported in this browser');
    }

    if (this.isRecording) {
      throw new Error('Recording is already in progress');
    }

    try {
      this.recordingType = type;
      this.chunks = [];

      // Define media constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          ...options.audio
        }
      };

      if (type === 'video') {
        constraints.video = {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: 'environment', // Use back camera by default
          ...options.video
        };
      }

      // Request media access
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Create MediaRecorder
      const mimeTypes = this.getSupportedMimeTypes(type);
      const mimeType = mimeTypes[0] || (type === 'video' ? 'video/webm' : 'audio/webm');

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: options.audioBitsPerSecond || 128000,
        videoBitsPerSecond: options.videoBitsPerSecond || 2500000
      });

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        this.stopRecording();
      };

      // Start recording
      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecording = true;

      return {
        success: true,
        message: `${type} recording started successfully`
      };

    } catch (error) {
      this.cleanup();
      
      let errorMessage = 'Failed to start recording';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permission denied. Please allow access to camera/microphone.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera/microphone found.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Recording not supported in this browser.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera/microphone constraints cannot be satisfied.';
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Stop recording and return the recorded data
   */
  async stopRecording() {
    if (!this.isRecording || !this.mediaRecorder) {
      throw new Error('No recording in progress');
    }

    return new Promise((resolve, reject) => {
      const handleStop = () => {
        try {
          // Create blob from recorded chunks
          const mimeType = this.mediaRecorder.mimeType;
          const blob = new Blob(this.chunks, { type: mimeType });
          
          // Create object URL for playback
          const url = URL.createObjectURL(blob);
          
          // Get recording metadata
          const metadata = {
            type: this.recordingType,
            mimeType,
            size: blob.size,
            duration: this.getRecordingDuration(),
            timestamp: new Date().toISOString()
          };

          this.cleanup();

          resolve({
            blob,
            url,
            metadata
          });
        } catch (error) {
          reject(error);
        }
      };

      if (this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.onstop = handleStop;
        this.mediaRecorder.stop();
      } else {
        handleStop();
      }
    });
  }

  /**
   * Pause recording (if supported)
   */
  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      return true;
    }
    return false;
  }

  /**
   * Resume recording (if supported)
   */
  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      return true;
    }
    return false;
  }

  /**
   * Get current recording state
   */
  getState() {
    return {
      isRecording: this.isRecording,
      state: this.mediaRecorder?.state || 'inactive',
      type: this.recordingType,
      duration: this.getRecordingDuration()
    };
  }

  /**
   * Get estimated recording duration (approximate)
   */
  getRecordingDuration() {
    // This is an approximation - for exact duration, you'd need to analyze the audio/video
    return this.chunks.length; // Rough estimate in seconds
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.mediaRecorder) {
      this.mediaRecorder = null;
    }
    
    this.chunks = [];
    this.isRecording = false;
  }

  /**
   * Get supported MIME types for recording
   */
  getSupportedMimeTypes(type) {
    const types = [];
    
    if (type === 'video') {
      const videoTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4;codecs=h264',
        'video/mp4'
      ];
      
      videoTypes.forEach(mimeType => {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          types.push(mimeType);
        }
      });
    } else {
      const audioTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/ogg'
      ];
      
      audioTypes.forEach(mimeType => {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          types.push(mimeType);
        }
      });
    }
    
    return types;
  }

  /**
   * Convert blob to File for upload
   */
  blobToFile(blob, filename) {
    const extension = this.recordingType === 'video' ? 'webm' : 'webm';
    const file = new File([blob], `${filename}.${extension}`, {
      type: blob.type,
      lastModified: Date.now()
    });
    return file;
  }

  /**
   * Get device capabilities
   */
  async getDeviceCapabilities() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      return {
        audioInputs: devices.filter(device => device.kind === 'audioinput'),
        videoInputs: devices.filter(device => device.kind === 'videoinput'),
        audioOutputs: devices.filter(device => device.kind === 'audiooutput')
      };
    } catch (error) {
      console.error('Error getting device capabilities:', error);
      return {
        audioInputs: [],
        videoInputs: [],
        audioOutputs: []
      };
    }
  }

  /**
   * Check permissions status
   */
  async checkPermissions() {
    try {
      const permissions = {};
      
      if (navigator.permissions) {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' });
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' });
        
        permissions.camera = cameraPermission.state;
        permissions.microphone = microphonePermission.state;
      }
      
      return permissions;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return {};
    }
  }
}

// Create singleton instance
export const recordingService = new RecordingService();

// Utility functions for recording management
export const recordingUtils = {
  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Format duration for display
   */
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * Generate unique filename for recording
   */
  generateFilename(type, timestamp = new Date()) {
    const dateStr = timestamp.toISOString().split('T')[0];
    const timeStr = timestamp.toTimeString().split(' ')[0].replace(/:/g, '-');
    return `guardian-guide-${type}-${dateStr}-${timeStr}`;
  },

  /**
   * Validate recording file
   */
  validateRecording(blob, maxSizeMB = 100) {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    
    if (blob.size > maxSize) {
      throw new Error(`Recording too large. Maximum size is ${maxSizeMB}MB`);
    }
    
    if (blob.size === 0) {
      throw new Error('Recording is empty');
    }
    
    return true;
  }
};
