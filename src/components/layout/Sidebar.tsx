"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, FileText, BarChart2, UserCheck, Landmark, FlaskConical, Newspaper, ScanLine, Calendar, TrendingUp, LogIn, Heart, Search, Menu, X, ChevronRight, Star, GraduationCap, Calculator, BookOpen, Bookmark } from "lucide-react";

const NAV = [
  { label:"Platform", items:[
    { href:"/",          label:"Home",      icon:Home },
    { href:"/watchlist", label:"Watchlist", icon:Bookmark },
  ]},
  { label:"Market Data", items:[
    { href:"/live-catalysts",       label:"Live Catalysts",      icon:Zap,          live:true },
    { href:"/sec-filings",          label:"SEC Filings",         icon:FileText },
    { href:"/earnings",             label:"Earnings",            icon:BarChart2 },
    { href:"/insider-trades",       label:"Insider Trades",      icon:UserCheck },
    { href:"/congressional-trades", label:"Congressional Trades",icon:Landmark },
    { href:"/fda-decisions",        label:"FDA Decisions",       icon:FlaskConical },
  ]},
  { label:"Intelligence", items:[
    { href:"/news",      label:"News Feed",     icon:Newspaper },
    { href:"/scanners",  label:"Scanners",      icon:ScanLine },
    { href:"/calendars", label:"Calendars",     icon:Calendar },
    { href:"/themes",    label:"Themes",        icon:TrendingUp },
  ]},
  { label:"Tools", items:[
    { href:"/calculators", label:"Calculators", icon:Calculator },
    { href:"/glossary",    label:"Glossary",    icon:BookOpen },
  ]},
  { label:"Research", items:[
    { href:"/research",  label:"Research Hub",  icon:GraduationCap },
  ]},
];

