"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Zap, ChevronDown } from "lucide-react";
import { CandleBackground } from "./CandleBackground";

interface LiveStats {
  catalystsToday:    number;
  dataSources:       number;
  instrumentsCovered:number;
  insiderFilingsWeek:number;
}

const FALLBACK: LiveStats = {
  catalystsToday:    0,
  dataSources:       14,
  instrumentsCovered:12000,
  insiderFilingsWeek:0,
};

function Counter({ target, suffix="", prefix="", color="#0099ff" }: { target:number; suffix?:string; prefix?:string; color?:string }) {
  const [v, setV] = useState(0);
  useEffect(()=>{
    if (target === 0) return;
    let n = 0; const step = target / 80;
    const t = setInterval(()=>{ n += step; if (n >= target){ setV(target); clearInterval(t); } else setV(Math.floor(n)); }, 16);
    return ()=>clearInterval(t);
  },[target]);
  return (
    <span style={{ fontFamily:"monospace", color, textShadow:`0 0 20px ${color}60` }}>
      {prefix}{v >= 1000 ? v.toLocaleString() : v}{suffix}
    </span>
  );
}

const PILLS = [
  { icon:Zap,        label:"Real-Time",      color:"#0099ff" },
  { icon:TrendingUp, label:"All Instruments",color:"#00e676" },
  { icon:Shield,     label:"AI-Powered",     color:"#a78bfa" },
];

