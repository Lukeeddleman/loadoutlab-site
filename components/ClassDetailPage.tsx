"use client";

import React, { useState } from 'react';
import { FlaskConical, ArrowLeft, Clock, ChevronRight, CheckCircle, Bell } from 'lucide-react';
import { addToWaitlist } from '@/lib/supabase';

interface ClassDetailProps {
  slug: string;
  level: string;
  title: string;
  duration: string;
  desc: string;
  details: string[];
  calUrl: string;
  comingSoon?: boolean;
}

export default function ClassDetailPage({ level, title, duration, desc, details, calUrl, comingSoon }: ClassDetailProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await addToWaitlist(email);
    if (!error || error.message?.includes('duplicate') || error.message?.includes('unique')) {
      setSubmitted(true);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-red-600/30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-red-600/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-red-600/30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-red-600/30 pointer-events-none" />

      {/* Header */}
      <header className="bg-black/95 border-b border-zinc-900 px-6 py-4 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <FlaskConical className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
            <span className="text-white font-black tracking-widest text-base">
              LOADOUT<span className="text-red-500">LAB</span>
            </span>
          </a>
          <a href="/#classes" className="flex items-center gap-2 text-zinc-600 hover:text-white text-xs tracking-widest font-mono transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> ALL CLASSES
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Left — class info */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-red-600" />
              <span className="text-red-500 text-xs font-mono tracking-widest">{level}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">
              {title}
            </h1>
            <div className="h-px w-24 bg-red-600/40 mb-6" />

            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-8">
              <Clock className="w-4 h-4" />
              <span className="font-mono tracking-widest">{duration}</span>
            </div>

            <p className="text-zinc-400 leading-relaxed mb-10 text-lg">
              {desc}
            </p>

            {/* What's covered */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-7">
              <p className="text-zinc-600 text-xs font-mono tracking-widest mb-5">WHAT&apos;S COVERED</p>
              <ul className="space-y-3">
                {details.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — booking CTA */}
          <div className="md:sticky md:top-8">
            <div className="bg-zinc-950 border border-red-600/20 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-red-600/30 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-red-600/30 pointer-events-none" />

              <div className="relative z-10">
                {comingSoon ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-4 h-4 text-zinc-600" />
                      <p className="text-zinc-600 text-xs font-mono tracking-widest">COMING SOON</p>
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight mb-1">GET NOTIFIED</h2>
                    <div className="h-px w-16 bg-zinc-800 mb-5" />
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                      This class is coming soon. Drop your email and you&apos;ll be the first to know when dates open up.
                    </p>
                    {submitted ? (
                      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-center">
                        <CheckCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <p className="text-white text-sm font-bold tracking-wide">You&apos;re on the list.</p>
                        <p className="text-zinc-500 text-xs mt-1">We&apos;ll reach out when this class opens up.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleWaitlist} className="space-y-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="your@email.com"
                          className="w-full bg-black border border-zinc-800 focus:border-red-600 text-white placeholder-zinc-700 px-4 py-3 rounded-lg outline-none transition-colors text-sm"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-600/40 disabled:opacity-50 text-white py-3 rounded-lg font-black text-sm tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          <Bell className="w-4 h-4" />
                          {loading ? 'SUBMITTING...' : 'NOTIFY ME'}
                        </button>
                      </form>
                    )}
                    <p className="text-zinc-700 text-xs text-center font-mono mt-4">
                      Or call (512) 553-5798
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-red-500 text-xs font-mono tracking-widest mb-2">READY TO TRAIN?</p>
                    <h2 className="text-2xl font-black text-white tracking-tight mb-1">BOOK YOUR SPOT</h2>
                    <div className="h-px w-16 bg-red-600/40 mb-6" />

                    <div className="space-y-3 mb-8">
                      {[
                        'Pick a date and time that works for you',
                        'Receive confirmation and details via email',
                        'Show up ready to work',
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-red-600/20 border border-red-600/30 rounded text-red-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <span className="text-zinc-400 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={calUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-lg font-black text-sm tracking-widest transition-colors flex items-center justify-center gap-2 mb-4"
                    >
                      BOOK NOW <ChevronRight className="w-4 h-4" />
                    </a>

                    <p className="text-zinc-700 text-xs text-center font-mono">
                      Powered by Calendly &nbsp;·&nbsp; No account required
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Questions CTA */}
            <div className="mt-5 bg-zinc-950 border border-zinc-900 rounded-xl p-6 text-center">
              <p className="text-zinc-500 text-sm mb-3">Have questions before booking?</p>
              <a href="/contact"
                className="text-red-500 hover:text-red-400 text-xs font-black tracking-widest transition-colors">
                CONTACT LUKE →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
