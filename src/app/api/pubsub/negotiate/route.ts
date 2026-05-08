import { NextResponse } from "next/server";
import { WebPubSubServiceClient } from "@azure/web-pubsub";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mints a short-lived Web PubSub access token for an authenticated browser client.
 * The browser then opens a WebSocket directly to Azure Web PubSub using this URL.
 * Free tier: 20k msgs/day, 20 concurrent connections.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conn = process.env.WEB_PUBSUB_CONNECTION_STRING;
  if (!conn) {
    return NextResponse.json({ error: "Web PubSub not configured" }, { status: 500 });
  }

  const userId = (session.user as { id?: string }).id ?? "anon";

  try {
    const ws    = new WebPubSubServiceClient(conn, "signals");
    const token = await ws.getClientAccessToken({
      userId,
      roles:  ["webpubsub.joinLeaveGroup", "webpubsub.sendToGroup"],
      expirationTimeInMinutes: 60,
    });
    return NextResponse.json({ url: token.url });
  } catch (err) {
    console.error("[pubsub/negotiate] failed:", err);
    return NextResponse.json({ error: "Could not negotiate Web PubSub token" }, { status: 500 });
  }
}
