import { ScrollText } from "lucide-react";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { getRecentCOTReports, netPositioning } from "@/lib/data/cftc";
import { tierAtLeast } from "@/lib/tier";
import { COTLive } from "./COTLive";

export const revalidate = 1800;

interface COTRow {
  market_and_exchange_names?: string;
  market_name?:               string;
  report_date_as_yyyy_mm_dd?: string;
  noncomm_positions_long_all?:  string | number;
  noncomm_positions_short_all?: string | number;
  comm_positions_long_all?:     string | number;
  comm_positions_short_all?:    string | number;
  open_interest_all?:           string | number;
  net?: { nonCommercial: number; commercial: number };
}

async function getCOT(session: unknown): Promise<{ rows: COTRow[]; premium: boolean }> {
  try {
    const isPremium = tierAtLeast(session as Parameters<typeof tierAtLeast>[0], "alpha");
    const marketContains = isPremium ? undefined : "S&P 500";
    const limit = isPremium ? 50 : 5;
    const rows = await getRecentCOTReports({ marketContains, limit });
    const enriched = rows.map(r => ({ ...r, net: netPositioning(r) }));
    return { rows: enriched, premium: isPremium };
  } catch { return { rows: [], premium: false }; }
}

function num(v: string | number | undefined): number {
  if (v == null) return 0;
  return typeof v === "number" ? v : parseFloat(v) || 0;
}

export default async function COTPage() {
  const session = await auth();
  const data    = await getCOT(session);
  const isPremium = (session?.user as { plan?: string } | undefined)?.plan !== "free";

  const rows = data.rows ?? [];
  const totalOI    = rows.reduce((sum, r) => sum + num(r.open_interest_all), 0);
  const netLongs   = rows.filter(r => (r.net?.nonCommercial ?? 0) > 0).length;
  const netShorts  = rows.filter(r => (r.net?.nonCommercial ?? 0) < 0).length;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="COT Reports · CFTC"
          labelColor="#a78bfa"
          icon={ScrollText}
          iconColor="#a78bfa"
          iconGlow="rgba(167,139,250,0.35)"
          title="Commitments of Traders"
          description="CFTC institutional positioning — non-commercial (speculator) and commercial (hedger) net positions across futures markets. Refreshed weekly."
          stats={[
            { label: "Markets",      value: rows.length, color: "#a78bfa" },
            { label: "Net Long",     value: netLongs,    color: "#00e676" },
            { label: "Net Short",    value: netShorts,   color: "#ff4d4d" },
            { label: "Total OI",     value: totalOI > 1e6 ? `${(totalOI / 1e6).toFixed(1)}M` : `${(totalOI / 1e3).toFixed(0)}K`, color: "#0090f0" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock all markets + history"
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <COTLive initial={data} />
      </ScrollReveal>
    </div>
  );
}
