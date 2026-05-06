import { UserCheck } from "lucide-react";
import { InsiderTradesTable } from "@/components/tables/InsiderTradesTable";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";

export const revalidate = 1800;

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
        {trades.length === 0 ? (
          <div style={{ textAlign:"center", padding:72, color:"var(--text-secondary)", background:"rgba(8,14,26,0.65)", backdropFilter:"blur(18px)", border:"1px solid rgba(0,230,118,0.12)", borderRadius:18 }}>
            <div style={{ width:64, height:64, background:"rgba(0,230,118,0.08)", border:"1px solid rgba(0,230,118,0.2)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <UserCheck size={28} style={{ color:"#00e676", opacity:0.7 }}/>
            </div>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>No insider trades found</div>
            <div style={{ fontSize:13, opacity:0.6 }}>Form 4 filings are submitted within 2 business days of a transaction. Check back shortly.</div>
          </div>
        ) : (
          <InsiderTradesTable trades={trades} />
        )}
      </ScrollReveal>
    </div>
  );
}
