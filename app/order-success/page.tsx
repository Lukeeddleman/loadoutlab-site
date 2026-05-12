'use client';
import { FlaskConical, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <FlaskConical className="w-6 h-6 text-red-500" />
          <span className="text-white font-black tracking-widest">
            LOADOUT<span className="text-red-500">LAB</span>
          </span>
        </div>
        <CheckCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-black text-white tracking-tighter mb-4">ORDER CONFIRMED</h1>
        <div className="h-px w-24 bg-red-600/40 mx-auto mb-6" />
        <p className="text-zinc-400 mb-2">Your order is in. Printful will have it printed and shipped your way.</p>
        <p className="text-zinc-600 text-sm mb-10">Check your email for a confirmation from Stripe.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest text-sm px-8 py-3 rounded transition-colors">
          BACK TO LOADOUT LAB
        </Link>
      </div>
    </div>
  );
}
