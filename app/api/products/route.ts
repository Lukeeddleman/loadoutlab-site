import { NextResponse } from 'next/server';

// Static local image overrides for products that have uploaded mockup sets
const LOCAL_IMAGES: Record<number, string[]> = {
  432269121: [ // Loadout Lab Weathered Cap
    '/products/cap/1.jpg',
    '/products/cap/2.jpg',
    '/products/cap/3.jpg',
    '/products/cap/4.jpg',
    '/products/cap/5.jpg',
    '/products/cap/6.jpg',
    '/products/cap/7.jpg',
    '/products/cap/8.jpg',
    '/products/cap/9.jpg',
    '/products/cap/10.jpg',
  ],
};

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

    // Get unique colors with all available mockup/preview images
    const colorMap: Record<string, { image: string; variantId: number; images: string[] }> = {};
    variants.forEach((v: {
      color: string;
      id: number;
      files: { type: string; preview_url: string; visible: boolean }[];
    }) => {
      if (!colorMap[v.color]) {
        // Collect all visible preview/mockup images for this color
        const imageFiles = v.files.filter((f) =>
          (f.type === 'mockup' || f.type === 'preview' || f.type === 'front') && f.preview_url
        );
        const images = imageFiles.map((f) => f.preview_url);
        const primaryImage = images[0] || product.thumbnail_url;
        colorMap[v.color] = {
          image: primaryImage,
          variantId: v.id,
          images,
        };
      }
    });

    // Get unique sizes
    const sizes = [...new Set(variants.map((v: { size: string }) => v.size))];

    // Use local image overrides if available
    const localImages = LOCAL_IMAGES[product.id];
    if (localImages) {
      Object.keys(colorMap).forEach((color) => {
        colorMap[color].image = localImages[0];
        colorMap[color].images = localImages;
      });
    }

    return {
      id: product.id,
      name: product.name,
      thumbnail: localImages?.[0] || product.thumbnail_url,
      colors: colorMap,
      sizes,
      variants: variants.map((v: {
        id: number;
        variant_id: number;
        color: string;
        size: string;
        retail_price: string;
        sku: string;
      }) => ({
        id: v.id,
        baseVariantId: v.variant_id,
        color: v.color,
        size: v.size,
        price: parseFloat(v.retail_price),
        sku: v.sku,
      })),
    };
  });

  return NextResponse.json({ products });
}
