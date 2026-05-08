"use client";
import Link from "next/link";
import { FileText, TrendingUp, ArrowRight } from "lucide-react";
import dayjs from "dayjs";
import type { EdgarFiling } from "@/lib/data/sec-edgar";

function FormBadge({ form }: { form: string }) {
  const map: Record<string, string> = {
    "4": "var(--accent)", "8-K": "var(--gold)", "SC 13D": "var(--bull)",
    "SC 13G": "var(--text-secondary)",
  };
  const c = map[form] ?? "var(--text-muted)";
  return (
    <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: c, background: `${c}18`, border: `1px solid ${c}30`, borderRadius: 5, padding: "2px 7px" }}>
      {form}
    </span>
  );
}

function VerdictBadge({ form }: { form: string }) {
  const label = form === "4" ? "Insider Activity" : form === "8-K" ? "Material Event" : "Regulatory";
  const isBull = form === "8-K";
  const c = isBull ? "var(--bull)" : "var(--accent)";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, color: c, background: `${c}18`, border: `1px solid ${c}40`, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {isBull ? <TrendingUp size={9}/> : <FileText size={9}/>} {label}
    </span>
  );
}

export function FilingsTable({ visible, locked }: { visible: EdgarFiling[]; locked: EdgarFiling[] }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="live-dot"/>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Recent Filings</span>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Last 30 days · {visible.length + locked.length} signals</span>
      </div>

      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "70px 100px 1fr 140px 90px", padding: "8px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
        {["Form","Date","Entity","Verdict","Period"].map(h => (
          <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</div>
        ))}
      </div>

      {visible.map(f => (
        <a key={f.id} href={f.linkToFilingDetails} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{ display: "grid", gridTemplateColumns: "70px 100px 1fr 140px 90px", padding: "11px 16px", borderBottom: "1px solid var(--border)", alignItems: "center", fontSize: 13 }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <div><FormBadge form={f.formType}/></div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{f.filedAt ? dayjs(f.filedAt).format("MMM D") : "—"}</div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)", fontWeight: 500 }}>{f.companyName}</div>
            <div><VerdictBadge form={f.formType}/></div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>{f.periodOfReport || "—"}</div>
          </div>
        </a>
      ))}

      {locked.length > 0 && (
        <div style={{ position: "relative" }}>
          {locked.slice(0, 6).map((_, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 100px 1fr 140px 90px", padding: "11px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)", filter: "blur(3px)", pointerEvents: "none" }}>
              {["██", "███ ██", "████████ ██████████", "███████", "██████"].map((p, j) => <div key={j}>{p}</div>)}
            </div>
          ))}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom, transparent, rgba(8,12,20,0.9))" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 10, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{locked.length} more signals</span>
              <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "#fff", padding: "7px 16px", borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                Upgrade <ArrowRight size={11}/>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
