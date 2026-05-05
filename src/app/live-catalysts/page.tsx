import Link from "next/link";
import { ArrowRight, Zap, FileText } from "lucide-react";
import { searchFilings } from "@/lib/data/sec-edgar";
import { FilingsTable } from "./FilingsTable";
import dayjs from "dayjs";

export const revalidate = 300;

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
            Real-time SEC filings — Form 4 insider trades, 8-K material events, and ownership changes.
          </p>
        </div>
        <Link href="/register?plan=alpha" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Unlock real-time feed <ArrowRight size={14}/>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Form 4 Filings", value: form4.length, icon: FileText },
          { label: "8-K Events",     value: form8k.length, icon: FileText },
          { label: "Signals Today",  value: all.length,    icon: Zap },
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

      <FilingsTable visible={visible} locked={locked}/>
    </div>
  );
}