export function Sidebar({ open, onToggle, onSearchOpen }: { open:boolean; onToggle:()=>void; onSearchOpen?:()=>void }) {
  const path = usePathname();

  return (
    <aside style={{
      position:"fixed", top:"var(--tape-h)", left:0, bottom:0,
      width: open ? "var(--sidebar-open)" : "var(--sidebar-w)",
      background:"rgba(4,8,18,0.82)",
      backdropFilter:"blur(24px)",
      WebkitBackdropFilter:"blur(24px)",
      borderRight:"1px solid rgba(255,255,255,0.06)",
      boxShadow:"4px 0 32px rgba(0,0,0,0.5)",
      display:"flex", flexDirection:"column",
      transition:"width 0.28s cubic-bezier(0.4,0,0.2,1)",
      overflow:"hidden", zIndex:40,
    }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)", minHeight:56, flexShrink:0 }}>
        <button
          onClick={onToggle}
          style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, cursor:"pointer", color:"var(--text-secondary)", flexShrink:0, transition:"background 0.15s, border-color 0.15s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="rgba(0,153,255,0.1)"; (e.currentTarget as HTMLElement).style.borderColor="rgba(0,153,255,0.3)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.08)"; }}
        >
          {open ? <X size={15}/> : <Menu size={15}/>}
        </button>
        {open && (
          <div style={{ opacity:1, whiteSpace:"nowrap" }}>
            <div style={{ fontFamily:"monospace", fontWeight:800, fontSize:16, letterSpacing:"-0.03em" }}>
              <span style={{ color:"var(--text-primary)" }}>catalyst</span>
              <span style={{ background:"linear-gradient(135deg, #0099ff, #00e676)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>wire</span>
            </div>
            <div style={{ fontSize:9, color:"var(--text-muted)", letterSpacing:"0.14em", marginTop:1, textTransform:"uppercase" }}>Intelligence Platform</div>
          </div>
        )}
      </div>

      {/* Search */}
      {open && (
        <div style={{ padding:"10px 10px", borderBottom:"1px solid rgba(255,255,255,0.04)", flexShrink:0 }}>
          <button
            onClick={onSearchOpen}
            style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"7px 10px", width:"100%", cursor:"pointer", textAlign:"left", transition:"border-color 0.15s, background 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="rgba(0,153,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor="rgba(0,153,255,0.2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.07)"; }}
          >
            <Search size={13} style={{ color:"var(--text-muted)", flexShrink:0 }}/>
            <span style={{ color:"var(--text-muted)", fontSize:12, flex:1 }}>Search tickers, filings…</span>
            <kbd style={{ fontSize:10, color:"var(--text-muted)", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:4, padding:"1px 5px", fontFamily:"monospace" }}>⌘K</kbd>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"6px 0" }}>
        {NAV.map(section => (
          <div key={section.label}>
            {open && <div style={{ padding:"12px 16px 3px", fontSize:9, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-muted)", opacity:0.6 }}>{section.label}</div>}
            {!open && <div style={{ height:12 }}/>}
            {section.items.map((item: any) => {
              const Icon = item.icon;
              const active = path === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!open ? item.label : undefined}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"8px 14px", margin:"1px 7px", borderRadius:9,
                    textDecoration:"none",
                    color: active ? "#fff" : "var(--text-secondary)",
                    background: active ? "rgba(0,153,255,0.12)" : "transparent",
                    boxShadow: active ? "0 0 0 1px rgba(0,153,255,0.2), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
                    minHeight:36, whiteSpace:"nowrap", overflow:"hidden",
                    transition:"background 0.15s, color 0.15s, box-shadow 0.15s",
                    position:"relative",
                  }}
                  onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.background="rgba(255,255,255,0.04)"; el.style.color="var(--text-primary)"; }}}
                  onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.background="transparent"; el.style.color="var(--text-secondary)"; }}}
                >
                  {active && (
                    <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:18, background:"linear-gradient(180deg, #0099ff, #00e676)", borderRadius:"0 2px 2px 0", boxShadow:"0 0 8px rgba(0,153,255,0.6)" }}/>
                  )}
                  <Icon size={16} style={{ flexShrink:0, color: active ? "var(--accent)" : "currentColor", filter: active ? "drop-shadow(0 0 4px rgba(0,153,255,0.5))" : "none", marginLeft: active ? 4 : 0 }}/>
                  {open && <>
                    <span style={{ fontSize:13, fontWeight: active ? 600 : 400, flex:1 }}>{item.label}</span>
                    {item.live  && <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20, background:"rgba(0,230,118,0.1)", color:"var(--bull)", border:"1px solid rgba(0,230,118,0.25)", boxShadow:"0 0 6px rgba(0,230,118,0.2)" }}>LIVE</span>}
                    {item.soon  && <span style={{ fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:20, background:"rgba(124,148,175,0.08)", color:"var(--text-muted)" }}>SOON</span>}
                    {item.badge && <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20, background:"var(--accent-dim)", color:"var(--accent)", border:"1px solid var(--accent-glow)" }}>{item.badge}</span>}
                    {!active && !item.soon && !item.badge && <ChevronRight size={11} style={{ color:"var(--text-muted)", opacity:0.3 }}/>}
                  </>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Upgrade CTA */}
      {open && (
        <div style={{ margin:"0 8px 8px", padding:"14px 14px", background:"linear-gradient(135deg, rgba(0,153,255,0.08) 0%, rgba(0,230,118,0.05) 100%)", border:"1px solid rgba(0,153,255,0.15)", borderRadius:12, position:"relative", overflow:"hidden", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.05)" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, background:"radial-gradient(circle, rgba(0,153,255,0.15), transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
            <Star size={13} style={{ color:"var(--gold)", filter:"drop-shadow(0 0 4px rgba(255,215,0,0.5))" }}/>
            <span style={{ fontSize:12, fontWeight:700, color:"var(--text-primary)" }}>Upgrade to Alpha</span>
          </div>
          <p style={{ fontSize:11, color:"var(--text-secondary)", marginBottom:10, lineHeight:1.6 }}>Real-time signals, all scanners, congressional data.</p>
          <Link
            href="/pricing"
            style={{ display:"block", textAlign:"center", background:"linear-gradient(135deg, #0099ff, #0066cc)", color:"#fff", borderRadius:7, padding:"6px 0", fontSize:12, fontWeight:700, textDecoration:"none", boxShadow:"0 0 16px rgba(0,153,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)", letterSpacing:"0.02em" }}
          >
            Start free trial →
          </Link>
        </div>
      )}

      {/* Bottom links */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"7px 0 10px", flexShrink:0 }}>
        {[
          { href:"/login",  label:"Login / Sign Up", icon:LogIn,  accent:false },
          { href:"/donate", label:"Donate",           icon:Heart,  accent:true  },
        ].map((item: any) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={!open ? item.label : undefined}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 14px", margin:"1px 7px", borderRadius:9, textDecoration:"none", minHeight:36, whiteSpace:"nowrap", color: item.accent ? "rgba(255,61,87,0.8)" : "var(--text-secondary)", transition:"background 0.15s, color 0.15s" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background="rgba(255,255,255,0.04)"; el.style.color = item.accent ? "#ff3d57" : "var(--text-primary)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background="transparent"; el.style.color = item.accent ? "rgba(255,61,87,0.8)" : "var(--text-secondary)"; }}
            >
              <Icon size={16} style={{ flexShrink:0 }}/>
              {open && <span style={{ fontSize:13 }}>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
