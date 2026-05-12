import { Landmark } from "lucide-react";
import { getRecent8Ks, searchFilings } from "@/lib/data/sec-edgar";
import { SecFilingsTable } from "@/components/tables/SecFilingsTable";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { tierAtLeast, shouldShowUpgradeCTA } from "@/lib/tier";

export const dynamic = "force-dynamic";

async function getCongressionalData() {
  try {
    const [form4s, govFilings] = await Promise.allSettled([
      searchFilings({ forms: ["4"], limit: 30 }),
      getRecent8Ks(20),
    ]);
    return {
      form4s: form4s.status === "fulfilled" ? form4s.value : [],
      govFilings: govFilings.status === "fulfilled" ? govFilings.value : [],
    };
  } catch {
    return { form4s: [], govFilings: [] };
  }
}

export default async function CongressionalTradesPage() {
  const [session, { form4s, govFilings }] = await Promise.all([auth(), getCongressionalData()]);

  if (!session?.user) {
    // Public view allowed with limits
  }

  const isPremium = tierAtLeast(session, "alpha");

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="STOCK Act · Political Alpha"
          labelColor="#f6c90e"
          icon={Landmark}
          iconColor="#f6c90e"
          iconGlow="rgba(246,201,14,0.35)"
          title="Congressional Trades"
          description="Real-time tracking of congressional insider activity through official SEC disclosures."
          stats={[
            { label: "Form 4 Filings", value: form4s.length, color: "#f6c90e" },
            { label: "Recent 8-K Events", value: govFilings.length, color: "#a78bfa" },
          ]}
          isPremium={isPremium}
          upgradeHref="/pricing"
          upgradeLabel="Unlock Full Database"
          shouldShowUpgradeCTA={shouldShowUpgradeCTA(session)}
        />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div style={{ background: "rgba(246,201,14,0.06)", border: "1px solid rgba(246,201,14,0.20)", borderRadius: 14, padding: "16px 20px", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, background: "rgba(246,201,14,0.12)", border: "1px solid rgba(246,201,14,0.25)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Landmark size={17} style={{ color: "#f6c90e" }}/>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f6c90e", marginBottom: 5 }}>Congressional STOCK Act Disclosures</div>
            <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.65 }}>
              Full real-time congressional trading data requires a dedicated provider. Below you can browse recent SEC Form 4 insider filings and material 8-K events.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Form 4 Section */}
      <ScrollReveal delay={180}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>Recent Form 4 — Officer & Director Transactions</div>
          {form4s.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(246,201,14,0.10)", borderRadius: 14 }}>
              No Form 4 data available right now.
            </div>
          ) : (
            <SecFilingsTable filings={form4s.slice(0, 20)} />
          )}
        </div>
      </ScrollReveal>

      {/* 8-K Section */}
      <ScrollReveal delay={240}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>Recent 8-K Material Events</div>
          {govFilings.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(12px)", border: "1px solid rgba(246,201,14,0.10)", borderRadius: 14 }}>
              No 8-K data available right now.
            </div>
          ) : (
            <SecFilingsTable filings={govFilings.slice(0, 15)} />
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
