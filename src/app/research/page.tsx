import Link from "next/link";
import { ExternalLink, BookOpen, Search, Globe, BarChart2, Newspaper, Database, ArrowRight } from "lucide-react";
import { RESEARCH_SOURCES } from "@/lib/data/research-sources";
import type { ResearchSource } from "@/lib/data/research-sources";

export const dynamic = "force-dynamic";

const CATEGORIES: { id: ResearchSource["category"]; label: string; icon: typeof BookOpen; desc: string }[] = [
  { id: "news", label: "Financial News", icon: Newspaper, desc: "Real-time journalism and market-moving headlines" },
  { id: "financial", label: "Stock Research", icon: BarChart2, desc: "Ratings, valuations, earnings analysis, and price targets" },
  { id: "data", label: "Market Data", icon: Database, desc: "Raw financial data, economic series, and regulatory filings" },
  { id: "industry", label: "Industry Intelligence", icon: Search, desc: "Market sizing, competitive landscape, and sector reports" },
  { id: "academic", label: "Academic Research", icon: BookOpen, desc: "Peer-reviewed finance papers and working papers" },
  { id: "global", label: "Global Markets", icon: Globe, desc: "Country risk, trade data, and geopolitical market analysis" },
];

const WORKFLOWS = [
  { label: "Earnings Catalyst Deep-Dive", sources: ["macrotrends","seeking-alpha","wsj","edgar"], desc: "Historical fundamentals → analyst estimates → transcript → regulatory filings" },
  { label: "Biotech FDA Catalyst Research", sources: ["ssrn","nber","edgar","reuters"], desc: "Clinical trial data → regulatory precedent → academic literature → SEC filings" },
  { label: "Macro / Rate Environment Analysis", sources: ["fred","reuters","ft","nber"], desc: "Economic indicators → central bank policy → academic macro research" },
  { label: "Sector & Industry Analysis", sources: ["statista","globaledge","morningstar","macrotrends"], desc: "Market sizing → global exposure → competitive moat → historical fundamentals" },
];

export default function ResearchPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Research Intelligence</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>Research Hub</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 640 }}>
          Curated institutional-grade research resources for active investors and analysts. Free and premium sources covering news, fundamentals, academic finance, and global markets.
        </p>
      </div>

      {/* Research Workflows */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, padding: 24, marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Research Workflows</h2>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>Curated source sequences for specific catalyst types and research goals.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {WORKFLOWS.map(wf => (
            <div key={wf.label} style={{ padding: "14px 16px", background: "var(--bg-elevated)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{wf.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{wf.desc}</div>
                </div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
                  {wf.sources.map((srcId, i) => {
                    const src = RESEARCH_SOURCES.find(s => s.id === srcId);
                    if (!src) return null;
                    return (
                      <span key={srcId} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        {i > 0 && <span style={{ color: "var(--text-muted)", fontSize: 10 }}>→</span>}
                        <a href={src.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6, background: `${src.iconColor}18`, color: src.iconColor, border: `1px solid ${src.iconColor}35`, textDecoration: "none" }}>
                          {src.shortName} <ExternalLink size={8}/>
                        </a>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources by category */}
      {CATEGORIES.map(cat => {
        const sources = RESEARCH_SOURCES.filter(s => s.category === cat.id);
        if (!sources.length) return null;
        const Icon = cat.icon;
        return (
          <section key={cat.id} style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Icon size={18} style={{ color: "var(--accent)" }}/>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{cat.label}</h2>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>{cat.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {sources.map(src => (
                <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, textDecoration: "none", display: "block", transition: "border-color 0.15s, transform 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>{src.name}</div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: src.free ? "rgba(0,230,118,0.12)" : "rgba(0,153,255,0.12)", color: src.free ? "var(--bull)" : "var(--accent)", border: `1px solid ${src.free ? "rgba(0,230,118,0.3)" : "rgba(0,153,255,0.3)"}` }}>
                        {src.free ? "FREE" : "PREMIUM"}
                      </span>
                    </div>
                    <ExternalLink size={14} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}/>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{src.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {src.bestFor.map(tag => (
                      <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: `${src.iconColor}12`, color: src.iconColor, border: `1px solid ${src.iconColor}28` }}>{tag}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Missing a source?</div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Suggest a research database or data provider to add to this hub.</p>
        </div>
        <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "#fff", padding: "9px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
          Suggest a source <ArrowRight size={12}/>
        </Link>
      </div>
    </div>
  );
}
