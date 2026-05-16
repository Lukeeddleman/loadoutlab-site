"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  supabase,
  signIn,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  uploadBlogImage,
  type BlogPost,
} from '@/lib/supabase';

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
};

const emptyForm: FormState = { title: '', slug: '', excerpt: '', content: '', published: false };

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function BlogAdminPage() {
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth on load
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAuthed(!!data?.user);
      setAuthChecked(true);
    });
  }, []);

  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    const { data } = await getAllPostsAdmin();
    setPosts((data as BlogPost[]) || []);
    setPostsLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadPosts();
  }, [authed, loadPosts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const { error } = await signIn(email, password);
    if (error) {
      setLoginError(error.message || 'Login failed.');
    } else {
      setAuthed(true);
    }
    setLoginLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await uploadBlogImage(file);
    setUploading(false);
    if (error || !url) {
      alert('Upload failed: ' + error);
      return;
    }
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const imageMarkdown = `\n![](${url})\n`;
    const newContent = form.content.slice(0, start) + imageMarkdown + form.content.slice(end);
    setForm(f => ({ ...f, content: newContent }));
    e.target.value = '';
  };

  const handleTitleChange = (val: string) => {
    setForm((f) => ({
      ...f,
      title: val,
      slug: slugManual ? f.slug : slugify(val),
    }));
  };

  const handleSlugChange = (val: string) => {
    setSlugManual(true);
    setForm((f) => ({ ...f, slug: val }));
  };

  const startEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setSlugManual(true);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      published: post.published,
    });
    setSaveError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSlugManual(false);
    setSaveError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      setSaveError('Title, slug, and content are required.');
      return;
    }
    setSaving(true);
    setSaveError('');
    if (editingId) {
      const { error } = await updatePost(editingId, {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content,
        published: form.published,
      });
      if (error) setSaveError((error as any).message || 'Save failed.');
      else { resetForm(); loadPosts(); }
    } else {
      const { error } = await createPost({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || undefined,
        content: form.content,
        published: form.published,
      });
      if (error) setSaveError((error as any).message || 'Save failed.');
      else { resetForm(); loadPosts(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deletePost(id);
    loadPosts();
    if (editingId === id) resetForm();
  };

  const handleTogglePublish = async (post: BlogPost) => {
    await updatePost(post.id, { published: !post.published });
    loadPosts();
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500 text-sm font-mono">Checking auth…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-white font-black text-2xl tracking-tight mb-1">Blog Admin</h1>
          <p className="text-zinc-600 text-sm mb-8">Loadout Lab — Instructor access only.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-mono tracking-widest mb-1">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-red-600/60 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-mono tracking-widest mb-1">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-red-600/60 transition-colors"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black py-3 rounded-lg text-sm tracking-widest transition-colors"
            >
              {loginLoading ? 'SIGNING IN…' : 'SIGN IN'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Blog Admin</h1>
            <p className="text-zinc-600 text-sm">Loadout Lab — Instructor Feed</p>
          </div>
          <a href="/blog" target="_blank" rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white text-xs font-mono tracking-widest transition-colors">
            VIEW BLOG →
          </a>
        </div>

        {/* Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-black tracking-tight text-white mb-6">
            {editingId ? 'EDIT POST' : 'NEW POST'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-xs font-mono tracking-widest mb-1">TITLE *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-red-600/60 transition-colors"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-mono tracking-widest mb-1">SLUG *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-red-600/60 transition-colors font-mono"
                  placeholder="post-slug"
                />
              </div>
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-mono tracking-widest mb-1">EXCERPT (optional)</label>
              <input
                type="text"
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-red-600/60 transition-colors"
                placeholder="Short summary shown on the blog index"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-zinc-400 text-xs font-mono tracking-widest">CONTENT *</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 px-3 py-1.5 rounded text-xs font-mono tracking-widest transition-colors"
                >
                  {uploading ? 'UPLOADING...' : '📷 INSERT PHOTO'}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <textarea
                ref={contentRef}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={16}
                placeholder="Write your post here..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white text-sm font-mono resize-y focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor="published" className="text-zinc-400 text-sm">Publish immediately</label>
            </div>
            {saveError && <p className="text-red-500 text-xs">{saveError}</p>}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-lg text-xs tracking-widest transition-colors"
              >
                {saving ? 'SAVING…' : editingId ? 'UPDATE POST' : 'CREATE POST'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-white font-bold px-6 py-2.5 rounded-lg text-xs tracking-widest transition-colors"
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Post list */}
        <div>
          <h2 className="text-lg font-black tracking-tight text-white mb-4">ALL POSTS</h2>
          {postsLoading ? (
            <p className="text-zinc-600 text-sm font-mono">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-zinc-600 text-sm">No posts yet. Create your first one above.</p>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xs font-mono font-bold tracking-widest px-2 py-0.5 rounded ${
                        post.published ? 'bg-green-900/40 text-green-400 border border-green-800/50' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}>
                        {post.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                    <p className="text-white font-bold text-sm truncate">{post.title}</p>
                    <p className="text-zinc-600 text-xs font-mono">/blog/{post.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className="text-xs font-mono tracking-widest px-3 py-1.5 rounded border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition-colors"
                    >
                      {post.published ? 'UNPUBLISH' : 'PUBLISH'}
                    </button>
                    <button
                      onClick={() => startEdit(post)}
                      className="text-xs font-mono tracking-widest px-3 py-1.5 rounded border border-zinc-700 hover:border-red-600/50 text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-xs font-mono tracking-widest px-3 py-1.5 rounded border border-zinc-800 hover:border-red-700/60 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
