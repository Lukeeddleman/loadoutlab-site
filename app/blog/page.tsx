import type { Metadata } from 'next';
import Link from 'next/link';
import { FlaskConical } from 'lucide-react';
import { getPublishedPosts } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Instructor Feed — Loadout Lab | Austin Firearms Training',
  description: 'Class recaps, shooting tips, and field notes from Luke Eddleman — firearms instructor serving Austin, Kyle, Buda, and San Marcos, TX.',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage() {
  const { data: posts } = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-900 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <FlaskConical className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
            <span className="text-white font-black tracking-widest text-base">
              LOADOUT<span className="text-red-500">LAB</span>
            </span>
          </Link>
          <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-xs font-mono tracking-widest transition-colors">
            ← BACK TO SITE
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-red-600/30 pointer-events-none" />
        <div className="absolute top-6 right-6 w-10 h-10 border-r-2 border-t-2 border-red-600/30 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-red-600" />
            <span className="text-red-500 text-xs font-mono tracking-widest">FROM THE INSTRUCTOR</span>
            <div className="w-8 h-px bg-red-600" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-4">
            INSTRUCTOR <span className="text-red-600">FEED</span>
          </h1>
          <div className="h-px w-24 bg-red-600/40 mx-auto mb-6" />
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Class recaps, shooting tips, and field notes from Luke Eddleman — Austin, TX firearms instructor.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          {!posts || posts.length === 0 ? (
            <div className="border border-zinc-900 rounded-xl p-12 text-center bg-zinc-950">
              <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-red-600/20" />
              <p className="text-zinc-500 text-sm leading-relaxed">
                New posts coming soon. Luke will be sharing class recaps, tips, and field notes here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article key={post.id} className="border border-zinc-900 rounded-xl p-7 bg-zinc-950 hover:border-zinc-700 transition-colors group">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-px bg-red-600" />
                    <time className="text-zinc-600 text-xs font-mono tracking-widest">
                      {formatDate(post.published_at || post.created_at)}
                    </time>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight mb-3 group-hover:text-zinc-100 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-zinc-500 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-red-500 hover:text-red-400 text-xs font-black tracking-widest transition-colors"
                  >
                    READ MORE →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer hint */}
      <div className="px-6 pb-16 text-center">
        <Link href="/faq" className="text-zinc-600 hover:text-zinc-400 text-xs font-mono tracking-widest transition-colors">
          Have questions? Visit the FAQ →
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-800 text-xs font-mono tracking-widest">
            © {new Date().getFullYear()} LOADOUT LAB. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-zinc-700 hover:text-white text-xs tracking-widest transition-colors font-mono">HOME</Link>
            <Link href="/#classes" className="text-zinc-700 hover:text-white text-xs tracking-widest transition-colors font-mono">CLASSES</Link>
            <Link href="/contact" className="text-zinc-700 hover:text-white text-xs tracking-widest transition-colors font-mono">CONTACT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
