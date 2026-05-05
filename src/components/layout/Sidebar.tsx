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
    { href:"/research",  label:"Research Hub",  icon:GraduationCap, badge:"UTPB" },
  ]},
];

export function Sidebar({ open, onToggle, onSearchOpen }: { open:boolean; onToggle:()=>void; onSearchOpen?:()=>void }) {
  const path = usePathname();
  return (
    <aside style={{
      position:"fixed", top:"var(--tape-h)", left:0, bottom:0,
      width: open ? "var(--sidebar-open)" : "var(--sidebar-w)",
      background:"var(--bg-surface)", borderRight:"1px solid var(--border)",
      display:"flex", flexDirection:"column",
      transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)",
      overflow:"hidden", zIndex:40,
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:"1px solid var(--border)", minHeight:56, flexShrink:0 }}>
        <button onClick={onToggle} style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", background:"transparent", border:"1px solid var(--border-medium)", borderRadius:8, cursor:"pointer", color:"var(--text-secondary)", flexShrink:0 }}>
          {open ? <X size={16}/> : <Menu size={16}/>}
        </button>
        {open && (
          <div style={{ opacity:1, whiteSpace:"nowrap" }}>
            <div style={{ fontFamily:"monospace", fontWeight:700, fontSize:15, color:"var(--text-primary)", letterSpacing:"-0.02em" }}>
              catalyst<span style={{ color:"var(--accent)" }}>wire</span>
            </div>
            <div style={{ fontSize:10, color:"var(--text-muted)", letterSpacing:"0.08em", marginTop:1 }}>INTELLIGENCE PLATFORM</div>
          </div>
        )}
      </div>

      {/* Search */}
      {open && (
        <div style={{ padding:"10px 12px", borderBottom:"1px solid var(--border)", flexShrink:0 }}>
          <button onClick={onSearchOpen} style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg-elevated)", border:"1px solid var(--border-medium)", borderRadius:8, padding:"6px 10px", width:"100%", cursor:"pointer", textAlign:"left" }}>
            <Search size={13} style={{ color:"var(--text-muted)", flexShrink:0 }}/>
            <span style={{ background:"transparent", color:"var(--text-muted)", fontSize:12, flex:1 }}>Search tickers, filings…</span>
            <kbd style={{ fontSize:10, color:"var(--text-muted)", background:"var(--bg-base)", border:"1px solid var(--border)", borderRadius:4, padding:"1px 5px", fontFamily:"monospace" }}>⌘K</kbd>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"8px 0" }}>
        {NAV.map(section => (
          <div key={section.label}>
            {open && <div style={{ padding:"12px 16px 4px", fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)" }}>{section.label}</div>}
            {!open && <div style={{ height:16 }}/>}
            {section.items.map((item: any) => {
              const Icon = item.icon;
              const active = path === item.href;
              return (
                <Link key={item.href} href={item.href} title={!open ? item.label : undefined} style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"8px 16px", margin:"1px 8px", borderRadius:8,
                  textDecoration:"none",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  background: active ? "var(--bg-elevated)" : "transparent",
                  borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                  minHeight:36, whiteSpace:"nowrap", overflow:"hidden",
                  transition:"background 0.15s, color 0.15s",
                }}>
                  <Icon size={17} style={{ flexShrink:0, color: active ? "var(--accent)" : "currentColor" }}/>
                  {open && <>
                    <span style={{ fontSize:13, fontWeight: active ? 500 : 400, flex:1 }}>{item.label}</span>
                    {item.live  && <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20, background:"var(--bull-dim)", color:"var(--bull)", border:"1px solid var(--bull-border)" }}>LIVE</span>}
                    {item.soon  && <span style={{ fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:20, background:"rgba(124,148,175,0.12)", color:"var(--text-muted)" }}>SOON</span>}
                    {item.badge && <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20, background:"var(--accent-dim)", color:"var(--accent)", border:"1px solid var(--accent-glow)" }}>{item.badge}</span>}
                    {!active && !item.soon && !item.badge && <ChevronRight size={12} style={{ color:"var(--text-muted)", opacity:0.5 }}/>}
                  </>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Upgrade CTA */}
      {open && (
        <div style={{ margin:"0 8px 8px", padding:12, background:"linear-gradient(135deg, rgba(0,153,255,0.10), rgba(0,230,118,0.06))", border:"1px solid rgba(0,153,255,0.20)", borderRadius:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <Star size={13} style={{ color:"var(--gold)" }}/>
            <span style={{ fontSize:12, fontWeight:600, color:"var(--text-primary)" }}>Upgrade to Alpha</span>
          </div>
          <p style={{ fontSize:11, color:"var(--text-secondary)", marginBottom:8, lineHeight:1.5 }}>Real-time signals, all scanners, congressional data.</p>
          <Link href="/pricing" style={{ display:"block", textAlign:"center", background:"var(--accent)", color:"#fff", borderRadius:6, padding:"5px 0", fontSize:11, fontWeight:600, textDecoration:"none" }}>
            Start free trial →
          </Link>
        </div>
      )}

      {/* Bottom */}
      <div style={{ borderTop:"1px solid var(--border)", padding:"8px 0 10px", flexShrink:0 }}>
        {[
          { href:"/login",  label:"Login / Sign Up", icon:LogIn,  accent:false },
          { href:"/donate", label:"Donate",           icon:Heart,  accent:true  },
        ].map((item: any) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} title={!open ? item.label : undefined} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"8px 16px", margin:"1px 8px", borderRadius:8,
              textDecoration:"none", minHeight:36, whiteSpace:"nowrap",
              color: item.accent ? "rgba(255,61,87,0.85)" : "var(--text-secondary)",
            }}>
              <Icon size={17} style={{ flexShrink:0 }}/>
              {open && <span style={{ fontSize:13 }}>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
