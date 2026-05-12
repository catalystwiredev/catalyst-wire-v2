import { NextResponse } from "next/server";
import { WebPubSubServiceClient } from "@azure/web-pubsub";
import { auth } from "@/lib/auth";
import { getSecret } from "@/lib/azure-secrets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mints a short-lived Web PubSub access token for authenticated clients.
 * Used by useSignalStream() hook for real-time signals.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const conn = await getSecret("WEB-PUBSUB-CONNECTION-STRING");
    const userId = (session.user as { id?: string }).id ?? "anon";

    const ws = new WebPubSubServiceClient(conn, "signals");
    const token = await ws.getClientAccessToken({
      userId,
      roles: ["webpubsub.joinLeaveGroup"],
      expirationTimeInMinutes: 60,
    });

    return NextResponse.json({ url: token.url });
  } catch (err) {
    console.error("[pubsub/negotiate] failed:", err);
    return NextResponse.json({
      error: "Could not negotiate Web PubSub token"
    }, { status: 500 });
  }
}
