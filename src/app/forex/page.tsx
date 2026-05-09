import { Globe } from "lucide-react";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { getMajorPairs } from "@/lib/data/frankfurter";
import { ForexLive } from "./ForexLive";

export const revalidate = 600;

interface FXResponse { base: string; date: string; rates: Record<string, number>; }

async function getForex(): Promise<FXResponse | null> {
  try {
    return await getMajorPairs();
  } catch { return null; }
}

export default async function ForexPage() {
  const [session, fx] = await Promise.all([auth(), getForex()]);
  const isPremium = (session?.user as { plan?: string } | undefined)?.plan !== "free";

  const pairCount = fx ? Object.keys(fx.rates).length : 0;
  const date      = fx?.date ?? "—";

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Forex · ECB Reference"
          labelColor="#00e676"
          icon={Globe}
          iconColor="#00e676"
          iconGlow="rgba(0,230,118,0.35)"
          title="Currency Markets"
          description="Live forex rates from the European Central Bank reference fix. Updates daily on ECB business days. Weekend rates serve last Friday close."
          stats={[
            { label: "Base Currency",  value: fx?.base ?? "USD",  color: "#00e676" },
            { label: "Major Pairs",    value: pairCount,           color: "#0090f0" },
            { label: "Last Fix",       value: date,                color: "#a78bfa" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock historical pairs"
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <ForexLive initial={fx} />
      </ScrollReveal>
    </div>
  );
}
