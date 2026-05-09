import { Calendar, ArrowRight } from "lucide-react";
import { CalendarsLive } from "./CalendarsLive";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import Link from "next/link";

export const revalidate = 300;

async function getCalendarData() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/calendars`, { next: { revalidate: 3600 } });
    if (!res.ok) return { earnings: [], fdaApps: [], ipoFilings: [] };
    return await res.json();
  } catch { return { earnings: [], fdaApps: [], ipoFilings: [] }; }
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

      <ScrollReveal delay={100}>
        <CalendarsLive initial={{ earnings: earnings ?? [], fdaApps: fdaApps ?? [], ipoFilings: ipoFilings ?? [] }} />
      </ScrollReveal>

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
