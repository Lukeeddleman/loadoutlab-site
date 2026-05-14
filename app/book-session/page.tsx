"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlaskConical, CalendarCheck, Loader2 } from 'lucide-react';

function BookSessionContent() {
  const params = useSearchParams();
  const calendlyUrl = params.get('calendly');
  const hours = params.get('hours');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!calendlyUrl) return;
    if (countdown === 0) {
      window.location.href = calendlyUrl;
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, calendlyUrl]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
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

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <a href="/" className="inline-flex items-center gap-2 mb-12 group">
          <FlaskConical className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
          <span className="text-white font-black tracking-widest text-base">
            LOADOUT<span className="text-red-500">LAB</span>
          </span>
        </a>

        <div className="bg-zinc-950 border border-red-600/20 rounded-xl p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
          <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-red-600/30 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-red-600/30 pointer-events-none" />

          <div className="relative z-10">
            <CalendarCheck className="w-12 h-12 text-red-500 mx-auto mb-6" />
            <p className="text-red-500 text-xs font-mono tracking-widest mb-2">PAYMENT CONFIRMED</p>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Now let&apos;s get you scheduled.
            </h1>
            <div className="h-px w-16 bg-red-600/40 mx-auto mb-6" />
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              Your {hours}-hour session is paid for. Pick the date and time that works for you.
            </p>

            {calendlyUrl ? (
              <>
                <a
                  href={calendlyUrl}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-lg font-black text-sm tracking-widest transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  PICK YOUR DATE & TIME
                </a>
                <p className="text-zinc-700 text-xs font-mono flex items-center justify-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Redirecting automatically in {countdown}s...
                </p>
              </>
            ) : (
              <div className="text-zinc-500 text-sm">
                <p>Something went wrong with the redirect.</p>
                <a href="/contact" className="text-red-500 hover:text-red-400 font-black tracking-widest text-xs mt-3 inline-block">
                  CONTACT LUKE →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookSessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <BookSessionContent />
    </Suspense>
  );
}
