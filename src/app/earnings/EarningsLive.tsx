"use client";

import { BarChart2 } from "lucide-react";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { LiveBadge } from "@/components/LiveBadge";
import { EarningsTable } from "@/components/tables/EarningsTable";

export function EarningsLive({ initialEarnings }: { initialEarnings: unknown[] }) {
  const { data, isFetching, lastUpdated } = useAutoRefresh<{ earnings: unknown[] }>(
    { earnings: initialEarnings },
    "/api/earnings",
    { intervalMs: 30_000 }
  );
  const earnings = data.earnings ?? [];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <LiveBadge isFetching={isFetching} lastUpdated={lastUpdated} label="Live · 30s" color="#f59e0b" />
      </div>
      {earnings.length === 0 ? (
        <div style={{ textAlign: "center", padding: 72, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(18px)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 18 }}>
          <BarChart2 size={28} style={{ color: "#f59e0b", opacity: 0.7, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No upcoming earnings found</div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>The next batch of reports will appear shortly.</div>
        </div>
      ) : (
        <EarningsTable earnings={earnings as Parameters<typeof EarningsTable>[0]["earnings"]} />
      )}
    </>
  );
}
