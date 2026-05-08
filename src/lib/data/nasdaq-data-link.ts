/**
 * Nasdaq Data Link (formerly Quandl) — datasets across short interest, 13F filings,
 * futures COT, fundamentals, and more.
 *
 * STATUS: Nasdaq Data Link's public endpoints are now bot-walled by Incapsula and
 * require an authenticated API key. Until NASDAQ_DATA_LINK_API_KEY is provisioned
 * in Key Vault, these functions return empty results with a warning.
 *
 * To activate:
 *   1. Sign up at https://data.nasdaq.com/sign-up
 *   2. Add the key to Key Vault as NASDAQ-DATA-LINK-API-KEY
 *   3. Add the app setting NASDAQ_DATA_LINK_API_KEY=@Microsoft.KeyVault(...)
 *
 * Use cases meanwhile:
 *   - COT reports → use src/lib/data/cftc.ts (no key required)
 *   - 13F filings → use src/lib/data/sec-edgar.ts (no key required)
 *   - Macro data  → use src/lib/data/fred.ts (FRED key already provisioned)
 */

const BASE = "https://data.nasdaq.com/api/v3/datasets";

function key(): string {
  return process.env.NASDAQ_DATA_LINK_API_KEY ?? "";
}

export interface NDLDataset {
  code:        string;          // e.g. "FRED/GDP"
  description: string;
  data:        Array<[string, ...(number | null)[]]>;   // [date, ...columns]
  columnNames: string[];
}

export async function getNasdaqDataset(code: string, opts: { limit?: number; startDate?: string; endDate?: string } = {}): Promise<NDLDataset | null> {
  const apiKey = key();
  if (!apiKey) {
    console.warn("[nasdaq-data-link] NASDAQ_DATA_LINK_API_KEY not set — endpoints are bot-walled without it");
    return null;
  }

  const { limit, startDate, endDate } = opts;
  const params = new URLSearchParams({ api_key: apiKey });
  if (limit)     params.set("limit", String(Math.min(limit, 10000)));
  if (startDate) params.set("start_date", startDate);
  if (endDate)   params.set("end_date", endDate);

  try {
    const res = await fetch(`${BASE}/${code}.json?${params}`, { next: { revalidate: 1800 } });
    if (!res.ok) { console.error("[nasdaq-data-link] HTTP", res.status); return null; }
    const d = await res.json() as { dataset?: { dataset_code?: string; description?: string; data?: Array<[string, ...(number | null)[]]>; column_names?: string[] } };
    const ds = d.dataset;
    if (!ds) return null;
    return {
      code:        ds.dataset_code ?? code,
      description: ds.description  ?? "",
      data:        ds.data         ?? [],
      columnNames: ds.column_names ?? [],
    };
  } catch (err) {
    console.error("[nasdaq-data-link] fetch failed:", err);
    return null;
  }
}

export const NASDAQ_KEY_PROVISIONED = !!process.env.NASDAQ_DATA_LINK_API_KEY;