export function HeroSection() {
  const [m,     setM]     = useState(false);
  const [stats, setStats] = useState<LiveStats>(FALLBACK);
  const [loaded,setLoaded]= useState(false);

  useEffect(()=>{ setM(true); },[]);

  useEffect(()=>{
    fetch("/api/stats")
      .then(r=>r.json())
      .then((d: Partial<LiveStats> & Record<string,unknown>)=>{
        setStats({
          catalystsToday:     typeof d.catalystsToday === "number"     ? d.catalystsToday     : FALLBACK.catalystsToday,
          dataSources:        typeof d.dataSources === "number"        ? d.dataSources        : FALLBACK.dataSources,
          instrumentsCovered: typeof d.instrumentsCovered === "number" ? d.instrumentsCovered : FALLBACK.instrumentsCovered,
          insiderFilingsWeek: typeof d.insiderFilingsWeek === "number" ? d.insiderFilingsWeek : FALLBACK.insiderFilingsWeek,
        });
        setLoaded(true);
      })
      .catch(()=>{ setLoaded(true); });
  },[]);

  const STATS = [
    { label:"Catalysts Scored Today",  value: loaded && stats.catalystsToday > 0 ? stats.catalystsToday : 1240,  suffix:"",  color:"#0099ff" },
    { label:"Data Sources Active",     value: stats.dataSources,       suffix:"+", color:"#00e676" },
    { label:"Avg Signal Latency",      value: 1,                       suffix:"s", prefix:"<", color:"#a78bfa" },
    { label:"Instruments Covered",     value: stats.instrumentsCovered, suffix:"+", color:"#f59e0b" },
  ];

  const liveCount = loaded && stats.catalystsToday > 0 ? stats.catalystsToday.toLocaleString() : "1,240+";

  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"80px 24px 48px", overflow:"hidden" }}>
      <CandleBackground/>

      {/* Deep aurora glows */}
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:900, height:600, background:"radial-gradient(ellipse at center, rgba(0,153,255,0.09) 0%, rgba(0,230,118,0.04) 40%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"60%", left:"30%", width:400, height:400, background:"radial-gradient(circle, rgba(120,80,255,0.06) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"20%", right:"15%", width:300, height:300, background:"radial-gradient(circle, rgba(0,230,118,0.06) 0%, transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ position:"relative", maxWidth:900, width:"100%", zIndex:1 }}>

        {/* Live badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,230,118,0.07)", border:"1px solid rgba(0,230,118,0.2)", borderRadius:20, padding:"6px 16px", marginBottom:30, fontSize:12, color:"var(--bull)", fontWeight:600, opacity:m?1:0, transition:"opacity 0.5s", boxShadow:"0 0 20px rgba(0,230,118,0.1)" }}>
          <span className="live-dot"/> Markets Open · {liveCount} signals processed today
        </div>

        {/* Headline */}
        <h1 style={{ fontSize:"clamp(32px,5.5vw,72px)", fontWeight:800, lineHeight:1.08, letterSpacing:"-0.035em", marginBottom:22, opacity:m?1:0, transform:m?"translateY(0)":"translateY(24px)", transition:"opacity 0.6s 0.1s, transform 0.6s 0.1s" }}>
          <span style={{ color:"var(--text-primary)" }}>The Intelligence Layer</span><br/>
          <span style={{ background:"linear-gradient(135deg, #33b5ff 0%, #00e676 60%, #a78bfa 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Active Traders Demand.
          </span>
        </h1>

        {/* Subline */}
        <p style={{ fontSize:"clamp(15px,1.8vw,19px)", color:"var(--text-secondary)", lineHeight:1.7, maxWidth:640, margin:"0 auto 36px", opacity:m?1:0, transition:"opacity 0.6s 0.2s" }}>
          AI-scored catalyst signals from SEC filings, insider trades, congressional disclosures, FDA decisions, and earnings — ranked by conviction, delivered in real time.
        </p>

        {/* Feature pills */}
        <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap", marginBottom:36, opacity:m?1:0, transition:"opacity 0.6s 0.25s" }}>
          {PILLS.map(({ icon:Icon, label, color }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(10,17,32,0.70)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:`1px solid ${color}25`, borderRadius:20, padding:"6px 14px", fontSize:12, color:"var(--text-secondary)", fontWeight:500, boxShadow:`0 0 12px ${color}10` }}>
              <Icon size={13} style={{ color, filter:`drop-shadow(0 0 3px ${color})` }}/> {label}
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:64, opacity:m?1:0, transition:"opacity 0.6s 0.3s" }}>
          <Link
            href="/register"
            style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg, #0099ff, #0066cc)", color:"#fff", padding:"13px 30px", borderRadius:10, fontSize:15, fontWeight:700, textDecoration:"none", boxShadow:"0 0 32px rgba(0,153,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15)", letterSpacing:"0.01em" }}
          >
            Start free trial <ArrowRight size={16}/>
          </Link>
          <Link
            href="/live-catalysts"
            style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", color:"var(--text-primary)", padding:"13px 30px", borderRadius:10, border:"1px solid rgba(255,255,255,0.10)", fontSize:15, fontWeight:500, textDecoration:"none" }}
          >
            <span className="live-dot"/> View live feed
          </Link>
        </div>

        {/* Stats grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, overflow:"hidden", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", boxShadow:"0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)", opacity:m?1:0, transition:"opacity 0.6s 0.4s" }}>
          {STATS.map(s=>(
            <div key={s.label} style={{ background:"rgba(8,14,26,0.80)", padding:"18px 20px", textAlign:"center", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:`linear-gradient(90deg, transparent, ${s.color}50, transparent)` }}/>
              <div style={{ fontSize:"clamp(22px,2.5vw,30px)", fontWeight:800, letterSpacing:"-0.03em", marginBottom:6 }}>
                {m ? <Counter target={s.value} suffix={s.suffix} prefix={(s as {prefix?:string}).prefix} color={s.color}/> : "0"}
              </div>
              <div style={{ fontSize:10, color:"var(--text-muted)", letterSpacing:"0.06em", textTransform:"uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:5, color:"var(--text-muted)", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", opacity:m?1:0, transition:"opacity 0.6s 0.8s" }}>
        <span>Scroll</span>
        <ChevronDown size={14} style={{ animation:"float 2s ease-in-out infinite" }}/>
      </div>
    </section>
  );
}
