"use client";

import React, { useState, useEffect, Suspense } from "react";
import { User, Lock, FlaskConical, Calendar, Bell, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

function SignInForm() {
  const { signIn, signUp, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  useEffect(() => {
    if (user) router.push(redirect);
  }, [user, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, { full_name: fullName });
        if (error) setError(error.message);
      } else {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-red-600/30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-red-600/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-red-600/30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-red-600/30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 mb-6 group">
            <FlaskConical className="w-7 h-7 text-red-500 group-hover:text-red-400 transition-colors" />
            <span className="text-white font-black tracking-widest text-lg">
              LOADOUT<span className="text-red-500">LAB</span>
            </span>
          </a>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">
            {isSignUp ? "CREATE ACCOUNT" : "WELCOME BACK"}
          </h1>
          <div className="h-px w-16 bg-red-600 mx-auto mt-3" />
        </div>

        {/* Toggle */}
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 text-xs font-black tracking-widest rounded-md transition-colors ${
              !isSignUp ? "bg-red-600 text-white" : "text-zinc-500 hover:text-white"
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 text-xs font-black tracking-widest rounded-md transition-colors ${
              isSignUp ? "bg-red-600 text-white" : "text-zinc-500 hover:text-white"
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 rounded-xl p-7 mb-5 space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs text-zinc-500 font-mono tracking-widest mb-2">FULL NAME</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 focus:border-red-600 rounded-lg text-white placeholder-zinc-700 outline-none transition-colors text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-zinc-500 font-mono tracking-widest mb-2">EMAIL</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 focus:border-red-600 rounded-lg text-white placeholder-zinc-700 outline-none transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 font-mono tracking-widest mb-2">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 focus:border-red-600 rounded-lg text-white placeholder-zinc-700 outline-none transition-colors text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white font-black text-sm tracking-widest rounded-lg transition-colors mt-2"
          >
            {loading ? "PROCESSING..." : isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
          </button>
        </form>

        {/* Benefits */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 mb-6 space-y-4">
          {[
            { Icon: Calendar, label: "Class Registration", desc: "Book and manage your training sessions" },
            { Icon: Bell,     label: "Schedule Alerts",    desc: "Get notified when new classes drop" },
            { Icon: Shield,   label: "Training History",   desc: "Track your progress over time" },
          ].map(({ Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-red-600/10 border border-red-600/20 rounded flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <div className="text-white text-sm font-bold">{label}</div>
                <div className="text-zinc-600 text-xs">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="/" className="text-zinc-700 hover:text-zinc-400 text-xs tracking-widest font-mono transition-colors">
            ← BACK TO HOME
          </a>
        </div>
      </div>
    </div>
  );
}

export default function StandaloneSignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 font-mono text-xs tracking-widest">LOADING...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
