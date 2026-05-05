import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/azure-db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const user   = userId ? await getUserById(userId).catch(() => null) : null;
    if (!user?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found." }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer:   user.stripe_customer_id,
      return_url: `${process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[stripe/portal]", err);
    return NextResponse.json({ error: "Could not open billing portal." }, { status: 500 });
  }
}
