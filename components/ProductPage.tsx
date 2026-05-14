'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FlaskConical, ShoppingBag, ArrowLeft, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'; // Loader2 used in checkout button

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

const PRODUCT_DESCRIPTIONS: Record<string, { tagline: string; description: string; details: string[] }> = {
  'Loadout Lab Weathered Cap': {
    tagline: 'Worn in. Built for the range.',
    description:
      'The Loadout Lab Weathered Cap is a distressed dad hat that looks like it\'s already been through a few thousand rounds. Otto Cap construction, low-profile fit, pre-broken-in feel right out of the box. Wear it at the range, on the road, or anywhere you carry the Loadout Lab standard.',
    details: [
      'Otto Cap 104-1018 distressed dad hat',
      'One size fits most — adjustable strap',
      'DTF front print',
      'Unstructured, low-profile crown',
      'Pre-distressed finish',
    ],
  },
  'Loadout Lab Morale Patch': {
    tagline: 'Stick it anywhere. Mean it everywhere.',
    description:
      'The Loadout Lab morale patch. Velcro-backed, embroidered, built to ride on your plate carrier, range bag, hat, or whatever else you put it on. Small patch, loud statement.',
    details: [
      'Embroidered morale patch',
      'Hook-and-loop velcro backing',
      'Durable embroidered construction',
      'One size',
    ],
  },
  'Control, Test, Improve Graphic Tee': {
    tagline: 'The formula. On your back.',
    description:
      'This isn\'t a shirt with a logo slapped on it. The Control, Test, Improve Graphic Tee lays out the entire Loadout Lab philosophy — gear specs, range data, blueprint-style AR diagram, coordinates, the whole thing. Wear it when you want people to ask questions you\'re ready to answer.',
    details: [
      'Heavyweight black tee',
      'Full back graphic — AR schematic, LL logo, coordinates, and tagline',
      'Red, white, and gray on black colorway',
      'Austin / Kyle, Texas coordinates printed',
      'Relaxed fit',
    ],
  },
  'Loadout Lab Logo Patch': {
    tagline: 'Put it where it counts.',
    description:
      'The Loadout Lab Logo Patch. Clean LL monogram, "LOADOUT LAB" across the bottom, embroidered on black. Hook-and-loop backing means it goes wherever you go — plate carrier, range bag, hat, jacket, wall. No frills, no fuss.',
    details: [
      'Embroidered LL logo patch',
      'Hook-and-loop velcro backing',
      'Black background with gray embroidery',
      'Merrowed border edge',
      'One size',
    ],
  },
  'Loadout Lab Logo Hat': {
    tagline: 'Clean lid. No explanation needed.',
    description:
      'The Loadout Lab Logo Hat. Black dad hat, embroidered LL monogram up front, nothing else competing for attention. Low-profile, unstructured, fits like it\'s already yours. The hat you reach for without thinking about it.',
    details: [
      'Unstructured black dad hat',
      'Embroidered silver LL monogram',
      'Low-profile crown',
      'Adjustable strap — one size fits most',
      'Ventilated eyelets',
    ],
  },
  'SAAMI .308 Tee': {
    tagline: 'Know your specs.',
    description:
      'The SAAMI .308 Tee is for the shooter who knows their round. Cotton Heritage MC1087 box tee — heavy, boxy, built to last. This isn\'t a soft fashion tee. It\'s the shirt you wear when you know exactly what you\'re doing and don\'t need to explain it.',
    details: [
      'Cotton Heritage MC1087 men\'s box tee',
      '100% ring-spun cotton',
      'Boxy, relaxed fit',
      'Pre-shrunk heavyweight fabric',
      'Available in Black and Navy Blazer',
      'Sizes S–4XL (2XL+ slightly higher price)',
    ],
  },
};

export default function ProductPage({ product }: { product: Product }) {
  const colorNames = Object.keys(product.colors);
  const [selectedColor, setSelectedColor] = useState(colorNames[0] || '');
  const [selectedSize, setSelectedSize] = useState((product.sizes[0] as string) || '');
  const [checkingOut, setCheckingOut] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');

  const variant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );
  const colorData = product.colors[selectedColor];
  const images = colorData?.images?.length ? colorData.images : [colorData?.image || product.thumbnail];
  const currentImage = activeImage || images[0];

  // Reset active image when color changes
  useEffect(() => {
    setActiveImage('');
  }, [selectedColor]);

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
              <Image
                src={currentImage}
                alt={`${product.name} — ${selectedColor}`}
                fill
                className="object-cover transition-all duration-300"
                priority
              />
              {/* Prev/Next arrows — only show when multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const idx = images.indexOf(currentImage);
                      setActiveImage(images[(idx - 1 + images.length) % images.length]);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 border border-zinc-700 rounded-full flex items-center justify-center transition-all">
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      const idx = images.indexOf(currentImage);
                      setActiveImage(images[(idx + 1) % images.length]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 border border-zinc-700 rounded-full flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnail row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button key={i} onClick={() => setActiveImage(url)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      currentImage === url ? 'border-red-600' : 'border-zinc-800 hover:border-zinc-500'
                    }`}>
                    <Image src={url} alt={`View ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="py-4">
            {(() => {
              const desc = PRODUCT_DESCRIPTIONS[product.name];
              return (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-px bg-red-600" />
                    <span className="text-red-500 text-xs font-mono tracking-widest">LOADOUT LAB GEAR</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">
                    {product.name}
                  </h1>

                  {desc && (
                    <p className="text-zinc-500 text-sm font-mono tracking-wide italic mb-4">{desc.tagline}</p>
                  )}

                  <p className="text-red-500 font-mono text-2xl mb-6">
                    ${variant?.price.toFixed(2) ?? '--'}
                    {selectedSize === '2XL' || selectedSize === '3XL' || selectedSize === '4XL'
                      ? <span className="text-zinc-600 text-sm ml-2">(extended size)</span>
                      : null}
                  </p>

                  <div className="h-px w-full bg-zinc-900 mb-6" />

                  {desc && (
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">{desc.description}</p>
                  )}
                </>
              );
            })()}

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

            {/* Product details list */}
            {PRODUCT_DESCRIPTIONS[product.name]?.details && (
              <div className="mt-8 border-t border-zinc-900 pt-6">
                <p className="text-zinc-500 text-xs font-mono tracking-widest mb-3">PRODUCT DETAILS</p>
                <ul className="space-y-2">
                  {PRODUCT_DESCRIPTIONS[product.name].details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm">
                      <span className="text-red-600 mt-1 flex-shrink-0">—</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
