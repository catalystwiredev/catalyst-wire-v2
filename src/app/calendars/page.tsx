import Link from "next/link";
import { Calendar, FlaskConical, BarChart2, Rocket, ArrowRight } from "lucide-react";
import { EarningsTable } from "@/components/tables/EarningsTable";
import { FDAApplicationsTable } from "@/components/tables/FDATable";
import { SecFilingsTable } from "@/components/tables/SecFilingsTable";

export const revalidate = 3600;

async function getCalendarData() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/calendars`, { next: { revalidate: 3600 } });
    if (!res.ok) return { earnings: [], fdaApps: [], ipoFilings: [] };
    return await res.json();
  } catch { return { earnings: [], fdaApps: [], ipoFilings: [] }; }
}

function SectionHeader({ icon: Icon, title, count, color = "var(--accent)" }: { icon: any; title: string; count?: number; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 32, height: 32, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={16} style={{ color }} />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
      {count != null && <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{count} items</span>}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}>
      {label}
    </div>
  );
}

export default async function CalendarsPage() {
  const { earnings, fdaApps, ipoFilings } = await getCalendarData();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Event Intelligence</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>FDA · Earnings · IPO Calendars</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Upcoming high-impact market events sourced live from Finnhub, OpenFDA, and SEC EDGAR.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

        <section>
          <SectionHeader icon={BarChart2} title="Earnings Calendar" count={earnings?.length} color="var(--bull)" />
          {!earnings?.length
            ? <EmptyState label="No upcoming earnings data available right now." />
            : <EarningsTable earnings={earnings.slice(0, 30)} />
          }
        </section>

        <section>
          <SectionHeader icon={FlaskConical} title="FDA Drug Applications (NDA/BLA)" count={fdaApps?.length} color="#f472b6" />
          {!fdaApps?.length
            ? <EmptyState label="No FDA application data available right now." />
            : <FDAApplicationsTable applications={fdaApps} />
          }
        </section>

        <section>
          <SectionHeader icon={Rocket} title="IPO Filings (S-1 Registrations)" count={ipoFilings?.length} color="var(--accent)" />
          {!ipoFilings?.length
            ? <EmptyState label="No recent S-1 filings found." />
            : <SecFilingsTable filings={ipoFilings} />
          }
        </section>

      </div>

      <div style={{ marginTop: 36, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>Unlock full calendar access with an Alpha plan — including AI conviction scores on every event.</p>
        <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <Calendar size={13}/> View plans <ArrowRight size={13}/>
        </Link>
      </div>
    </div>
  );
}
