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

async function pollTask(apiKey: string, taskKey: string, maxAttempts = 20): Promise<string[]> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`https://api.printful.com/mockup-generator/task?task_key=${taskKey}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    const status = data.result?.status;

    if (status === 'completed') {
      return (data.result?.mockups || []).map((m: { mockup_url: string }) => m.mockup_url);
    }
    if (status === 'failed') {
      throw new Error('Mockup generation failed');
    }
  }
  throw new Error('Mockup generation timed out');
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

  // Create mockup task
  const taskRes = await fetch(`https://api.printful.com/mockup-generator/create-task/${productId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variant_ids: [variantId],
      format: 'jpg',
      files: placements.map((placement) => ({
        placement,
        image_url: files[placement],
        position: {
          area_width: 1800,
          area_height: 2400,
          width: 1800,
          height: 2400,
          top: 0,
          left: 0,
        },
      })),
    }),
  });

  const taskData = await taskRes.json();
  if (taskData.code !== 200) {
    return NextResponse.json({ error: 'Task creation failed', detail: taskData }, { status: 500 });
  }

  const taskKey = taskData.result?.task_key;
  if (!taskKey) {
    return NextResponse.json({ error: 'No task key returned' }, { status: 500 });
  }

  // Poll for completion
  const mockupUrls = await pollTask(apiKey, taskKey);

  return NextResponse.json(
    { mockups: mockupUrls },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    }
  );
}
