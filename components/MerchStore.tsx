'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

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

export default function MerchStore() {
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
    <section id="merch" className="bg-black py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-red-600" />
            <span className="text-red-500 text-xs font-mono tracking-widest">LOADOUT LAB GEAR</span>
            <div className="w-8 h-px bg-red-600" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
            WEAR THE <span className="text-red-600">LAB</span>
          </h2>
          <div className="h-px w-24 bg-red-600/40 mx-auto mb-6" />
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const firstColor = Object.keys(product.colors)[0] || '';
              const image = product.colors[firstColor]?.image || product.thumbnail;
              const lowestPrice = Math.min(...product.variants.map((v) => v.price));

              return (
                <Link key={product.id} href={`/shop/${productSlug(product.name)}`}
                  className="group bg-zinc-950 border border-zinc-800 hover:border-red-600/40 rounded-xl overflow-hidden transition-all duration-300 flex flex-col">
                  {/* Image */}
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

                  {/* Info */}
                  <div className="p-5 flex items-center justify-between flex-1">
                    <div>
                      <h3 className="text-white font-black tracking-tight">{product.name}</h3>
                      <p className="text-red-500 font-mono text-sm mt-0.5">
                        From ${lowestPrice.toFixed(2)}
                      </p>
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

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-600 text-sm font-mono tracking-widest">FIRST DROP COMING SOON</p>
          </div>
        )}
      </div>
    </section>
  );
}
