"use client";

import { ScrollText, ArrowUp, ArrowDown } from "lucide-react";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { LiveBadge } from "@/components/LiveBadge";

interface COTRow {
  market_and_exchange_names?: string;
  market_name?:               string;
  report_date_as_yyyy_mm_dd?: string;
  noncomm_positions_long_all?:  string | number;
  noncomm_positions_short_all?: string | number;
  comm_positions_long_all?:     string | number;
  comm_positions_short_all?:    string | number;
  open_interest_all?:           string | number;
  net?: { nonCommercial: number; commercial: number };
}

function num(v: string | number | undefined): number {
  if (v == null) return 0;
  return typeof v === "number" ? v : parseFloat(v) || 0;
}

export function COTLive({ initial }: { initial: { rows: COTRow[]; premium: boolean } }) {
  const { data, isFetching, lastUpdated } = useAutoRefresh<{ rows: COTRow[]; premium?: boolean }>(
    initial,
    "/api/cot",
    { intervalMs: 60_000 }
  );
  const rows = data.rows ?? [];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <LiveBadge isFetching={isFetching} lastUpdated={lastUpdated} label="Live · 60s" color="#a78bfa" />
      </div>

      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: 72, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(18px)", border: "1px solid rgba(167,139,250,0.12)", borderRadius: 18 }}>
          <ScrollText size={28} style={{ color: "#a78bfa", opacity: 0.7, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No COT reports loaded</div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>CFTC publishes Commitments of Traders weekly on Friday afternoons.</div>
        </div>
      ) : (
        <div style={{ background: "rgba(8,14,26,0.65)", backdropFilter: "blur(16px)", border: "1px solid rgba(167,139,250,0.12)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.3)" }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Market</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Date</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Spec Net</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Comm Net</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Open Interest</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const market   = r.market_and_exchange_names ?? r.market_name ?? "—";
                  const specNet  = r.net?.nonCommercial ?? (num(r.noncomm_positions_long_all) - num(r.noncomm_positions_short_all));
                  const commNet  = r.net?.commercial    ?? (num(r.comm_positions_long_all)    - num(r.comm_positions_short_all));
                  const oi       = num(r.open_interest_all);
                  const specUp   = specNet >= 0;
                  const commUp   = commNet >= 0;
                  const specColor = specUp ? "#00e676" : "#ff4d4d";
                  const commColor = commUp ? "#00e676" : "#ff4d4d";
                  return (
                    <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {market.length > 50 ? market.slice(0, 50) + "…" : market}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontFamily: "ui-monospace, monospace" }}>
                        {r.report_date_as_yyyy_mm_dd?.slice(0, 10) ?? "—"}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: specColor, fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                          {specUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                          {Math.abs(specNet).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: commColor, fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                          {commUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                          {Math.abs(commNet).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--text-secondary)", fontFamily: "ui-monospace, monospace" }}>
                        {oi.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
