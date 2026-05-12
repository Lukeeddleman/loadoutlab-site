import { NextRequest, NextResponse } from 'next/server';

// Design file image URLs for each product (from sync_variants files)
const PRODUCT_FILES: Record<number, Record<string, string>> = {
  // SAAMI .308 Tee (product_id: 917)
  917: {
    front: 'https://files.cdn.printful.com/files/5f8/5f843b020e52b8291a1a13c3e0859dcb_preview.png',
    back: 'https://files.cdn.printful.com/printfile-preview/987478492/5a0cd47b480c6bda3d0b2185399b996e_preview.png',
  },
  // Loadout Lab Weathered Cap (product_id: 396)
  396: {
    front_dtf_hat: 'https://files.cdn.printful.com/printfile-preview/987708184/cc1e71e91cc5563ae6f793211d12a9e8_preview.png',
  },
};

const PLACEMENTS_BY_PRODUCT: Record<number, string[]> = {
  917: ['front', 'back'],
  396: ['front_dtf_hat'],
};

async function pollTask(apiKey: string, taskKey: string, maxAttempts = 20): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`https://api.printful.com/mockup-generator/task?task_key=${taskKey}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    const status = data.result?.status;
    if (status === 'completed') {
      return data.result?.mockups?.[0]?.mockup_url || '';
    }
    if (status === 'failed') throw new Error('Mockup generation failed');
  }
  throw new Error('Mockup generation timed out');
}

async function createTask(apiKey: string, productId: number, variantId: number, placement: string, imageUrl: string): Promise<string> {
  const res = await fetch(`https://api.printful.com/mockup-generator/create-task/${productId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variant_ids: [variantId],
      format: 'jpg',
      files: [{ placement, image_url: imageUrl }],
    }),
  });
  const data = await res.json();
  if (data.code !== 200) throw new Error(`Task creation failed for ${placement}: ${data.result}`);
  return data.result?.task_key;
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const productId = parseInt(searchParams.get('productId') || '0');
  const variantId = parseInt(searchParams.get('variantId') || '0');

  if (!productId || !variantId) {
    return NextResponse.json({ error: 'productId and variantId required' }, { status: 400 });
  }

  const files = PRODUCT_FILES[productId];
  const placements = PLACEMENTS_BY_PRODUCT[productId];
  if (!files || !placements) {
    return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
  }

  // Create one task per placement, then poll all in parallel
  const taskKeys = await Promise.all(
    placements.map((placement) => createTask(apiKey, productId, variantId, placement, files[placement]))
  );

  const mockupUrls = await Promise.all(
    taskKeys.map((key) => pollTask(apiKey, key))
  );

  return NextResponse.json(
    { mockups: mockupUrls.filter(Boolean) },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' } }
  );
}
