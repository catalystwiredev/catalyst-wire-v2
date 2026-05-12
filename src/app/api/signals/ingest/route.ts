import { NextRequest, NextResponse } from "next/server";
import { insertSignal } from "@/lib/azure-db";
import { WebPubSubServiceClient } from "@azure/web-pubsub";
import { getSecret } from "@/lib/azure-secrets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SignalPayload {
  symbol: string;
  direction: "UP" | "DOWN";
  confidence: number;
  last_price: number;
  mean_target: number;
  pct_change: number;
  bull_range: number;
  bear_range: number;
  steps: number;
  model: string;
}

function isValid(b: unknown): b is SignalPayload {
  if (!b || typeof b !== "object") return false;
  const p = b as Record<string, unknown>;
  return (
    typeof p.symbol === "string" && p.symbol.length > 0 && p.symbol.length <= 20 &&
    (p.direction === "UP" || p.direction === "DOWN") &&
    typeof p.confidence === "number" &&
    typeof p.last_price === "number" &&
    typeof p.mean_target === "number" &&
    typeof p.pct_change === "number" &&
    typeof p.bull_range === "number" &&
    typeof p.bear_range === "number" &&
    typeof p.steps === "number" &&
    typeof p.model === "string"
  );
}

export async function POST(req: NextRequest) {
  // Auth via shared secret (harvester sends X-Cron-Secret)
  const cronSecret = await getSecret("CRON-SECRET").catch(() => "");
  const headerSecret = req.headers.get("x-cron-secret") ?? "";

  if (!cronSecret || headerSecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValid(body)) {
    return NextResponse.json({ error: "Invalid signal payload" }, { status: 400 });
  }

  const id = await insertSignal(body);

  // Best-effort publish to Web PubSub — do not fail the ingest if PubSub fails
  try {
    const pubsubConn = await getSecret("WEB-PUBSUB-CONNECTION-STRING");
    const ws = new WebPubSubServiceClient(pubsubConn, "signals");
    await ws.sendToAll({
      type: "signal",
      id,
      symbol: body.symbol,
      direction: body.direction,
      confidence: body.confidence,
      last_price: body.last_price,
      mean_target: body.mean_target,
      pct_change: body.pct_change,
      bull_range: body.bull_range,
      bear_range: body.bear_range,
      steps: body.steps,
      model: body.model,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[signals/ingest] pubsub publish failed:", e);
    // Non-fatal — ingest still succeeded
  }

  return NextResponse.json({ id, ok: true });
}
