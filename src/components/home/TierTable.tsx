"use client";
import Link from "next/link";
import { Check, X, Star, Zap, Building2 } from "lucide-react";

type CV = true | false | string;
const TIERS = [
  { id:"catalyst",     name:"Catalyst",     price:"Free",  period:"forever",  icon:Zap,       iconColor:"var(--text-secondary)", highlight:false, cta:"Get started",    href:"/register",              style:"outline" as const },
  { id:"alpha",        name:"Alpha",        price:"$29",   period:"/ month",  icon:Star,      iconColor:"var(--accent)",         highlight:true,  cta:"Start free trial",href:"/register?plan=alpha",   style:"filled" as const, badge:"MOST POPULAR" },
  { id:"institutional",name:"Institutional",price:"$79",   period:"/ month",  icon:Building2, iconColor:"var(--gold)",           highlight:false, cta:"Start free trial",href:"/register?plan=institutional",style:"gold" as const },
];
const ROWS: { label:string; cat?:string; values?:[CV,CV,CV] }[] = [
  { label:"Data", cat:"DATA" },
  { label:"Catalyst feed",          values:["15min delay",true,true] },
  { label:"Real-time signals",      values:[false,true,true] },
  { label:"SEC filings",            values:["Form 4 only",true,true] },
  { label:"Insider trades",         values:[false,true,true] },
  { label:"Congressional trades",   values:[false,true,true] },
  { label:"FDA decisions",          values:[false,true,true] },
  { label:"Earnings data",          values:["Limited",true,true] },
  { label:"Intelligence", cat:"INTELLIGENCE" },
  { label:"AI conviction scores",   values:[false,true,true] },
  { label:"Directional verdicts",   values:[false,true,true] },
  { label:"Historical correlations",values:[false,false,true] },
  { label:"AI narrative summaries", values:[false,false,true] },
  { label:"Tools", cat:"TOOLS" },
  { label:"All calculators",        values:[true,true,true] },
  { label:"Watchlist",              values:["3 tickers","Unlimited","Unlimited"] },
  { label:"Momentum scanners",      values:[false,true,true] },
  { label:"Custom alert builder",   values:[false,false,true] },
  { label:"API access",             values:[false,false,true] },
];

function Cell({ v }: { v:CV }) {
  if(v===true)  return <Check size={16} style={{ color:"var(--bull)" }}/>;
  if(v===false) return <X     size={14} style={{ color:"var(--text-muted)" }}/>;
  return <span style={{ fontSize:11, color:"var(--text-secondary)", fontFamily:"monospace" }}>{v}</span>;
}

export function TierTable() {
  return (
    <section style={{ padding:"0 24px 80px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", color:"var(--accent)", textTransform:"uppercase", marginBottom:10 }}>Pricing</div>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:12 }}>Choose your edge</h2>
          <p style={{ fontSize:15, color:"var(--text-secondary)" }}>All plans include a 7-day free trial. No credit card required.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"260px repeat(3,1fr)", gap:1, marginBottom:1 }}>
          <div/>
          {TIERS.map(t=>{ const Icon=t.icon; return (
            <div key={t.id} style={{ background:t.highlight?"var(--bg-elevated)":"var(--bg-card)", border:t.highlight?"1px solid rgba(0,153,255,0.35)":"1px solid var(--border)", borderRadius:"12px 12px 0 0", padding:"24px 20px 20px", position:"relative", textAlign:"center" }}>
              {t.badge && <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"var(--accent)", color:"#fff", fontSize:10, fontWeight:700, letterSpacing:"0.08em", borderRadius:20, padding:"3px 12px", whiteSpace:"nowrap" }}>{t.badge}</div>}
              <Icon size={22} style={{ color:t.iconColor, marginBottom:8 }}/>
              <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>{t.name}</div>
              <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:4, marginBottom:16 }}>
                <span style={{ fontSize:32, fontWeight:800, color:t.highlight?"var(--accent)":t.id==="institutional"?"var(--gold)":"var(--text-primary)", fontFamily:"monospace", letterSpacing:"-0.03em" }}>{t.price}</span>
                {t.period && <span style={{ fontSize:13, color:"var(--text-secondary)" }}>{t.period}</span>}
              </div>
              <Link href={t.href} style={{ display:"block", textAlign:"center", textDecoration:"none", padding:"9px 0", borderRadius:8, fontSize:13, fontWeight:600, ...(t.style==="filled"?{background:"var(--accent)",color:"#fff"}:t.style==="gold"?{background:"var(--gold-dim)",color:"var(--gold)",border:"1px solid rgba(255,215,0,0.30)"}:{background:"transparent",color:"var(--text-secondary)",border:"1px solid var(--border-medium)"}) }}>
                {t.cta}
              </Link>
            </div>
          );})}
        </div>
        <div style={{ border:"1px solid var(--border)", borderRadius:"0 0 12px 12px", overflow:"hidden" }}>
          {ROWS.map((row,i)=>{
            if(row.cat) return (
              <div key={row.label} style={{ display:"grid", gridTemplateColumns:"260px repeat(3,1fr)", background:"var(--bg-surface)", padding:"8px 16px", borderTop:i>0?"1px solid var(--border)":"none" }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.10em", color:"var(--text-muted)", textTransform:"uppercase", gridColumn:"1/-1" }}>{row.cat}</div>
              </div>
            );
            return (
              <div key={row.label} style={{ display:"grid", gridTemplateColumns:"260px repeat(3,1fr)", borderTop:"1px solid var(--border)", background:i%2===0?"var(--bg-card)":"var(--bg-surface)" }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="var(--bg-elevated)"}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=i%2===0?"var(--bg-card)":"var(--bg-surface)"}
              >
                <div style={{ padding:"10px 16px", fontSize:13, color:"var(--text-secondary)", display:"flex", alignItems:"center" }}>{row.label}</div>
                {row.values!.map((v,j)=>(
                  <div key={j} style={{ padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"center", borderLeft:"1px solid var(--border)" }}>
                    <Cell v={v}/>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:20, background:"var(--accent-dim)", border:"1px solid rgba(0,153,255,0.20)", borderRadius:10, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
          <div>
            <span style={{ fontSize:14, fontWeight:600, color:"var(--text-primary)" }}>Save with annual billing</span>
            <span style={{ fontSize:13, color:"var(--text-secondary)", marginLeft:10 }}>Get 2 months free — Alpha $24/mo, Institutional $66/mo</span>
          </div>
          <Link href="/pricing" style={{ textDecoration:"none", fontSize:13, fontWeight:600, color:"var(--accent)", whiteSpace:"nowrap" }}>View annual plans →</Link>
        </div>
      </div>
    </section>
  );
}
