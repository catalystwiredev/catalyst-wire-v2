"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, LogIn } from "lucide-react";

function verdictColor(verdict: string) {
  if (!verdict) return "#f59e0b";
  const v = verdict.toLowerCase();
  if (v === "bullish") return "#00e676";
  if (v === "bearish") return "#ff3d57";
  return "#f59e0b";
}

function scoreColor(score: number) {
  if (score >= 80) return "#00e676";
  if (score >= 60) return "#0099ff";
  return "#f59e0b";
}

export function TerminalUnlock({ initialData, isAuthenticated = false }: { initialData: any[]; isAuthenticated?: boolean }) {
  const [unlocked, setUnlocked] = useState(isAuthenticated);

  if (!unlocked) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "48px 24px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={24} style={{ color: "var(--text-muted)" }} />
        </div>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Sign in to access live catalysts</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>Create a free account to view real-time market catalyst data.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            <LogIn size={14} /> Sign in
          </Link>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--bg-elevated)", color: "var(--text-secondary)", padding: "10px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid var(--border-medium)" }}>
            Create free account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e676", display: "inline-block" }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#00e676", fontFamily: "monospace" }}>
          LIVE FEED — {initialData.length} CATALYSTS
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Ticker", "Type", "Description", "Verdict", "Score"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {initialData.map((row, i) => {
              const ticker = row.ticker ?? row.Ticker ?? "";
              const type = row.type ?? row.EventType ?? "";
              const description = row.description ?? row.Description ?? "";
              const verdict = row.verdict ?? row.Verdict ?? "";
              const score = row.impactScore ?? row.ImpactScore ?? 0;
              return (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>${ticker}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{type.replace(/_/g, " ")}</td>
                  <td style={{ padding: "10px 12px", color: "var(--text-secondary)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{description}</td>
                  <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, color: verdictColor(verdict), background: `${verdictColor(verdict)}18`, border: `1px solid ${verdictColor(verdict)}40` }}>
                      {verdict.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700, color: scoreColor(score) }}>{score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
