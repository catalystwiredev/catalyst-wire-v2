"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Zap, ChevronDown } from "lucide-react";
import { CandleBackground } from "./CandleBackground";

const STATS = [
  { label:"Catalysts Scored Today", value:3847, suffix:"" },
  { label:"Data Sources Active",    value:14,   suffix:"+" },
  { label:"Avg Signal Latency",     value:1,    suffix:"s", prefix:"<" },
  { label:"Instruments Covered",    value:12000,suffix:"+" },
];

function Counter({ target, suffix="", prefix="" }: { target:number; suffix?:string; prefix?:string }) {
  const [v, setV] = useState(0);
  useEffect(()=>{
    let n=0; const step=target/90;
    const t=setInterval(()=>{ n+=step; if(n>=target){ setV(target); clearInterval(t); } else setV(Math.floor(n)); },16);
    return ()=>clearInterval(t);
  },[target]);
  return <span style={{ fontFamily:"monospace" }}>{prefix}{v>=1000?v.toLocaleString():v}{suffix}</span>;
}

export function HeroSection() {
  const [m, setM] = useState(false);
  useEffect(()=>{ setM(true); },[]);
  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"80px 24px 48px", overflow:"hidden" }}>
      <CandleBackground/>
      <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:500, background:"radial-gradient(ellipse at center, rgba(0,153,255,0.08) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", maxWidth:860, width:"100%" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,230,118,0.08)", border:"1px solid var(--bull-border)", borderRadius:20, padding:"5px 14px", marginBottom:28, fontSize:12, color:"var(--bull)", fontWeight:500, opacity:m?1:0, transition:"opacity 0.5s" }}>
          <span className="live-dot"/> Markets Open · 3,847 signals processed today
        </div>
        <h1 style={{ fontSize:"clamp(32px,5.5vw,72px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-0.03em", marginBottom:20, opacity:m?1:0, transform:m?"translateY(0)":"translateY(20px)", transition:"opacity 0.6s 0.1s, transform 0.6s 0.1s" }}>
          <span style={{ color:"var(--text-primary)" }}>The Intelligence Layer</span><br/>
          <span className="gradient-text">Active Traders Demand.</span>
        </h1>
        <p style={{ fontSize:"clamp(15px,2vw,19px)", color:"var(--text-secondary)", lineHeight:1.65, maxWidth:640, margin:"0 auto 36px", opacity:m?1:0, transition:"opacity 0.6s 0.2s" }}>
          AI-scored catalyst signals from SEC filings, insider trades, congressional disclosures, FDA decisions, and earnings — ranked by conviction, delivered in real time across every market session and instrument.
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap", marginBottom:40, opacity:m?1:0, transition:"opacity 0.6s 0.25s" }}>
          {[{icon:Zap,label:"Real-Time"},{icon:TrendingUp,label:"All Instruments"},{icon:Shield,label:"AI-Powered"}].map(({icon:Icon,label})=>(
            <div key={label} style={{ display:"flex", alignItems:"center", gap:6, background:"var(--bg-card)", border:"1px solid var(--border-medium)", borderRadius:20, padding:"5px 12px", fontSize:12, color:"var(--text-secondary)", fontWeight:500 }}>
              <Icon size={13} style={{ color:"var(--accent)" }}/> {label}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:64, opacity:m?1:0, transition:"opacity 0.6s 0.3s" }}>
          <Link href="/register" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--accent)", color:"#fff", padding:"12px 28px", borderRadius:8, fontSize:15, fontWeight:600, textDecoration:"none", boxShadow:"0 0 24px var(--accent-glow)" }}>
            Start free trial <ArrowRight size={16}/>
          </Link>
          <Link href="/live-catalysts" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"transparent", color:"var(--text-primary)", padding:"12px 28px", borderRadius:8, border:"1px solid var(--border-medium)", fontSize:15, fontWeight:500, textDecoration:"none" }}>
            <span className="live-dot"/> View live feed
          </Link>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:"var(--border)", border:"1px solid var(--border-medium)", borderRadius:10, overflow:"hidden", opacity:m?1:0, transition:"opacity 0.6s 0.4s" }}>
          {STATS.map(s=>(
            <div key={s.label} style={{ background:"var(--bg-card)", padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontSize:"clamp(20px,2.5vw,28px)", fontWeight:700, color:"var(--text-primary)", letterSpacing:"-0.02em", marginBottom:4 }}>
                {m ? <Counter target={s.value} suffix={s.suffix} prefix={(s as any).prefix}/> : "0"}
              </div>
              <div style={{ fontSize:11, color:"var(--text-muted)", letterSpacing:"0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:4, color:"var(--text-muted)", fontSize:11, opacity:m?1:0, transition:"opacity 0.6s 0.8s" }}>
        <span>SCROLL</span><ChevronDown size={14}/>
      </div>
    </section>
  );
}
