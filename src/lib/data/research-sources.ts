export interface ResearchSource {
  id:        string;
  name:      string;
  shortName: string;
  url:       string;
  category:  "news" | "financial" | "industry" | "academic" | "global" | "data";
  description: string;
  bestFor:   string[];
  free:      boolean;
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
    description: "Real-time financial news wire and market-moving headlines with audio squawk box. Preferred by active traders.",
    bestFor: ["Breaking catalysts", "Real-time alerts", "Options flow", "Pre-market news"],
  },
  {
    id: "morningstar", name: "Morningstar", shortName: "Morningstar",
    url: "https://www.morningstar.com/stocks",
    category: "financial", free: false, iconColor: "#e63946",
    description: "Institutional-grade stock ratings, fair value estimates, economic moat analysis, and portfolio analytics.",
    bestFor: ["Fundamental analysis", "Fair value", "Moat analysis", "ETF research"],
  },
  {
    id: "seeking-alpha", name: "Seeking Alpha", shortName: "SeekingAlpha",
    url: "https://seekingalpha.com",
    category: "financial", free: false, iconColor: "#ff6b35",
    description: "Crowd-sourced equity research, earnings transcripts, dividend analysis, and quant factor ratings.",
    bestFor: ["Earnings transcripts", "Dividend analysis", "Quant ratings", "Bull/bear cases"],
  },
  {
    id: "macrotrends", name: "Macrotrends", shortName: "Macrotrends",
    url: "https://www.macrotrends.net",
    category: "financial", free: true, iconColor: "#2d6a4f",
    description: "Long-term fundamental charts for 6,000+ stocks — P/E ratio, revenue, EPS, margins, and balance sheet history.",
    bestFor: ["Historical fundamentals", "P/E ratios", "Revenue trends", "Margin analysis"],
  },
  {
    id: "fred", name: "FRED — St. Louis Fed", shortName: "FRED",
    url: "https://fred.stlouisfed.org",
    category: "data", free: true, iconColor: "#118ab2",
    description: "800,000+ economic time series from 100+ sources. CPI, GDP, unemployment, yield curves, and Fed balance sheet data.",
    bestFor: ["Macro indicators", "Yield curve", "Inflation data", "Employment statistics"],
  },
  {
    id: "ssrn", name: "SSRN — Social Science Research Network", shortName: "SSRN",
    url: "https://www.ssrn.com/index.cfm/en/fin/",
    category: "academic", free: true, iconColor: "#7b2d8b",
    description: "Largest preprint repository for finance and economics research. Thousands of working papers before journal publication.",
    bestFor: ["Academic finance research", "Factor investing", "Market microstructure", "Quantitative strategies"],
  },
  {
    id: "nber", name: "National Bureau of Economic Research", shortName: "NBER",
    url: "https://www.nber.org/papers?q=finance",
    category: "academic", free: true, iconColor: "#2d6a4f",
    description: "Leading economic research papers from top academics. Covers monetary policy, asset pricing, and market cycles.",
    bestFor: ["Economic cycles", "Asset pricing theory", "Monetary policy", "Labor market research"],
  },
  {
    id: "scholar", name: "Google Scholar — Finance", shortName: "Scholar",
    url: "https://scholar.google.com/scholar?q=quantitative+finance+investing",
    category: "academic", free: true, iconColor: "#4285f4",
    description: "Search across 200M+ academic articles. Filter by finance, economics, and investment research from any university.",
    bestFor: ["Literature reviews", "Academic citations", "Cross-disciplinary research", "Thesis research"],
  },
  {
    id: "globaledge", name: "GlobalEdge — MSU", shortName: "GlobalEdge",
    url: "https://globaledge.msu.edu/global-insights",
    category: "global", free: true, iconColor: "#118ab2",
    description: "Michigan State's international business intelligence platform. Country risk profiles, trade statistics, and geopolitical analysis.",
    bestFor: ["Country risk", "Emerging markets", "Trade data", "Geopolitical analysis"],
  },
  {
    id: "edgar", name: "SEC EDGAR Full-Text Search", shortName: "EDGAR",
    url: "https://efts.sec.gov/LATEST/search-index",
    category: "data", free: true, iconColor: "#0099ff",
    description: "Search the full text of all SEC filings — 10-K, 10-Q, 8-K, S-1, Form 4, DEF 14A. Primary source for all regulatory disclosures.",
    bestFor: ["10-K annual reports", "Insider filings", "Proxy statements", "IPO prospectuses"],
  },
  {
    id: "statista", name: "Statista", shortName: "Statista",
    url: "https://www.statista.com/markets/",
    category: "industry", free: false, iconColor: "#8338ec",
    description: "Market size statistics, industry reports, and consumer data across 600+ industries and 50+ countries.",
    bestFor: ["Market sizing", "Consumer trends", "Industry benchmarks", "Comparative statistics"],
  },
  {
    id: "wisesheets", name: "WiseSheets", shortName: "WiseSheets",
    url: "https://www.wisesheets.io",
    category: "data", free: false, iconColor: "#00b4d8",
    description: "Pull real-time and historical stock data, financials, and options data directly into Google Sheets or Excel.",
    bestFor: ["Spreadsheet modeling", "Historical data", "Options analysis", "Automated reports"],
  },
];

export function getByCategory(cat: ResearchSource["category"]) {
  return RESEARCH_SOURCES.filter(s => s.category === cat);
}
