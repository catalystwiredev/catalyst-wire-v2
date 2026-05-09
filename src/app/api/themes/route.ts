import { NextResponse } from "next/server";
import { getYahooQuote } from "@/lib/data/yahoo-finance";
import { withCache } from "@/lib/cache";

export const runtime = "nodejs";
export const revalidate = 3600;

interface ThemeDefinition {
  name:        string;
  slug:        string;
  tickers:     string[];
  description: string;
}

const THEMES: ThemeDefinition[] = [
  { name: "AI & Machine Learning", slug: "ai",       tickers: ["NVDA","MSFT","GOOG","META","AMD","PLTR"],     description: "Artificial intelligence infrastructure, software, and compute plays." },
  { name: "Biotech",               slug: "biotech",  tickers: ["MRNA","BIIB","REGN","VRTX","ILMN","CRSP"],    description: "Genomics, mRNA platforms, and next-gen drug development." },
  { name: "Defense",               slug: "defense",  tickers: ["LMT","RTX","NOC","GD","BA","KTOS"],           description: "Aerospace, defense contractors, and next-gen weapons systems." },
  { name: "Electric Vehicles",     slug: "ev",       tickers: ["TSLA","RIVN","LCID","NIO","LI","XPEV"],       description: "EV manufacturers and next-gen mobility companies." },
  { name: "Clean Energy",          slug: "energy",   tickers: ["NEE","ENPH","SEDG","FSLR","RUN","PLUG"],      description: "Solar, wind, and clean energy infrastructure." },
  { name: "Crypto Equities",       slug: "crypto",   tickers: ["COIN","MARA","RIOT","MSTR","CLSK","HUT"],     description: "Bitcoin miners, exchanges, and crypto-native public companies." },
  { name: "Cybersecurity",         slug: "cybersec", tickers: ["CRWD","PANW","ZS","FTNT","S","OKTA"],         description: "Zero-trust, endpoint, and cloud security platforms." },
  { name: "Space & Aviation",      slug: "space",    tickers: ["RKLB","ASTS","ACHR","JOBY","SPCE","LUNR"],    description: "Commercial space launch, satellite, and advanced air mobility." },
];

export async function GET() {
  try {
    // Redis cache for 1 hour — Alpha Vantage free tier = 25 req/day
    const cached = await withCache("themes:v1", fetchThemes, 3600).catch(() => fetchThemes());
    return NextResponse.json({ themes: cached, generated: new Date().toISOString() });
  } catch (err) {
    console.error("[api/themes]", err);
    return NextResponse.json({ themes: [], generated: new Date().toISOString(), error: "Failed to fetch theme data" });
  }
}

async function fetchThemes() {
    // Collect all unique tickers across themes
    const allTickers: string[] = [];
    for (const theme of THEMES) {
      for (const ticker of theme.tickers) {
        if (!allTickers.includes(ticker)) {
          allTickers.push(ticker);
        }
      }
    }

    // Yahoo Finance: no key, no rate limit, returns pre/post-market prices when active
    const quoteMap = new Map<string, number | null>();
    const results = await Promise.allSettled(
      allTickers.map(ticker => getYahooQuote(ticker).then(q => ({ ticker, q })))
    );
    for (const r of results) {
      if (r.status === "fulfilled") {
        const { ticker, q } = r.value;
        // During extended hours, prefer the active session's change over regular-market change
        const pct = q
          ? (q.preMarketChangePercent ?? q.postMarketChangePercent ?? q.regularMarketChangePercent)
          : null;
        quoteMap.set(ticker, pct);
      } else {
        // ticker not available in fulfilled result; handled via default null below
      }
    }

    const themes = THEMES.map((theme) => {
      const changes: number[] = [];
      let topMover    = "";
      let topMoverPct = 0;

      for (const ticker of theme.tickers) {
        const pct = quoteMap.get(ticker);
        if (pct !== null && pct !== undefined) {
          changes.push(pct);
          if (Math.abs(pct) > Math.abs(topMoverPct)) {
            topMover    = ticker;
            topMoverPct = pct;
          }
        }
      }

      const avgChange1d = changes.length > 0
        ? parseFloat((changes.reduce((a, b) => a + b, 0) / changes.length).toFixed(2))
        : 0;

      return {
        name:        theme.name,
        slug:        theme.slug,
        tickers:     theme.tickers,
        description: theme.description,
        avgChange1d,
        topMover,
        topMoverPct: parseFloat(topMoverPct.toFixed(2)),
      };
    });

    return themes;
}
