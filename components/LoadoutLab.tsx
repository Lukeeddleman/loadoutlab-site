"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MerchStore from '@/components/MerchStore';
import {
  FlaskConical, Shield, ChevronRight, Calendar,
  ShoppingBag, User, Menu, X,
  ArrowRight, Award, BookOpen, Crosshair, Target
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { addToWaitlist } from '@/lib/supabase';

// ─── Age Gate ─────────────────────────────────────────────────────────────────

const AgeGate = ({ onVerify, visible }: { onVerify: (v: boolean) => void; visible: boolean }) => (
  <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
    {/* Tactical grid */}
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: `linear-gradient(rgba(220,38,38,0.07) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(220,38,38,0.07) 1px, transparent 1px)`,
      backgroundSize: '40px 40px'
    }} />
    {/* Corner brackets */}
    <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-red-600/50 pointer-events-none" />
    <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-red-600/50 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-red-600/50 pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-red-600/50 pointer-events-none" />

    {/* Logo */}
    <div className="absolute top-8 left-8 flex items-center gap-2">
      <FlaskConical className="w-7 h-7 text-red-500" />
      <span className="text-white font-black tracking-widest text-lg">
        LOADOUT<span className="text-red-500">LAB</span>
      </span>
    </div>

    {/* Modal */}
    <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative bg-zinc-950 border border-red-600/25 rounded-xl p-8 max-w-sm w-full shadow-2xl shadow-red-950/40">
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent rounded-xl pointer-events-none" />
        <div className="relative z-10">
          <div className="text-center mb-7">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-black text-white tracking-widest mb-1">AGE VERIFICATION</h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-4" />
            <p className="text-zinc-400 text-sm leading-relaxed">
              This site contains firearms-related content including instruction, gear, and specifications.
              You must be 18 or older to enter.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => onVerify(true)}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 tracking-widest text-sm"
            >
              I AM 18 OR OLDER <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onVerify(false)}
              className="w-full bg-transparent border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 font-medium py-3 px-6 rounded-lg transition-colors tracking-wide text-sm"
            >
              I AM UNDER 18
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Rejected ─────────────────────────────────────────────────────────────────

const RejectedScreen = () => (
  <div className="min-h-screen bg-black flex items-center justify-center p-4">
    <div className="text-center max-w-sm">
      <Shield className="w-16 h-16 text-red-700 mx-auto mb-4" />
      <h1 className="text-2xl font-black text-white tracking-widest mb-2">ACCESS DENIED</h1>
      <div className="h-px w-32 bg-gradient-to-r from-transparent via-red-700 to-transparent mx-auto mb-4" />
      <p className="text-zinc-500 text-sm">
        Loadout Lab is restricted to users 18 and older due to firearms-related content.
      </p>
    </div>
  </div>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = ({ user }: { user: unknown }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT', href: '#about' },
    { label: 'CLASSES', href: '#classes' },
    { label: 'MERCH', href: '#merch' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-sm border-b border-zinc-900' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <FlaskConical className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
          <span className="text-white font-black tracking-widest text-base">
            LOADOUT<span className="text-red-500">LAB</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href}
              className="text-zinc-500 hover:text-white text-xs font-bold tracking-widest transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">

          <a href="#classes"
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg text-xs font-black tracking-widest transition-colors">
            BOOK A CLASS
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-zinc-400 hover:text-white transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/98 border-t border-zinc-900 px-6 py-6 space-y-5">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block text-zinc-400 hover:text-white text-sm tracking-widest py-1 transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#classes" onClick={() => setOpen(false)}
            className="block bg-red-600 text-white text-center py-3 rounded-lg font-black text-sm tracking-widest mt-2">
            BOOK A CLASS
          </a>
        </div>
      )}
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

