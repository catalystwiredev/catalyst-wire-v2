"use client";

import { FlaskConical } from "lucide-react";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { LiveBadge } from "@/components/LiveBadge";
import { FDAApplicationsTable, FDARecallsTable } from "@/components/tables/FDATable";

interface FDAResponse { applications: unknown[]; recalls: unknown[]; }

export function FDALive({ initial }: { initial: FDAResponse }) {
  const { data, isFetching, lastUpdated } = useAutoRefresh<FDAResponse>(
    initial,
    "/api/fda",
    { intervalMs: 30_000 }
  );
  const applications = data.applications ?? [];
  const recalls      = data.recalls ?? [];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <LiveBadge isFetching={isFetching} lastUpdated={lastUpdated} label="Live · 30s" color="#f472b6" />
      </div>
      <div style={{ marginBottom: 32 }}>
        {applications.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(18px)", border: "1px solid rgba(244,114,182,0.12)", borderRadius: 18 }}>
            <FlaskConical size={28} style={{ color: "#f472b6", opacity: 0.7, marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No applications at this time</div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>FDA application data refreshes from OpenFDA.</div>
          </div>
        ) : (
          <FDAApplicationsTable applications={applications as Parameters<typeof FDAApplicationsTable>[0]["applications"]} />
        )}
      </div>
      {recalls.length > 0 && (
        <FDARecallsTable recalls={recalls as Parameters<typeof FDARecallsTable>[0]["recalls"]} />
      )}
    </>
  );
}
