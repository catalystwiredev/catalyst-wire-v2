import { BarChart2 } from "lucide-react";
import { EarningsLive } from "./EarningsLive";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { tierAtLeast, shouldShowUpgradeCTA } from "@/lib/tier";

export const dynamic = "force-dynamic";

async function getEarnings() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/earnings`, { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.earnings ?? [];
  } catch { 
    return []; 
  }
}

export default async function EarningsPage() {
  const [session, earnings] = await Promise.all([auth(), getEarnings()]);

  const isPremium = tierAtLeast(session, "alpha");

  const weekLater = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
  const thisWeek = earnings.filter((e: {date?:string}) => (e.date ?? "") <= weekLater).length;
  const withEst = earnings.filter((e: {epsEstimate?:number}) => e.epsEstimate != null).length;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Earnings Calendar · Live"
          labelColor="#f59e0b"
          icon={BarChart2}
          iconColor="#f59e0b"
          iconGlow="rgba(245,158,11,0.35)"
          title="Earnings Intelligence"
          description="Live earnings calendar with EPS estimates, revenue targets, historical surprise patterns, and AI-powered pre-earnings analysis."
          stats={[
            { label: "Upcoming Reports", value: earnings.length, color: "#f59e0b" },
            { label: "This Week", value: thisWeek, color: "#0090f0" },
            { label: "With EPS Est.", value: withEst, color: "#00e676" },
          ]}
          isPremium={isPremium}
          upgradeHref="/pricing"
          upgradeLabel="Unlock AI Analysis"
          shouldShowUpgradeCTA={shouldShowUpgradeCTA(session)}
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <EarningsLive initialEarnings={earnings} />
      </ScrollReveal>
    </div>
  );
}
