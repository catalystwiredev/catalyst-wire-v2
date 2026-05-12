import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/azure-db";
import { getSecret } from "@/lib/azure-secrets";

export const dynamic = "force-dynamic";

async function getStripeConfig() {
  const [secretKey, alphaMonthly, alphaAnnual, instMonthly, instAnnual] = await Promise.all([
    getSecret("STRIPE-SECRET-KEY"),
    getSecret("STRIPE-ALPHA-MONTHLY-PRICE-ID"),
    getSecret("STRIPE-ALPHA-ANNUAL-PRICE-ID"),
    getSecret("STRIPE-INSTITUTIONAL-MONTHLY-PRICE-ID"),
    getSecret("STRIPE-INSTITUTIONAL-ANNUAL-PRICE-ID"),
  ]);

  return {
    stripe: new Stripe(secretKey),
    priceIds: {
      alpha: alphaMonthly,
      alpha_annual: alphaAnnual,
      inst: instMonthly,
      inst_annual: instAnnual,
    }
  };
}

export async function POST(req: NextRequest) {
  const { stripe, priceIds } = await getStripeConfig();

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json() as { plan: string };
    const priceId = priceIds[plan as keyof typeof priceIds];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const userId = (session.user as { id?: string }).id;
    const user = userId ? await getUserById(userId).catch(() => null) : null;

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: user?.stripe_customer_id ?? undefined,
      customer_email: user?.stripe_customer_id ? undefined : (session.user.email ?? undefined),
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: { user_id: userId ?? "" },
      },
      success_url: `${process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { user_id: userId ?? "" },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 });
  }
}
