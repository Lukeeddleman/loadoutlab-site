import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('Supabase initialization:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length
});

// Create a fallback client for build time
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

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
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const signUp = async (email: string, password: string, metadata?: { username?: string; full_name?: string }) => {
  console.log('Attempting to sign up with:', { email, hasPassword: !!password, metadata });
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Using placeholder client:', supabaseUrl === 'https://placeholder.supabase.co');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    console.log('Sign up result:', { data: data?.user?.id ? 'User created' : 'No user', error });
    return { data, error };
  } catch (err) {
    console.error('Sign up catch error:', err);
    return { data: null, error: { message: 'Network error during sign up' } };
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
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
  const { error } = await supabase
    .from('builds')
    .delete()
    .eq('id', buildId);

  return { error };
};