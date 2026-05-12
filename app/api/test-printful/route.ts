import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No PRINTFUL_API_KEY set' }, { status: 500 });

  try {
    // Test 1: Get store info
    const storeRes = await fetch('https://api.printful.com/store', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const storeData = await storeRes.json();

    // Test 2: Get products
    const productsRes = await fetch('https://api.printful.com/store/products', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const productsData = await productsRes.json();

    // Test 3: Get full details for each product
    const productDetails = await Promise.all(
      (productsData.result || []).map(async (p: { id: number }) => {
        const res = await fetch(`https://api.printful.com/store/products/${p.id}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        return res.json();
      })
    );

    return NextResponse.json({
      products: productsData,
      details: productDetails,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
