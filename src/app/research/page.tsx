import Link from "next/link";
import { ExternalLink, BookOpen, Search, GraduationCap, Globe, BarChart2, Newspaper } from "lucide-react";
import { RESEARCH_SOURCES } from "@/lib/data/research-sources";
import type { ResearchSource } from "@/lib/data/research-sources";

const CATEGORIES: { id: ResearchSource["category"]; label: string; icon: typeof BookOpen; desc: string }[] = [
  { id: "news",      label: "Financial News",         icon: Newspaper,    desc: "Premium journalism and real-time reporting" },
  { id: "financial", label: "Stock Research",         icon: BarChart2,    desc: "Ratings, valuations, and price projections" },
  { id: "industry",  label: "Industry Intelligence",  icon: Search,       desc: "Market sizing, competitive analysis, sector reports" },
  { id: "academic",  label: "Academic Journals",      icon: BookOpen,     desc: "Peer-reviewed finance research and strategy papers" },
  { id: "global",    label: "Global Markets",         icon: Globe,        desc: "Country risk, trade data, geopolitical analysis" },
];

const TICKER_WORKFLOWS = [
  { ticker: "NVDA", label: "AI semiconductor deep-dive", sources: ["ibisworld","valueline","proquest-abi"] },
  { ticker: "MRNA", label: "Biotech FDA catalyst research", sources: ["proquest-abi","ebsco-bsc","wsj"] },
  { ticker: "LMT",  label: "Defense sector analysis", sources: ["ibisworld","globaledge","valueline"] },
];

export default function ResearchPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <GraduationCap size={22} style={{ color: "var(--accent)" }}/>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase" }}>UTPB Academic Access</div>
        </div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>Research Hub</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 640 }}>
          Catalyst Wire integrates with UTPB&apos;s institutional database subscriptions — Value Line, IBISWorld, ProQuest, and EBSCO — alongside public sources like WSJ and GlobalEdge. Use these alongside platform signals for deep fundamental research.
        </p>
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 12px" }}>
          <GraduationCap size={12}/> UTPB credentials required for sources marked with a lock. Public sources are open to all users.
        </div>
      </div>

      {/* Ticker-based research workflows */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, padding: 24, marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Quick Research Workflows</h2>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>Open the right sources for a specific catalyst or ticker in one click.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TICKER_WORKFLOWS.map(wf => (
            <div key={wf.ticker} style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", fontSize: 14, minWidth: 52 }}>${wf.ticker}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1 }}>{wf.label}</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {wf.sources.map(srcId => {
                  const src = RESEARCH_SOURCES.find(s => s.id === srcId);
                  if (!src) return null;
                  return (
                    <a key={srcId} href={src.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: `${src.iconColor}18`, color: src.iconColor, border: `1px solid ${src.iconColor}40`, textDecoration: "none" }}>
                      {src.shortName} <ExternalLink size={9}/>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ProQuest embedded search widget */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, padding: 24, marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, background: "rgba(123,45,139,0.15)", border: "1px solid rgba(123,45,139,0.35)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={13} style={{ color: "#7b2d8b" }}/>
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>ProQuest ABI/INFORM Global Search</h2>
          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: "rgba(123,45,139,0.12)", color: "#7b2d8b", border: "1px solid rgba(123,45,139,0.30)" }}>UTPB</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18 }}>
          Search 5,000+ business and finance journals. Full-text access requires UTPB credentials via ezproxy.
        </p>
        {/* ProQuest search widget embed */}
        <iframe
          src="https://www.proquest.com/abiglobal/widget/Widgets?accountid=7137&type=searchbox&css=false"
          width="100%"
          height="60"
          style={{ border: "none", borderRadius: 8, overflow: "hidden" }}
          title="ProQuest ABI/INFORM Search"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
        />
        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <a href="https://www.proquest.com/abiglobal/advanced?accountid=7137" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, fontWeight: 600, color: "#7b2d8b", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Advanced search <ExternalLink size={11}/>
          </a>
          <a href="https://www.proquest.com/myresearch/documents?accountid=7137" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            My saved research <ExternalLink size={11}/>
          </a>
        </div>
      </div>

      {/* All sources by category */}
      {CATEGORIES.map(cat => {
        const sources = RESEARCH_SOURCES.filter(s => s.category === cat.id);
        if (!sources.length) return null;
        const Icon = cat.icon;
        return (
          <section key={cat.id} style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Icon size={18} style={{ color: "var(--accent)" }}/>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{cat.label}</h2>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>{cat.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {sources.map(src => (
                <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer"
                  style={{ background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: 12, padding: 20, textDecoration: "none", display: "block", transition: "border-color 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{src.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: src.iconColor }}>{src.requiresUTPB ? "🔒 UTPB Access" : "🌐 Public"}</div>
                    </div>
                    <ExternalLink size={14} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}/>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{src.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {src.bestFor.map(tag => (
                      <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: `${src.iconColor}12`, color: src.iconColor, border: `1px solid ${src.iconColor}30` }}>{tag}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
