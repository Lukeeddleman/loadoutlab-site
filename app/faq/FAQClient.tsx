"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FlaskConical, Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: "Do I need to own a firearm to take a class?",
    a: (
      <>
        No. Rental firearms are available for an additional fee — just let Luke know when you book. If you have your own firearm and want to train with it, even better. Just make sure it&apos;s in safe working condition and you have the right ammo for your class (details on each class page).
      </>
    ),
    aPlain: "No. Rental firearms are available for an additional fee — just let Luke know when you book. If you have your own firearm and want to train with it, even better. Just make sure it's in safe working condition and you have the right ammo for your class (details on each class page).",
  },
  {
    q: "Are classes held near Austin, TX?",
    a: (
      <>
        Yes. Loadout Lab serves Austin and the surrounding south Texas area including Kyle, Buda, and San Marcos. Exact range location is confirmed when you book.
      </>
    ),
    aPlain: "Yes. Loadout Lab serves Austin and the surrounding south Texas area including Kyle, Buda, and San Marcos. Exact range location is confirmed when you book.",
  },
  {
    q: "I've never shot a gun before. Is that okay?",
    a: (
      <>
        Absolutely. The{' '}
        <Link href="/classes/fundamentals" className="text-red-500 hover:text-red-400 underline underline-offset-2">
          Fundamentals class
        </Link>{' '}
        is built specifically for first-time shooters. You don&apos;t need any prior experience — just show up ready to learn. Luke has worked with total beginners many times and knows how to build confidence from the ground up.
      </>
    ),
    aPlain: "Absolutely. The Fundamentals class is built specifically for first-time shooters. You don't need any prior experience — just show up ready to learn. Luke has worked with total beginners many times and knows how to build confidence from the ground up.",
  },
  {
    q: "What should I wear and bring?",
    a: (
      <>
        Wear comfortable, closed-toe shoes and clothes you don&apos;t mind getting dirty. No open-toed shoes on the range — ever. Bring water, a snack, and your ID. Each class page has a specific gear list. Eye and ear protection are available to borrow if you don&apos;t have your own.
      </>
    ),
    aPlain: "Wear comfortable, closed-toe shoes and clothes you don't mind getting dirty. No open-toed shoes on the range — ever. Bring water, a snack, and your ID. Each class page has a specific gear list. Eye and ear protection are available to borrow if you don't have your own.",
  },
  {
    q: "How long are the classes?",
    a: (
      <>
        It depends on the class. Fundamentals runs 2–3 hours. Most other classes are 3–4 hours.{' '}
        <Link href="/classes/private-instruction" className="text-red-500 hover:text-red-400 underline underline-offset-2">
          Private instruction
        </Link>{' '}
        is flexible — you set the schedule. Check the individual class pages for specifics.
      </>
    ),
    aPlain: "It depends on the class. Fundamentals runs 2–3 hours. Most other classes are 3–4 hours. Private instruction is flexible — you set the schedule. Check the individual class pages for specifics.",
  },
  {
    q: "Is private instruction worth it if I could just take a group class?",
    a: (
      <>
        <Link href="/classes/private-instruction" className="text-red-500 hover:text-red-400 underline underline-offset-2">
          Private instruction
        </Link>{' '}
        is a completely different experience. Every minute is focused on you — your technique, your goals, your pace. It&apos;s the fastest way to improve and the best option if you have specific skills you want to work on. A lot of students who start with group classes come back for private sessions once they catch the bug.
      </>
    ),
    aPlain: "Private instruction is a completely different experience. Every minute is focused on you — your technique, your goals, your pace. It's the fastest way to improve and the best option if you have specific skills you want to work on. A lot of students who start with group classes come back for private sessions once they catch the bug.",
  },
  {
    q: "Are classes safe for beginners?",
    a: (
      <>
        Yes. Safety is the first thing taught and the last thing checked at every session. Every student handles firearms under direct supervision. Luke has trained total beginners and experienced shooters alike — the environment is controlled, focused, and judgment-free.
      </>
    ),
    aPlain: "Yes. Safety is the first thing taught and the last thing checked at every session. Every student handles firearms under direct supervision. Luke has trained total beginners and experienced shooters alike — the environment is controlled, focused, and judgment-free.",
  },
  {
    q: "Can I book a class as a gift?",
    a: (
      <>
        Yes.{' '}
        <Link href="/classes/private-instruction" className="text-red-500 hover:text-red-400 underline underline-offset-2">
          Private instruction
        </Link>{' '}
        is especially popular as a gift. Reach out through the{' '}
        <Link href="/contact" className="text-red-500 hover:text-red-400 underline underline-offset-2">
          contact page
        </Link>{' '}
        and Luke will work with you to set something up.
      </>
    ),
    aPlain: "Yes. Private instruction is especially popular as a gift. Reach out through the contact page and Luke will work with you to set something up.",
  },
  {
    q: "What's the difference between the Fundamentals class and Defensive Pistol?",
    a: (
      <>
        <Link href="/classes/fundamentals" className="text-red-500 hover:text-red-400 underline underline-offset-2">
          Fundamentals
        </Link>{' '}
        is for people who want a solid foundation — safety, grip, stance, sight alignment, basic shooting.{' '}
        <Link href="/classes/defensive-pistol" className="text-red-500 hover:text-red-400 underline underline-offset-2">
          Defensive Pistol
        </Link>{' '}
        picks up from there and focuses on real-world application: drawing from a holster, close-quarters technique, clearing malfunctions, and thinking through scenarios. If you&apos;re newer to shooting, start with Fundamentals. If you already have basic proficiency, Defensive Pistol is where things get interesting.
      </>
    ),
    aPlain: "Fundamentals is for people who want a solid foundation — safety, grip, stance, sight alignment, basic shooting. Defensive Pistol picks up from there and focuses on real-world application: drawing from a holster, close-quarters technique, clearing malfunctions, and thinking through scenarios. If you're newer to shooting, start with Fundamentals. If you already have basic proficiency, Defensive Pistol is where things get interesting.",
  },
  {
    q: "Do you offer classes for groups or corporate teams?",
    a: (
      <>
        Yes — that&apos;s what{' '}
        <Link href="/classes/squad-training" className="text-red-500 hover:text-red-400 underline underline-offset-2">
          Squad Training
        </Link>{' '}
        is for. Sessions are designed for 3–8 people and can be tailored to your group&apos;s experience level. Great for couples, friend groups, or workplace teams looking to build a shared skillset.
      </>
    ),
    aPlain: "Yes — that's what Squad Training is for. Sessions are designed for 3–8 people and can be tailored to your group's experience level. Great for couples, friend groups, or workplace teams looking to build a shared skillset.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.aPlain,
    },
  })),
};

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
              <span className="text-red-500 text-xs font-mono tracking-widest">LOADOUT LAB</span>
              <div className="w-8 h-px bg-red-600" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-4">
              FREQUENTLY ASKED<br /><span className="text-red-600">QUESTIONS</span>
            </h1>
            <div className="h-px w-24 bg-red-600/40 mx-auto mb-6" />
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Everything you need to know before you book.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="px-6 pb-20">
          <div className="max-w-3xl mx-auto space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-zinc-900 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left bg-black hover:bg-zinc-950 transition-colors group"
                >
                  <span className="text-white font-bold text-sm tracking-wide pr-4 leading-snug">
                    {faq.q}
                  </span>
                  <span className="flex-shrink-0 text-red-500 group-hover:text-red-400 transition-colors">
                    {openIndex === i ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-1 border-t border-zinc-900 bg-black">
                    <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="relative border border-zinc-900 rounded-xl p-10 text-center bg-zinc-950 overflow-hidden">
              <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-red-600/40 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-red-600/40 pointer-events-none" />
              <h2 className="text-2xl font-black text-white tracking-tight mb-3">Still have questions?</h2>
              <p className="text-zinc-500 text-sm mb-8 max-w-sm mx-auto">
                Luke is happy to answer before you book. Reach out directly or check out the class lineup.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-black text-xs tracking-widest transition-colors">
                  CONTACT LUKE
                </Link>
                <Link href="/#classes" className="border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white px-8 py-3 rounded-lg font-black text-xs tracking-widest transition-colors">
                  VIEW CLASSES
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
              <Link href="/#classes" className="text-zinc-700 hover:text-white text-xs tracking-widest transition-colors font-mono">CLASSES</Link>
              <Link href="/contact" className="text-zinc-700 hover:text-white text-xs tracking-widest transition-colors font-mono">CONTACT</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
