import { FileText } from "lucide-react";
import { SecFilingsTable } from "@/components/tables/SecFilingsTable";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";

export const revalidate = 900;

async function getFilings() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/sec-filings`, { next: { revalidate: 900 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.filings ?? [];
  } catch { return []; }
}

export default async function SECFilingsPage() {
  const [session, filings] = await Promise.all([auth(), getFilings()]);
  const isPremium = (session?.user as any)?.plan !== "free";

  const form4Count = filings.filter((f: {formType:string}) => f.formType === "4").length;
  const eightKCount = filings.filter((f: {formType:string}) => f.formType === "8-K").length;

  return (
    <div style={{ padding:"32px 24px", maxWidth:1200, margin:"0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="SEC EDGAR · Live"
          labelColor="#a78bfa"
          icon={FileText}
          iconColor="#a78bfa"
          iconGlow="rgba(167,139,250,0.35)"
          title="SEC Filings"
          description="8-K, Form 4, 10-K, 10-Q — parsed and AI-scored within seconds of EDGAR publication. Full filing history with direct links."
          stats={[
            { label:"Total Filings", value: filings.length, color:"#a78bfa" },
            { label:"Form 4",        value: form4Count,     color:"#00e676" },
            { label:"8-K Events",    value: eightKCount,    color:"#f59e0b" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock AI parsing"
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        {filings.length === 0 ? (
          <div style={{ textAlign:"center", padding:72, color:"var(--text-secondary)", background:"rgba(8,14,26,0.65)", backdropFilter:"blur(18px)", border:"1px solid rgba(167,139,250,0.12)", borderRadius:18 }}>
            <div style={{ width:64, height:64, background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <FileText size={28} style={{ color:"#a78bfa", opacity:0.7 }}/>
            </div>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>No filings found</div>
            <div style={{ fontSize:13, opacity:0.6 }}>EDGAR publishes new filings throughout the trading day. Check back shortly.</div>
          </div>
        ) : (
          <SecFilingsTable filings={filings} />
        )}
      </ScrollReveal>
    </div>
  );
}
