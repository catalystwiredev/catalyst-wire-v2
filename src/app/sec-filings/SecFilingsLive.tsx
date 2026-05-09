"use client";

import { FileText } from "lucide-react";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { LiveBadge } from "@/components/LiveBadge";
import { SecFilingsTable } from "@/components/tables/SecFilingsTable";

export function SecFilingsLive({ initialFilings }: { initialFilings: unknown[] }) {
  const { data, isFetching, lastUpdated } = useAutoRefresh<{ filings: unknown[]; count: number }>(
    { filings: initialFilings, count: initialFilings.length },
    "/api/sec-filings",
    { intervalMs: 15_000 }
  );
  const filings = data.filings ?? [];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <LiveBadge isFetching={isFetching} lastUpdated={lastUpdated} label="Live · 15s" color="#a78bfa" />
      </div>
      {filings.length === 0 ? (
        <div style={{ textAlign: "center", padding: 72, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(18px)", border: "1px solid rgba(167,139,250,0.12)", borderRadius: 18 }}>
          <FileText size={28} style={{ color: "#a78bfa", opacity: 0.7, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No filings found</div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>EDGAR publishes new filings throughout the trading day. Check back shortly.</div>
        </div>
      ) : (
        <SecFilingsTable filings={filings as Parameters<typeof SecFilingsTable>[0]["filings"]} />
      )}
    </>
  );
}
