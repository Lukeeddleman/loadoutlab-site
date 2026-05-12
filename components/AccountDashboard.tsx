"use client";

import React, { useEffect } from "react";
import { FlaskConical, User, Calendar, Bell, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AccountDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 font-mono text-xs tracking-widest">LOADING...</div>
      </div>
    );
  }

  const displayName = (user.user_metadata?.full_name as string) || user.email || "OPERATOR";

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(220,38,38,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(220,38,38,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Header */}
      <header className="bg-black/95 border-b border-zinc-900 px-6 py-4 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <FlaskConical className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
            <span className="text-white font-black tracking-widest text-base">
              LOADOUT<span className="text-red-500">LAB</span>
            </span>
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-zinc-600 hover:text-white text-xs tracking-widest font-mono transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> SIGN OUT
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        {/* Welcome */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-red-600" />
            <span className="text-red-500 text-xs font-mono tracking-widest">YOUR ACCOUNT</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">
            WELCOME BACK,
          </h1>
          <h1 className="text-5xl font-black text-red-600 tracking-tighter leading-none uppercase">
            {displayName.split(" ")[0]}.
          </h1>
          <div className="h-px w-24 bg-red-600/40 mt-6" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {/* Profile card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-white font-black text-sm tracking-wide">PROFILE</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-zinc-600 text-xs font-mono tracking-widest mb-0.5">NAME</div>
                <div className="text-white text-sm">
                  {(user.user_metadata?.full_name as string) || "—"}
                </div>
              </div>
              <div>
                <div className="text-zinc-600 text-xs font-mono tracking-widest mb-0.5">EMAIL</div>
                <div className="text-zinc-300 text-sm">{user.email}</div>
              </div>
              <div>
                <div className="text-zinc-600 text-xs font-mono tracking-widest mb-0.5">MEMBER SINCE</div>
                <div className="text-zinc-300 text-sm">
                  {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>
              </div>
            </div>
          </div>

          {/* Classes card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-white font-black text-sm tracking-wide">CLASSES</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
              <div className="text-4xl font-black text-zinc-800 mb-2">0</div>
              <div className="text-zinc-600 text-xs font-mono tracking-widest mb-5">CLASSES BOOKED</div>
              <a href="/#classes"
                className="text-red-500 hover:text-red-400 text-xs font-bold tracking-widest flex items-center gap-1 transition-colors">
                BROWSE CLASSES <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Notifications card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-white font-black text-sm tracking-wide">NOTIFICATIONS</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
              <div className="w-2 h-2 rounded-full bg-red-600 mx-auto mb-3" />
              <div className="text-zinc-400 text-xs font-mono tracking-widest mb-1">WAITLIST ACTIVE</div>
              <div className="text-zinc-600 text-xs leading-relaxed">
                You&apos;ll be notified when new classes are scheduled.
              </div>
            </div>
          </div>
        </div>

        {/* Coming soon banner */}
        <div className="bg-zinc-950 border border-red-600/15 rounded-xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-red-500 text-xs font-mono tracking-widest mb-3">COMING SOON</div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              CLASS BOOKING IS ON THE WAY
            </h2>
            <div className="h-px w-16 bg-red-600/40 mx-auto mb-4" />
            <p className="text-zinc-500 text-sm max-w-md mx-auto mb-6">
              Full scheduling, payment, and class management is being built out now.
              You&apos;re already on the list — we&apos;ll reach out when spots open up.
            </p>
            <a href="/#classes"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-black text-xs tracking-widest transition-colors">
              VIEW UPCOMING CLASSES <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
