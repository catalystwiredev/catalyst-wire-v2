import { FlaskConical } from "lucide-react";
import { FDAApplicationsTable, FDARecallsTable } from "@/components/tables/FDATable";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";

export const revalidate = 3600;

async function getFDAData() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/fda`, { next: { revalidate: 3600 } });
    if (!res.ok) return { applications: [], recalls: [] };
    return await res.json();
  } catch { return { applications: [], recalls: [] }; }
}

export default async function FDADecisionsPage() {
  const [session, { applications, recalls }] = await Promise.all([auth(), getFDAData()]);
  const isPremium = (session?.user as any)?.plan !== "free";

  const approved = applications.filter((a: {status?:string}) => (a.status ?? "").toLowerCase().includes("approved")).length;

  return (
    <div style={{ padding:"32px 24px", maxWidth:1200, margin:"0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="OpenFDA · Biotech Intelligence"
          labelColor="#f472b6"
          icon={FlaskConical}
          iconColor="#f472b6"
          iconGlow="rgba(244,114,182,0.35)"
          title="FDA Decisions"
          description="Live NDA, BLA, and drug application data from the FDA — approvals, complete response letters, PDUFA dates, and active recall alerts."
          stats={[
            { label:"Applications",  value: applications.length, color:"#f472b6" },
            { label:"Approved",      value: approved,            color:"#00e676" },
            { label:"Active Recalls",value: recalls.length,      color:"#ff4d4d" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock PDUFA calendar"
        />
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <div style={{ marginBottom: 32 }}>
          {applications.length === 0 ? (
            <div style={{ textAlign:"center", padding:60, color:"var(--text-secondary)", background:"rgba(8,14,26,0.65)", backdropFilter:"blur(18px)", border:"1px solid rgba(244,114,182,0.12)", borderRadius:18 }}>
              <div style={{ width:64, height:64, background:"rgba(244,114,182,0.08)", border:"1px solid rgba(244,114,182,0.2)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <FlaskConical size={28} style={{ color:"#f472b6", opacity:0.7 }}/>
              </div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>No applications at this time</div>
              <div style={{ fontSize:13, opacity:0.6 }}>FDA application data refreshes hourly from OpenFDA.</div>
            </div>
          ) : (
            <FDAApplicationsTable applications={applications} />
          )}
        </div>
      </ScrollReveal>

      {recalls.length > 0 && (
        <ScrollReveal delay={240}>
          <FDARecallsTable recalls={recalls} />
        </ScrollReveal>
      )}
    </div>
  );
}
