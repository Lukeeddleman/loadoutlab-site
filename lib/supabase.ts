import { createClient } from '@supabase/supabase-js';

// Get environment variables at runtime with fallback
function getEnvVars() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  };
}

// Create Supabase client with fallback for missing env vars
function createSupabaseClient() {
  const { url, key } = getEnvVars();
  
  // Debug logging (only in browser)
  if (typeof window !== 'undefined') {
    console.log('Supabase Environment Check:', {
      hasUrl: !!url,
      hasKey: !!key,
      url: url || '[MISSING]',
      keyLength: key?.length || 0
    });
  }
  
  // If we have both env vars, use them
  if (url && key) {
    return createClient(url, key);
  }
  
  // Fallback client for development/missing env vars
  console.warn('Supabase environment variables not found, using fallback client');
  return createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export const supabase = createSupabaseClient();

// Database Types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      builds: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          configuration: any; // JSON object containing the build configuration
          is_template: boolean;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          configuration: any;
          is_template?: boolean;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          configuration?: any;
          is_template?: boolean;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Auth helper functions
// Check if we have valid Supabase configuration
const hasValidConfig = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const getCurrentUser = async () => {
  if (!hasValidConfig) {
    return { user: null, error: { message: 'Supabase not configured' } };
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const signUp = async (email: string, password: string, metadata?: { username?: string; full_name?: string }) => {
  if (!hasValidConfig) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!hasValidConfig) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  if (!hasValidConfig) {
    return { error: { message: 'Supabase not configured' } };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Build management functions
export const saveBuild = async (build: {
  name: string;
  description?: string;
  configuration: any;
  is_public?: boolean;
}) => {
  if (!hasValidConfig) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('builds')
    .insert({
      user_id: user.id,
      ...build
    })
    .select()
    .single();

  return { data, error };
};

export const getUserBuilds = async () => {
  if (!hasValidConfig) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('builds')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_template', false)
    .order('updated_at', { ascending: false });

  return { data, error };
};

export const getPublicBuilds = async () => {
  if (!hasValidConfig) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  const { data, error } = await supabase
    .from('builds')
    .select(`
      *,
      profiles!builds_user_id_fkey(username, full_name)
    `)
    .eq('is_public', true)
    .eq('is_template', false)
    .order('created_at', { ascending: false })
    .limit(50);

  return { data, error };
};

export const getTemplates = async () => {
  if (!hasValidConfig) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  const { data, error } = await supabase
    .from('builds')
    .select(`
      *,
      profiles!builds_user_id_fkey(username, full_name)
    `)
    .eq('is_template', true)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const updateBuild = async (buildId: string, updates: {
  name?: string;
  description?: string;
  configuration?: any;
  is_public?: boolean;
}) => {
  if (!hasValidConfig) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  const { data, error } = await supabase
    .from('builds')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', buildId)
    .select()
    .single();

  return { data, error };
};

export const deleteBuild = async (buildId: string) => {
  if (!hasValidConfig) {
    return { error: { message: 'Supabase not configured' } };
  }

  const { error } = await supabase
    .from('builds')
    .delete()
    .eq('id', buildId);

  return { error };
};