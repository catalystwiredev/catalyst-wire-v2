/**
 * Research Sources Directory — Curated list of financial intelligence tools.
 * Used for Research / Resources page to guide users to best tools per category.
 *
 * Philosophy: Institutional-grade curation. No secrets. Static & fast.
 */
export interface ResearchSource {
  id: string;
  name: string;
  shortName: string;
  url: string;
  category: "news" | "financial" | "industry" | "academic" | "global" | "data";
  description: string;
  bestFor: string[];
  free: boolean;
  iconColor: string;
}

export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    id: "wsj", name: "The Wall Street Journal", shortName: "WSJ",
    url: "https://www.wsj.com/market-data",
    category: "news", free: false, iconColor: "#0274b7",
    description: "Premium financial journalism. Earnings coverage, M&A announcements, Fed policy, and deep company investigations.",
    bestFor: ["Earnings analysis", "M&A news", "Fed/macro", "Executive profiles"],
  },
  {
    id: "reuters", name: "Reuters Markets", shortName: "Reuters",
    url: "https://www.reuters.com/markets/",
    category: "news", free: true, iconColor: "#ff6600",
    description: "Global breaking financial news, commodity prices, currency data, and central bank coverage.",
    bestFor: ["Breaking news", "Commodities", "Forex", "Central bank policy"],
  },
  {
    id: "ft", name: "Financial Times", shortName: "FT",
    url: "https://www.ft.com/markets",
    category: "news", free: false, iconColor: "#f7c59f",
    description: "Global financial and business news with deep analytical coverage across markets, companies, and economies.",
    bestFor: ["Global markets", "Corporate strategy", "Economic analysis", "ESG investing"],
  },
  {
    id: "benzinga", name: "Benzinga Pro", shortName: "Benzinga",
    url: "https://pro.benzinga.com",
    category: "news", free: false, iconColor: "#00b4d8",
    description: "Real-time financial news wire and market-moving headlines with audio squawk box.",
    bestFor: ["Breaking catalysts", "Real-time alerts", "Options flow", "Pre-market news"],
  },
  {
    id: "morningstar", name: "Morningstar", shortName: "Morningstar",
    url: "https://www.morningstar.com/stocks",
    category: "financial", free: false, iconColor: "#e63946",
    description: "Institutional-grade stock ratings, fair value estimates, economic moat analysis.",
    bestFor: ["Fundamental analysis", "Fair value", "Moat analysis", "ETF research"],
  },
  {
    id: "seeking-alpha", name: "Seeking Alpha", shortName: "SeekingAlpha",
    url: "https://seekingalpha.com",
    category: "financial", free: false, iconColor: "#ff6b35",
    description: "Crowd-sourced equity research, earnings transcripts, dividend analysis.",
    bestFor: ["Earnings transcripts", "Dividend analysis", "Quant ratings", "Bull/bear cases"],
  },
  {
    id: "macrotrends", name: "Macrotrends", shortName: "Macrotrends",
    url: "https://www.macrotrends.net",
    category: "financial", free: true, iconColor: "#2d6a4f",
    description: "Long-term fundamental charts for 6,000+ stocks.",
    bestFor: ["Historical fundamentals", "P/E ratios", "Revenue trends", "Margin analysis"],
  },
  {
    id: "fred", name: "FRED — St. Louis Fed", shortName: "FRED",
    url: "https://fred.stlouisfed.org",
    category: "data", free: true, iconColor: "#118ab2",
    description: "800,000+ economic time series. CPI, GDP, unemployment, yield curves.",
    bestFor: ["Macro indicators", "Yield curve", "Inflation data", "Employment statistics"],
  },
  {
    id: "edgar", name: "SEC EDGAR", shortName: "EDGAR",
    url: "https://www.sec.gov/edgar",
    category: "data", free: true, iconColor: "#0099ff",
    description: "Primary source for all regulatory filings (10-K, 8-K, Form 4, etc.).",
    bestFor: ["SEC filings", "Insider trades", "10-K analysis", "IPO prospectuses"],
  },
  // ... (rest of your sources unchanged)
  {
    id: "statista", name: "Statista", shortName: "Statista",
    url: "https://www.statista.com/markets/",
    category: "industry", free: false, iconColor: "#8338ec",
    description: "Market size statistics and industry reports across 600+ industries.",
    bestFor: ["Market sizing", "Industry benchmarks", "Consumer trends"],
  },
];

export function getByCategory(cat: ResearchSource["category"]) {
  return RESEARCH_SOURCES.filter(s => s.category === cat);
}

export function getPremiumSources() {
  return RESEARCH_SOURCES.filter(s => !s.free);
}
