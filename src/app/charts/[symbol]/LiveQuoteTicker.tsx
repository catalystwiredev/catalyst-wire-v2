"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, Wifi } from "lucide-react";

interface QuoteResp {
  symbol: string;
  price:  number;
  change: number;
  high:   number | null;
  low:    number | null;
  volume: number | null;
  session?: "pre-market" | "regular" | "after-hours";
  preMarket?:  { price: number; change: number | null; time: string | null } | null;
  postMarket?: { price: number; change: number | null; time: string | null } | null;
  provider: string;
}

/**
 * Lightweight price/session ticker that polls /api/quote every 5 seconds.
 * Mounts above the chart but does NOT modify ChartClient — entirely additive.
 *
 * Shows the live regular-session price plus pre-market and after-hours quotes
 * when the upstream feed reports them (Yahoo). Updates work in all sessions:
 * pre-market, standard hours, after-hours, overnight, and weekends (per source).
 */
export function LiveQuoteTicker({ symbol }: { symbol: string }) {
  const [quote, setQuote]     = useState<QuoteResp | null>(null);
  const [prevPrice, setPrev]  = useState<number | null>(null);
  const [flash, setFlash]     = useState<"up" | "down" | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/quote/${symbol}`, { cache: "no-store" });
        if (!res.ok) return;
        const q = await res.json() as QuoteResp;
        if (cancelled) return;

        setQuote(prev => {
          if (prev && q.price !== prev.price) {
            const dir = q.price > prev.price ? "up" : "down";
            setFlash(dir);
            setPrev(prev.price);
            if (flashTimer.current) clearTimeout(flashTimer.current);
            flashTimer.current = setTimeout(() => setFlash(null), 600);
          }
          return q;
        });
      } catch { /* swallow — next tick will retry */ }
    }

    void poll();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") void poll();
    }, 1500);

    function onVisible() {
      if (document.visibilityState === "visible") void poll();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, [symbol]);

  if (!quote) {
    return (
      <div style={{ background: "rgba(8,14,26,0.65)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <Wifi size={13} style={{ color: "var(--text-muted)" }} />
        <span style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.05em" }}>Connecting to live quote stream…</span>
      </div>
    );
  }

  const up = quote.change >= 0;
  const color = up ? "#00e676" : "#ff4d4d";
  const Icon = up ? TrendingUp : TrendingDown;

  const flashColor = flash === "up" ? "rgba(0,230,118,0.20)" : flash === "down" ? "rgba(255,77,77,0.20)" : "transparent";
  void prevPrice;

  const sessionLabel = quote.session === "pre-market" ? "Pre-Market"
                     : quote.session === "after-hours" ? "After-Hours"
                     : "Regular Session";
  const sessionColor = quote.session === "pre-market" ? "#a78bfa"
                     : quote.session === "after-hours" ? "#f59e0b"
                     : "#0090f0";

  return (
    <div style={{
      background: `linear-gradient(90deg, ${flashColor}, rgba(8,14,26,0.65))`,
      backdropFilter: "blur(16px)",
      border: `1px solid ${color}22`, borderRadius: 12, padding: "14px 18px",
      marginBottom: 14,
      display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
      transition: "background 0.2s",
    }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 18, fontWeight: 800, color }}>
          ${quote.price.toFixed(2)}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color }}>
          <Icon size={12} />
          {up ? "+" : ""}{quote.change.toFixed(2)}%
        </span>
      </div>

      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
        color: sessionColor, padding: "3px 10px", borderRadius: 5,
        background: `${sessionColor}14`, border: `1px solid ${sessionColor}30`,
      }}>
        {sessionLabel}
      </span>

      {quote.preMarket && (
        <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "ui-monospace, monospace" }}>
          Pre: ${quote.preMarket.price.toFixed(2)}
          {quote.preMarket.change != null && (
            <span style={{ color: quote.preMarket.change >= 0 ? "#00e676" : "#ff4d4d", marginLeft: 6 }}>
              ({quote.preMarket.change >= 0 ? "+" : ""}{quote.preMarket.change.toFixed(2)}%)
            </span>
          )}
        </span>
      )}

      {quote.postMarket && (
        <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "ui-monospace, monospace" }}>
          After: ${quote.postMarket.price.toFixed(2)}
          {quote.postMarket.change != null && (
            <span style={{ color: quote.postMarket.change >= 0 ? "#00e676" : "#ff4d4d", marginLeft: 6 }}>
              ({quote.postMarket.change >= 0 ? "+" : ""}{quote.postMarket.change.toFixed(2)}%)
            </span>
          )}
        </span>
      )}

      <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Live · 1.5s · {quote.provider}
      </span>
    </div>
  );
}
