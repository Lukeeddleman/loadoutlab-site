import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: 'No webhook secret' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const items = JSON.parse(session.metadata?.items || '[]');
    const shipping = session.shipping_details;

    if (!items.length || !shipping?.address) {
      console.error('Missing items or shipping in session:', session.id);
      return NextResponse.json({ ok: true });
    }

    // Build Printful order
    const printfulOrder = {
      recipient: {
        name: shipping.name || 'Customer',
        address1: shipping.address.line1,
        address2: shipping.address.line2 || '',
        city: shipping.address.city,
        state_code: shipping.address.state,
        country_code: shipping.address.country,
        zip: shipping.address.postal_code,
      },
      items: items.map((item: { variantId: number; quantity: number }) => ({
        sync_variant_id: item.variantId,
        quantity: item.quantity,
      })),
    };

    const printfulRes = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(printfulOrder),
    });

    const printfulData = await printfulRes.json();
    if (printfulData.code !== 200) {
      console.error('Printful order failed:', printfulData);
    } else {
      console.log('Printful order created:', printfulData.result.id);
    }
  }

  return NextResponse.json({ ok: true });
}
