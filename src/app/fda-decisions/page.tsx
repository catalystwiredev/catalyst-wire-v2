import { FlaskConical } from "lucide-react";
import { FDALive } from "./FDALive";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";

export const revalidate = 300;

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
        <FDALive initial={{ applications, recalls }} />
      </ScrollReveal>
    </div>
  );
}
