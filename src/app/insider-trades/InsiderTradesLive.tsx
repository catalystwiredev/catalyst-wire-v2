"use client";

import { UserCheck } from "lucide-react";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { LiveBadge } from "@/components/LiveBadge";
import { InsiderTradesTable } from "@/components/tables/InsiderTradesTable";

export function InsiderTradesLive({ initialTrades }: { initialTrades: unknown[] }) {
  const { data, isFetching, lastUpdated } = useAutoRefresh<{ trades: unknown[]; count: number }>(
    { trades: initialTrades, count: initialTrades.length },
    "/api/insider-trades",
    { intervalMs: 30_000 }
  );
  const trades = data.trades ?? [];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <LiveBadge isFetching={isFetching} lastUpdated={lastUpdated} label="Live · 30s" color="#00e676" />
      </div>
      {trades.length === 0 ? (
        <div style={{ textAlign: "center", padding: 72, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(18px)", border: "1px solid rgba(0,230,118,0.12)", borderRadius: 18 }}>
          <UserCheck size={28} style={{ color: "#00e676", opacity: 0.7, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No insider trades found</div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>Form 4 filings appear within 2 business days of a transaction.</div>
        </div>
      ) : (
        <InsiderTradesTable trades={trades as Parameters<typeof InsiderTradesTable>[0]["trades"]} />
      )}
    </>
  );
}
