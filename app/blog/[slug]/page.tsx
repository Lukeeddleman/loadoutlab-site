import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FlaskConical, ArrowRight } from 'lucide-react';
import { getPostBySlug } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getPostBySlug(slug);
  if (!data) return { title: 'Post Not Found — Loadout Lab' };
  return {
    title: `${data.title} — Loadout Lab`,
    description: data.excerpt || 'Instructor field notes from Loadout Lab — Austin, TX firearms training.',
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await getPostBySlug(slug);

  if (!post) notFound();

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
          <Link href="/blog" className="text-zinc-600 hover:text-zinc-400 text-xs font-mono tracking-widest transition-colors">
            ← INSTRUCTOR FEED
          </Link>
        </div>
      </header>

      {/* Post */}
      <article className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-4 h-px bg-red-600" />
            <time className="text-zinc-600 text-xs font-mono tracking-widest">
              {formatDate(post.published_at || post.created_at)}
            </time>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-zinc-400 text-lg leading-relaxed mb-8 border-l-2 border-red-600/50 pl-5">
              {post.excerpt}
            </p>
          )}

          <div className="h-px w-full bg-zinc-900 mb-10" />

          <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed">
            <ReactMarkdown
              components={{
                img: ({ src, alt }) => (
                  <img
                    src={src}
                    alt={alt || ''}
                    className="rounded-lg w-full my-6 border border-zinc-800"
                  />
                ),
                p: ({ children }) => (
                  <p className="mb-5 text-zinc-300 leading-relaxed">{children}</p>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-black text-white tracking-wide mt-10 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-black text-white tracking-wide mt-8 mb-3">{children}</h3>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-bold">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-5 text-zinc-300 space-y-1">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-zinc-300">{children}</li>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="h-px w-full bg-zinc-900 mb-10" />
          <div className="relative border border-zinc-900 rounded-xl p-10 text-center bg-zinc-950">
            <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-red-600/40 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-red-600/40 pointer-events-none" />
            <h2 className="text-2xl font-black text-white tracking-tight mb-3">Ready to train?</h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-sm mx-auto">
              Check out upcoming classes or reach out to Luke directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#classes"
                className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-black text-xs tracking-widest transition-colors inline-flex items-center justify-center gap-2"
              >
                VIEW CLASSES <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white px-8 py-3 rounded-lg font-black text-xs tracking-widest transition-colors"
              >
                CONTACT LUKE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-800 text-xs font-mono tracking-widest">
            © {new Date().getFullYear()} LOADOUT LAB. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-zinc-700 hover:text-white text-xs tracking-widest transition-colors font-mono">HOME</Link>
            <Link href="/blog" className="text-zinc-700 hover:text-white text-xs tracking-widest transition-colors font-mono">FEED</Link>
            <Link href="/contact" className="text-zinc-700 hover:text-white text-xs tracking-widest transition-colors font-mono">CONTACT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
