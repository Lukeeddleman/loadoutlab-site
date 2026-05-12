import { NextResponse } from 'next/server';

// Tee product_id: 917, Cap product_id: 396
const PRODUCT_IDS = [917, 396];

export async function GET() {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No PRINTFUL_API_KEY set' }, { status: 500 });

  try {
    // Test mockup generator printfiles for each base product
    const printfiles = await Promise.all(
      PRODUCT_IDS.map(async (id) => {
        const res = await fetch(`https://api.printful.com/mockup-generator/printfiles/${id}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        return { product_id: id, data: await res.json() };
      })
    );

    return NextResponse.json({ printfiles });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
