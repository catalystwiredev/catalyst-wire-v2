"use client";
import { useEffect, useRef, useState } from "react";
import { WebPubSubClient } from "@azure/web-pubsub-client";

export interface SignalEvent {
  type: "signal";
  id: string;
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
  ts: string;
}

export type PubSubStatus = "idle" | "connecting" | "connected" | "error" | "unauthorized";

export function useSignalStream(maxBuffer = 100, symbol?: string) {
  const [status, setStatus] = useState<PubSubStatus>("idle");
  const [signals, setSignals] = useState<SignalEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<WebPubSubClient | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      setStatus("connecting");
      setError(null);

      try {
        const negotiate = await fetch("/api/pubsub/negotiate", { method: "GET" });
        if (!negotiate.ok) {
          if (negotiate.status === 401) {
            setStatus("unauthorized");
            setError("Sign in required for live signals");
            return;
          }

          throw new Error(`Negotiation failed (${negotiate.status})`);
        }

        const { url } = await negotiate.json() as { url: string };
        if (cancelled) return;

        const client = new WebPubSubClient(url);
        clientRef.current = client;

        client.on("connected", () => { if (!cancelled) setStatus("connected"); });
        client.on("disconnected", () => { if (!cancelled) setStatus("idle"); });

        client.on("group-message", (e) => {
          if (cancelled) return;
          const data = e.message.data as SignalEvent;
          if (!data || data.type !== "signal") return;
          if (symbol && data.symbol.toUpperCase() !== symbol.toUpperCase()) return;

          setSignals(prev => [data, ...prev].slice(0, maxBuffer));
        });

        await client.start();
        await client.joinGroup("signals");
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Unknown connection error";
          setError(msg);
          setStatus("error");
        }
      }
    }

    connect();

    return () => {
      cancelled = true;
      const c = clientRef.current;
      if (c) c.stop();
      clientRef.current = null;
    };
  }, [symbol, maxBuffer]);

  return { status, signals, error };
}