const HeroSection = () => (
  <section id="home" className="min-h-screen bg-black flex items-center relative overflow-hidden pt-20">
    {/* Grid */}
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: `linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)`,
      backgroundSize: '60px 60px'
    }} />
    {/* Red ambient glow */}
    <div className="absolute top-1/3 left-1/3 w-[700px] h-[700px] bg-red-700/8 rounded-full blur-3xl pointer-events-none" />
    {/* Corner accents */}
    <div className="absolute top-24 left-6 w-10 h-10 border-l-2 border-t-2 border-red-600/30 pointer-events-none" />
    <div className="absolute top-24 right-6 w-10 h-10 border-r-2 border-t-2 border-red-600/30 pointer-events-none" />

    <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
      <div className="max-w-3xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-red-600" />
          <span className="text-red-500 text-xs font-mono tracking-widest uppercase">
            Texas-Based Firearms Instruction
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white leading-none mb-2 tracking-tighter">
          CONTROL.
        </h1>
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-red-600 leading-none mb-2 tracking-tighter">
          TEST.
        </h1>
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white leading-none tracking-tighter">
          IMPROVE.
        </h1>

        <div className="h-px w-48 bg-gradient-to-r from-red-600 to-transparent my-8" />

        <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl">
          Professional firearms instruction from a military veteran and federal security professional.
          Every student leaves more capable, more confident, and safer with a firearm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#classes"
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-lg font-black text-sm tracking-widest transition-colors flex items-center justify-center gap-2">
            VIEW CLASSES <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#about"
            className="border border-zinc-800 hover:border-zinc-600 text-white px-8 py-4 rounded-lg font-black text-sm tracking-widest transition-colors flex items-center justify-center gap-2">
            MEET THE INSTRUCTOR
          </a>
        </div>
      </div>
    </div>

    {/* Decorative crosshair */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-5 pointer-events-none">
      <Crosshair className="w-[500px] h-[500px] text-red-600" />
    </div>
  </section>
);

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const StatsBar = () => (
  <div className="bg-zinc-950 border-y border-zinc-900 py-10">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {[
        { value: 'MILITARY', label: 'VETERAN' },
        { value: 'FEDERAL', label: 'SECURITY' },
        { value: 'EXPERIENCED', label: 'RANGE INSTRUCTOR' },
        { value: 'TEXAS', label: 'BASED' },
      ].map((s) => (
        <div key={s.label} className="group">
          <div className="text-lg font-black text-red-500 tracking-widest mb-1 group-hover:text-red-400 transition-colors">
            {s.value}
          </div>
          <div className="text-xs text-zinc-600 tracking-widest font-mono">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── About ────────────────────────────────────────────────────────────────────

const AboutSection = () => (
  <section id="about" className="bg-black py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-red-600" />
            <span className="text-red-500 text-xs font-mono tracking-widest">THE INSTRUCTOR</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">
            LUKE EDDLEMAN.<br /><span className="text-red-600">REAL</span><br />EXPERIENCE.
          </h2>
          <div className="h-px w-24 bg-red-600/40 mb-7" />
          <p className="text-zinc-400 leading-relaxed mb-5">
            Loadout Lab isn&apos;t run by someone who took a weekend course and printed a certificate.
            Luke Eddleman brings years of real-world experience — U.S. military service,
            federal security work, and time as a professional range instructor.
          </p>
          <p className="text-zinc-400 leading-relaxed mb-10">
            The goal is simple: take every student from where they are and make them more capable,
            more confident, and safer with a firearm. No judgment, no ego — just results.
          </p>

          {/* Credentials */}
          <div className="space-y-3">
            {[
              { Icon: Award,    label: 'U.S. Military Veteran' },
              { Icon: Shield,   label: 'Federal Security Professional' },
              { Icon: Target,   label: 'Professional Range Instructor' },
              { Icon: BookOpen, label: 'LTC Instruction Coming Soon' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600/10 border border-red-600/25 rounded flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-zinc-300 text-sm tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor photo */}
        <div className="relative">
          <div className="aspect-square bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden">
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-red-600/60 z-10" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-red-600/60 z-10" />
            <Image
              src="/instructor.PNG"
              alt="Luke Eddleman — Loadout Lab Instructor"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Classes ──────────────────────────────────────────────────────────────────

const ClassesSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await addToWaitlist(email);
    if (!error || error.message?.includes('duplicate') || error.message?.includes('unique')) {
      setSubmitted(true);
    } else {
      console.error('Waitlist error:', error);
      setSubmitted(true);
    }
    setLoading(false);
  };

  const offerings = [
    {
      slug: 'fundamentals',
      level: 'BEGINNER',
      title: 'FUNDAMENTALS',
      desc: 'Safe handling, range etiquette, stance, grip, sight alignment, and trigger control. The foundation everything else is built on.',
      duration: '2–3 Hours',
      comingSoon: true,
    },
    {
      slug: 'defensive-pistol',
      level: 'INTERMEDIATE',
      title: 'DEFENSIVE PISTOL',
      desc: 'Drawing from holster, close-quarters drills, malfunction clearing, and real-world defensive scenarios.',
      duration: '3–4 Hours',
      comingSoon: true,
    },
    {
      slug: 'carbine-ar-platform',
      level: 'INTERMEDIATE',
      title: 'CARBINE / AR PLATFORM',
      desc: 'AR familiarization, zeroing, precision fundamentals, positional shooting, and practical drills.',
      duration: '3–4 Hours',
      comingSoon: true,
    },
    {
      slug: 'squad-training',
      level: 'ALL LEVELS',
      title: 'SQUAD TRAINING',
      desc: 'Train with your people. Group sessions for friends, couples, families, or teams who want to build skills and confidence together.',
      duration: '3–4 Hours',
      comingSoon: true,
    },
    {
      slug: 'precision-fundamentals',
      level: 'INTERMEDIATE / ADVANCED',
      title: 'PRECISION FUNDAMENTALS',
      desc: 'Dial in your accuracy. The science and mechanics behind consistent, repeatable precision shooting at distance.',
      duration: '3–4 Hours',
      comingSoon: true,
    },
    {
      slug: 'private-instruction',
      level: 'ALL LEVELS',
      title: 'PRIVATE INSTRUCTION',
      desc: 'One-on-one sessions tailored to your goals, experience level, and schedule. Maximum results, minimum wasted time.',
      duration: 'Flexible',
      comingSoon: false,
    },
  ];

  return (
    <section id="classes" className="bg-zinc-950 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-red-600" />
            <span className="text-red-500 text-xs font-mono tracking-widest">TRAINING PROGRAMS</span>
            <div className="w-8 h-px bg-red-600" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
            WHAT WE <span className="text-red-600">TEACH</span>
          </h2>
          <div className="h-px w-24 bg-red-600/40 mx-auto mb-6" />
          <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed">
            Classes are being scheduled now. Join the waitlist and you&apos;ll be the first to know when spots open up.
          </p>
        </div>

        {/* Class cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {offerings.map((cls) => (
            <a key={cls.title} href={`/classes/${cls.slug}`}
              className={`rounded-xl p-7 transition-all duration-300 group block border ${
                cls.comingSoon
                  ? 'bg-zinc-950 border-zinc-900 hover:border-zinc-700 opacity-70 hover:opacity-90'
                  : 'bg-black border-zinc-900 hover:border-red-600/30'
              }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs font-mono tracking-widest block mb-1 ${
                    cls.comingSoon ? 'text-zinc-600' : 'text-red-500'
                  }`}>{cls.level}</span>
                  <h3 className="text-xl font-black text-white tracking-wide">{cls.title}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono mt-1 flex-shrink-0">
                  {cls.comingSoon ? (
                    <span className="text-zinc-700 font-mono tracking-widest text-xs border border-zinc-800 rounded px-2 py-0.5">COMING SOON</span>
                  ) : (
                    <>
                      <Calendar className="w-3 h-3 text-zinc-600" />
                      <span className="text-zinc-600">{cls.duration}</span>
                    </>
                  )}
                </div>
              </div>
              <div className={`h-px w-full mb-4 ${
                cls.comingSoon ? 'bg-zinc-900' : 'bg-zinc-900 group-hover:bg-red-600/20 transition-colors'
              }`} />
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">{cls.desc}</p>
              {cls.comingSoon ? (
                <span className="text-zinc-600 group-hover:text-zinc-400 text-xs font-black tracking-widest flex items-center gap-1 transition-colors">
                  VIEW DETAILS <ArrowRight className="w-3 h-3" />
                </span>
              ) : (
                <span className="text-red-500 group-hover:text-red-400 text-xs font-black tracking-widest flex items-center gap-1 transition-colors">
                  LEARN MORE & BOOK <ArrowRight className="w-3 h-3" />
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Book CTA */}
        <div className="text-center mt-4">
          <a href="/contact"
            className="inline-flex items-center gap-2 border border-zinc-800 hover:border-red-600/40 text-zinc-400 hover:text-white px-6 py-3 rounded-lg font-black text-xs tracking-widest transition-colors">
            QUESTIONS? CONTACT LUKE <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── Merch (live store) ───────────────────────────────────────────────────────

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="bg-zinc-950 border-t border-zinc-900 px-6 py-14">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-red-500" />
          <span className="text-white font-black tracking-widest">
            LOADOUT<span className="text-red-500">LAB</span>
          </span>
        </div>
        <p className="text-zinc-700 text-xs tracking-widest font-mono text-center hidden sm:block">
          CONTROL. TEST. IMPROVE. &nbsp;·&nbsp; TEXAS-BASED FIREARMS INSTRUCTION
        </p>
        <p className="text-zinc-700 text-xs tracking-widest font-mono text-center sm:hidden">
          TEXAS-BASED FIREARMS INSTRUCTION
        </p>
        <div className="flex items-center gap-6">
          {[
            { label: 'CLASSES', href: '#classes' },
            { label: 'ABOUT', href: '#about' },
            { label: 'CONTACT', href: '/contact' },
          ].map(l => (
            <a key={l.label} href={l.href}
              className="text-zinc-700 hover:text-white text-xs tracking-widest transition-colors font-mono">
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-zinc-800 text-xs font-mono">
          © {new Date().getFullYear()} LOADOUT LAB. ALL RIGHTS RESERVED.
        </p>
        <a href="tel:5125535798" className="text-zinc-600 hover:text-zinc-400 text-xs font-mono tracking-widest transition-colors">
          (512) 553-5798
        </a>
      </div>
    </div>
  </footer>
);

// ─── Main Site ────────────────────────────────────────────────────────────────

const MainSite = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar user={user} />
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <ClassesSection />
      <MerchStore />
      <Footer />
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const LoadoutLab = () => {
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);
  const [isRejected, setIsRejected] = useState(false);
  const [gateVisible, setGateVisible] = useState(false);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const v = sessionStorage.getItem('ageVerified');
    if (v === 'true') {
      setAgeVerified(true);
    } else if (v === 'false') {
      setIsRejected(true);
    } else {
      setShowGate(true);
      setTimeout(() => setGateVisible(true), 100);
    }
  }, []);

  const handleVerify = (over18: boolean) => {
    sessionStorage.setItem('ageVerified', String(over18));
    if (over18) setAgeVerified(true);
    else setIsRejected(true);
  };

  if (isRejected) return <RejectedScreen />;
  if (ageVerified) return <MainSite />;
  if (showGate) return <AgeGate onVerify={handleVerify} visible={gateVisible} />;
  return <div className="min-h-screen bg-black" />;
};

export default LoadoutLab;
