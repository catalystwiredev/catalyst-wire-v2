"use client";
import Link from "next/link";
import { useRef } from "react";
import { Zap, ScanLine, Calendar, FileText, UserCheck, Landmark, FlaskConical, BarChart2, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon:Zap,          color:"#0099ff",  glow:"rgba(0,153,255,0.35)",   colorDim:"rgba(0,153,255,0.10)",  title:"AI Catalyst Feed",        description:"Every market-moving event scored 0–100 with conviction tiers and directional verdicts. Real-time, ranked, actionable.", href:"/live-catalysts",       stat:"Live · updates every 5 min" },
  { icon:FileText,     color:"#a78bfa",  glow:"rgba(167,139,250,0.35)", colorDim:"rgba(167,139,250,0.10)",title:"SEC Filings",             description:"8-K, Form 4, 10-Q, S-1 — parsed and AI-scored within seconds of EDGAR publication.", href:"/sec-filings",           stat:"8-K, Form 4, 10-K, 10-Q" },
  { icon:UserCheck,    color:"#00e676",  glow:"rgba(0,230,118,0.35)",   colorDim:"rgba(0,230,118,0.10)",  title:"Insider Trades",          description:"Form 4 disclosures from executives. Track cluster buys, CEO purchases, and historically significant patterns.", href:"/insider-trades",       stat:"Officer & director transactions" },
  { icon:Landmark,     color:"#ffd700",  glow:"rgba(255,215,0,0.35)",   colorDim:"rgba(255,215,0,0.10)",  title:"Congressional Trades",   description:"STOCK Act disclosures from members of Congress. Political alpha — who's trading before it's mainstream news.", href:"/congressional-trades", stat:"STOCK Act disclosures" },
  { icon:FlaskConical, color:"#f472b6",  glow:"rgba(244,114,182,0.35)", colorDim:"rgba(244,114,182,0.10)",title:"FDA Decisions",           description:"PDUFA dates, drug approvals, clinical trial outcomes — with AI probability scores and historical context.", href:"/fda-decisions",        stat:"NDA, BLA, PDUFA · OpenFDA" },
  { icon:BarChart2,    color:"#f59e0b",  glow:"rgba(245,158,11,0.35)",  colorDim:"rgba(245,158,11,0.10)", title:"Earnings Intelligence",  description:"Pre-earnings AI analysis, historical surprise patterns, options implied moves — all in one view.", href:"/earnings",             stat:"60-day forward calendar" },
  { icon:ScanLine,     color:"#34d399",  glow:"rgba(52,211,153,0.35)",  colorDim:"rgba(52,211,153,0.10)", title:"Momentum Scanners",      description:"AI-ranked catalyst momentum, unusual volume, and sector rotation — scanners built for active traders.", href:"/scanners",             stat:"Live · updated hourly" },
  { icon:Calendar,     color:"#60a5fa",  glow:"rgba(96,165,250,0.35)",  colorDim:"rgba(96,165,250,0.10)", title:"Specialized Calendars",  description:"FDA PDUFA, earnings, IPO S-1 registrations — live from Finnhub, OpenFDA, and SEC EDGAR.", href:"/calendars",            stat:"Finnhub · OpenFDA · EDGAR" },
];

function TiltCard({ f }: { f: typeof FEATURES[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = f.icon;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateZ(4px)`;
  }

  function onEnter(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    el.style.borderColor = `${f.color}40`;
    el.style.boxShadow = `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${f.color}25, 0 0 30px ${f.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`;
  }

  function onLeave(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    el.style.borderColor = "rgba(255,255,255,0.07)";
    el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)";
  }

  return (
    <Link href={f.href} style={{ textDecoration: "none", display: "block" }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          background: "rgba(10,17,32,0.65)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 18,
          padding: "24px 22px 20px",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.25s, box-shadow 0.25s, transform 0.1s linear",
          transformStyle: "preserve-3d",
          boxShadow: "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
          cursor: "pointer",
        }}
      >
        {/* Ambient glow orb */}
        <div style={{ position:"absolute", top:-30, right:-20, width:120, height:120, background:`radial-gradient(circle, ${f.glow} 0%, transparent 70%)`, pointerEvents:"none", filter:"blur(20px)" }}/>
        {/* Top shimmer line */}
        <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:1, background:`linear-gradient(90deg, transparent, ${f.color}50, transparent)`, pointerEvents:"none" }}/>

        {/* Icon */}
        <div style={{ width:44, height:44, background:`linear-gradient(135deg, ${f.colorDim} 0%, rgba(0,0,0,0) 100%)`, border:`1px solid ${f.color}30`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, position:"relative", boxShadow:`0 0 16px ${f.glow}` }}>
          <Icon size={21} style={{ color:f.color, filter:`drop-shadow(0 0 4px ${f.color})` }}/>
        </div>

        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:8, color:"var(--text-primary)", letterSpacing:"-0.01em" }}>{f.title}</h3>
        <p style={{ fontSize:12.5, color:"var(--text-secondary)", lineHeight:1.65, marginBottom:18 }}>{f.description}</p>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:f.color, fontFamily:"monospace", fontWeight:600, textShadow:`0 0 8px ${f.glow}` }}>{f.stat}</span>
          <div style={{ width:26, height:26, background:`${f.color}15`, border:`1px solid ${f.color}30`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <ArrowRight size={13} style={{ color:f.color }}/>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeatureCards() {
  return (
    <section style={{ padding:"0 24px 80px", position:"relative", zIndex:1 }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,153,255,0.08)", border:"1px solid rgba(0,153,255,0.2)", borderRadius:20, padding:"5px 14px", marginBottom:14 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", boxShadow:"0 0 8px var(--accent)", display:"inline-block" }}/>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", color:"var(--accent)", textTransform:"uppercase" }}>Full Coverage</span>
          </div>
          <h2 style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:800, letterSpacing:"-0.025em", marginBottom:14, lineHeight:1.15 }}>
            Every signal that{" "}
            <span style={{ background:"linear-gradient(135deg, #33b5ff, #00e676)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              moves markets
            </span>
          </h2>
          <p style={{ fontSize:16, color:"var(--text-secondary)", maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>Not a screener. Not a news feed. A complete intelligence operating system for active traders.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:18 }}>
          {FEATURES.map(f => <TiltCard key={f.title} f={f}/>)}
        </div>
      </div>
    </section>
  );
}
