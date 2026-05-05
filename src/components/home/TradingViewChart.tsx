"use client";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Bitcoin, BarChart2, Globe } from "lucide-react";

const TABS = [
  { id:"indexes",     label:"US Indexes", icon:TrendingUp, symbol:"FOREXCOM:SPXUSD" },
  { id:"crypto",      label:"Crypto",     icon:Bitcoin,    symbol:"COINBASE:BTCUSD" },
  { id:"commodities", label:"Commodities",icon:BarChart2,  symbol:"TVC:GOLD" },
  { id:"macro",       label:"Economic",   icon:Globe,      symbol:"FRED:DFF" },
] as const;

function ChartWidget({ symbol }: { symbol:string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!ref.current) return;
    ref.current.innerHTML="";
    const s=document.createElement("script");
    s.src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    s.async=true;
    s.innerHTML=JSON.stringify({ autosize:true, symbol, interval:"D", timezone:"America/New_York", theme:"dark", style:"1", locale:"en", withdateranges:true, hide_side_toolbar:false, allow_symbol_change:true, save_image:false, backgroundColor:"rgba(8,12,20,1)", gridColor:"rgba(255,255,255,0.04)" });
    ref.current.appendChild(s);
  },[symbol]);
  return <div ref={ref} className="tradingview-widget-container" style={{ height:"100%", width:"100%" }}><div className="tradingview-widget-container__widget" style={{ height:"100%", width:"100%" }}/></div>;
}

export function TradingViewChart() {
  const [active, setActive] = useState<string>("indexes");
  const tab = TABS.find(t=>t.id===active)!;
  return (
    <section style={{ padding:"0 24px 80px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", color:"var(--accent)", textTransform:"uppercase", marginBottom:8 }}>Live Markets</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:700, letterSpacing:"-0.02em" }}>All markets, one platform</h2>
        </div>
        <div style={{ background:"var(--bg-card)", border:"1px solid var(--border-medium)", borderRadius:14, overflow:"hidden" }}>
          <div style={{ display:"flex", borderBottom:"1px solid var(--border)", padding:"0 16px", background:"var(--bg-surface)" }}>
            {TABS.map(t=>{
              const Icon=t.icon; const on=t.id===active;
              return (
                <button key={t.id} onClick={()=>setActive(t.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"12px 16px", background:"transparent", border:"none", borderBottom: on?"2px solid var(--accent)":"2px solid transparent", color: on?"var(--text-primary)":"var(--text-secondary)", fontSize:13, fontWeight: on?600:400, cursor:"pointer", marginBottom:-1 }}>
                  <Icon size={14} style={{ color: on?"var(--accent)":"currentColor" }}/>{t.label}
                </button>
              );
            })}
          </div>
          <div style={{ height:500 }}><ChartWidget symbol={tab.symbol}/></div>
        </div>
        <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:10, textAlign:"center" }}>Charts powered by TradingView. For informational purposes only. Not financial advice.</p>
      </div>
    </section>
  );
}
