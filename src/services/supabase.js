import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database service functions
export const supabaseService = {
  // User operations
  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating user:', error);
      return { data: null, error: error.message };
    }
  },

  async getUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userId', userId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { data: null, error: error.message };
    }
  },

  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('userId', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      return { data: null, error: error.message };
    }
  },

  // Incident operations
  async createIncident(incidentData) {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .insert([incidentData])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating incident:', error);
      return { data: null, error: error.message };
    }
  },

  async getUserIncidents(userId) {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return { data: null, error: error.message };
    }
  },

  async updateIncident(reportId, updates) {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .update(updates)
        .eq('reportId', reportId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating incident:', error);
      return { data: null, error: error.message };
    }
  },

  async deleteIncident(reportId) {
    try {
      const { error } = await supabase
        .from('incident_reports')
        .delete()
        .eq('reportId', reportId);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting incident:', error);
      return { error: error.message };
    }
  },

  // File upload for recordings
  async uploadRecording(file, fileName) {
    try {
      const { data, error } = await supabase.storage
        .from('recordings')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);
      
      return { data: { ...data, publicUrl: urlData.publicUrl }, error: null };
    } catch (error) {
      console.error('Error uploading recording:', error);
      return { data: null, error: error.message };
    }
  },

  // Jurisdiction data operations
  async getJurisdictionData(state) {
    try {
      const { data, error } = await supabase
        .from('jurisdiction_data')
        .select('*')
        .eq('state', state)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching jurisdiction data:', error);
      return { data: null, error: error.message };
    }
  }
};

// Authentication helpers
export const authService = {
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error: error.message };
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error: error.message };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { data: user, error: null };
    } catch (error) {
      console.error('Error getting current user:', error);
      return { data: null, error: error.message };
    }
  }
};
