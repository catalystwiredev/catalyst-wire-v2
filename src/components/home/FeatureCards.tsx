"use client";
import Link from "next/link";
import { Zap, ScanLine, Calendar, FileText, UserCheck, Landmark, FlaskConical, BarChart2, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon:Zap,          color:"var(--accent)",  colorDim:"rgba(0,153,255,0.10)",  title:"AI Catalyst Feed",        description:"Every market-moving event scored 0–100 with conviction tiers and directional verdicts. Real-time, ranked, actionable.", href:"/live-catalysts",       stat:"3,847 signals today" },
  { icon:FileText,     color:"#a78bfa",        colorDim:"rgba(167,139,250,0.10)",title:"SEC Filings",             description:"8-K, Form 4, 10-Q, S-1 — parsed and AI-scored within seconds of EDGAR publication.", href:"/sec-filings",           stat:"124 filings today" },
  { icon:UserCheck,    color:"var(--bull)",    colorDim:"rgba(0,230,118,0.10)",  title:"Insider Trades",          description:"Form 4 disclosures from executives. Track cluster buys, CEO purchases, and historically significant patterns.", href:"/insider-trades",       stat:"47 trades today" },
  { icon:Landmark,     color:"var(--gold)",    colorDim:"rgba(255,215,0,0.10)",  title:"Congressional Trades",   description:"STOCK Act disclosures from members of Congress. Political alpha — who's trading before it's mainstream news.", href:"/congressional-trades", stat:"12 disclosures this week" },
  { icon:FlaskConical, color:"#f472b6",        colorDim:"rgba(244,114,182,0.10)",title:"FDA Decisions",           description:"PDUFA dates, drug approvals, clinical trial outcomes — with AI probability scores and historical context.", href:"/fda-decisions",        stat:"8 decisions this month" },
  { icon:BarChart2,    color:"var(--neutral)", colorDim:"rgba(245,158,11,0.10)", title:"Earnings Intelligence",  description:"Pre-earnings AI analysis, historical surprise patterns, options implied moves — all in one view.", href:"/earnings",             stat:"236 reports this week" },
  { icon:ScanLine,     color:"#34d399",        colorDim:"rgba(52,211,153,0.10)", title:"Momentum Scanners",      description:"AI-ranked catalyst momentum, unusual volume, and sector rotation — scanners built for active traders.", href:"/scanners",             stat:"Live · updated hourly" },
  { icon:Calendar,     color:"#60a5fa",        colorDim:"rgba(96,165,250,0.10)", title:"Specialized Calendars",  description:"FDA PDUFA, earnings, IPO S-1 registrations — live from Finnhub, OpenFDA, and SEC EDGAR.", href:"/calendars",            stat:"Live · 3 data sources" },
];

export function FeatureCards() {
  return (
    <section style={{ padding:"0 24px 80px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", color:"var(--accent)", textTransform:"uppercase", marginBottom:10 }}>Full Coverage</div>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:700, letterSpacing:"-0.02em", marginBottom:14 }}>Every signal that moves markets</h2>
          <p style={{ fontSize:16, color:"var(--text-secondary)", maxWidth:520, margin:"0 auto" }}>Not a screener. Not a news feed. A complete intelligence operating system for active traders.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
          {FEATURES.map(f=>{
            const Icon=f.icon;
            return (
              <Link key={f.title} href={f.href} style={{ textDecoration:"none" }}>
                <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:14, padding:"22px 22px 18px", height:"100%", position:"relative", overflow:"hidden", transition:"border-color 0.2s, background 0.2s, transform 0.2s", cursor:"pointer" }}
                  onMouseEnter={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.borderColor=f.color; el.style.background="var(--bg-elevated)"; el.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLDivElement; el.style.borderColor="var(--border)"; el.style.background="var(--bg-card)"; el.style.transform="translateY(0)"; }}
                >
                  <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, background:f.colorDim, borderRadius:"50%", filter:"blur(20px)", pointerEvents:"none" }}/>
                  <div style={{ width:40, height:40, background:f.colorDim, border:`1px solid ${f.color}30`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                    <Icon size={20} style={{ color:f.color }}/>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:600, marginBottom:8, color:"var(--text-primary)" }}>{f.title}</h3>
                  <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.6, marginBottom:16 }}>{f.description}</p>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:11, color:f.color, fontFamily:"monospace", fontWeight:500 }}>{f.stat}</span>
                    <ArrowRight size={14} style={{ color:f.color, opacity:0.7 }}/>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
