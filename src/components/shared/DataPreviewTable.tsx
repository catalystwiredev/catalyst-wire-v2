"use client";
import Link from "next/link";
import { Lock, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useState } from "react";

export interface Col { key:string; label:string; width?:string; }
export interface DataRow { id:string; cells:Record<string,React.ReactNode>; expanded?:React.ReactNode; }

function Row({ row, cols }: { row:DataRow; cols:Col[] }) {
  const [open,setOpen]=useState(false);
  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:`${cols.map(c=>c.width??"1fr").join(" ")} 36px`, padding:"11px 16px", borderBottom:"1px solid var(--border)", cursor:row.expanded?"pointer":"default", transition:"background 0.12s", alignItems:"center", fontSize:13 }}
        onClick={()=>row.expanded&&setOpen(o=>!o)}
        onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="var(--bg-elevated)"}
        onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background="transparent"}
      >
        {cols.map(c=><div key={c.key} style={{ color:"var(--text-primary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.cells[c.key]}</div>)}
        {row.expanded ? (open?<ChevronUp size={14} style={{color:"var(--text-muted)"}}/>:<ChevronDown size={14} style={{color:"var(--text-muted)"}}/>):<div/>}
      </div>
      {open&&row.expanded&&(
        <div style={{ padding:"12px 16px 14px 24px", borderBottom:"1px solid var(--border)", background:"var(--bg-overlay)", fontSize:12, color:"var(--text-secondary)", lineHeight:1.7 }}>
          {row.expanded}
        </div>
      )}
    </>
  );
}

export function DataPreviewTable({ title, subtitle, cols, visible, locked, plan="alpha" }: {
  title:string; subtitle:string; cols:Col[]; visible:DataRow[]; locked:DataRow[]; plan?:string;
}) {
  return (
    <div style={{ background:"var(--bg-card)", border:"1px solid var(--border-medium)", borderRadius:14, overflow:"hidden" }}>
      <div style={{ padding:"14px 16px", background:"var(--bg-surface)", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span className="live-dot"/>
            <span style={{ fontSize:15, fontWeight:600, color:"var(--text-primary)" }}>{title}</span>
          </div>
          <div style={{ fontSize:12, color:"var(--text-secondary)", marginTop:2 }}>{subtitle}</div>
        </div>
        <Link href={`/register?plan=${plan}`} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--accent)", color:"#fff", padding:"6px 14px", borderRadius:7, fontSize:12, fontWeight:600, textDecoration:"none" }}>
          Unlock all data <ArrowRight size={12}/>
        </Link>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:`${cols.map(c=>c.width??"1fr").join(" ")} 36px`, padding:"8px 16px", borderBottom:"1px solid var(--border)", background:"var(--bg-surface)" }}>
        {cols.map(c=><div key={c.key} style={{ fontSize:10, fontWeight:700, letterSpacing:"0.10em", color:"var(--text-muted)", textTransform:"uppercase" }}>{c.label}</div>)}
        <div/>
      </div>
      {visible.map(r=><Row key={r.id} row={r} cols={cols}/>)}
      {locked.length>0&&(
        <div style={{ position:"relative" }}>
          {locked.map((_,i)=>(
            <div key={i} className="blur-locked" style={{ display:"grid", gridTemplateColumns:`${cols.map(c=>c.width??"1fr").join(" ")} 36px`, padding:"11px 16px", borderBottom:"1px solid var(--border)", fontSize:13, color:"var(--text-muted)" }}>
              {cols.map(c=><div key={c.key}>{"███████".slice(0,5+i%3)}</div>)}<div/>
            </div>
          ))}
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, background:"linear-gradient(to bottom,rgba(8,12,20,0) 0%,rgba(8,12,20,0.9) 40%)" }}>
            <div style={{ background:"var(--bg-card)", border:"1px solid var(--border-medium)", borderRadius:12, padding:"16px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, maxWidth:340, textAlign:"center" }}>
              <Lock size={20} style={{ color:"var(--text-muted)" }}/>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)" }}>{locked.length} more rows locked</div>
              <div style={{ fontSize:12, color:"var(--text-secondary)" }}>Upgrade to access real-time data, full history, and AI scores.</div>
              <Link href={`/register?plan=${plan}`} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--accent)", color:"#fff", padding:"8px 20px", borderRadius:8, fontSize:13, fontWeight:600, textDecoration:"none", marginTop:4 }}>
                Start 7-day free trial <ArrowRight size={13}/>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
