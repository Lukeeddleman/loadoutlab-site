import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: NextRequest) {
  const { items } = await req.json();
  // items: [{ variantId, name, price, quantity, image, color, size }]

  if (!items?.length) {
    return NextResponse.json({ error: 'No items' }, { status: 400 });
  }

  const lineItems = items.map((item: {
    name: string;
    price: number;
    quantity: number;
    image?: string;
    color: string;
    size: string;
  }) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: `${item.name} — ${item.color} / ${item.size}`,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['US'] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 499, currency: 'usd' },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 10 },
          },
        },
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://loadoutlab.com'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://loadoutlab.com'}/#merch`,
    metadata: {
      items: JSON.stringify(items.map((i: { variantId: number; quantity: number }) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      }))),
    },
  });

  return NextResponse.json({ url: session.url });
}
