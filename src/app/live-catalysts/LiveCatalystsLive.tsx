"use client";

import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { LiveBadge } from "@/components/LiveBadge";
import { FilingsTable } from "./FilingsTable";
import type { EdgarFiling } from "@/lib/data/sec-edgar";

export function LiveCatalystsLive({
  initial,
  isPremium,
}: {
  initial: { filings: EdgarFiling[] };
  isPremium: boolean;
}) {
  const { data, isFetching, lastUpdated } = useAutoRefresh<{ filings: EdgarFiling[] }>(
    initial,
    "/api/sec-filings",
    { intervalMs: 15_000 }
  );

  const all     = data.filings ?? [];
  const visible = isPremium ? all : all.slice(0, 8);
  const locked  = isPremium ? [] : all.slice(8);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <LiveBadge isFetching={isFetching} lastUpdated={lastUpdated} label="Live · 15s" color="#0090f0" />
      </div>
      <FilingsTable visible={visible} locked={locked}/>
    </>
  );
}
