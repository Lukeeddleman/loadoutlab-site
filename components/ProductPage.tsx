'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FlaskConical, ShoppingBag, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';

interface Variant {
  id: number;
  color: string;
  size: string;
  price: number;
  sku: string;
}

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  colors: Record<string, { image: string; variantId: number }>;
  sizes: string[];
  variants: Variant[];
}

// Map our sync product IDs to Printful base product IDs for mockup generator
const SYNC_TO_BASE: Record<number, number> = {
  432267769: 917, // SAAMI .308 Tee
  432269121: 396, // Loadout Lab Weathered Cap
};

export default function ProductPage({ product }: { product: Product }) {
  const colorNames = Object.keys(product.colors);
  const [selectedColor, setSelectedColor] = useState(colorNames[0] || '');
  const [selectedSize, setSelectedSize] = useState((product.sizes[0] as string) || '');
  const [checkingOut, setCheckingOut] = useState(false);
  const [mockups, setMockups] = useState<string[]>([]);
  const [mockupsLoading, setMockupsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  const variant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );
  const defaultImage = product.colors[selectedColor]?.image || product.thumbnail;
  const currentImage = activeImage || defaultImage;

  // Fetch mockups when color/variant changes
  useEffect(() => {
    const baseProductId = SYNC_TO_BASE[product.id];
    if (!baseProductId || !variant) return;

    setMockupsLoading(true);
    setActiveImage('');
    fetch(`/api/mockups?productId=${baseProductId}&variantId=${variant.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.mockups?.length) {
          setMockups(d.mockups);
          setActiveImage(d.mockups[0]);
        }
        setMockupsLoading(false);
      })
      .catch(() => setMockupsLoading(false));
  }, [product.id, variant?.id]);

  const buyNow = async () => {
    if (!variant) return;
    setCheckingOut(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{
          variantId: variant.id,
          name: product.name,
          color: selectedColor,
          size: selectedSize,
          price: variant.price,
          image: currentImage,
          quantity: 1,
        }],
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setCheckingOut(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-red-500" />
          <span className="text-white font-black tracking-widest text-sm">
            LOADOUT<span className="text-red-500">LAB</span>
          </span>
        </Link>
        <Link href="/#merch" className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to shop
        </Link>
      </nav>

      {/* Breadcrumb */}
      <div className="px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">HOME</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/#merch" className="hover:text-zinc-400 transition-colors">SHOP</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-400">{product.name.toUpperCase()}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image gallery */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative aspect-square bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-red-600/40 z-10" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-red-600/40 z-10" />
              {mockupsLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-zinc-950/60">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              )}
              <Image
                src={currentImage}
                alt={`${product.name} — ${selectedColor}`}
                fill
                className="object-cover transition-all duration-300"
                priority
              />
            </div>
            {/* Thumbnails */}
            {mockups.length > 1 && (
              <div className="flex gap-3">
                {mockups.map((url, i) => (
                  <button key={i} onClick={() => setActiveImage(url)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === url ? 'border-red-600' : 'border-zinc-800 hover:border-zinc-600'
                    }`}>
                    <Image src={url} alt={`View ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-red-600" />
              <span className="text-red-500 text-xs font-mono tracking-widest">LOADOUT LAB GEAR</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-3">
              {product.name}
            </h1>

            <p className="text-red-500 font-mono text-2xl mb-8">
              ${variant?.price.toFixed(2) ?? '--'}
              {selectedSize === '2XL' || selectedSize === '3XL' || selectedSize === '4XL'
                ? <span className="text-zinc-600 text-sm ml-2">(extended size)</span>
                : null}
            </p>

            <div className="h-px w-full bg-zinc-900 mb-8" />

            {/* Color selector */}
            {colorNames.length > 1 && (
              <div className="mb-6">
                <p className="text-zinc-500 text-xs font-mono tracking-widest mb-3">
                  COLOR — <span className="text-zinc-300">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colorNames.map((color) => (
                    <button key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs font-mono tracking-wide rounded border transition-all ${
                        selectedColor === color
                          ? 'border-red-600 text-white bg-red-600/10'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes.length > 1 && (
              <div className="mb-8">
                <p className="text-zinc-500 text-xs font-mono tracking-widest mb-3">
                  SIZE — <span className="text-zinc-300">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes as string[]).map((size) => (
                    <button key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-mono tracking-wide rounded border transition-all ${
                        selectedSize === size
                          ? 'border-red-600 text-white bg-red-600/10'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buy button */}
            <button
              onClick={buyNow}
              disabled={!variant || checkingOut}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black tracking-widest py-4 rounded flex items-center justify-center gap-2 transition-colors text-sm">
              {checkingOut
                ? <><Loader2 className="w-4 h-4 animate-spin" /> REDIRECTING...</>
                : <><ShoppingBag className="w-4 h-4" /> BUY NOW — ${variant?.price.toFixed(2) ?? '--'}</>
              }
            </button>

            <p className="text-zinc-600 text-xs font-mono text-center mt-4">
              SHIPS VIA PRINTFUL · FULFILLED IN 2–5 BUSINESS DAYS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
