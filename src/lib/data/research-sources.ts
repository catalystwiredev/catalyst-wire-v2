/**
 * UTPB-accessible academic and premium research databases.
 * Access via UTPB ezproxy (requires UTPB credentials for full text).
 * Non-UTPB users can access free/public portions.
 *
 * ProQuest accountid: 7137 (UTPB institutional)
 */

export interface ResearchSource {
  id:           string;
  name:         string;
  shortName:    string;
  url:          string;
  embedUrl?:    string;     // iframe-embeddable URL
  widgetUrl?:   string;     // widget embed URL
  category:     "news" | "financial" | "industry" | "academic" | "global";
  description:  string;
  bestFor:      string[];
  requiresUTPB: boolean;
  iconColor:    string;
}

export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    id:           "wsj",
    name:         "The Wall Street Journal",
    shortName:    "WSJ",
    url:          "https://www.wsj.com",
    category:     "news",
    description:  "Premium financial journalism. Earnings coverage, M&A announcements, Fed policy analysis, and deep company investigations.",
    bestFor:      ["Earnings analysis", "M&A news", "Fed/macro", "Executive profiles"],
    requiresUTPB: false,
    iconColor:    "#0274b7",
  },
  {
    id:           "valueline",
    name:         "Value Line Research Center",
    shortName:    "Value Line",
    url:          "https://research-valueline-com.ezproxy.utpb.edu/secure/research#list=recent&sec=list",
    category:     "financial",
    description:  "Institutional-grade stock rankings, safety ratings, 3-5 year price projections, and timeliness scores across 1,700+ stocks.",
    bestFor:      ["Stock ratings", "Safety scores", "Price projections", "Fundamental analysis"],
    requiresUTPB: true,
    iconColor:    "#e63946",
  },
  {
    id:           "ibisworld",
    name:         "IBISWorld Industry Research",
    shortName:    "IBISWorld",
    url:          "https://my-ibisworld-com.ezproxy.utpb.edu",
    category:     "industry",
    description:  "700+ US industry reports with market size, key player rankings, growth drivers, and risk ratings. Essential for sector/theme analysis.",
    bestFor:      ["Sector sizing", "Competitive landscape", "Market share", "Industry risk"],
    requiresUTPB: true,
    iconColor:    "#2d6a4f",
  },
  {
    id:           "proquest-abi",
    name:         "ProQuest ABI/INFORM Global",
    shortName:    "ABI/INFORM",
    url:          "https://www.proquest.com/abiglobal/advanced?accountid=7137",
    widgetUrl:    "https://www.proquest.com/abiglobal/widget/create/Widgets?accountid=7137",
    category:     "academic",
    description:  "5,000+ business and finance journals. Access peer-reviewed research on markets, trading strategies, accounting, and economics.",
    bestFor:      ["Academic finance research", "Trading strategy papers", "Accounting analysis", "Economic studies"],
    requiresUTPB: true,
    iconColor:    "#7b2d8b",
  },
  {
    id:           "ebsco-bsc",
    name:         "EBSCO Business Source Complete",
    shortName:    "EBSCO BSC",
    url:          "https://research-ebsco-com.ezproxy.utpb.edu/c/aoxppu/search/basic?db=bth",
    category:     "academic",
    description:  "Full-text access to 2,300+ business journals. Covers Harvard Business Review, Financial Analysts Journal, and Journal of Finance.",
    bestFor:      ["HBR articles", "Financial Analysts Journal", "Corporate strategy", "Investment research"],
    requiresUTPB: true,
    iconColor:    "#f4a261",
  },
  {
    id:           "globaledge",
    name:         "GlobalEdge MSU",
    shortName:    "GlobalEdge",
    url:          "https://globaledge.msu.edu/global-insights",
    category:     "global",
    description:  "Michigan State's international business intelligence platform. Country risk profiles, trade statistics, and geopolitical market analysis.",
    bestFor:      ["Country risk", "Emerging markets", "Trade data", "Geopolitical analysis"],
    requiresUTPB: false,
    iconColor:    "#118ab2",
  },
  {
    id:           "proquest-my",
    name:         "ProQuest My Research",
    shortName:    "ProQuest Saved",
    url:          "https://www.proquest.com/myresearch/documents?accountid=7137",
    category:     "academic",
    description:  "Your saved ProQuest documents, alerts, and research folders. Keep track of relevant journal articles and reports.",
    bestFor:      ["Saved research", "Citation alerts", "Research folders"],
    requiresUTPB: true,
    iconColor:    "#7b2d8b",
  },
];

/** Get sources by category */
export function getByCategory(category: ResearchSource["category"]): ResearchSource[] {
  return RESEARCH_SOURCES.filter(s => s.category === category);
}

/** Get ProQuest search URL for a ticker or topic */
export function getProquestSearchUrl(query: string): string {
  const encoded = encodeURIComponent(`"${query}"`);
  return `https://www.proquest.com/abiglobal/results/AdvancedMethodsTransformer?accountid=7137&query=${encoded}`;
}

/** Get Value Line research URL for a ticker */
export function getValueLineUrl(ticker: string): string {
  return `https://research-valueline-com.ezproxy.utpb.edu/secure/research#search=${encodeURIComponent(ticker)}`;
}

/** Get IBISWorld search URL for an industry keyword */
export function getIBISWorldUrl(keyword: string): string {
  return `https://my-ibisworld-com.ezproxy.utpb.edu/search/?keyword=${encodeURIComponent(keyword)}`;
}
