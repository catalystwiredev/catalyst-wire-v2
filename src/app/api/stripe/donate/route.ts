import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
  try {
    const { amount = 1500 } = await req.json() as { amount?: number };
    const cents = Math.max(100, Math.min(amount, 1000000));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: cents,
          product_data: {
            name: "Catalyst Wire — Support the Platform",
            description: "One-time donation to fund data sources, infrastructure, and new features.",
            images: [],
          },
        },
      }],
      success_url: `${process.env.NEXTAUTH_URL}/donate?success=1`,
      cancel_url:  `${process.env.NEXTAUTH_URL}/donate`,
      metadata: { type: "donation" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[stripe/donate]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
