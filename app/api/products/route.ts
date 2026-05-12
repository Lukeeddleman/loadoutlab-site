import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No PRINTFUL_API_KEY' }, { status: 500 });

  const productsRes = await fetch('https://api.printful.com/store/products', {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 300 }, // cache 5 min
  });
  const productsData = await productsRes.json();

  const details = await Promise.all(
    (productsData.result || []).map(async (p: { id: number }) => {
      const res = await fetch(`https://api.printful.com/store/products/${p.id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 300 },
      });
      return res.json();
    })
  );

  // Shape the data for the frontend
  const products = details.map((d) => {
    const product = d.result.sync_product;
    const variants = d.result.sync_variants;

    // Get unique colors with their mockup images
    const colorMap: Record<string, { image: string; variantId: number }> = {};
    variants.forEach((v: {
      color: string;
      id: number;
      files: { type: string; preview_url: string }[];
    }) => {
      if (!colorMap[v.color]) {
        const mockup = v.files.find((f: { type: string }) => f.type === 'mockup' || f.type === 'preview');
        colorMap[v.color] = {
          image: mockup?.preview_url || product.thumbnail_url,
          variantId: v.id,
        };
      }
    });

    // Get unique sizes
    const sizes = [...new Set(variants.map((v: { size: string }) => v.size))];

    return {
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail_url,
      colors: colorMap,
      sizes,
      variants: variants.map((v: {
        id: number;
        color: string;
        size: string;
        retail_price: string;
        sku: string;
      }) => ({
        id: v.id,
        color: v.color,
        size: v.size,
        price: parseFloat(v.retail_price),
        sku: v.sku,
      })),
    };
  });

  return NextResponse.json({ products });
}
