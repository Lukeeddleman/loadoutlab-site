'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Plus, Minus, X, ArrowRight, Loader2 } from 'lucide-react';

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

interface CartItem {
  variantId: number;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
}

export default function MerchStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [selections, setSelections] = useState<Record<number, { color: string; size: string }>>({});

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        // Default selections
        const defaults: Record<number, { color: string; size: string }> = {};
        (d.products || []).forEach((p: Product) => {
          const firstColor = Object.keys(p.colors)[0] || '';
          const firstSize = (p.sizes[0] as string) || '';
          defaults[p.id] = { color: firstColor, size: firstSize };
        });
        setSelections(defaults);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getVariant = (product: Product, color: string, size: string) =>
    product.variants.find((v) => v.color === color && v.size === size);

  const addToCart = (product: Product) => {
    const sel = selections[product.id];
    if (!sel) return;
    const variant = getVariant(product, sel.color, sel.size);
    if (!variant) return;
    const image = product.colors[sel.color]?.image || product.thumbnail;

    setCart((prev) => {
      const existing = prev.find((i) => i.variantId === variant.id);
      if (existing) {
        return prev.map((i) => i.variantId === variant.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { variantId: variant.id, name: product.name, color: sel.color, size: sel.size, price: variant.price, image, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (variantId: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.variantId === variantId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const checkout = async () => {
    setCheckingOut(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setCheckingOut(false);
  };

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

        {/* Cart button */}
        {cartCount > 0 && (
          <div className="flex justify-end mb-8">
            <button onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest text-sm px-5 py-2.5 rounded transition-colors">
              <ShoppingBag className="w-4 h-4" />
              CART ({cartCount}) — ${cartTotal.toFixed(2)}
            </button>
          </div>
        )}

        {/* Products */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => {
              const sel = selections[product.id] || { color: '', size: '' };
              const colorNames = Object.keys(product.colors);
              const currentImage = product.colors[sel.color]?.image || product.thumbnail;
              const variant = getVariant(product, sel.color, sel.size);

              return (
                <div key={product.id} className="bg-zinc-950 border border-zinc-800 hover:border-red-600/30 rounded-xl overflow-hidden transition-all duration-300">
                  {/* Product image */}
                  <div className="relative aspect-square bg-zinc-900">
                    <Image src={currentImage} alt={product.name} fill className="object-cover" />
                    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-600/50" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-600/50" />
                  </div>

                  {/* Product info */}
                  <div className="p-6">
                    <h3 className="text-white font-black tracking-tight text-xl mb-1">{product.name}</h3>
                    <p className="text-red-500 font-mono text-sm mb-5">
                      ${variant?.price.toFixed(2) ?? '--'}
                    </p>

                    {/* Color selector */}
                    {colorNames.length > 1 && (
                      <div className="mb-4">
                        <p className="text-zinc-500 text-xs font-mono tracking-widest mb-2">COLOR</p>
                        <div className="flex flex-wrap gap-2">
                          {colorNames.map((color) => (
                            <button key={color}
                              onClick={() => setSelections((prev) => ({ ...prev, [product.id]: { ...prev[product.id], color } }))}
                              className={`px-3 py-1.5 text-xs font-mono tracking-wide rounded border transition-all ${
                                sel.color === color
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
                      <div className="mb-6">
                        <p className="text-zinc-500 text-xs font-mono tracking-widest mb-2">SIZE</p>
                        <div className="flex flex-wrap gap-2">
                          {(product.sizes as string[]).map((size) => (
                            <button key={size}
                              onClick={() => setSelections((prev) => ({ ...prev, [product.id]: { ...prev[product.id], size } }))}
                              className={`px-3 py-1.5 text-xs font-mono tracking-wide rounded border transition-all ${
                                sel.size === size
                                  ? 'border-red-600 text-white bg-red-600/10'
                                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                              }`}>
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={() => addToCart(product)}
                      disabled={!variant}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold tracking-widest text-sm py-3 rounded flex items-center justify-center gap-2 transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cart drawer */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
            <div className="w-full max-w-sm bg-zinc-950 border-l border-zinc-800 flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h3 className="text-white font-black tracking-widest">YOUR CART</h3>
                <button onClick={() => setCartOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-zinc-600 text-sm font-mono text-center mt-8">CART IS EMPTY</p>
                ) : cart.map((item) => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-zinc-900 rounded overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{item.name}</p>
                      <p className="text-zinc-500 text-xs font-mono">{item.color} / {item.size}</p>
                      <p className="text-red-500 text-xs font-mono mt-1">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(item.variantId, -1)} className="w-6 h-6 border border-zinc-700 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.variantId, 1)} className="w-6 h-6 border border-zinc-700 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-800">
                  <div className="flex justify-between mb-4">
                    <span className="text-zinc-400 text-sm">Subtotal</span>
                    <span className="text-white font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-zinc-600 text-xs font-mono mb-4">+ shipping calculated at checkout</p>
                  <button onClick={checkout} disabled={checkingOut}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold tracking-widest text-sm py-3 rounded flex items-center justify-center gap-2 transition-colors">
                    {checkingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {checkingOut ? 'REDIRECTING...' : 'CHECKOUT'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
