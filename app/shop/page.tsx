'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FlaskConical, ArrowLeft, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';

interface Variant {
  id: number;
  baseVariantId: number;
  color: string;
  size: string;
  price: number;
  sku: string;
}

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  colors: Record<string, { image: string; variantId: number; images: string[] }>;
  sizes: string[];
  variants: Variant[];
}

function productSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Header */}
      <header className="bg-black/95 border-b border-zinc-900 px-6 py-4 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <FlaskConical className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
            <span className="text-white font-black tracking-widest text-base">
              LOADOUT<span className="text-red-500">LAB</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-zinc-600 hover:text-white text-xs tracking-widest font-mono transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> BACK TO HOME
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 relative z-10">

        {/* Page header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-red-600" />
            <span className="text-red-500 text-xs font-mono tracking-widest">LOADOUT LAB GEAR</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-none mb-4">
            WEAR THE <span className="text-red-600">LAB</span>
          </h1>
          <div className="h-px w-24 bg-red-600/40 mb-6" />
          <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
            Gear that represents what you do on the range. Every piece ships direct — no middleman, no markup games.
          </p>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-600 text-sm font-mono tracking-widest">FIRST DROP COMING SOON</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const firstColor = Object.keys(product.colors)[0] || '';
              const image = product.colors[firstColor]?.image || product.thumbnail;
              const lowestPrice = Math.min(...product.variants.map((v) => v.price));

              return (
                <Link key={product.id} href={`/shop/${productSlug(product.name)}`}
                  className="group bg-zinc-950 border border-zinc-800 hover:border-red-600/40 rounded-xl overflow-hidden transition-all duration-300 flex flex-col">
                  <div className="relative aspect-square bg-zinc-900 overflow-hidden">
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-600/40" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-600/40" />
                  </div>
                  <div className="p-5 flex items-center justify-between flex-1">
                    <div>
                      <h3 className="text-white font-black tracking-tight">{product.name}</h3>
                      <p className="text-red-500 font-mono text-sm mt-0.5">From ${lowestPrice.toFixed(2)}</p>
                    </div>
                    <div className="w-9 h-9 bg-red-600/10 border border-red-600/25 group-hover:bg-red-600 group-hover:border-red-600 rounded flex items-center justify-center transition-all duration-300 flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Back CTA */}
        {!loading && products.length > 0 && (
          <div className="text-center mt-16">
            <Link href="/#classes"
              className="inline-flex items-center gap-2 border border-zinc-800 hover:border-red-600/40 text-zinc-400 hover:text-white px-6 py-3 rounded-lg font-black text-xs tracking-widest transition-colors">
              VIEW TRAINING CLASSES <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
