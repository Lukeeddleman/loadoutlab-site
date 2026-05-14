import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  });
}

// Calendly URLs per duration — swap these out once Luke creates the events
const CALENDLY_URLS: Record<number, string> = {
  1: 'https://calendly.com/eddleman-luke/private-instruction',
  2: 'https://calendly.com/eddleman-luke/private-instruction-1-hr-clone',
  3: 'https://calendly.com/eddleman-luke/private-instruction-2-hr-clone',
};

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const { hours } = await req.json();

  if (!hours || ![1, 2, 3].includes(hours)) {
    return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadoutlab.com';
  const amount = hours * 100; // $100/hr
  const calendlyUrl = CALENDLY_URLS[hours];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Private Instruction — ${hours} Hour${hours > 1 ? 's' : ''}`,
            description: 'One-on-one firearms instruction with Luke Eddleman. Range fees included. After payment, you\'ll be redirected to schedule your session.',
          },
          unit_amount: amount * 100, // convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${siteUrl}/book-session?calendly=${encodeURIComponent(calendlyUrl)}&hours=${hours}`,
    cancel_url: `${siteUrl}/classes/private-instruction`,
    metadata: {
      type: 'class',
      slug: 'private-instruction',
      hours: String(hours),
    },
  });

  return NextResponse.json({ url: session.url });
}
