"use client";
import { Brain, Clock, Globe2, TrendingUp, Layers, ShieldCheck } from "lucide-react";

const POINTS = [
  { icon:Brain,       color:"var(--accent)",  title:"AI conviction scoring — not just aggregation",        body:"Every signal runs through a 6-step AI pipeline: relevance → sentiment → magnitude → corroboration → conviction → verdict. You get a score 0–100 and a clear bullish/bearish/neutral call." },
  { icon:Clock,       color:"var(--bull)",    title:"All sessions. Pre-market through overnight.",          body:"Markets don't stop at 4PM and neither do catalysts. Catalyst Wire processes signals 24 hours a day across every session." },
  { icon:Globe2,      color:"#a78bfa",        title:"Every instrument, not just stocks",                   body:"Equities, options, ETFs, crypto, forex, commodities, futures, biotech, IPOs, SPACs, and macro instruments — one unified intelligence layer." },
  { icon:TrendingUp,  color:"var(--gold)",    title:"Historical correlation engine",                       body:'"When this type of event occurs, these sectors have historically moved +4.2% over 5 trading days." The kind of signal institutional desks pay for.' },
  { icon:Layers,      color:"var(--neutral)", title:"Source chain transparency",                           body:"Every signal shows exactly where it came from: SEC EDGAR → Form type → Filing entity → AI reasoning. No black boxes." },
  { icon:ShieldCheck, color:"#34d399",        title:"Built for traders, by a trader",                      body:"No bloated enterprise UX. No noise. No paywalled data that doesn't move markets. Fast, dense, and immediately actionable." },
];

export function WhyDifferent() {
  return (
    <section style={{ padding:"0 24px 80px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", color:"var(--accent)", textTransform:"uppercase", marginBottom:10 }}>Why Catalyst Wire</div>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:14 }}>
            Not a screener. <span className="gradient-text">Not a news feed.</span>
          </h2>
          <p style={{ fontSize:16, color:"var(--text-secondary)", maxWidth:560, margin:"0 auto" }}>There are thousands of financial data tools. Catalyst Wire is the intelligence layer between raw data and your trade decision.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:20 }}>
          {POINTS.map(p=>{ const Icon=p.icon; return (
            <div key={p.title} style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:14, padding:"28px 26px", display:"flex", gap:18, transition:"border-color 0.2s, background 0.2s" }}
              onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.borderColor=`${p.color}50`; el.style.background="var(--bg-elevated)"; }}
              onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.borderColor="var(--border)"; el.style.background="var(--bg-card)"; }}
            >
              <div style={{ width:44, height:44, background:`${p.color}18`, border:`1px solid ${p.color}30`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                <Icon size={22} style={{ color:p.color }}/>
              </div>
              <div>
                <h3 style={{ fontSize:15, fontWeight:600, color:"var(--text-primary)", marginBottom:8, lineHeight:1.3 }}>{p.title}</h3>
                <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.7 }}>{p.body}</p>
              </div>
            </div>
          );})}
        </div>
      </div>
    </section>
  );
}
