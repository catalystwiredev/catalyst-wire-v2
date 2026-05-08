import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateUserPlan, setStripeCustomerId, getUserByEmail } from "@/lib/azure-db";

export const dynamic = "force-dynamic";

function getPlanMap(): Record<string, string> {
  return {
    [process.env.STRIPE_ALPHA_MONTHLY_PRICE_ID         ?? ""]: "alpha",
    [process.env.STRIPE_ALPHA_ANNUAL_PRICE_ID          ?? ""]: "alpha",
    [process.env.STRIPE_INSTITUTIONAL_MONTHLY_PRICE_ID ?? ""]: "institutional",
    [process.env.STRIPE_INSTITUTIONAL_ANNUAL_PRICE_ID  ?? ""]: "institutional",
  };
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const PLAN_MAP = getPlanMap();
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[webhook] signature failed", err);
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const cs = event.data.object as Stripe.Checkout.Session;
        if (cs.mode !== "subscription") break;
        const customerId = cs.customer as string;
        const subId      = cs.subscription as string;
        const sub        = await stripe.subscriptions.retrieve(subId);
        const priceId    = sub.items.data[0]?.price.id ?? "";
        const plan       = PLAN_MAP[priceId] ?? "alpha";

        if (cs.customer_email) {
          const user = await getUserByEmail(cs.customer_email).catch(() => null);
          if (user) await setStripeCustomerId(user.id, customerId).catch(() => null);
        }
        await updateUserPlan(customerId, plan, "active", subId);
        break;
      }

      case "customer.subscription.updated": {
        const sub     = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price.id ?? "";
        const plan    = PLAN_MAP[priceId] ?? "alpha";
        const status  = sub.status === "active" || sub.status === "trialing" ? "active" : "inactive";
        await updateUserPlan(sub.customer as string, plan, status, sub.id);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await updateUserPlan(sub.customer as string, "free", "inactive", "");
        break;
      }
    }
  } catch (err) {
    console.error("[webhook] handler error", err);
  }

  return NextResponse.json({ received: true });
}
