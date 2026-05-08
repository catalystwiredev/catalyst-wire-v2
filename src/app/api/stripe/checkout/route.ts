import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { getUserById, setStripeCustomerId } from "@/lib/azure-db";

export const dynamic = "force-dynamic";

const PRICE_IDS: Record<string, string | undefined> = {
  alpha:         process.env.STRIPE_ALPHA_MONTHLY_PRICE_ID,
  alpha_annual:  process.env.STRIPE_ALPHA_ANNUAL_PRICE_ID,
  inst:          process.env.STRIPE_INSTITUTIONAL_MONTHLY_PRICE_ID,
  inst_annual:   process.env.STRIPE_INSTITUTIONAL_ANNUAL_PRICE_ID,
};

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json() as { plan: string };
    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const userId = (session.user as { id?: string }).id;
    const user   = userId ? await getUserById(userId).catch(() => null) : null;

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode:                 "subscription",
      customer:             user?.stripe_customer_id ?? undefined,
      customer_email:       user?.stripe_customer_id ? undefined : (session.user.email ?? undefined),
      line_items:           [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: { user_id: userId ?? "" },
      },
      success_url: `${process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata:    { user_id: userId ?? "" },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 });
  }
}
