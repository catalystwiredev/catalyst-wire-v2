import { Calendar, FlaskConical, BarChart2, Rocket, ArrowRight } from "lucide-react";
import { EarningsTable } from "@/components/tables/EarningsTable";
import { FDAApplicationsTable } from "@/components/tables/FDATable";
import { SecFilingsTable } from "@/components/tables/SecFilingsTable";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import Link from "next/link";

export const revalidate = 3600;

async function getCalendarData() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/calendars`, { next: { revalidate: 3600 } });
    if (!res.ok) return { earnings: [], fdaApps: [], ipoFilings: [] };
    return await res.json();
  } catch { return { earnings: [], fdaApps: [], ipoFilings: [] }; }
}

function SectionHeader({ icon: Icon, title, count, color = "var(--accent)" }: { icon: React.ElementType; title: string; count?: number; color?: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
      <div style={{ width:38, height:38, background:`${color}12`, border:`1px solid ${color}28`, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 16px ${color}25` }}>
        <Icon size={18} style={{ color, filter:`drop-shadow(0 0 4px ${color})` }}/>
      </div>
      <h2 style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.015em", margin:0 }}>{title}</h2>
      {count != null && (
        <span style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"monospace", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:6, padding:"2px 9px", fontWeight:600 }}>
          {count} items
        </span>
      )}
    </div>
  );
}

function EmptyState({ label, icon: Icon, color }: { label: string; icon: React.ElementType; color: string }) {
  return (
    <div style={{ padding:"40px 24px", textAlign:"center", color:"var(--text-muted)", background:"rgba(8,14,26,0.65)", backdropFilter:"blur(12px)", border:`1px solid ${color}12`, borderRadius:16, fontSize:13 }}>
      <div style={{ width:48, height:48, background:`${color}08`, border:`1px solid ${color}18`, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
        <Icon size={22} style={{ color, opacity:0.6 }}/>
      </div>
      {label}
    </div>
  );
}

export default async function CalendarsPage() {
  const [session, { earnings, fdaApps, ipoFilings }] = await Promise.all([auth(), getCalendarData()]);
  const isPremium = (session?.user as any)?.plan !== "free";

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px 72px" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Event Intelligence · Live"
          labelColor="#60a5fa"
          icon={Calendar}
          iconColor="#60a5fa"
          iconGlow="rgba(96,165,250,0.35)"
          title="FDA · Earnings · IPO Calendars"
          description="Upcoming high-impact market events — earnings reports, FDA drug application decisions, and IPO S-1 registrations sourced live from Finnhub, OpenFDA, and SEC EDGAR."
          stats={[
            { label:"Earnings Reports",  value: earnings?.length  ?? 0, color:"#00e676" },
            { label:"FDA Applications",  value: fdaApps?.length   ?? 0, color:"#f472b6" },
            { label:"IPO Filings (S-1)", value: ipoFilings?.length ?? 0, color:"#60a5fa" },
          ]}
          isPremium={isPremium}
          upgradeHref="/pricing"
          upgradeLabel="View plans"
        />
      </ScrollReveal>

      <div style={{ display:"flex", flexDirection:"column", gap:36 }}>
        <ScrollReveal delay={100}>
          <section>
            <SectionHeader icon={BarChart2} title="Earnings Calendar" count={earnings?.length} color="#00e676"/>
            {!earnings?.length
              ? <EmptyState label="No upcoming earnings data available right now." icon={BarChart2} color="#00e676"/>
              : <EarningsTable earnings={earnings.slice(0, 30)}/>
            }
          </section>
        </ScrollReveal>

        <ScrollReveal delay={180}>
          <section>
            <SectionHeader icon={FlaskConical} title="FDA Drug Applications (NDA/BLA)" count={fdaApps?.length} color="#f472b6"/>
            {!fdaApps?.length
              ? <EmptyState label="No FDA application data available right now." icon={FlaskConical} color="#f472b6"/>
              : <FDAApplicationsTable applications={fdaApps}/>
            }
          </section>
        </ScrollReveal>

        <ScrollReveal delay={260}>
          <section>
            <SectionHeader icon={Rocket} title="IPO Filings (S-1 Registrations)" count={ipoFilings?.length} color="#60a5fa"/>
            {!ipoFilings?.length
              ? <EmptyState label="No recent S-1 filings found." icon={Rocket} color="#60a5fa"/>
              : <SecFilingsTable filings={ipoFilings}/>
            }
          </section>
        </ScrollReveal>
      </div>

      {!isPremium && (
        <ScrollReveal delay={320}>
          <div style={{ marginTop:40, textAlign:"center" }}>
            <p style={{ fontSize:13, color:"var(--text-secondary)", marginBottom:16 }}>
              Unlock full calendar access with an Alpha plan — including AI conviction scores on every event.
            </p>
            <Link href="/pricing" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg, #0099ff, #0066cc)", color:"#fff", padding:"12px 24px", borderRadius:10, fontSize:13, fontWeight:700, textDecoration:"none", boxShadow:"0 0 24px rgba(0,153,255,0.3)" }}>
              <Calendar size={13}/> View plans <ArrowRight size={13}/>
            </Link>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
