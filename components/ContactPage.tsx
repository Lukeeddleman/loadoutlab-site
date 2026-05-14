"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, Send, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError('Something went wrong. Try emailing luke@loadoutlab.com directly.');
      }
    } catch {
      setError('Something went wrong. Try emailing luke@loadoutlab.com directly.');
    } finally {
      setLoading(false);
    }
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
          <a href="/" className="flex items-center group">
            <Image src="/logo.png" alt="Loadout Lab" width={120} height={40} className="h-10 w-auto" />
          </a>
          <a href="/" className="flex items-center gap-2 text-zinc-600 hover:text-white text-xs tracking-widest font-mono transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> BACK
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Left — info */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-red-600" />
              <span className="text-red-500 text-xs font-mono tracking-widest">GET IN TOUCH</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">
              LET&apos;S<br /><span className="text-red-600">TALK.</span>
            </h1>
            <div className="h-px w-24 bg-red-600/40 mb-8" />
            <p className="text-zinc-400 leading-relaxed mb-10">
              Whether you&apos;re interested in private instruction, have questions about upcoming classes,
              or just want to know more about what Loadout Lab offers — reach out. Luke responds personally.
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="text-zinc-600 text-xs font-mono tracking-widest mb-0.5">EMAIL</div>
                  <a href="mailto:luke@loadoutlab.com"
                    className="text-white text-sm hover:text-red-400 transition-colors">
                    luke@loadoutlab.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="text-zinc-600 text-xs font-mono tracking-widest mb-0.5">PHONE</div>
                  <a href="tel:5125535798"
                    className="text-white text-sm hover:text-red-400 transition-colors">
                    (512) 553-5798
                  </a>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="mt-12 bg-zinc-950 border border-zinc-900 rounded-xl p-6">
              <p className="text-zinc-600 text-xs font-mono tracking-widest mb-4">GOOD FOR</p>
              <ul className="space-y-2">
                {[
                  'Private lesson inquiries',
                  'Group class bookings',
                  'Questions about experience level',
                  'Corporate or team training',
                  'General questions',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-1 h-1 rounded-full bg-red-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <div className="bg-zinc-950 border border-red-600/20 rounded-xl p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-red-600/30 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-red-600/30 pointer-events-none" />
                <div className="relative z-10">
                  <CheckCircle className="w-12 h-12 text-red-500 mx-auto mb-5" />
                  <h2 className="text-2xl font-black text-white tracking-widest mb-2">MESSAGE SENT</h2>
                  <div className="h-px w-16 bg-red-600/40 mx-auto mb-5" />
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    Luke will get back to you personally. Usually within 24 hours.
                  </p>
                  <a href="/"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-black text-xs tracking-widest transition-colors">
                    BACK TO HOME
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-500 font-mono tracking-widest mb-2">NAME *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full bg-black border border-zinc-800 focus:border-red-600 text-white placeholder-zinc-700 px-4 py-3 rounded-lg outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 font-mono tracking-widest mb-2">EMAIL *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-black border border-zinc-800 focus:border-red-600 text-white placeholder-zinc-700 px-4 py-3 rounded-lg outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 font-mono tracking-widest mb-2">SUBJECT</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 focus:border-red-600 text-white px-4 py-3 rounded-lg outline-none transition-colors text-sm appearance-none"
                  >
                    <option value="">Select a topic...</option>
                    <option value="Private Lesson Inquiry">Private Lesson Inquiry</option>
                    <option value="Group Class Booking">Group Class Booking</option>
                    <option value="Corporate / Team Training">Corporate / Team Training</option>
                    <option value="General Question">General Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 font-mono tracking-widest mb-2">MESSAGE *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell Luke what you're looking for..."
                    className="w-full bg-black border border-zinc-800 focus:border-red-600 text-white placeholder-zinc-700 px-4 py-3 rounded-lg outline-none transition-colors text-sm resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm font-mono">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white py-4 rounded-lg font-black text-sm tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'SENDING...' : <><Send className="w-4 h-4" /> SEND MESSAGE</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
