import Link from "next/link";
import { ArrowRight, Zap, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { searchFilings } from "@/lib/data/sec-edgar";
import dayjs from "dayjs";

export const revalidate = 300;

function VerdictBadge({ v }: { v: string }) {
  const isBuy  = v === "Buy"  || v === "Bullish" || v === "Material Event";
  const isSell = v === "Sell" || v === "Bearish";
  const c = isBuy ? "var(--bull)" : isSell ? "var(--bear)" : "var(--accent)";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, color: c, background: `${c}18`, border: `1px solid ${c}40`, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {isBuy ? <TrendingUp size={9}/> : isSell ? <TrendingDown size={9}/> : <FileText size={9}/>}
      {v}
    </span>
  );
}

function FormBadge({ form }: { form: string }) {
  const map: Record<string, string> = {
    "4": "var(--accent)", "8-K": "var(--gold)", "SC 13D": "var(--bull)",
    "SC 13G": "var(--text-secondary)", "10-Q": "var(--text-muted)", "10-K": "var(--text-muted)",
  };
  const c = map[form] ?? "var(--text-muted)";
  return (
    <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: c, background: `${c}18`, border: `1px solid ${c}30`, borderRadius: 5, padding: "2px 7px" }}>
      {form}
    </span>
  );
}

export default async function LiveCatalystsPage() {
  const thirtyDaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");

  const [form4, form8k] = await Promise.all([
    searchFilings({ forms: ["4"], dateFrom: thirtyDaysAgo, limit: 20 }).catch(() => []),
    searchFilings({ forms: ["8-K"], dateFrom: thirtyDaysAgo, limit: 20 }).catch(() => []),
  ]);

  const all = [...form4, ...form8k]
    .sort((a, b) => new Date(b.file_date).getTime() - new Date(a.file_date).getTime())
    .slice(0, 30);

  const visible = all.slice(0, 8);
  const locked  = all.slice(8);

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span className="live-dot"/>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase" }}>Live Feed</span>
          </div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Live Catalysts</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Real-time SEC filings — Form 4 insider trades, 8-K material events, and 13D/13G ownership changes.
          </p>
        </div>
        <Link href="/register?plan=alpha" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Unlock real-time feed <ArrowRight size={14}/>
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Form 4 Filings",    value: form4.length,    icon: TrendingUp },
          { label: "8-K Events",        value: form8k.length,   icon: FileText },
          { label: "Signals Today",     value: all.length,      icon: Zap },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Icon size={13} style={{ color: "var(--accent)" }}/>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="live-dot"/>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Recent Filings</span>
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Last 30 days · {all.length} signals</span>
        </div>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "70px 100px 1fr 120px 90px", padding: "8px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
          {["Form","Date","Entity","Verdict","Period"].map((h) => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {visible.map((f) => (
          <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ display: "grid", gridTemplateColumns: "70px 100px 1fr 120px 90px", padding: "11px 16px", borderBottom: "1px solid var(--border)", alignItems: "center", fontSize: 13 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div><FormBadge form={f.form}/></div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)" }}>{dayjs(f.file_date).format("MMM D")}</div>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)", fontWeight: 500 }}>{f.entity_name}</div>
              <div><VerdictBadge v={f.form === "4" ? "Insider Activity" : f.form === "8-K" ? "Material Event" : "Regulatory"}/></div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>{f.period || "—"}</div>
            </div>
          </a>
        ))}

        {/* Locked rows */}
        {locked.length > 0 && (
          <div style={{ position: "relative" }}>
            {locked.slice(0, 6).map((_, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 100px 1fr 120px 90px", padding: "11px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)", filter: "blur(3px)", pointerEvents: "none" }}>
                {["██", "███ ██", "█████████ ██████████", "███████", "██████"].map((p, j) => (
                  <div key={j}>{p}</div>
                ))}
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
    </div>
  );
}
