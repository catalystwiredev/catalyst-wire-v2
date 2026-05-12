import { FileText } from "lucide-react";
import { SecFilingsLive } from "./SecFilingsLive";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { tierAtLeast, shouldShowUpgradeCTA } from "@/lib/tier";

export const dynamic = "force-dynamic";

async function getFilings() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/sec-filings`, { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.filings ?? [];
  } catch { return []; }
}

export default async function SECFilingsPage() {
  const [session, filings] = await Promise.all([auth(), getFilings()]);

  const isPremium = tierAtLeast(session, "alpha");

  const form4Count = filings.filter((f: {formType?: string}) => f.formType === "4").length;
  const eightKCount = filings.filter((f: {formType?: string}) => f.formType === "8-K").length;

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
            { label:"Form 4", value: form4Count, color:"#00e676" },
            { label:"8-K Events", value: eightKCount, color:"#f59e0b" },
          ]}
          isPremium={isPremium}
          upgradeHref="/pricing"
          upgradeLabel="Unlock Full Live Filings + AI Scoring"
          shouldShowUpgradeCTA={shouldShowUpgradeCTA(session)}
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <SecFilingsLive initialFilings={filings} />
      </ScrollReveal>
    </div>
  );
}
