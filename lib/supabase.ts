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

// Waitlist
export const addToWaitlist = async (email: string) => {
  if (!hasValidConfig) {
    return { error: { message: 'Supabase not configured' } };
  }
  const { error } = await supabase
    .from('waitlist')
    .insert({ email });
  return { error };
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

// Blog post types
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// Blog helpers
export const getPublishedPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, published_at, created_at')
    .eq('published', true)
    .order('published_at', { ascending: false });
  return { data, error };
};

export const getPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  return { data, error };
};

export const getAllPostsAdmin = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createPost = async (post: {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  published?: boolean;
}) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...post,
      published_at: post.published ? new Date().toISOString() : null,
    })
    .select()
    .single();
  return { data, error };
};

export const updatePost = async (id: string, updates: Partial<BlogPost>) => {
  const payload: Partial<BlogPost> = { ...updates };
  if (updates.published && !updates.published_at) {
    (payload as any).published_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from('blog_posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deletePost = async (id: string) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  return { error };
};

// Blog image upload
export const uploadBlogImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) return { url: null, error: error.message };

  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(data.path);

  return { url: publicUrl, error: null };
};