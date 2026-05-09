import { UserCheck } from "lucide-react";
import { InsiderTradesLive } from "./InsiderTradesLive";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";

export const revalidate = 120;

async function getTrades() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/insider-trades`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.trades ?? [];
  } catch { return []; }
}

export default async function InsiderTradesPage() {
  const [session, trades] = await Promise.all([auth(), getTrades()]);
  const isPremium = (session?.user as any)?.plan !== "free";

  const withQuote = trades.filter((t: {quote?: unknown}) => !!t.quote).length;
  const uniqueTickers = new Set(trades.map((t: {ticker?:string}) => t.ticker).filter(Boolean)).size;

  return (
    <div style={{ padding:"32px 24px", maxWidth:1200, margin:"0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Form 4 · Officer & Director Transactions"
          labelColor="#00e676"
          icon={UserCheck}
          iconColor="#00e676"
          iconGlow="rgba(0,230,118,0.35)"
          title="Insider Trades"
          description="Live Form 4 filings from SEC EDGAR — officer and director transactions in real time. Cluster buys, CEO purchases, and pattern-significant moves."
          stats={[
            { label:"Form 4 Filings",   value: trades.length,  color:"#00e676" },
            { label:"Unique Tickers",   value: uniqueTickers,  color:"#0090f0" },
            { label:"With Live Quotes", value: withQuote,      color:"#f59e0b" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock signal scores"
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <InsiderTradesLive initialTrades={trades} />
      </ScrollReveal>
    </div>
  );
}
