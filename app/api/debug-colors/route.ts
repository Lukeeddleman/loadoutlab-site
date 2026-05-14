import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('id');
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 });
  if (!productId) return NextResponse.json({ error: 'Pass ?id=PRODUCT_ID' }, { status: 400 });

  const res = await fetch(`https://api.printful.com/store/products/${productId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
  });
  const data = await res.json();
  const variants = data.result?.sync_variants || [];

  const colors = [...new Set(variants.map((v: { color: string }) => v.color))];
  return NextResponse.json({ productId, colors });
}
