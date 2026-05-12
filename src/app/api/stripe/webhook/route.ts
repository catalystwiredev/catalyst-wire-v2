import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateUserPlan, setStripeCustomerId, getUserByEmail } from "@/lib/azure-db";
import { getSecret } from "@/lib/azure-secrets";

export const dynamic = "force-dynamic";

async function getStripeConfig() {
  const [secretKey, webhookSecret, alphaMonthly, alphaAnnual, instMonthly, instAnnual] = await Promise.all([
    getSecret("STRIPE-SECRET-KEY"),
    getSecret("STRIPE-WEBHOOK-SECRET"),
    getSecret("STRIPE-ALPHA-MONTHLY-PRICE-ID"),
    getSecret("STRIPE-ALPHA-ANNUAL-PRICE-ID"),
    getSecret("STRIPE-INSTITUTIONAL-MONTHLY-PRICE-ID"),
    getSecret("STRIPE-INSTITUTIONAL-ANNUAL-PRICE-ID"),
  ]);

  const PLAN_MAP: Record<string, string> = {
    [alphaMonthly ?? ""]: "alpha",
    [alphaAnnual ?? ""]: "alpha",
    [instMonthly ?? ""]: "institutional",
    [instAnnual ?? ""]: "institutional",
  };

  return {
    stripe: new Stripe(secretKey),
    webhookSecret,
    PLAN_MAP,
  };
}

export async function POST(req: NextRequest) {
  const { stripe, webhookSecret, PLAN_MAP } = await getStripeConfig();

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature failed", err);
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const cs = event.data.object as any;
        if (cs.mode !== "subscription") break;

        const customerId = cs.customer as string;
        const subId = cs.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subId);
        const priceId = sub.items.data[0]?.price.id ?? "";
        const plan = PLAN_MAP[priceId] ?? "alpha";

        if (cs.customer_email) {
          const user = await getUserByEmail(cs.customer_email).catch(() => null);
          if (user) await setStripeCustomerId(user.id, customerId).catch(() => null);
        }

        await updateUserPlan(customerId, plan, "active", subId);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const priceId = sub.items.data[0]?.price.id ?? "";
        const plan = PLAN_MAP[priceId] ?? "alpha";
        const status = (sub.status === "active" || sub.status === "trialing") ? "active" : "inactive";
        await updateUserPlan(sub.customer as string, plan, status, sub.id);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        await updateUserPlan(sub.customer as string, "free", "inactive", "");
        break;
      }
    }
  } catch (err) {
    console.error("[webhook] handler error", err);
  }

  return NextResponse.json({ received: true });
}
